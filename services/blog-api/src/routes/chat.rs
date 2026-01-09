use axum::{
    extract::State,
    http::StatusCode,
    response::sse::{Event, KeepAlive, Sse},
    routing::post,
    Json,
    Router,
};
use futures::stream::Stream;
use serde::{Deserialize, Serialize};
use std::{
    collections::VecDeque,
    convert::Infallible,
    sync::Arc,
    time::Duration,
};

use crate::services::AppState;

#[derive(Deserialize, Debug)]
pub struct ChatRequest {
    #[serde(alias = "message")]
    pub query: Option<String>,
    pub locale: Option<String>,
    #[serde(alias = "threadId")]
    pub thread_id: Option<String>,
    pub history: Option<serde_json::Value>,
}

#[derive(Serialize)]
struct RagChatRequest<'a> {
    query: &'a str,
    locale: &'a str,
}

#[derive(Serialize)]
pub struct ChatSimpleResponse {
    pub response: String,
    #[serde(rename = "hasContext")]
    pub has_context: bool,
    #[serde(rename = "sourceCount")]
    pub source_count: usize,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
    pub details: Option<String>,
}

fn rag_base_url() -> Result<reqwest::Url, String> {
    let raw = std::env::var("RAG_SERVICE_URL").unwrap_or_else(|_| "http://localhost:7073".to_string());
    reqwest::Url::parse(&raw).map_err(|e| format!("Invalid RAG_SERVICE_URL: {e}"))
}

fn rag_chat_url() -> Result<reqwest::Url, String> {
    rag_base_url()?
        .join("/api/chat")
        .map_err(|e| format!("Invalid RAG chat URL: {e}"))
}

async fn chat(
    State(_state): State<Arc<AppState>>,
    Json(payload): Json<ChatRequest>,
) -> Result<Sse<impl Stream<Item = Result<Event, Infallible>>>, (StatusCode, Json<ErrorResponse>)> {
    let query = payload.query.unwrap_or_default();
    let query = query.trim().to_string();
    if query.is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "Query is required".to_string(),
                details: None,
            }),
        ));
    }

    let locale = payload.locale.unwrap_or_else(|| "ko".to_string());
    let locale = if locale == "en" { "en" } else { "ko" };

    let url = rag_chat_url().map_err(|e| {
        (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(ErrorResponse {
                error: "RAG service is not configured".to_string(),
                details: Some(e),
            }),
        )
    })?;

    let client = reqwest::Client::new();
    let upstream = client
        .post(url)
        .json(&RagChatRequest {
            query: &query,
            locale,
        })
        .send()
        .await
        .map_err(|e| {
            (
                StatusCode::BAD_GATEWAY,
                Json(ErrorResponse {
                    error: "Failed to reach RAG service".to_string(),
                    details: Some(e.to_string()),
                }),
            )
        })?;

    if !upstream.status().is_success() {
        let status = StatusCode::from_u16(upstream.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY);
        let details = upstream.text().await.ok();
        return Err((
            status,
            Json(ErrorResponse {
                error: "RAG service error".to_string(),
                details,
            }),
        ));
    }

    struct ProxyState {
        response: reqwest::Response,
        buffer: String,
        pending: VecDeque<String>,
        ended: bool,
    }

    let stream = futures::stream::unfold(
        ProxyState {
            response: upstream,
            buffer: String::new(),
            pending: VecDeque::new(),
            ended: false,
        },
        |mut state| async move {
            loop {
                if let Some(next) = state.pending.pop_front() {
                    return Some((Ok(Event::default().data(next)), state));
                }

                if state.ended {
                    return None;
                }

                match state.response.chunk().await {
                    Ok(Some(bytes)) => {
                        let chunk = String::from_utf8_lossy(&bytes);

                        let mut buffer = std::mem::take(&mut state.buffer);
                        buffer.push_str(&chunk);

                        let mut lines = buffer.split('\n').collect::<Vec<_>>();
                        state.buffer = lines.pop().unwrap_or("").to_string();

                        for line in lines {
                            if let Some(data) = line.strip_prefix("data: ") {
                                let data = data.trim();
                                if data.is_empty() || data == "[DONE]" {
                                    continue;
                                }
                                state.pending.push_back(data.to_string());
                            }
                        }

                        continue;
                    }
                    Ok(None) => return None,
                    Err(e) => {
                        state.ended = true;

                        let payload = serde_json::json!({
                            "type": "content",
                            "content": format!("[RAG proxy error] {e}"),
                        })
                        .to_string();

                        return Some((Ok(Event::default().data(payload)), state));
                    }
                }
            }
        },
    );

    Ok(Sse::new(stream).keep_alive(
        KeepAlive::new()
            .interval(Duration::from_secs(15))
            .text("keep-alive"),
    ))
}

async fn chat_simple(
    State(_state): State<Arc<AppState>>,
    Json(payload): Json<ChatRequest>,
) -> Result<(StatusCode, Json<ChatSimpleResponse>), (StatusCode, Json<ErrorResponse>)> {
    let query = payload.query.unwrap_or_default();
    let query = query.trim().to_string();
    if query.is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "Query is required".to_string(),
                details: None,
            }),
        ));
    }

    let locale = payload.locale.unwrap_or_else(|| "ko".to_string());
    let locale = if locale == "en" { "en" } else { "ko" };

    let url = rag_chat_url().map_err(|e| {
        (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(ErrorResponse {
                error: "RAG service is not configured".to_string(),
                details: Some(e),
            }),
        )
    })?;

    let client = reqwest::Client::new();
    let mut upstream = client
        .post(url)
        .json(&RagChatRequest {
            query: &query,
            locale,
        })
        .send()
        .await
        .map_err(|e| {
            (
                StatusCode::BAD_GATEWAY,
                Json(ErrorResponse {
                    error: "Failed to reach RAG service".to_string(),
                    details: Some(e.to_string()),
                }),
            )
        })?;

    if !upstream.status().is_success() {
        let status = StatusCode::from_u16(upstream.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY);
        let details = upstream.text().await.ok();
        return Err((
            status,
            Json(ErrorResponse {
                error: "RAG service error".to_string(),
                details,
            }),
        ));
    }

    let mut buffer = String::new();
    let mut response_text = String::new();
    let mut source_count: usize = 0;
    let mut done = false;

    loop {
        match upstream.chunk().await {
            Ok(Some(bytes)) => {
                let chunk = String::from_utf8_lossy(&bytes);

                let mut combined = std::mem::take(&mut buffer);
                combined.push_str(&chunk);

                let mut lines = combined.split('\n').collect::<Vec<_>>();
                buffer = lines.pop().unwrap_or("").to_string();

                for line in lines {
                    let Some(data) = line.strip_prefix("data: ") else {
                        continue;
                    };

                    let data = data.trim();
                    if data.is_empty() || data == "[DONE]" {
                        continue;
                    }

                    let Ok(value) = serde_json::from_str::<serde_json::Value>(data) else {
                        continue;
                    };

                    let event_type = value.get("type").and_then(|v| v.as_str()).unwrap_or("");
                    match event_type {
                        "sources" => {
                            if let Some(arr) = value.get("sources").and_then(|v| v.as_array()) {
                                source_count = arr.len();
                            }
                        }
                        "content" => {
                            if let Some(content) = value.get("content").and_then(|v| v.as_str()) {
                                response_text.push_str(content);
                            }
                        }
                        "done" => {
                            done = true;
                        }
                        _ => {}
                    }
                }

                if done {
                    break;
                }
            }
            Ok(None) => break,
            Err(e) => {
                return Err((
                    StatusCode::BAD_GATEWAY,
                    Json(ErrorResponse {
                        error: "Failed to read RAG stream".to_string(),
                        details: Some(e.to_string()),
                    }),
                ));
            }
        }
    }

    Ok((
        StatusCode::OK,
        Json(ChatSimpleResponse {
            response: response_text,
            has_context: source_count > 0,
            source_count,
        }),
    ))
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/", post(chat)).route("/simple", post(chat_simple))
}

