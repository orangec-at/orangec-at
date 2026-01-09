use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Json,
    Router,
};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::sync::Arc;

use crate::auth::verify_internal_api_key;
use crate::models::{NewsletterSubscription, NewNewsletterSubscription};
use crate::schema::{newsletter_subscriptions, users};
use crate::services::resend::{send_email, EmailParams};
use crate::services::AppState;

#[derive(Deserialize)]
pub struct SubscribeRequest {
    pub email: String,
    pub locale: Option<String>,
}

#[derive(Deserialize)]
pub struct ConfirmRequest {
    pub token: String,
}

#[derive(Deserialize)]
pub struct UnsubscribeRequest {
    pub token: Option<String>,
    pub email: Option<String>,
}

#[derive(Deserialize)]
pub struct NewsletterStatusRequest {
    pub email: String,
}

#[derive(Serialize)]
pub struct NewsletterStatusResponse {
    pub email: String,
    pub status: String,
    pub confirmed_at: Option<String>,
    pub unsubscribed_at: Option<String>,
}

#[derive(Serialize)]
pub struct NewsletterResponse {
    pub success: bool,
    pub status: String,
    pub message: String,
}

fn normalize_email(email: &str) -> String {
    email.trim().to_lowercase()
}

fn is_valid_email(email: &str) -> bool {
    email.contains('@') && email.contains('.')
}

fn sha256_hash(value: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(value.as_bytes());
    format!("{:x}", hasher.finalize())
}

fn generate_token() -> String {
    use rand::RngCore;

    let mut bytes = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut bytes);
    hex::encode(bytes)
}

fn base_url() -> String {
    std::env::var("NEXT_PUBLIC_BASE_URL").unwrap_or_else(|_| "http://localhost:7071".to_string())
}

fn newsletter_from() -> String {
    std::env::var("NEWSLETTER_FROM")
        .or_else(|_| std::env::var("AUTH_EMAIL_FROM"))
        .unwrap_or_else(|_| "Archives <onboarding@resend.dev>".to_string())
}

async fn subscribe(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<SubscribeRequest>,
) -> (StatusCode, Json<NewsletterResponse>) {
    if std::env::var("RESEND_API_KEY").is_err() {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(NewsletterResponse {
                success: false,
                status: "ERROR".to_string(),
                message: "Email delivery is not configured. Set RESEND_API_KEY.".to_string(),
            }),
        );
    }

    let email = normalize_email(&payload.email);

    if !is_valid_email(&email) {
        return (
            StatusCode::BAD_REQUEST,
            Json(NewsletterResponse {
                success: false,
                status: "ERROR".to_string(),
                message: "Invalid email".to_string(),
            }),
        );
    }

    let locale = payload.locale.unwrap_or_else(|| "ko".to_string());
    let locale = if locale == "en" { "en" } else { "ko" };

    let confirm_token = generate_token();
    let unsubscribe_token = generate_token();

    let confirm_token_hash = sha256_hash(&confirm_token);
    let unsubscribe_token_hash = sha256_hash(&unsubscribe_token);

    let base_url = base_url();
    let confirm_url = format!("{}/{}/newsletter/confirm?token={}", base_url, locale, confirm_token);
    let unsubscribe_url = format!(
        "{}/{}/newsletter/unsubscribe?token={}",
        base_url, locale, unsubscribe_token
    );

    let pool = state.db.clone();
    let email_for_db = email.clone();
    let confirm_hash_for_db = confirm_token_hash.clone();
    let unsubscribe_hash_for_db = unsubscribe_token_hash.clone();

    let db_result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let existing: Option<NewsletterSubscription> = newsletter_subscriptions::table
            .filter(newsletter_subscriptions::email.eq(&email_for_db))
            .first(&mut conn)
            .optional()
            .map_err(|e| format!("DB query error: {}", e))?;

        if let Some(ref sub) = existing {
            if sub.status == "ACTIVE" {
                return Ok::<_, String>((
                    StatusCode::OK,
                    NewsletterResponse {
                        success: true,
                        status: "ACTIVE".to_string(),
                        message: "Already subscribed".to_string(),
                    },
                    false,
                ));
            }

            diesel::update(
                newsletter_subscriptions::table
                    .filter(newsletter_subscriptions::email.eq(&email_for_db)),
            )
            .set((
                newsletter_subscriptions::status.eq("PENDING"),
                newsletter_subscriptions::confirm_token_hash.eq(Some(confirm_hash_for_db)),
                newsletter_subscriptions::unsubscribe_token_hash.eq(Some(unsubscribe_hash_for_db)),
                newsletter_subscriptions::confirmed_at.eq::<Option<chrono::NaiveDateTime>>(None),
                newsletter_subscriptions::unsubscribed_at.eq::<Option<chrono::NaiveDateTime>>(None),
            ))
            .execute(&mut conn)
            .map_err(|e| format!("DB update error: {}", e))?;

            return Ok((
                StatusCode::OK,
                NewsletterResponse {
                    success: true,
                    status: "PENDING".to_string(),
                    message: "Check your email to confirm".to_string(),
                },
                true,
            ));
        }

        let new_sub = NewNewsletterSubscription {
            id: cuid2::create_id(),
            email: email_for_db,
            status: "PENDING".to_string(),
            user_id: None,
            confirm_token_hash: Some(confirm_hash_for_db),
            unsubscribe_token_hash: Some(unsubscribe_hash_for_db),
        };

        diesel::insert_into(newsletter_subscriptions::table)
            .values(&new_sub)
            .execute(&mut conn)
            .map_err(|e| format!("DB insert error: {}", e))?;

        Ok::<_, String>((
            StatusCode::OK,
            NewsletterResponse {
                success: true,
                status: "PENDING".to_string(),
                message: "Check your email to confirm".to_string(),
            },
            true,
        ))
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    let (status, response, should_send_email) = match db_result {
        Ok(v) => v,
        Err(e) => {
            tracing::error!("Subscribe error: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(NewsletterResponse {
                    success: false,
                    status: "ERROR".to_string(),
                    message: "Internal server error".to_string(),
                }),
            );
        }
    };

    if !should_send_email {
        return (status, Json(response));
    }

    let html = format!(
        "<p>Confirm your subscription to Archives.</p>\
         <p><a href=\"{}\">Confirm subscription</a></p>\
         <hr />\
         <p><a href=\"{}\">Unsubscribe</a></p>",
        confirm_url, unsubscribe_url
    );

    if let Err(e) = send_email(EmailParams {
        from: newsletter_from(),
        to: email,
        subject: "Confirm your subscription".to_string(),
        html,
    })
    .await
    {
        tracing::error!("Newsletter email send failed: {}", e);
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(NewsletterResponse {
                success: false,
                status: "ERROR".to_string(),
                message: "Failed to send confirmation email".to_string(),
            }),
        );
    }

    (status, Json(response))
}

async fn confirm(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ConfirmRequest>,
) -> (StatusCode, Json<NewsletterResponse>) {
    let token = payload.token.trim().to_string();
    if token.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(NewsletterResponse {
                success: false,
                status: "ERROR".to_string(),
                message: "Missing token".to_string(),
            }),
        );
    }

    let token_hash = sha256_hash(&token);
    let pool = state.db.clone();

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let subscription: Option<NewsletterSubscription> = newsletter_subscriptions::table
            .filter(newsletter_subscriptions::confirm_token_hash.eq(&token_hash))
            .filter(newsletter_subscriptions::status.eq("PENDING"))
            .first(&mut conn)
            .optional()
            .map_err(|e| format!("DB query error: {}", e))?;

        let sub = match subscription {
            Some(s) => s,
            None => {
                return Ok::<_, String>((
                    StatusCode::BAD_REQUEST,
                    NewsletterResponse {
                        success: false,
                        status: "ERROR".to_string(),
                        message: "Invalid or expired token".to_string(),
                    },
                ))
            }
        };

        let now = chrono::Utc::now().naive_utc();

        diesel::update(newsletter_subscriptions::table.filter(newsletter_subscriptions::id.eq(&sub.id)))
            .set((
                newsletter_subscriptions::status.eq("ACTIVE"),
                newsletter_subscriptions::confirmed_at.eq(Some(now)),
                newsletter_subscriptions::unsubscribed_at.eq::<Option<chrono::NaiveDateTime>>(None),
                newsletter_subscriptions::confirm_token_hash.eq::<Option<String>>(None),
            ))
            .execute(&mut conn)
            .map_err(|e| format!("DB update error: {}", e))?;

        let _ = diesel::update(users::table.filter(users::email.eq(Some(sub.email.as_str()))))
            .set(users::newsletter_opt_in_at.eq(Some(now)))
            .execute(&mut conn);

        Ok::<_, String>((
            StatusCode::OK,
            NewsletterResponse {
                success: true,
                status: "ACTIVE".to_string(),
                message: "Subscription confirmed".to_string(),
            },
        ))
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok((status, response)) => (status, Json(response)),
        Err(e) => {
            tracing::error!("Confirm error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(NewsletterResponse {
                    success: false,
                    status: "ERROR".to_string(),
                    message: "Internal server error".to_string(),
                }),
            )
        }
    }
}

async fn unsubscribe(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UnsubscribeRequest>,
) -> (StatusCode, Json<NewsletterResponse>) {
    let pool = state.db.clone();

    let result = if let Some(token) = payload.token {
        let token_hash = sha256_hash(token.trim());

        tokio::task::spawn_blocking(move || {
            let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

            let subscription: Option<NewsletterSubscription> = newsletter_subscriptions::table
                .filter(newsletter_subscriptions::unsubscribe_token_hash.eq(&token_hash))
                .first(&mut conn)
                .optional()
                .map_err(|e| format!("DB query error: {}", e))?;

            let sub = match subscription {
                Some(s) => s,
                None => {
                    return Ok::<_, String>((
                        StatusCode::BAD_REQUEST,
                        NewsletterResponse {
                            success: false,
                            status: "ERROR".to_string(),
                            message: "Invalid token".to_string(),
                        },
                    ))
                }
            };

            let now = chrono::Utc::now().naive_utc();

            diesel::update(newsletter_subscriptions::table.filter(newsletter_subscriptions::id.eq(&sub.id)))
                .set((
                    newsletter_subscriptions::status.eq("UNSUBSCRIBED"),
                    newsletter_subscriptions::unsubscribed_at.eq(Some(now)),
                    newsletter_subscriptions::confirm_token_hash.eq::<Option<String>>(None),
                ))
                .execute(&mut conn)
                .map_err(|e| format!("DB update error: {}", e))?;

            let _ = diesel::update(users::table.filter(users::email.eq(Some(sub.email.as_str()))))
                .set(users::newsletter_opt_in_at.eq::<Option<chrono::NaiveDateTime>>(None))
                .execute(&mut conn);

            Ok::<_, String>((
                StatusCode::OK,
                NewsletterResponse {
                    success: true,
                    status: "UNSUBSCRIBED".to_string(),
                    message: "Unsubscribed".to_string(),
                },
            ))
        })
        .await
        .unwrap_or_else(|e| Err(format!("Task error: {}", e)))
    } else if let Some(email) = payload.email {
        let email = normalize_email(&email);

        tokio::task::spawn_blocking(move || {
            let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

            let existing: Option<NewsletterSubscription> = newsletter_subscriptions::table
                .filter(newsletter_subscriptions::email.eq(&email))
                .first(&mut conn)
                .optional()
                .map_err(|e| format!("DB query error: {}", e))?;

            if let Some(sub) = existing {
                if sub.status != "UNSUBSCRIBED" {
                    let now = chrono::Utc::now().naive_utc();

                    diesel::update(newsletter_subscriptions::table.filter(newsletter_subscriptions::id.eq(&sub.id)))
                        .set((
                            newsletter_subscriptions::status.eq("UNSUBSCRIBED"),
                            newsletter_subscriptions::unsubscribed_at.eq(Some(now)),
                            newsletter_subscriptions::confirm_token_hash.eq::<Option<String>>(None),
                        ))
                        .execute(&mut conn)
                        .map_err(|e| format!("DB update error: {}", e))?;

                    let _ = diesel::update(users::table.filter(users::email.eq(Some(sub.email.as_str()))))
                        .set(users::newsletter_opt_in_at.eq::<Option<chrono::NaiveDateTime>>(None))
                        .execute(&mut conn);
                }
            }

            Ok::<_, String>((
                StatusCode::OK,
                NewsletterResponse {
                    success: true,
                    status: "UNSUBSCRIBED".to_string(),
                    message: "Unsubscribed".to_string(),
                },
            ))
        })
        .await
        .unwrap_or_else(|e| Err(format!("Task error: {}", e)))
    } else {
        return (
            StatusCode::BAD_REQUEST,
            Json(NewsletterResponse {
                success: false,
                status: "ERROR".to_string(),
                message: "Token or email required".to_string(),
            }),
        );
    };

    match result {
        Ok((status, response)) => (status, Json(response)),
        Err(e) => {
            tracing::error!("Unsubscribe error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(NewsletterResponse {
                    success: false,
                    status: "ERROR".to_string(),
                    message: "Internal server error".to_string(),
                }),
            )
        }
    }
}

async fn status(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<NewsletterStatusRequest>,
) -> (StatusCode, Json<Option<NewsletterStatusResponse>>) {
    if verify_internal_api_key(&headers).is_err() {
        return (StatusCode::UNAUTHORIZED, Json(None));
    }

    let email = normalize_email(&payload.email);
    if !is_valid_email(&email) {
        return (StatusCode::BAD_REQUEST, Json(None));
    }

    let pool = state.db.clone();

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let subscription: Option<NewsletterSubscription> = newsletter_subscriptions::table
            .filter(newsletter_subscriptions::email.eq(&email))
            .first(&mut conn)
            .optional()
            .map_err(|e| format!("DB query error: {}", e))?;

        let response = match subscription {
            None => NewsletterStatusResponse {
                email,
                status: "UNSUBSCRIBED".to_string(),
                confirmed_at: None,
                unsubscribed_at: None,
            },
            Some(sub) => {
                let confirmed_at = sub.confirmed_at.map(|dt| {
                    chrono::DateTime::<chrono::Utc>::from_naive_utc_and_offset(dt, chrono::Utc)
                        .to_rfc3339()
                });
                let unsubscribed_at = sub.unsubscribed_at.map(|dt| {
                    chrono::DateTime::<chrono::Utc>::from_naive_utc_and_offset(dt, chrono::Utc)
                        .to_rfc3339()
                });

                NewsletterStatusResponse {
                    email: sub.email,
                    status: sub.status,
                    confirmed_at,
                    unsubscribed_at,
                }
            }
        };

        Ok::<_, String>(response)
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(response) => (StatusCode::OK, Json(Some(response))),
        Err(e) => {
            tracing::error!("Newsletter status error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(None))
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/subscribe", post(subscribe))
        .route("/unsubscribe", post(unsubscribe))
        .route("/confirm", post(confirm))
        .route("/status", post(status))
}
