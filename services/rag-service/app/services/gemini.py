"""Gemini API service for embeddings and chat"""
import os
from typing import List, AsyncGenerator
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


class GeminiService:
    """Service for Gemini API operations"""

    def __init__(self):
        """Initialize Gemini service"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        genai.configure(api_key=api_key)
        self.embed_model_name = "models/text-embedding-004"
        # Using latest model - gemini-2.5-flash (newest as of 2025!)
        self.chat_model_name = "models/gemini-2.5-flash"

    async def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for text

        Args:
            text: Input text to embed

        Returns:
            List of embedding values (1536 dimensions)
        """
        try:
            result = genai.embed_content(
                model=self.embed_model_name,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding: {e}")
            raise

    async def embed_query(self, query: str) -> List[float]:
        """
        Generate embedding for search query

        Args:
            query: Search query text

        Returns:
            List of embedding values
        """
        try:
            result = genai.embed_content(
                model=self.embed_model_name,
                content=query,
                task_type="retrieval_query"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating query embedding: {e}")
            raise

    async def chat_stream(
        self,
        query: str,
        context: str,
        locale: str = "ko"
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat response with context

        Args:
            query: User question
            context: Retrieved context from vector store
            locale: Language locale (ko or en)

        Yields:
            Chunks of response text
        """
        try:
            model = genai.GenerativeModel(self.chat_model_name)

            system_prompt = self._build_system_prompt(locale)
            user_message = f"{system_prompt}\n\nContext:\n{context}\n\nQuestion: {query}"

            response = model.generate_content(
                user_message,
                stream=True,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "max_output_tokens": 2048,
                }
            )

            for chunk in response:
                if chunk.text:
                    yield chunk.text

        except Exception as e:
            print(f"Error in chat streaming: {e}")
            error_message = "죄송합니다. 응답 생성 중 오류가 발생했습니다." if locale == "ko" else "Sorry, an error occurred while generating the response."
            yield error_message

    def _build_system_prompt(self, locale: str) -> str:
        """Build system prompt based on locale"""
        if locale == "ko":
            return """당신은 이재일(Jaeil Lee)의 블로그 AI 어시스턴트입니다.

역할:
- 주어진 컨텍스트를 기반으로 사용자의 질문에 정확하고 도움이 되는 답변을 제공합니다
- 컨텍스트에 없는 내용은 추측하지 말고, 모른다고 솔직하게 말합니다
- 답변 시 관련된 블로그 글이나 문서를 언급할 때는 자연스럽게 인용합니다
- 전문적이면서도 친근한 톤을 유지합니다

답변 스타일:
- 명확하고 구조화된 답변
- 필요시 코드 예시나 구체적인 사례 포함
- 기술적 정확성 유지"""
        else:
            return """You are an AI assistant for Jaeil Lee's blog.

Role:
- Provide accurate and helpful answers based on the given context
- If information is not in the context, honestly say you don't know instead of guessing
- When mentioning blog posts or documents, cite them naturally
- Maintain a professional yet friendly tone

Answer Style:
- Clear and structured responses
- Include code examples or specific cases when needed
- Maintain technical accuracy"""

    @staticmethod
    def is_configured() -> bool:
        """Check if Gemini API is properly configured"""
        return bool(os.getenv("GEMINI_API_KEY"))
