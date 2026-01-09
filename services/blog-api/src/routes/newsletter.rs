use axum::{
    routing::post,
    Router,
    Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct SubscribeRequest {
    pub email: String,
    pub locale: Option<String>,
}

#[derive(Serialize)]
pub struct NewsletterResponse {
    pub success: bool,
    pub status: String,
    pub message: String,
}

async fn subscribe(Json(payload): Json<SubscribeRequest>) -> (StatusCode, Json<NewsletterResponse>) {
    // TODO: Implement newsletter subscription with Resend
    (StatusCode::OK, Json(NewsletterResponse {
        success: true,
        status: "PENDING".to_string(),
        message: "Check your email to confirm".to_string(),
    }))
}

async fn unsubscribe(Json(payload): Json<SubscribeRequest>) -> (StatusCode, Json<NewsletterResponse>) {
    (StatusCode::OK, Json(NewsletterResponse {
        success: true,
        status: "UNSUBSCRIBED".to_string(),
        message: "Unsubscribed".to_string(),
    }))
}

async fn confirm() -> (StatusCode, Json<NewsletterResponse>) {
    (StatusCode::OK, Json(NewsletterResponse {
        success: true,
        status: "ACTIVE".to_string(),
        message: "Subscription confirmed".to_string(),
    }))
}

pub fn router() -> Router {
    Router::new()
        .route("/subscribe", post(subscribe))
        .route("/unsubscribe", post(unsubscribe))
        .route("/confirm", post(confirm))
}
