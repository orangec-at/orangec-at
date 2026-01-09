use axum::{
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Router,
};
use diesel::prelude::*;
use hmac::{Hmac, Mac};
use sha2::Sha256;
use std::sync::Arc;

use crate::models::{NewOrder, Role};
use crate::schema::{orders, products, users};
use crate::services::AppState;

type HmacSha256 = Hmac<Sha256>;

/// Stripe webhook signature verification
/// Format: t=timestamp,v1=signature,v1=signature...
fn verify_stripe_signature(payload: &[u8], sig_header: &str, secret: &str) -> Result<(), String> {
    let mut timestamp: Option<&str> = None;
    let mut signatures: Vec<&str> = Vec::new();

    for part in sig_header.split(',') {
        let mut kv = part.splitn(2, '=');
        match (kv.next(), kv.next()) {
            (Some("t"), Some(ts)) => timestamp = Some(ts),
            (Some("v1"), Some(sig)) => signatures.push(sig),
            _ => {}
        }
    }

    let timestamp = timestamp.ok_or("Missing timestamp in signature")?;
    if signatures.is_empty() {
        return Err("Missing v1 signature".to_string());
    }

    // Check timestamp is within 5 minutes (300 seconds)
    let ts: i64 = timestamp.parse().map_err(|_| "Invalid timestamp")?;
    let now = chrono::Utc::now().timestamp();
    if (now - ts).abs() > 300 {
        return Err("Timestamp too old or in future".to_string());
    }

    // Compute expected signature: HMAC-SHA256(timestamp + "." + payload)
    let signed_payload = format!("{}.", timestamp);
    let mut mac =
        HmacSha256::new_from_slice(secret.as_bytes()).map_err(|_| "Invalid webhook secret")?;
    mac.update(signed_payload.as_bytes());
    mac.update(payload);
    let expected = hex::encode(mac.finalize().into_bytes());

    // Check if any provided signature matches
    for sig in signatures {
        if constant_time_eq(sig.as_bytes(), expected.as_bytes()) {
            return Ok(());
        }
    }

    Err("Signature mismatch".to_string())
}

/// Constant-time comparison to prevent timing attacks
fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut result = 0u8;
    for (x, y) in a.iter().zip(b.iter()) {
        result |= x ^ y;
    }
    result == 0
}

#[derive(Debug, serde::Deserialize)]
struct StripeEvent {
    #[serde(rename = "type")]
    event_type: String,
    data: StripeEventData,
}

#[derive(Debug, serde::Deserialize)]
struct StripeEventData {
    object: CheckoutSession,
}

#[derive(Debug, serde::Deserialize)]
struct CheckoutSession {
    metadata: Option<SessionMetadata>,
}

#[derive(Debug, serde::Deserialize)]
struct SessionMetadata {
    #[serde(rename = "userId")]
    user_id: Option<String>,
    #[serde(rename = "productId")]
    product_id: Option<String>,
}

async fn stripe_webhook(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: Bytes,
) -> StatusCode {
    // Get Stripe signature header
    let sig_header = match headers.get("stripe-signature") {
        Some(h) => match h.to_str() {
            Ok(s) => s.to_string(),
            Err(_) => {
                tracing::warn!("Invalid stripe-signature header encoding");
                return StatusCode::BAD_REQUEST;
            }
        },
        None => {
            tracing::warn!("Missing stripe-signature header");
            return StatusCode::BAD_REQUEST;
        }
    };

    // Get webhook secret from environment
    let webhook_secret = match std::env::var("STRIPE_WEBHOOK_SECRET") {
        Ok(s) => s,
        Err(_) => {
            tracing::error!("STRIPE_WEBHOOK_SECRET not configured");
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    };

    // Verify signature
    if let Err(e) = verify_stripe_signature(&body, &sig_header, &webhook_secret) {
        tracing::warn!("Stripe signature verification failed: {}", e);
        return StatusCode::BAD_REQUEST;
    }

    // Parse event
    let event: StripeEvent = match serde_json::from_slice(&body) {
        Ok(e) => e,
        Err(e) => {
            tracing::error!("Failed to parse Stripe event: {}", e);
            return StatusCode::BAD_REQUEST;
        }
    };

    tracing::info!("Received Stripe webhook: {}", event.event_type);

    // Handle checkout.session.completed
    if event.event_type == "checkout.session.completed" {
        let metadata = match &event.data.object.metadata {
            Some(m) => m,
            None => {
                tracing::warn!("checkout.session.completed missing metadata");
                return StatusCode::OK;
            }
        };

        let user_id = match &metadata.user_id {
            Some(id) => id.clone(),
            None => {
                tracing::warn!("checkout.session.completed missing userId");
                return StatusCode::OK;
            }
        };

        let product_id = match &metadata.product_id {
            Some(id) => id.clone(),
            None => {
                tracing::warn!("checkout.session.completed missing productId");
                return StatusCode::OK;
            }
        };

        let pool = state.db.clone();

        let result = tokio::task::spawn_blocking(move || {
            let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

            conn.transaction::<_, anyhow::Error, _>(|conn| {
                // 1. Create order
                let new_order = NewOrder {
                    id: cuid2::create_id(),
                    user_id: user_id.clone(),
                    product_id: product_id.clone(),
                    status: "COMPLETED".to_string(),
                };

                diesel::insert_into(orders::table)
                    .values(&new_order)
                    .execute(conn)?;

                tracing::info!(
                    "Created order for user={}, product={}",
                    user_id,
                    product_id
                );

                // 2. Get product category
                let category: Option<String> = products::table
                    .filter(products::id.eq(&product_id))
                    .select(products::category)
                    .first(conn)
                    .optional()?;

                // 3. If membership product, upgrade user to ADMIN
                if let Some(cat) = category {
                    if cat == "membership" {
                        diesel::update(users::table.filter(users::id.eq(&user_id)))
                            .set(users::role.eq(Role::ADMIN))
                            .execute(conn)?;

                        tracing::info!("Upgraded user {} to ADMIN (membership purchase)", user_id);
                    }
                }

                Ok(())
            })
            .map_err(|e| e.to_string())?;

            Ok::<_, String>(())
        })
        .await
        .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

        if let Err(e) = result {
            tracing::error!("Failed to process checkout.session.completed: {}", e);
            // Still return OK to acknowledge receipt - Stripe will retry otherwise
        }
    }

    StatusCode::OK
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/stripe", post(stripe_webhook))
}
