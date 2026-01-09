use axum::{
    routing::get,
    Router,
    Json,
    http::StatusCode,
    extract::Query,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::services::AppState;

#[derive(Deserialize)]
pub struct SearchQuery {
    pub query: String,
    pub locale: Option<String>,
    pub top_k: Option<i32>,
    pub min_similarity: Option<f32>,
}

#[derive(Serialize)]
pub struct SearchResult {
    pub slug: String,
    pub title: String,
    pub excerpt: String,
    pub similarity: f32,
}

#[derive(Serialize)]
pub struct SearchResponse {
    pub results: Vec<SearchResult>,
    pub query: String,
}

async fn search(Query(params): Query<SearchQuery>) -> (StatusCode, Json<SearchResponse>) {
    // TODO: Proxy to RAG service at Hugging Face
    (StatusCode::OK, Json(SearchResponse {
        results: vec![],
        query: params.query,
    }))
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", get(search))
}
