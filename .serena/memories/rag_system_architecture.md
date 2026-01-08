# RAG System Architecture for Blog

## 시스템 개요

블로그 콘텐츠(MDX posts, documents)를 AI로 검색/질문할 수 있는 RAG 시스템 구축.

## 기술 스택 선정

### Vector Database
**선택: Vercel Postgres with pgvector**
- ✅ Vercel 무료 호스팅 (Hobby plan)
- ✅ PostgreSQL extension으로 벡터 검색 지원
- ✅ 기존 Prisma ORM 활용 가능
- ❌ 대안: Pinecone (유료), ChromaDB (로컬)

### Embeddings Model
**선택: OpenAI text-embedding-3-small**
- ✅ 비용 효율적 ($0.02 / 1M tokens)
- ✅ 1536 dimensions
- ✅ 한국어/영어 multilingual 지원
- ❌ 대안: text-embedding-3-large (더 비쌈)

### LLM Model
**선택: GPT-4o-mini**
- ✅ 저렴 ($0.15 / 1M input tokens)
- ✅ 빠른 응답 속도
- ✅ 충분한 품질
- ❌ 대안: GPT-4o (더 비싸지만 더 좋은 품질)

### Framework
**선택: Custom Implementation (no LangChain)**
- ✅ 포트폴리오에서 직접 구현 능력 증명
- ✅ 가벼운 dependency
- ✅ 세밀한 컨트롤
- ❌ 대안: LangChain (빠르지만 블랙박스)

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Chat Widget (Floating Button + Modal)               │  │
│  │  - Framer Motion animations                          │  │
│  │  - Real-time streaming responses                     │  │
│  │  - Source attribution with links                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (App Router)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /api/chat                                       │  │
│  │  - Receive user query                                │  │
│  │  - Generate query embedding                          │  │
│  │  - Vector similarity search                          │  │
│  │  - Call OpenAI with context                          │  │
│  │  - Stream response                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /api/indexing/trigger                          │  │
│  │  - Manual trigger for reindexing                     │  │
│  │  - Rebuild hook (on content update)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Embedding & Indexing Service                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Content Processing Pipeline                         │  │
│  │  1. Read MDX files (posts + documents)              │  │
│  │  2. Extract text & metadata (frontmatter)           │  │
│  │  3. Chunk text (1000 tokens, 200 overlap)           │  │
│  │  4. Generate embeddings (OpenAI API)                │  │
│  │  5. Store in vector DB with metadata                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Vercel Postgres with pgvector                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Table: content_embeddings                           │  │
│  │  - id (uuid)                                         │  │
│  │  - content_type (blog | resume | cover-letter)      │  │
│  │  - slug (unique identifier)                          │  │
│  │  - locale (ko | en)                                  │  │
│  │  - title (string)                                    │  │
│  │  - chunk_text (text, max 1000 tokens)               │  │
│  │  - chunk_index (int, for ordering)                  │  │
│  │  - embedding (vector(1536))                         │  │
│  │  - metadata (jsonb: tags, category, date, etc)      │  │
│  │  - created_at, updated_at                           │  │
│  │                                                      │  │
│  │  Index: vector similarity (cosine distance)         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 데이터 모델

### Prisma Schema
```prisma
model ContentEmbedding {
  id           String   @id @default(cuid())
  contentType  String   // "blog" | "resume" | "cover-letter" | "portfolio"
  slug         String   
  locale       String   // "ko" | "en"
  title        String
  chunkText    String   @db.Text
  chunkIndex   Int      
  embedding    Unsupported("vector(1536)")
  metadata     Json     // { tags, category, date, author, description }
  url          String   // /blog/[slug] or /documents/[type]/[slug]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([slug, locale, chunkIndex])
  @@index([contentType])
  @@index([locale])
  // pgvector index for similarity search
  @@index([embedding], type: Ivfflat)
}
```

## RAG 쿼리 플로우

### 1. User Query → Embedding
```typescript
// User: "Next.js 성능 최적화 방법 알려줘"
const queryEmbedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: userQuery,
  dimensions: 1536,
});
```

### 2. Vector Similarity Search
```sql
SELECT 
  slug, title, chunk_text, url, metadata,
  1 - (embedding <=> $1) AS similarity
FROM content_embeddings
WHERE locale = $2
ORDER BY embedding <=> $1
LIMIT 5;
```

### 3. Build Context + Generate Response
```typescript
const context = relevantChunks.map(chunk => 
  `[${chunk.title}](${chunk.url})\n${chunk.chunk_text}`
).join("\n\n---\n\n");

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `You are an AI assistant for Jaeil Lee's blog. 
      Answer questions based on the provided context. 
      Always cite sources with markdown links.
      Language: ${locale === 'ko' ? 'Korean' : 'English'}`
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion: ${userQuery}`
    }
  ],
  stream: true, // Real-time streaming
});
```

## Indexing Strategy

### Initial Indexing (Build Time)
```typescript
// scripts/index-content.ts
async function indexAllContent() {
  // 1. Read all MDX files
  const posts = await getBlogPostsByLocale('ko');
  const documents = await getAllDocuments();
  
  // 2. Process each content
  for (const content of [...posts, ...documents]) {
    const chunks = chunkText(content.text, 1000, 200);
    
    for (const [index, chunk] of chunks.entries()) {
      const embedding = await generateEmbedding(chunk);
      
      await prisma.contentEmbedding.create({
        data: {
          contentType: content.type,
          slug: content.slug,
          locale: content.locale,
          title: content.title,
          chunkText: chunk,
          chunkIndex: index,
          embedding: embedding,
          metadata: content.metadata,
          url: content.url,
        }
      });
    }
  }
}
```

### Incremental Updates (Webhook)
```typescript
// On content update via GitHub webhook or manual trigger
POST /api/indexing/trigger
{
  "contentType": "blog",
  "slug": "new-post",
  "locale": "ko"
}

// Delete old embeddings + reindex
await prisma.contentEmbedding.deleteMany({
  where: { slug, locale }
});
await indexSingleContent(slug, locale);
```

## UI Components

### Chat Widget (Floating Button)
```typescript
// components/rag/chat-widget.tsx
<AnimatePresence>
  {isOpen && (
    <motion.div className="fixed bottom-20 right-8 w-96 h-[600px]">
      <Card>
        <ChatHeader />
        <ChatMessages messages={messages} />
        <ChatInput onSubmit={handleSubmit} />
      </Card>
    </motion.div>
  )}
</AnimatePresence>

<FloatingButton onClick={() => setIsOpen(true)}>
  <MessageCircle />
</FloatingButton>
```

### Source Attribution
```typescript
// Show sources below AI response
<SourceList>
  {sources.map(source => (
    <SourceCard key={source.slug}>
      <Link href={source.url}>
        {source.title}
      </Link>
      <Badge>{source.contentType}</Badge>
    </SourceCard>
  ))}
</SourceList>
```

## Cost Estimation

### Indexing (One-time)
- 현재 콘텐츠: ~10 blog posts + ~10 documents
- 평균 길이: 2000 tokens/post → 2 chunks
- Total chunks: 40 chunks
- Embedding cost: 40 * 2000 tokens = 80K tokens
- **Cost**: $0.02 / 1M tokens = **$0.0016 (무시 가능)**

### Query (per request)
- Query embedding: 20 tokens = $0.0000004
- Context retrieval: 5 chunks * 1000 tokens = 5K tokens input
- Response generation: ~500 tokens output
- **Cost per query**: ~$0.001 (0.1원)

### Monthly Estimate (100 queries)
- **Total**: ~$0.10/month (100원)

## 구현 우선순위

### Phase 1: MVP (1-2주)
1. ✅ Vercel Postgres + pgvector 설정
2. ✅ OpenAI API 키 설정
3. ✅ Content indexing script (scripts/index-content.ts)
4. ✅ Query API endpoint (POST /api/chat)
5. ✅ 간단한 Chat UI (shadcn/ui)

### Phase 2: Enhancement (1주)
1. Streaming responses (Server-Sent Events)
2. Source attribution UI
3. Conversation history (session storage)
4. Loading states & error handling

### Phase 3: Optimization (선택사항)
1. Incremental indexing webhook
2. Query caching (Redis)
3. Hybrid search (vector + keyword)
4. Analytics (query tracking)

## 기대 효과

### Portfolio Impact
- ✅ **OpenAI API 실전 경험** - Solutions Architect 역할에 필요
- ✅ **RAG 시스템 설계 능력** - LLM best practices 증명
- ✅ **Vector DB 경험** - pgvector, embeddings, similarity search
- ✅ **차별화된 블로그** - AI-powered search는 희귀

### User Experience
- ✅ **빠른 정보 탐색** - "Next.js 성능 최적화" 즉시 검색
- ✅ **자연어 질문** - "이재일의 OAuth 경험은?" 질문 가능
- ✅ **Source attribution** - 원본 글 링크 제공

## Next Steps
1. Vercel Postgres 프로젝트 생성
2. pgvector extension 활성화
3. OpenAI API key 발급
4. Prisma schema 업데이트
5. Indexing script 작성
