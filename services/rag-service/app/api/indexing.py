"""Indexing API endpoint"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import IndexingRequest, IndexingResponse
from app.services.vector_store import VectorStore

router = APIRouter()

vector_store = VectorStore()


@router.post("/indexing/trigger", response_model=IndexingResponse)
async def trigger_indexing(
    request: IndexingRequest,
    background_tasks: BackgroundTasks
):
    """
    Trigger content indexing

    This endpoint is for manual triggering or webhook integration.
    The actual indexing should be done via the CLI script.

    Args:
        request: IndexingRequest with optional filters
        background_tasks: FastAPI background tasks

    Returns:
        IndexingResponse with status
    """
    try:
        # Get current stats
        stats = vector_store.get_stats()

        return IndexingResponse(
            status="info",
            message="Please run the indexing script manually: `uv run python scripts/generate_embeddings.py`",
            indexed_count=stats["total_embeddings"],
            embeddings_path="database"
        )

    except Exception as e:
        print(f"Error in indexing trigger: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/indexing/stats")
async def get_indexing_stats():
    """
    Get indexing statistics

    Returns:
        Statistics about indexed content
    """
    try:
        return vector_store.get_stats()
    except Exception as e:
        print(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
