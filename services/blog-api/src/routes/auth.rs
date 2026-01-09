use axum::{
    routing::{get, post},
    Router,
    Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

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

async fn login(Json(payload): Json<LoginRequest>) -> (StatusCode, Json<AuthResponse>) {
    // TODO: Implement Supabase Auth login
    // For now, return placeholder
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
    // TODO: Extract user from JWT and return info
    (StatusCode::OK, Json(None))
}

pub fn router() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/me", get(me))
}
