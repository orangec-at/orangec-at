use axum::{
    extract::{Query, State},
    http::{HeaderMap, StatusCode},
    routing::{get, post},
    Json,
    Router,
};
use chrono::NaiveDateTime;
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

#[derive(Deserialize)]
pub struct ListMarginaliaQuery {
    pub limit: Option<i64>,
}

#[derive(Serialize)]
pub struct MarginaliaItem {
    pub id: String,
    pub content: String,
    pub tags: Vec<String>,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct ListMarginaliaResponse {
    pub items: Vec<MarginaliaItem>,
}

fn format_date(dt: NaiveDateTime) -> String {
    dt.format("%Y.%m.%d").to_string()
}

async fn list_marginalia(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Query(params): Query<ListMarginaliaQuery>,
) -> (StatusCode, Json<ListMarginaliaResponse>) {
    if verify_internal_api_key(&headers).is_err() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(ListMarginaliaResponse { items: vec![] }),
        );
    }

    let limit = params.limit.unwrap_or(20).min(100);
    let pool = state.db.clone();

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let rows: Vec<(String, String, Vec<String>, NaiveDateTime)> = marginalia::table
            .select((
                marginalia::id,
                marginalia::content,
                marginalia::tags,
                marginalia::created_at,
            ))
            .order(marginalia::created_at.desc())
            .limit(limit)
            .load(&mut conn)
            .map_err(|e| format!("DB query error: {}", e))?;

        let items: Vec<MarginaliaItem> = rows
            .into_iter()
            .map(|(id, content, tags, created_at)| MarginaliaItem {
                id,
                content,
                tags,
                created_at: format_date(created_at),
            })
            .collect();

        Ok::<_, String>(items)
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(items) => (StatusCode::OK, Json(ListMarginaliaResponse { items })),
        Err(e) => {
            tracing::error!("list_marginalia error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ListMarginaliaResponse { items: vec![] }),
            )
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", post(save_marginalia))
        .route("/", get(list_marginalia))
}
