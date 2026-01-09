# Blog API (Rust)

Lightweight Rust API server for OrangeC Blog, designed to run on Oracle Cloud free tier (1GB RAM).

## Tech Stack

- **Framework**: Axum
- **ORM**: Diesel (PostgreSQL)
- **Runtime**: Tokio

## Memory Usage

~20MB at runtime (vs 200MB+ for NestJS/Next.js serverless)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/api/auth/login` | Login (Supabase Auth) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| POST | `/api/newsletter/subscribe` | Subscribe |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe |
| POST | `/api/checkout/create-session` | Stripe checkout |
| POST | `/api/webhook/stripe` | Stripe webhook |
| POST | `/api/chat` | RAG chat passthrough (SSE) |
| POST | `/api/chat/simple` | RAG chat (non-streaming JSON) |
| GET | `/api/search` | RAG search passthrough |

### Auth Notes

- `POST /api/auth/login` uses Supabase password grant (needs `SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- `GET /api/auth/me` expects `Authorization: Bearer <access_token>` and verifies with `SUPABASE_JWT_SECRET`.

### RAG Notes

- `RAG_SERVICE_URL` can be set to either the origin (e.g. `http://localhost:7073`) or the chat URL (e.g. `http://localhost:7073/api/chat`).
- `/api/chat` proxies the upstream SSE stream and forwards `data: {...}` lines.
- `/api/chat/simple` consumes the upstream SSE stream and returns `{ response, hasContext, sourceCount }`.

### Internal Auth Notes

Some endpoints require `x-internal-api-key` and are validated against `INTERNAL_API_KEY`.

## Development

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Run locally
cp .env.example .env
# Edit .env with your credentials
cargo run

# Build for production
cargo build --release
```

## Deployment (OCI)

```bash
# Cross-compile for Linux (from Mac)
rustup target add x86_64-unknown-linux-gnu
cargo build --release --target x86_64-unknown-linux-gnu

# Upload binary
scp target/x86_64-unknown-linux-gnu/release/blog-api ubuntu@VM_IP:~

# Run on server
./blog-api
```

## Environment Variables

See `.env.example` for required variables.
