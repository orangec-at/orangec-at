use axum::{
    routing::post,
    Router,
    http::StatusCode,
    body::Bytes,
};
use std::sync::Arc;

use crate::services::AppState;

async fn stripe_webhook(_body: Bytes) -> StatusCode {
    // TODO: Verify Stripe signature and handle webhook events
    tracing::info!("Received Stripe webhook");
    StatusCode::OK
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/stripe", post(stripe_webhook))
}
