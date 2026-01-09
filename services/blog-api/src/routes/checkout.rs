use axum::{
    routing::post,
    Router,
    Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CheckoutRequest {
    pub product_id: String,
    pub price_id: Option<String>,
    pub is_subscription: bool,
}

#[derive(Serialize)]
pub struct CheckoutResponse {
    pub url: Option<String>,
    pub error: Option<String>,
}

async fn create_session(Json(payload): Json<CheckoutRequest>) -> (StatusCode, Json<CheckoutResponse>) {
    // TODO: Implement Stripe checkout session creation
    (StatusCode::OK, Json(CheckoutResponse {
        url: Some("https://checkout.stripe.com/placeholder".to_string()),
        error: None,
    }))
}

pub fn router() -> Router {
    Router::new()
        .route("/create-session", post(create_session))
}
