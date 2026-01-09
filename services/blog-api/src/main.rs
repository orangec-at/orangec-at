use axum::{
    routing::get,
    Router,
    Json,
    http::{Method, HeaderValue},
};
use tower_http::cors::{CorsLayer, Any};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::net::SocketAddr;
use std::sync::Arc;
use serde::Serialize;

mod schema;
mod routes;
mod models;
mod services;
mod auth;

use services::AppState;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
}

#[derive(Serialize)]
struct ApiInfo {
    name: String,
    version: String,
    endpoints: Vec<String>,
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "healthy".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> Json<ApiInfo> {
    Json(ApiInfo {
        name: "OrangeC Blog API".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        endpoints: vec![
            "GET  /health".to_string(),
            "POST /api/auth/login".to_string(),
            "POST /api/auth/logout".to_string(),
            "GET  /api/auth/me".to_string(),
            "POST /api/newsletter/subscribe".to_string(),
            "POST /api/newsletter/unsubscribe".to_string(),
            "POST /api/checkout/create-session".to_string(),
            "POST /api/webhook/stripe".to_string(),
            "POST /api/chat".to_string(),
            "GET  /api/search".to_string(),
        ],
    })
}

fn create_cors_layer() -> CorsLayer {
    let origins = std::env::var("CORS_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:3000,http://localhost:7071".to_string());
    
    let origins: Vec<HeaderValue> = origins
        .split(',')
        .filter_map(|s| s.trim().parse().ok())
        .collect();

    CorsLayer::new()
        .allow_origin(origins)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any)
        .allow_credentials(true)
}

#[tokio::main]
async fn main() {
    // Load .env
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "blog_api=debug,tower_http=debug".into()),
        ))
        .init();

    let state = Arc::new(AppState::new());
    tracing::info!("Database connection pool initialized");

    let router = Router::<Arc<AppState>>::new()
        .route("/", get(root))
        .route("/health", get(health))
        .nest("/api/auth", routes::auth::router())
        .nest("/api/newsletter", routes::newsletter::router())
        .nest("/api/checkout", routes::checkout::router())
        .nest("/api/chat", routes::chat::router())
        .nest("/api/search", routes::search::router())
        .nest("/api/webhook", routes::webhook::router())
        .layer(TraceLayer::new_for_http())
        .layer(create_cors_layer());

    let app: Router = router.with_state(state);

    // Run server
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a number");

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("🚀 Blog API listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
