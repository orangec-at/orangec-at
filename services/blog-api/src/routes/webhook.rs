use axum::{
    routing::post,
    Router,
    http::StatusCode,
    body::Bytes,
};

async fn stripe_webhook(body: Bytes) -> StatusCode {
    // TODO: Verify Stripe signature and handle webhook events
    tracing::info!("Received Stripe webhook");
    StatusCode::OK
}

pub fn router() -> Router {
    Router::new()
        .route("/stripe", post(stripe_webhook))
}
