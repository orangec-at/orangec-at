use axum::{
    routing::{get, post},
    Router,
    Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::services::AppState;

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
}

#[derive(Serialize)]
pub struct UserInfo {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
    pub role: String,
}

async fn login(Json(_payload): Json<LoginRequest>) -> (StatusCode, Json<AuthResponse>) {
    (StatusCode::OK, Json(AuthResponse {
        success: true,
        message: "Login endpoint - implement with Supabase Auth".to_string(),
        token: None,
    }))
}

async fn logout() -> (StatusCode, Json<AuthResponse>) {
    (StatusCode::OK, Json(AuthResponse {
        success: true,
        message: "Logged out".to_string(),
        token: None,
    }))
}

async fn me() -> (StatusCode, Json<Option<UserInfo>>) {
    (StatusCode::OK, Json(None))
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/me", get(me))
}
