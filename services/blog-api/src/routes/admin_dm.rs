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
use crate::models::{NewMessage, NewThread};
use crate::schema::{messages, threads};
use crate::services::AppState;

const ADMIN_DM_THREAD_TITLE: &str = "__ADMIN_DM__";

#[derive(Deserialize)]
pub struct SendAdminDmRequest {
    pub user_id: String,
    pub content: String,
}

#[derive(Serialize)]
pub struct SendAdminDmResponse {
    pub success: bool,
    pub message: String,
    pub thread_id: Option<String>,
}

async fn send_admin_dm(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<SendAdminDmRequest>,
) -> (StatusCode, Json<SendAdminDmResponse>) {
    if verify_internal_api_key(&headers).is_err() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(SendAdminDmResponse {
                success: false,
                message: "Unauthorized".to_string(),
                thread_id: None,
            }),
        );
    }

    if payload.content.trim().len() < 5 {
        return (
            StatusCode::BAD_REQUEST,
            Json(SendAdminDmResponse {
                success: false,
                message: "Message is too short".to_string(),
                thread_id: None,
            }),
        );
    }

    let pool = state.db.clone();
    let user_id = payload.user_id;
    let content = payload.content;

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        conn.transaction::<_, anyhow::Error, _>(|conn| {
            let existing_thread_id: Option<String> = threads::table
                .filter(threads::user_id.eq(Some(user_id.as_str())))
                .filter(threads::title.eq(Some(ADMIN_DM_THREAD_TITLE)))
                .select(threads::id)
                .first(conn)
                .optional()?;

            let thread_id = if let Some(id) = existing_thread_id {
                id
            } else {
                let id = cuid2::create_id();
                let new_thread = NewThread {
                    id: id.clone(),
                    title: Some(ADMIN_DM_THREAD_TITLE.to_string()),
                    user_id: Some(user_id.clone()),
                };
                diesel::insert_into(threads::table)
                    .values(&new_thread)
                    .execute(conn)?;
                id
            };

            let new_message = NewMessage {
                id: cuid2::create_id(),
                thread_id: thread_id.clone(),
                role: "user".to_string(),
                content,
            };

            diesel::insert_into(messages::table)
                .values(&new_message)
                .execute(conn)?;

            Ok::<_, anyhow::Error>(thread_id)
        })
        .map_err(|e| e.to_string())
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(thread_id) => (
            StatusCode::OK,
            Json(SendAdminDmResponse {
                success: true,
                message: "Your message has been delivered to the Master's inbox.".to_string(),
                thread_id: Some(thread_id),
            }),
        ),
        Err(e) => {
            tracing::error!("send_admin_dm error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(SendAdminDmResponse {
                    success: false,
                    message: "Failed to deliver message".to_string(),
                    thread_id: None,
                }),
            )
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/", post(send_admin_dm))
}
