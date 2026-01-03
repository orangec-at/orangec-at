# RAG Service

Retrieval-Augmented Generation service for blog with Gemini API.

## Features

- 🤖 Gemini 2.0 Flash for chat completions
- 🔍 Semantic search with text-embedding-004
- 📊 Cosine similarity vector search
- 🌊 Streaming responses (Server-Sent Events)
- 🌐 Bilingual support (Korean/English)
- 🚀 FastAPI + Python 3.11
- ⚡ uv for fast package management

## Prerequisites

- Python 3.11+
- uv package manager
- Gemini API key

## Setup

### 1. Install uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Install dependencies

```bash
cd apps/rag-service
uv sync
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
CORS_ORIGINS=http://localhost:3000,https://your-blog.vercel.app
ENVIRONMENT=development
```

### 4. Generate embeddings

Index blog posts and documents:

```bash
uv run python scripts/generate_embeddings.py
```

This will:
- Read all MDX files from `../blog/src/posts/` and `../blog/documents/`
- Generate embeddings using Gemini API
- Save to `data/embeddings.json`

### 5. Run the server

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 7073
```

Or use the shortcut:

```bash
uv run python -m app.main
```

## API Endpoints

### Health Check

```bash
curl http://localhost:7073/health
```

Response:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "gemini_configured": true
}
```

### Chat

```bash
curl -X POST http://localhost:7073/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "Next.js 성능 최적화 방법은?", "locale": "ko"}'
```

Response: Server-Sent Events (SSE) stream

```
data: {"type": "sources", "sources": [...]}

data: {"type": "content", "content": "Next.js ..."}

data: {"type": "done"}
```

### Indexing Stats

```bash
GET /api/indexing/stats
```

Response:
```json
{
  "total_embeddings": 20,
  "by_locale": {
    "ko": 15,
    "en": 5
  },
  "by_content_type": {
    "blog": 10,
    "resumes": 8,
    "cover-letters": 2
  }
}
```

## Development

### Run tests

```bash
uv run pytest
```

### Lint

```bash
uv run ruff check app/
```

### Format

```bash
uv run black app/
```

### Type check

```bash
uv run mypy app/
```

## Project Structure

```
rag-service/
├── app/
│   ├── api/              # API endpoints
│   │   ├── chat.py       # Chat endpoint
│   │   └── indexing.py   # Indexing endpoint
│   ├── services/         # Business logic
│   │   ├── gemini.py     # Gemini API client
│   │   └── vector_store.py # Vector search
│   ├── models/           # Pydantic models
│   │   └── schemas.py    # Request/response schemas
│   └── main.py           # FastAPI app
├── scripts/
│   └── generate_embeddings.py # Indexing script
├── tests/                # Tests
├── data/
│   └── embeddings.json   # Vector storage
├── pyproject.toml        # Project config
└── README.md
```

## Usage with Frontend

The service is designed to work with the Next.js blog frontend.

Frontend should make requests to:

```typescript
// Chat request
const response = await fetch('http://localhost:7073/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'Your question here',
    locale: 'ko'
  })
});

// Read SSE stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Parse SSE data
}
```

## Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render

Create `render.yaml`:

```yaml
services:
  - type: web
    name: rag-service
    env: python
    buildCommand: pip install uv && uv sync
    startCommand: uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

## Cost

- Gemini API: **FREE** (1500 requests/day)
- Embeddings: ~$0.002 per 1000 chunks
- Monthly estimate: **~$0** (under free tier limits)

## License

MIT
