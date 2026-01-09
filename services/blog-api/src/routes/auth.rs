use axum::{
    routing::{get, post},
    Router,
    Json,
    http::{StatusCode, HeaderMap},
    extract::State,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use diesel::prelude::*;
use chrono::{Utc, Duration};
use sha2::{Sha256, Digest};

use crate::services::AppState;
use crate::services::email::EmailService;
use crate::auth::{bearer_token, verify_supabase_jwt};
use crate::schema::{verification_tokens, users, sessions};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: Option<String>,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub success: bool,
    pub message: String,
    pub token: Option<String>,
    pub refresh_token: Option<String>,
    pub expires_in: Option<i64>,
}

#[derive(Serialize)]
pub struct UserInfo {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
    pub role: String,
}

#[derive(Serialize)]
struct SupabasePasswordGrantRequest {
    email: String,
    password: String,
}

#[derive(Deserialize)]
struct SupabaseTokenResponse {
    access_token: String,
    expires_in: i64,
    refresh_token: String,
    token_type: String,
}

async fn login(Json(payload): Json<LoginRequest>) -> (StatusCode, Json<AuthResponse>) {
    let password = match payload.password {
        Some(password) if !password.trim().is_empty() => password,
        _ => {
            return (
                StatusCode::BAD_REQUEST,
                Json(AuthResponse {
                    success: false,
                    message: "Password is required".to_string(),
                    token: None,
                    refresh_token: None,
                    expires_in: None,
                }),
            )
        }
    };

    let supabase_url = std::env::var("SUPABASE_URL")
        .or_else(|_| std::env::var("NEXT_PUBLIC_SUPABASE_URL"));
    let supabase_anon_key = std::env::var("SUPABASE_ANON_KEY")
        .or_else(|_| std::env::var("NEXT_PUBLIC_SUPABASE_ANON_KEY"));

    let (supabase_url, supabase_anon_key) = match (supabase_url, supabase_anon_key) {
        (Ok(url), Ok(key)) => (url, key),
        _ => {
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(AuthResponse {
                    success: false,
                    message: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.".to_string(),
                    token: None,
                    refresh_token: None,
                    expires_in: None,
                }),
            )
        }
    };

    let supabase_url = supabase_url.trim_end_matches('/');
    let url = format!("{}/auth/v1/token?grant_type=password", supabase_url);

    let response = match reqwest::Client::new()
        .post(url)
        .header("apikey", &supabase_anon_key)
        .header("Authorization", format!("Bearer {}", supabase_anon_key))
        .json(&SupabasePasswordGrantRequest {
            email: payload.email,
            password,
        })
        .send()
        .await
    {
        Ok(resp) => resp,
        Err(_) => {
            return (
                StatusCode::BAD_GATEWAY,
                Json(AuthResponse {
                    success: false,
                    message: "Failed to reach Supabase".to_string(),
                    token: None,
                    refresh_token: None,
                    expires_in: None,
                }),
            )
        }
    };

    if !response.status().is_success() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(AuthResponse {
                success: false,
                message: "Invalid email or password".to_string(),
                token: None,
                refresh_token: None,
                expires_in: None,
            }),
        );
    }

    let token_response = match response.json::<SupabaseTokenResponse>().await {
        Ok(body) => body,
        Err(_) => {
            return (
                StatusCode::BAD_GATEWAY,
                Json(AuthResponse {
                    success: false,
                    message: "Supabase response parse error".to_string(),
                    token: None,
                    refresh_token: None,
                    expires_in: None,
                }),
            )
        }
    };

    (
        StatusCode::OK,
        Json(AuthResponse {
            success: true,
            message: "Logged in".to_string(),
            token: Some(token_response.access_token),
            refresh_token: Some(token_response.refresh_token),
            expires_in: Some(token_response.expires_in),
        }),
    )
}

async fn logout(headers: HeaderMap) -> (StatusCode, Json<AuthResponse>) {
    let token = bearer_token(&headers).ok();

    let supabase_url = std::env::var("SUPABASE_URL")
        .or_else(|_| std::env::var("NEXT_PUBLIC_SUPABASE_URL"));
    let supabase_anon_key = std::env::var("SUPABASE_ANON_KEY")
        .or_else(|_| std::env::var("NEXT_PUBLIC_SUPABASE_ANON_KEY"));

    if let (Ok(url), Ok(key), Some(token)) = (supabase_url, supabase_anon_key, token) {
        let url = url.trim_end_matches('/');
        let endpoint = format!("{}/auth/v1/logout", url);

        let _ = reqwest::Client::new()
            .post(endpoint)
            .header("apikey", &key)
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await;
    }

    (StatusCode::OK, Json(AuthResponse {
        success: true,
        message: "Logged out".to_string(),
        token: None,
        refresh_token: None,
        expires_in: None,
    }))
}

async fn me(headers: HeaderMap) -> (StatusCode, Json<Option<UserInfo>>) {
    let token = match bearer_token(&headers) {
        Ok(token) => token,
        Err(_) => return (StatusCode::UNAUTHORIZED, Json(None)),
    };

    let claims = match verify_supabase_jwt(&token) {
        Ok(claims) => claims,
        Err(_) => return (StatusCode::UNAUTHORIZED, Json(None)),
    };

    let email = claims.email.unwrap_or_default();
    let role = claims.role.unwrap_or_else(|| "USER".to_string());

    (
        StatusCode::OK,
        Json(Some(UserInfo {
            id: claims.sub,
            email,
            name: None,
            role,
        })),
    )
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/me", get(me))
        .route("/magic-link", post(send_magic_link))
        .route("/verify", post(verify_magic_link))
}

#[derive(Deserialize)]
pub struct MagicLinkRequest {
    pub email: String,
    pub locale: Option<String>,
    pub callback_url: Option<String>,
}

#[derive(Serialize)]
pub struct MagicLinkResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Deserialize)]
pub struct VerifyRequest {
    pub token: String,
}

#[derive(Serialize)]
pub struct VerifyResponse {
    pub success: bool,
    pub message: String,
    pub session_token: Option<String>,
    pub user_id: Option<String>,
}

fn generate_token() -> String {
    use rand::Rng;
    let bytes: [u8; 32] = rand::thread_rng().gen();
    hex::encode(bytes)
}

fn hash_token(token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    hex::encode(hasher.finalize())
}

async fn send_magic_link(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<MagicLinkRequest>,
) -> (StatusCode, Json<MagicLinkResponse>) {
    let email = payload.email.trim().to_lowercase();
    let locale = payload.locale.unwrap_or_else(|| "ko".to_string());
    let callback_url = payload.callback_url
        .unwrap_or_else(|| std::env::var("NEXT_PUBLIC_BASE_URL").unwrap_or_else(|_| "http://localhost:3000".to_string()));

    if !email.contains('@') {
        return (
            StatusCode::BAD_REQUEST,
            Json(MagicLinkResponse {
                success: false,
                message: "Invalid email address".to_string(),
            }),
        );
    }

    let raw_token = generate_token();
    let hashed_token = hash_token(&raw_token);
    let expires = Utc::now() + Duration::hours(24);

    let conn = &mut match state.db.get() {
        Ok(conn) => conn,
        Err(_) => {
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(MagicLinkResponse {
                    success: false,
                    message: "Database connection failed".to_string(),
                }),
            );
        }
    };

    let insert_result = diesel::insert_into(verification_tokens::table)
        .values((
            verification_tokens::identifier.eq(&email),
            verification_tokens::token.eq(&hashed_token),
            verification_tokens::expires.eq(expires.naive_utc()),
        ))
        .execute(conn);

    if insert_result.is_err() {
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(MagicLinkResponse {
                success: false,
                message: "Failed to create verification token".to_string(),
            }),
        );
    }

    let magic_link_url = format!(
        "{}/api/auth/callback/email?token={}&email={}",
        callback_url.trim_end_matches('/'),
        raw_token,
        urlencoding::encode(&email)
    );

    let email_service = match EmailService::from_env() {
        Ok(service) => service,
        Err(e) => {
            tracing::error!("Email service error: {}", e);
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(MagicLinkResponse {
                    success: false,
                    message: "Email service not configured".to_string(),
                }),
            );
        }
    };

    if let Err(e) = email_service.send_magic_link(&email, &magic_link_url, &locale).await {
        tracing::error!("Failed to send magic link email: {}", e);
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(MagicLinkResponse {
                success: false,
                message: "Failed to send email".to_string(),
            }),
        );
    }

    tracing::info!("Magic link sent to {}", email);

    (
        StatusCode::OK,
        Json(MagicLinkResponse {
            success: true,
            message: "Magic link sent".to_string(),
        }),
    )
}

async fn verify_magic_link(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<VerifyRequest>,
) -> (StatusCode, Json<VerifyResponse>) {
    let hashed_token = hash_token(&payload.token);

    let conn = &mut match state.db.get() {
        Ok(conn) => conn,
        Err(_) => {
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(VerifyResponse {
                    success: false,
                    message: "Database connection failed".to_string(),
                    session_token: None,
                    user_id: None,
                }),
            );
        }
    };

    let token_record: Result<(String, chrono::NaiveDateTime), _> = verification_tokens::table
        .filter(verification_tokens::token.eq(&hashed_token))
        .select((verification_tokens::identifier, verification_tokens::expires))
        .first(conn);

    let (email, expires) = match token_record {
        Ok(record) => record,
        Err(_) => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(VerifyResponse {
                    success: false,
                    message: "Invalid or expired token".to_string(),
                    session_token: None,
                    user_id: None,
                }),
            );
        }
    };

    if expires < Utc::now().naive_utc() {
        let _ = diesel::delete(
            verification_tokens::table.filter(verification_tokens::token.eq(&hashed_token))
        ).execute(conn);

        return (
            StatusCode::UNAUTHORIZED,
            Json(VerifyResponse {
                success: false,
                message: "Token expired".to_string(),
                session_token: None,
                user_id: None,
            }),
        );
    }

    let _ = diesel::delete(
        verification_tokens::table.filter(verification_tokens::token.eq(&hashed_token))
    ).execute(conn);

    let user_id: Option<String> = users::table
        .filter(users::email.eq(&email))
        .select(users::id)
        .first(conn)
        .ok();

    let user_id = match user_id {
        Some(id) => id,
        None => {
            let new_id = cuid2::create_id();
            let now = Utc::now().naive_utc();

            let insert_result = diesel::insert_into(users::table)
                .values((
                    users::id.eq(&new_id),
                    users::email.eq(&email),
                    users::email_verified.eq(now),
                    users::role.eq(crate::models::entities::Role::USER),
                    users::ink_points.eq(0),
                    users::created_at.eq(now),
                    users::updated_at.eq(now),
                ))
                .execute(conn);

            if let Err(e) = insert_result {
                tracing::error!("Failed to create user: {:?}", e);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(VerifyResponse {
                        success: false,
                        message: format!("Failed to create user: {}", e),
                        session_token: None,
                        user_id: None,
                    }),
                );
            }

            new_id
        }
    };

    let session_token = generate_token();
    let session_expires = Utc::now() + Duration::days(30);
    let session_id = cuid2::create_id();

    let session_result = diesel::insert_into(sessions::table)
        .values((
            sessions::id.eq(&session_id),
            sessions::session_token.eq(&session_token),
            sessions::user_id.eq(&user_id),
            sessions::expires.eq(session_expires.naive_utc()),
        ))
        .execute(conn);

    if let Err(e) = session_result {
        tracing::error!("Failed to create session: {:?}", e);
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(VerifyResponse {
                success: false,
                message: format!("Failed to create session: {}", e),
                session_token: None,
                user_id: None,
            }),
        );
    }

    tracing::info!("User {} logged in via magic link", email);

    (
        StatusCode::OK,
        Json(VerifyResponse {
            success: true,
            message: "Logged in successfully".to_string(),
            session_token: Some(session_token),
            user_id: Some(user_id),
        }),
    )
}
