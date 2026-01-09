/**
 * RAG API Client for chat functionality
 */

import { blogApiUrl } from "@/lib/blog-api";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SourceDocument {
  slug: string;
  title: string;
  url: string;
  content_type: string;
  similarity: number;
  excerpt: string;
}

export interface ChatResponse {
  content: string;
  sources: SourceDocument[];
}


/**
 * Stream chat response from RAG API
 */
export async function* streamChat(
  query: string,
  locale: string = 'ko'
): AsyncGenerator<{ type: 'sources' | 'content' | 'done'; sources?: SourceDocument[]; content?: string }> {
  console.log('🚀 Starting chat stream:', { query, locale, url: blogApiUrl("/api/chat") });

  const response = await fetch(blogApiUrl("/api/chat"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, locale }),
  });

  console.log('📡 Response received:', response.status, response.headers.get('content-type'));

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let chunkCount = 0;

  console.log('📖 Starting to read stream...');

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      console.log('✅ Stream ended. Total chunks:', chunkCount);
      break;
    }

    chunkCount++;
    const chunk = decoder.decode(value, { stream: true });
    console.log(`📦 Chunk ${chunkCount}:`, chunk);

    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data.trim()) {
          try {
            const parsed = JSON.parse(data);
            console.log('✨ Parsed data:', parsed);
            yield parsed;
          } catch (e) {
            console.error('❌ Error parsing SSE data:', e, 'Raw:', data);
          }
        }
      }
    }
  }
}

/**
 * Check RAG service health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(blogApiUrl("/health"));
    const data = await response.json();
    return data.status === "healthy";
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
