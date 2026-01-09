use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Json,
    Router,
};
use diesel::prelude::*;
use diesel::sql_query;
use diesel::sql_types::{BigInt, Int4, Nullable, Text, Timestamp};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::auth::verify_internal_api_key;
use crate::services::AppState;

#[derive(Deserialize)]
pub struct AdminRequest {
    pub user_role: String,
}

#[derive(Serialize)]
pub struct UserStats {
    pub total_users: i64,
    pub total_ink_points: i64,
    pub average_ink_points: i64,
    pub admin_count: i64,
}

#[derive(Serialize)]
pub struct OrderUser {
    pub name: Option<String>,
    pub email: Option<String>,
    pub image: Option<String>,
}

#[derive(Serialize)]
pub struct OrderProduct {
    pub name: String,
    pub point_price: i32,
    pub image: Option<String>,
}

#[derive(Serialize)]
pub struct OrderWithDetails {
    pub id: String,
    pub status: String,
    pub created_at: chrono::NaiveDateTime,
    pub user: OrderUser,
    pub product: OrderProduct,
}

#[derive(Serialize)]
pub struct TopUser {
    pub id: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub ink_points: i32,
    pub order_count: i64,
}

#[derive(Serialize)]
pub struct ProductStat {
    pub id: String,
    pub name: String,
    pub category: String,
    pub order_count: i64,
}

#[derive(Serialize)]
pub struct DashboardData {
    pub user_stats: UserStats,
    pub recent_orders: Vec<OrderWithDetails>,
    pub top_users: Vec<TopUser>,
    pub product_stats: Vec<ProductStat>,
}

#[derive(QueryableByName)]
struct UserStatsRow {
    #[diesel(sql_type = BigInt)]
    total_users: i64,
    #[diesel(sql_type = BigInt)]
    total_ink_points: i64,
    #[diesel(sql_type = BigInt)]
    average_ink_points: i64,
    #[diesel(sql_type = BigInt)]
    admin_count: i64,
}

#[derive(QueryableByName)]
struct RecentOrderRow {
    #[diesel(sql_type = Text)]
    id: String,
    #[diesel(sql_type = Text)]
    status: String,
    #[diesel(sql_type = Timestamp)]
    created_at: chrono::NaiveDateTime,
    #[diesel(sql_type = Nullable<Text>)]
    user_name: Option<String>,
    #[diesel(sql_type = Nullable<Text>)]
    user_email: Option<String>,
    #[diesel(sql_type = Nullable<Text>)]
    user_image: Option<String>,
    #[diesel(sql_type = Text)]
    product_name: String,
    #[diesel(sql_type = Int4)]
    product_point_price: i32,
    #[diesel(sql_type = Nullable<Text>)]
    product_image: Option<String>,
}

#[derive(QueryableByName)]
struct TopUserRow {
    #[diesel(sql_type = Text)]
    id: String,
    #[diesel(sql_type = Nullable<Text>)]
    name: Option<String>,
    #[diesel(sql_type = Nullable<Text>)]
    email: Option<String>,
    #[diesel(sql_type = Int4)]
    ink_points: i32,
    #[diesel(sql_type = BigInt)]
    order_count: i64,
}

#[derive(QueryableByName)]
struct ProductStatRow {
    #[diesel(sql_type = Text)]
    id: String,
    #[diesel(sql_type = Text)]
    name: String,
    #[diesel(sql_type = Text)]
    category: String,
    #[diesel(sql_type = BigInt)]
    order_count: i64,
}

async fn dashboard(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<AdminRequest>,
) -> (StatusCode, Json<Option<DashboardData>>) {
    if verify_internal_api_key(&headers).is_err() {
        return (StatusCode::UNAUTHORIZED, Json(None));
    }

    if payload.user_role != "ADMIN" {
        return (StatusCode::FORBIDDEN, Json(None));
    }

    let pool = state.db.clone();

    let result = tokio::task::spawn_blocking(move || {
        let mut conn = pool.get().map_err(|e| format!("DB connection error: {}", e))?;

        let stats_sql = r#"
            SELECT
                COUNT(*)::bigint AS total_users,
                COALESCE(SUM("inkPoints"), 0)::bigint AS total_ink_points,
                COALESCE(AVG("inkPoints"), 0)::bigint AS average_ink_points,
                COALESCE(SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END), 0)::bigint AS admin_count
            FROM "User"
        "#;

        let stats_row: UserStatsRow = sql_query(stats_sql)
            .get_result(&mut conn)
            .map_err(|e| format!("Stats query error: {}", e))?;

        let recent_sql = r#"
            SELECT
                o.id::text AS id,
                o.status::text AS status,
                o."createdAt" AS created_at,
                u.name::text AS user_name,
                u.email::text AS user_email,
                u.image::text AS user_image,
                p.name::text AS product_name,
                p."pointPrice"::int4 AS product_point_price,
                p.image::text AS product_image
            FROM "Order" o
            JOIN "Product" p ON p.id = o."productId"
            JOIN "User" u ON u.id = o."userId"
            ORDER BY o."createdAt" DESC
            LIMIT 20
        "#;

        let recent_rows: Vec<RecentOrderRow> = sql_query(recent_sql)
            .load(&mut conn)
            .map_err(|e| format!("Recent orders query error: {}", e))?;

        let top_users_sql = r#"
            SELECT
                u.id::text AS id,
                u.name::text AS name,
                u.email::text AS email,
                u."inkPoints"::int4 AS ink_points,
                COALESCE(COUNT(o.id), 0)::bigint AS order_count
            FROM "User" u
            LEFT JOIN "Order" o ON o."userId" = u.id
            GROUP BY u.id
            ORDER BY u."inkPoints" DESC
            LIMIT 10
        "#;

        let top_user_rows: Vec<TopUserRow> = sql_query(top_users_sql)
            .load(&mut conn)
            .map_err(|e| format!("Top users query error: {}", e))?;

        let product_stats_sql = r#"
            SELECT
                p.id::text AS id,
                p.name::text AS name,
                p.category::text AS category,
                COALESCE(COUNT(o.id), 0)::bigint AS order_count
            FROM "Product" p
            LEFT JOIN "Order" o ON o."productId" = p.id
            GROUP BY p.id
            ORDER BY order_count DESC
        "#;

        let product_rows: Vec<ProductStatRow> = sql_query(product_stats_sql)
            .load(&mut conn)
            .map_err(|e| format!("Product stats query error: {}", e))?;

        let user_stats = UserStats {
            total_users: stats_row.total_users,
            total_ink_points: stats_row.total_ink_points,
            average_ink_points: stats_row.average_ink_points,
            admin_count: stats_row.admin_count,
        };

        let recent_orders = recent_rows
            .into_iter()
            .map(|row| OrderWithDetails {
                id: row.id,
                status: row.status,
                created_at: row.created_at,
                user: OrderUser {
                    name: row.user_name,
                    email: row.user_email,
                    image: row.user_image,
                },
                product: OrderProduct {
                    name: row.product_name,
                    point_price: row.product_point_price,
                    image: row.product_image,
                },
            })
            .collect::<Vec<_>>();

        let top_users = top_user_rows
            .into_iter()
            .map(|row| TopUser {
                id: row.id,
                name: row.name,
                email: row.email,
                ink_points: row.ink_points,
                order_count: row.order_count,
            })
            .collect::<Vec<_>>();

        let product_stats = product_rows
            .into_iter()
            .map(|row| ProductStat {
                id: row.id,
                name: row.name,
                category: row.category,
                order_count: row.order_count,
            })
            .collect::<Vec<_>>();

        Ok::<_, String>(DashboardData {
            user_stats,
            recent_orders,
            top_users,
            product_stats,
        })
    })
    .await
    .unwrap_or_else(|e| Err(format!("Task error: {}", e)));

    match result {
        Ok(data) => (StatusCode::OK, Json(Some(data))),
        Err(e) => {
            tracing::error!("dashboard error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(None))
        }
    }
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/dashboard", post(dashboard))
}
