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
use crate::schema::products;
use crate::services::stripe::CreateCheckoutSessionParams;
use crate::services::{stripe, AppState};

#[derive(Deserialize)]
pub struct CheckoutRequest {
    pub user_id: String,
    pub email: String,
    pub product_id: String,
    pub is_subscription: bool,
    pub locale: Option<String>,
}

#[derive(Serialize)]
pub struct CheckoutResponse {
    pub url: Option<String>,
    pub error: Option<String>,
}

fn base_url() -> String {
    std::env::var("NEXT_PUBLIC_BASE_URL").unwrap_or_else(|_| "http://localhost:7071".to_string())
}

fn unit_amount_from_decimal(price: &bigdecimal::BigDecimal) -> Option<i64> {
    let s = price.to_string();
    let mut parts = s.split('.');
    let whole = parts.next()?.parse::<i64>().ok()?;
    let frac = parts.next().unwrap_or("0");

    let mut cents = frac.chars().take(2).collect::<String>();
    while cents.len() < 2 {
        cents.push('0');
    }

    let cents = cents.parse::<i64>().ok()?;
    Some(whole.saturating_mul(100).saturating_add(cents))
}

async fn create_session(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<CheckoutRequest>,
) -> (StatusCode, Json<CheckoutResponse>) {
    if verify_internal_api_key(&headers).is_err() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(CheckoutResponse {
                url: None,
                error: Some("Unauthorized".to_string()),
            }),
        );
    }

    if payload.email.trim().is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(CheckoutResponse {
                url: None,
                error: Some("Email is required".to_string()),
            }),
        );
    }

    let locale = payload.locale.unwrap_or_else(|| "ko".to_string());
    let locale = if locale == "en" { "en" } else { "ko" };

    let success_url = format!("{}/{}/shop?success=true", base_url(), locale);
    let cancel_url = format!("{}/{}/shop?canceled=true", base_url(), locale);

    let pool = state.db.clone();
    let product_id = payload.product_id.clone();

    let product_result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let row: Option<(String, String, bigdecimal::BigDecimal)> = products::table
            .filter(products::id.eq(&product_id))
            .select((products::id, products::name, products::price))
            .first(&mut conn)
            .optional()
            .map_err(|e| format!("DB query error: {}", e))?;

        let Some((_id, name, price)) = row else {
            return Err("Product not found".to_string());
        };

        let unit_amount = unit_amount_from_decimal(&price).unwrap_or(1000);

        Ok::<_, String>((name, unit_amount))
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    let (product_name, unit_amount) = match product_result {
        Ok(v) => v,
        Err(e) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(CheckoutResponse {
                    url: None,
                    error: Some(e),
                }),
            )
        }
    };

    let params = CreateCheckoutSessionParams {
        customer_email: payload.email,
        user_id: payload.user_id,
        product_id: payload.product_id,
        product_name,
        unit_amount,
        success_url,
        cancel_url,
        is_subscription: payload.is_subscription,
    };

    match stripe::create_checkout_session(params).await {
        Ok(url) => (
            StatusCode::OK,
            Json(CheckoutResponse {
                url: Some(url),
                error: None,
            }),
        ),
        Err(e) => {
            tracing::error!("Stripe create_session error: {}", e);
            (
                StatusCode::BAD_GATEWAY,
                Json(CheckoutResponse {
                    url: None,
                    error: Some("Stripe error".to_string()),
                }),
            )
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/create-session", post(create_session))
}
