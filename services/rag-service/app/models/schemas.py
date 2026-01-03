"""Pydantic models for request/response validation"""
from pydantic import BaseModel, Field
from typing import List, Optional


class ChatRequest(BaseModel):
    """Chat request model"""
    query: str = Field(..., min_length=1, max_length=1000, description="User query")
    locale: str = Field(default="ko", pattern="^(ko|en)$", description="Language locale")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "query": "Next.js 성능 최적화 방법은?",
                    "locale": "ko"
                }
            ]
        }
    }


class SourceDocument(BaseModel):
    """Source document metadata"""
    slug: str
    title: str
    url: str
    content_type: str
    similarity: float
    excerpt: str = Field(description="Text excerpt from the document")


class ChatResponse(BaseModel):
    """Chat response model"""
    answer: str
    sources: List[SourceDocument]
    locale: str


class IndexingRequest(BaseModel):
    """Indexing request model"""
    content_type: Optional[str] = Field(default=None, description="Type of content to index (blog, resume, all)")
    locale: Optional[str] = Field(default=None, pattern="^(ko|en)$", description="Locale to index")


class IndexingResponse(BaseModel):
    """Indexing response model"""
    status: str
    message: str
    indexed_count: int
    embeddings_path: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    gemini_configured: bool
