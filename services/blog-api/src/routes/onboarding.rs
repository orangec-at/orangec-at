use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Json,
    Router,
};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::auth::verify_internal_api_key;
use crate::models::NewNewsletterSubscription;
use crate::schema::{newsletter_subscriptions, users};
use crate::services::AppState;

#[derive(Deserialize)]
pub struct CompleteOnboardingRequest {
    pub user_id: String,
    pub email: String,
    pub accept_terms: bool,
    pub newsletter_opt_in: bool,
}

#[derive(Serialize)]
pub struct CompleteOnboardingResponse {
    pub success: bool,
    pub message: String,
}

async fn complete_onboarding(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<CompleteOnboardingRequest>,
) -> (StatusCode, Json<CompleteOnboardingResponse>) {
    if verify_internal_api_key(&headers).is_err() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(CompleteOnboardingResponse {
                success: false,
                message: "Unauthorized".to_string(),
            }),
        );
    }

    if !payload.accept_terms {
        return (
            StatusCode::BAD_REQUEST,
            Json(CompleteOnboardingResponse {
                success: false,
                message: "Terms acceptance is required".to_string(),
            }),
        );
    }

    let pool = state.db.clone();
    let user_id = payload.user_id;
    let email = payload.email.trim().to_lowercase();
    let newsletter_opt_in = payload.newsletter_opt_in;

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;
        let now = chrono::Utc::now().naive_utc();

        conn.transaction::<_, anyhow::Error, _>(|conn| {
            diesel::update(users::table.filter(users::id.eq(&user_id)))
                .set((
                    users::terms_accepted_at.eq(Some(now)),
                    users::onboarding_completed_at.eq(Some(now)),
                    users::newsletter_opt_in_at.eq::<Option<chrono::NaiveDateTime>>(None),
                ))
                .execute(conn)?;

            if newsletter_opt_in {
                let existing: Option<String> = newsletter_subscriptions::table
                    .filter(newsletter_subscriptions::email.eq(&email))
                    .select(newsletter_subscriptions::id)
                    .first(conn)
                    .optional()?;

                if let Some(id) = existing {
                    diesel::update(newsletter_subscriptions::table.filter(newsletter_subscriptions::id.eq(&id)))
                        .set((
                            newsletter_subscriptions::status.eq("ACTIVE"),
                            newsletter_subscriptions::user_id.eq(Some(user_id.as_str())),
                            newsletter_subscriptions::confirmed_at.eq(Some(now)),
                            newsletter_subscriptions::unsubscribed_at.eq::<Option<chrono::NaiveDateTime>>(None),
                            newsletter_subscriptions::confirm_token_hash.eq::<Option<String>>(None),
                        ))
                        .execute(conn)?;
                } else {
                    let new_sub = NewNewsletterSubscription {
                        id: cuid2::create_id(),
                        email: email.clone(),
                        status: "ACTIVE".to_string(),
                        user_id: Some(user_id.clone()),
                        confirm_token_hash: None,
                        unsubscribe_token_hash: None,
                    };

                    diesel::insert_into(newsletter_subscriptions::table)
                        .values(&new_sub)
                        .execute(conn)?;

                    diesel::update(newsletter_subscriptions::table.filter(newsletter_subscriptions::email.eq(&email)))
                        .set(newsletter_subscriptions::confirmed_at.eq(Some(now)))
                        .execute(conn)?;
                }

                let _ = diesel::update(users::table.filter(users::id.eq(&user_id)))
                    .set(users::newsletter_opt_in_at.eq(Some(now)))
                    .execute(conn);
            }

            Ok(())
        })
        .map_err(|e| e.to_string())?;

        Ok::<_, String>(())
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(()) => (
            StatusCode::OK,
            Json(CompleteOnboardingResponse {
                success: true,
                message: "Onboarding completed".to_string(),
            }),
        ),
        Err(e) => {
            tracing::error!("complete_onboarding error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(CompleteOnboardingResponse {
                    success: false,
                    message: "Failed to complete onboarding".to_string(),
                }),
            )
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/complete", post(complete_onboarding))
}
