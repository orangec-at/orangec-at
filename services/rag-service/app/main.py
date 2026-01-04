"""FastAPI main application"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, indexing, search
from app.models.schemas import HealthResponse
from app.services.gemini import GeminiService
from dotenv import load_dotenv

load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="RAG Service",
    description="Retrieval-Augmented Generation service for blog with Gemini API",
    version="0.1.0"
)

# CORS middleware
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:7071")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

print(f"🔧 CORS Origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(indexing.router, prefix="/api", tags=["indexing"])
app.include_router(search.router, prefix="/api", tags=["search"])


@app.get("/", response_model=dict)
def root():
    """Root endpoint"""
    return {
        "message": "RAG Service is running!",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
def health():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        gemini_configured=GeminiService.is_configured()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=7073,
        reload=True
    )
