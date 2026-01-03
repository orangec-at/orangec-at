"""Chat API endpoint"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatRequest, SourceDocument
from app.services.gemini import GeminiService
from app.services.vector_store import VectorStore
import json

router = APIRouter()

# Initialize services
gemini_service = GeminiService()
vector_store = VectorStore()


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint with streaming response

    Args:
        request: ChatRequest with query and locale

    Returns:
        StreamingResponse with chat completion
    """
    try:
        # 1. Generate query embedding
        query_embedding = await gemini_service.embed_query(request.query)

        # 2. Vector similarity search
        relevant_docs = vector_store.search(
            query_embedding=query_embedding,
            top_k=3,
            locale=request.locale,
            min_similarity=0.3
        )

        if not relevant_docs:
            error_msg = (
                "관련된 콘텐츠를 찾을 수 없습니다. 다른 질문을 시도해보세요."
                if request.locale == "ko"
                else "No relevant content found. Please try a different question."
            )
            raise HTTPException(status_code=404, detail=error_msg)

        # 3. Build context from relevant documents
        context_parts = []
        sources = []

        for doc in relevant_docs:
            # Add to context
            title = doc.get("title", "Untitled")
            text = doc.get("text", "")
            url = doc.get("url", "")

            context_parts.append(f"[{title}]({url})\n{text}")

            # Prepare source metadata
            sources.append(SourceDocument(
                slug=doc.get("slug", ""),
                title=title,
                url=url,
                content_type=doc.get("content_type", "blog"),
                similarity=doc.get("similarity", 0.0),
                excerpt=text[:200] + "..." if len(text) > 200 else text
            ))

        context = "\n\n---\n\n".join(context_parts)

        # 4. Stream response
        async def generate():
            """Generator for streaming response"""
            # First, send sources as metadata
            metadata = {
                "type": "sources",
                "sources": [source.model_dump() for source in sources]
            }
            yield f"data: {json.dumps(metadata, ensure_ascii=False)}\n\n"

            # Then stream the answer
            async for chunk in gemini_service.chat_stream(
                query=request.query,
                context=context,
                locale=request.locale
            ):
                data = {
                    "type": "content",
                    "content": chunk
                }
                yield f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

            # Send done signal
            yield "data: {\"type\": \"done\"}\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
