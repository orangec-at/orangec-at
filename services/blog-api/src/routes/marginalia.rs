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
use crate::models::NewMarginalia;
use crate::schema::{marginalia, users};
use crate::services::AppState;

#[derive(Deserialize)]
pub struct SaveMarginaliaRequest {
    pub user_id: String,
    pub content: String,
    pub tags: Vec<String>,
}

#[derive(Serialize)]
pub struct SaveMarginaliaResponse {
    pub success: bool,
    pub message: String,
}

async fn save_marginalia(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<SaveMarginaliaRequest>,
) -> (StatusCode, Json<SaveMarginaliaResponse>) {
    if verify_internal_api_key(&headers).is_err() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(SaveMarginaliaResponse {
                success: false,
                message: "Unauthorized".to_string(),
            }),
        );
    }

    if payload.content.trim().is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(SaveMarginaliaResponse {
                success: false,
                message: "Content is required".to_string(),
            }),
        );
    }

    let pool = state.db.clone();
    let user_id = payload.user_id;
    let content = payload.content;
    let tags = payload.tags;

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        conn.transaction::<_, anyhow::Error, _>(|conn| {
            let new_record = NewMarginalia {
                id: cuid2::create_id(),
                content,
                tags,
                user_id: user_id.clone(),
            };

            diesel::insert_into(marginalia::table)
                .values(&new_record)
                .execute(conn)?;

            diesel::update(users::table.filter(users::id.eq(&user_id)))
                .set(users::ink_points.eq(users::ink_points + 15))
                .execute(conn)?;

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
            Json(SaveMarginaliaResponse {
                success: true,
                message: "Fragment saved and Ink points awarded!".to_string(),
            }),
        ),
        Err(e) => {
            tracing::error!("save_marginalia error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(SaveMarginaliaResponse {
                    success: false,
                    message: "Failed to save fragment".to_string(),
                }),
            )
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/", post(save_marginalia))
}
