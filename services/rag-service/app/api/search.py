"""Search API endpoint"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import SearchResult
from app.services.gemini import GeminiService
from app.services.vector_store import VectorStore

router = APIRouter()

gemini_service = GeminiService()
vector_store = VectorStore()


@router.get("/search", response_model=List[SearchResult])
async def search(
    query: str = Query(..., min_length=1, max_length=500),
    locale: Optional[str] = Query(default=None, pattern="^(ko|en)$"),
    top_k: int = Query(default=10, ge=1, le=50),
    min_similarity: float = Query(default=0.3, ge=0.0, le=1.0),
):
    try:
        query_embedding = await gemini_service.embed_query(query)

        docs = vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
            locale=locale,
            min_similarity=min_similarity,
        )

        results: List[SearchResult] = []
        for doc in docs:
            content_type = doc.get("content_type") or "blog"
            slug = doc.get("slug") or ""
            title = doc.get("title") or slug
            url = doc.get("url")

            if not url:
                if content_type == "blog":
                    url = f"/catalog/{slug}"
                else:
                    url = f"/documents/{content_type}/{slug}"

            text = doc.get("text") or ""
            excerpt = text[:200] + "..." if len(text) > 200 else text

            results.append(
                SearchResult(
                    slug=slug,
                    title=title,
                    url=url,
                    content_type=content_type,
                    similarity=float(doc.get("similarity") or 0.0),
                    excerpt=excerpt,
                    locale=doc.get("locale") or locale or "ko",
                )
            )

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
