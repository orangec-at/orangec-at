use axum::{
    routing::post,
    Router,
    Json,
    response::sse::{Event, Sse},
};
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use futures::stream::{self, Stream};

#[derive(Deserialize)]
pub struct ChatRequest {
    pub query: String,
    pub locale: Option<String>,
    pub thread_id: Option<String>,
}

#[derive(Serialize)]
pub struct ChatChunk {
    pub r#type: String,
    pub content: Option<String>,
    pub sources: Option<Vec<String>>,
}

async fn chat(Json(payload): Json<ChatRequest>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    // TODO: Proxy to RAG service at Hugging Face
    let rag_url = std::env::var("RAG_SERVICE_URL")
        .unwrap_or_else(|_| "http://localhost:7073/api/chat".to_string());

    // For now, return a simple response
    let stream = stream::iter(vec![
        Ok(Event::default().data(r#"{"type":"content","content":"RAG proxy not yet implemented"}"#)),
        Ok(Event::default().data(r#"{"type":"done"}"#)),
    ]);

    Sse::new(stream)
}

pub fn router() -> Router {
    Router::new()
        .route("/", post(chat))
}
