use axum::{
    routing::{get, post},
    Router,
    Json,
    http::{StatusCode, HeaderMap},
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::services::AppState;
use crate::auth::{bearer_token, verify_supabase_jwt};

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
}
