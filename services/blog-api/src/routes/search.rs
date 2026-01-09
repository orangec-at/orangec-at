use axum::{
    extract::Query,
    http::StatusCode,
    routing::get,
    Json,
    Router,
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

#[derive(Deserialize, Serialize)]
pub struct SearchResult {
    pub slug: String,
    pub title: String,
    pub url: String,
    pub content_type: String,
    pub similarity: f32,
    pub excerpt: String,
    pub locale: String,
}

fn rag_base_url() -> Result<reqwest::Url, String> {
    let raw = std::env::var("RAG_SERVICE_URL").unwrap_or_else(|_| "http://localhost:7073".to_string());
    reqwest::Url::parse(&raw).map_err(|e| format!("Invalid RAG_SERVICE_URL: {e}"))
}

async fn search(Query(params): Query<SearchQuery>) -> Result<(StatusCode, Json<Vec<SearchResult>>), (StatusCode, String)> {
    let query = params.query.trim();
    if query.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Query is required".to_string()));
    }

    let locale = params.locale.unwrap_or_else(|| "ko".to_string());
    let locale = if locale == "en" { Some("en".to_string()) } else { Some("ko".to_string()) };

    let top_k = params.top_k.unwrap_or(10).max(1) as i32;
    let min_similarity = params.min_similarity.unwrap_or(0.3);

    let mut url = rag_base_url()
        .map_err(|e| (StatusCode::SERVICE_UNAVAILABLE, e))?
        .join("/api/search")
        .map_err(|e| (StatusCode::SERVICE_UNAVAILABLE, format!("Invalid RAG search URL: {e}")))?;

    {
        let mut qp = url.query_pairs_mut();
        qp.append_pair("query", query);
        if let Some(locale) = &locale {
            qp.append_pair("locale", locale);
        }
        qp.append_pair("top_k", &top_k.to_string());
        qp.append_pair("min_similarity", &min_similarity.to_string());
    }

    let client = reqwest::Client::new();
    let upstream = client
        .get(url)
        .send()
        .await
        .map_err(|e| (StatusCode::BAD_GATEWAY, e.to_string()))?;

    if !upstream.status().is_success() {
        let status = StatusCode::from_u16(upstream.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY);
        let text = upstream
            .text()
            .await
            .unwrap_or_else(|_| "RAG service error".to_string());
        return Err((status, text));
    }

    let results = upstream
        .json::<Vec<SearchResult>>()
        .await
        .map_err(|e| (StatusCode::BAD_GATEWAY, e.to_string()))?;

    Ok((StatusCode::OK, Json(results)))
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/", get(search))
}
