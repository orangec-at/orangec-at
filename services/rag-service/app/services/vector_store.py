"""Vector store with Supabase pgvector support"""
import os
import json
import psycopg2
from psycopg2.extras import execute_values
from pgvector.psycopg2 import register_vector
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class VectorStore:
    """PostgreSQL vector store with pgvector"""

    def __init__(self):
        """Initialize connection to Supabase Postgres"""
        self.db_url = os.getenv("DATABASE_URL")
        if not self.db_url:
            raise ValueError("DATABASE_URL environment variable is not set")
        
        # Adjust pgbouncer URL if needed (replace 6543 with 5432 for direct access if preferred)
        # But usually DATABASE_URL from .env is fine.
        
        self._init_db()

    def _get_connection(self, register=True):
        """Create a new database connection"""
        conn = psycopg2.connect(self.db_url)
        if register:
            try:
                register_vector(conn)
            except Exception:
                # If extension not enabled yet, this might fail
                pass
        return conn

    def _init_db(self):
        """Initialize pgvector extension and table"""
        # First connection without registration to enable extension
        conn = self._get_connection(register=False)
        try:
            with conn.cursor() as cur:
                cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
            conn.commit()
            
            # Now we can register vector type
            register_vector(conn)
            
            with conn.cursor() as cur:
                # 2. Create Embedding table if not exists (matching Prisma schema)
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS "Embedding" (
                        "id" TEXT PRIMARY KEY,
                        "slug" TEXT NOT NULL,
                        "content" TEXT NOT NULL,
                        "metadata" JSONB NOT NULL,
                        "vector" vector(768),
                        "locale" TEXT NOT NULL DEFAULT 'ko',
                        "contentType" TEXT NOT NULL DEFAULT 'blog',
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # 3. Create indices for faster search
                cur.execute('CREATE INDEX IF NOT EXISTS "Embedding_locale_idx" ON "Embedding"("locale")')
                cur.execute('CREATE INDEX IF NOT EXISTS "Embedding_contentType_idx" ON "Embedding"("contentType")')
                
            conn.commit()
            print("✅ Database initialized with pgvector")
        except Exception as e:
            print(f"⚠️ Error initializing database: {e}")
            conn.rollback()
        finally:
            conn.close()

    def upsert_embeddings(self, documents: List[Dict]):
        """
        Upsert embeddings into PostgreSQL
        
        Args:
            documents: List of document dicts with embedding, slug, text, etc.
        """
        import uuid
        
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                # Prepare data for insertion
                data = []
                for doc in documents:
                    # Map doc fields to table columns
                    row = (
                        doc.get("id") or f"rag_{uuid.uuid4()}",
                        doc["slug"],
                        doc["text"],
                        json.dumps(doc.get("metadata", {})),
                        doc["embedding"],
                        doc.get("locale", "ko"),
                        doc.get("content_type", "blog")
                    )
                    data.append(row)
                
                # Use execute_values for efficient batch upsert
                # On conflict by id, update everything
                execute_values(cur, """
                    INSERT INTO "Embedding" (id, slug, content, metadata, vector, locale, "contentType")
                    VALUES %s
                    ON CONFLICT (id) DO UPDATE SET
                        content = EXCLUDED.content,
                        metadata = EXCLUDED.metadata,
                        vector = EXCLUDED.vector,
                        locale = EXCLUDED.locale,
                        "contentType" = EXCLUDED."contentType"
                """, data)
                
            conn.commit()
            print(f"✅ Upserted {len(documents)} embeddings to Supabase")
        except Exception as e:
            print(f"❌ Error upserting to database: {e}")
            conn.rollback()
            raise
        finally:
            conn.close()

    def search(
        self,
        query_embedding: object,
        top_k: int = 5,
        locale: Optional[str] = None,
        content_type: Optional[str] = None,
        min_similarity: float = 0.3
    ) -> List[Dict]:
        """
        Search for similar documents using cosine similarity (<=> operator)
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results
            locale: Filter
            content_type: Filter
            min_similarity: Threshold
            
        Returns:
            List of documents with similarity scores
        """
        conn = self._get_connection()
        results = []
        
        try:
            with conn.cursor() as cur:
                # pgvector cosine distance is 1 - cosine_similarity
                # So we use (1 - distance) to get similarity
                sql = """
                    SELECT 
                        slug, content, metadata, locale, "contentType",
                        1 - (vector <=> %s) AS similarity
                    FROM "Embedding"
                    WHERE 1=1
                """
                params = [query_embedding]
                
                if locale:
                    sql += " AND locale = %s"
                    params.append(locale)
                
                if content_type:
                    sql += ' AND "contentType" = %s'
                    params.append(content_type)
                    
                sql += " AND (1 - (vector <=> %s)) >= %s"
                params.append(query_embedding)
                params.append(min_similarity)
                
                sql += " ORDER BY similarity DESC LIMIT %s"
                params.append(top_k)
                
                cur.execute(sql, params)
                
                for row in cur.fetchall():
                    metadata = json.loads(row[2]) if isinstance(row[2], str) else (row[2] or {})
                    title = metadata.get("title") or row[0]
                    url = metadata.get("url") or ""

                    results.append({
                        "slug": row[0],
                        "text": row[1],
                        "title": title,
                        "url": url,
                        "metadata": metadata,
                        "locale": row[3],
                        "content_type": row[4],
                        "similarity": float(row[5])
                    })
                    
        except Exception as e:
            print(f"❌ Error searching database: {e}")
        finally:
            conn.close()
            
        return results

    def get_stats(self) -> Dict:
        """Get stats from database"""
        conn = self._get_connection()
        stats = {"total_embeddings": 0, "by_locale": {}, "by_content_type": {}}
        
        try:
            with conn.cursor() as cur:
                cur.execute('SELECT COUNT(*) FROM "Embedding"')
                total_row = cur.fetchone()
                if total_row is not None:
                    stats["total_embeddings"] = total_row[0]
                else:
                    stats["total_embeddings"] = 0
                
                cur.execute('SELECT locale, COUNT(*) FROM "Embedding" GROUP BY locale')
                for row in cur.fetchall():
                    stats["by_locale"][row[0]] = row[1]
                    
                cur.execute('SELECT "contentType", COUNT(*) FROM "Embedding" GROUP BY "contentType"')
                for row in cur.fetchall():
                    stats["by_content_type"][row[0]] = row[1]
        finally:
            conn.close()
            
        return stats

    def clear(self):
        """Clear the entire Embedding table"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute('DELETE FROM "Embedding"')
            conn.commit()
            print("✅ Cleared all database embeddings")
        finally:
            conn.close()
