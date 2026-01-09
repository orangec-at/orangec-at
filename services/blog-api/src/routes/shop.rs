use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::{get, post},
    Json,
    Router,
};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::auth::verify_internal_api_key;
use crate::models::NewOrder;
use crate::schema::{orders, products, users};
use crate::services::AppState;

#[derive(Serialize)]
pub struct ProductDto {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: String,
    pub point_price: i32,
    pub image: Option<String>,
    pub category: String,
    pub is_rare: bool,
}

#[derive(Serialize)]
pub struct InkPointsResponse {
    pub ink_points: Option<i32>,
}

#[derive(Deserialize)]
pub struct InkPointsRequest {
    pub user_id: String,
}

#[derive(Deserialize)]
pub struct BuyProductRequest {
    pub user_id: String,
    pub product_id: String,
}

#[derive(Serialize)]
pub struct PurchaseResult {
    pub success: bool,
    pub message: String,
    pub remaining_points: Option<i32>,
}

#[derive(Deserialize)]
pub struct UserOrdersRequest {
    pub user_id: String,
}

#[derive(Serialize)]
pub struct OrderWithProduct {
    pub id: String,
    pub status: String,
    pub created_at: chrono::NaiveDateTime,
    pub product: OrderProduct,
}

#[derive(Serialize)]
pub struct OrderProduct {
    pub name: String,
    pub image: Option<String>,
    pub point_price: i32,
}

async fn list_products(State(state): State<Arc<AppState>>) -> (StatusCode, Json<Vec<ProductDto>>) {
    let pool = state.db.clone();

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let rows: Vec<(String, String, String, bigdecimal::BigDecimal, i32, Option<String>, String, bool)> =
            products::table
                .select((
                    products::id,
                    products::name,
                    products::description,
                    products::price,
                    products::point_price,
                    products::image,
                    products::category,
                    products::is_rare,
                ))
                .order((products::is_rare.desc(), products::category.asc(), products::name.asc()))
                .load(&mut conn)
                .map_err(|e| format!("DB query error: {}", e))?;

        let data = rows
            .into_iter()
            .map(
                |(id, name, description, price, point_price, image, category, is_rare)| ProductDto {
                    id,
                    name,
                    description,
                    price: price.to_string(),
                    point_price,
                    image,
                    category,
                    is_rare,
                },
            )
            .collect::<Vec<_>>();

        Ok::<_, String>(data)
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(data) => (StatusCode::OK, Json(data)),
        Err(e) => {
            tracing::error!("list_products error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(vec![]))
        }
    }
}

async fn get_ink_points(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<InkPointsRequest>,
) -> (StatusCode, Json<InkPointsResponse>) {
    if verify_internal_api_key(&headers).is_err() {
        return (StatusCode::UNAUTHORIZED, Json(InkPointsResponse { ink_points: None }));
    }

    let pool = state.db.clone();
    let user_id = payload.user_id;

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let ink_points: Option<i32> = users::table
            .filter(users::id.eq(&user_id))
            .select(users::ink_points)
            .first(&mut conn)
            .optional()
            .map_err(|e| format!("DB query error: {}", e))?;

        Ok::<_, String>(ink_points)
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(points) => (StatusCode::OK, Json(InkPointsResponse { ink_points: points })),
        Err(e) => {
            tracing::error!("get_ink_points error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(InkPointsResponse { ink_points: None }))
        }
    }
}

async fn buy_product(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<BuyProductRequest>,
) -> (StatusCode, Json<PurchaseResult>) {
    if verify_internal_api_key(&headers).is_err() {
        return (
            StatusCode::UNAUTHORIZED,
            Json(PurchaseResult {
                success: false,
                message: "Unauthorized".to_string(),
                remaining_points: None,
            }),
        );
    }

    let pool = state.db.clone();
    let user_id = payload.user_id;
    let product_id = payload.product_id;

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        conn.transaction::<_, anyhow::Error, _>(|conn| {
            let user_points: Option<i32> = users::table
                .filter(users::id.eq(&user_id))
                .select(users::ink_points)
                .first(conn)
                .optional()?;

            let user_points = user_points.ok_or_else(|| anyhow::anyhow!("User not found"))?;

            let product_row: Option<(String, i32)> = products::table
                .filter(products::id.eq(&product_id))
                .select((products::name, products::point_price))
                .first(conn)
                .optional()?;

            let (product_name, point_price) =
                product_row.ok_or_else(|| anyhow::anyhow!("Product not found"))?;

            if user_points < point_price {
                return Err(anyhow::anyhow!(
                    "Insufficient Ink points. Needed: {}, Have: {}",
                    point_price,
                    user_points
                ));
            }

            let remaining = user_points - point_price;

            diesel::update(users::table.filter(users::id.eq(&user_id)))
                .set(users::ink_points.eq(remaining))
                .execute(conn)?;

            let order = NewOrder {
                id: cuid2::create_id(),
                user_id: user_id.clone(),
                product_id: product_id.clone(),
                status: "COMPLETED".to_string(),
            };

            diesel::insert_into(orders::table)
                .values(&order)
                .execute(conn)?;

            Ok::<_, anyhow::Error>((product_name, remaining))
        })
        .map_err(|e| e.to_string())
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok((product_name, remaining)) => (
            StatusCode::OK,
            Json(PurchaseResult {
                success: true,
                message: format!("\"{}\" 구매 완료! (Purchase successful)", product_name),
                remaining_points: Some(remaining),
            }),
        ),
        Err(e) => (
            StatusCode::BAD_REQUEST,
            Json(PurchaseResult {
                success: false,
                message: e,
                remaining_points: None,
            }),
        ),
    }
}

async fn get_user_orders(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<UserOrdersRequest>,
) -> (StatusCode, Json<Vec<OrderWithProduct>>) {
    if verify_internal_api_key(&headers).is_err() {
        return (StatusCode::UNAUTHORIZED, Json(vec![]));
    }

    let pool = state.db.clone();
    let user_id = payload.user_id;

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let rows: Vec<(String, String, chrono::NaiveDateTime, String, Option<String>, i32)> =
            orders::table
                .inner_join(products::table)
                .filter(orders::user_id.eq(&user_id))
                .order(orders::created_at.desc())
                .select((
                    orders::id,
                    orders::status,
                    orders::created_at,
                    products::name,
                    products::image,
                    products::point_price,
                ))
                .load(&mut conn)
                .map_err(|e| format!("DB query error: {}", e))?;

        let data = rows
            .into_iter()
            .map(
                |(id, status, created_at, name, image, point_price)| OrderWithProduct {
                    id,
                    status,
                    created_at,
                    product: OrderProduct {
                        name,
                        image,
                        point_price,
                    },
                },
            )
            .collect::<Vec<_>>();

        Ok::<_, String>(data)
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(data) => (StatusCode::OK, Json(data)),
        Err(e) => {
            tracing::error!("get_user_orders error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(vec![]))
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/products", get(list_products))
        .route("/ink-points", post(get_ink_points))
        .route("/buy", post(buy_product))
        .route("/orders", post(get_user_orders))
}
