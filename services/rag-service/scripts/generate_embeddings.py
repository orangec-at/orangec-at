"""Script to generate embeddings from blog MDX files"""
import asyncio
import sys
from pathlib import Path
from typing import List, Dict
import re

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.gemini import GeminiService
from app.services.vector_store import VectorStore


def extract_frontmatter(content: str) -> tuple[Dict, str]:
    """
    Extract frontmatter and content from MDX file

    Args:
        content: Full MDX file content

    Returns:
        Tuple of (frontmatter_dict, content_text)
    """
    frontmatter = {}
    text = content

    # Match frontmatter between ---
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if match:
        frontmatter_text = match.group(1)
        text = match.group(2)

        # Parse YAML-like frontmatter (simple key: value)
        for line in frontmatter_text.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                frontmatter[key.strip()] = value.strip().strip('"').strip("'")

    return frontmatter, text


def clean_mdx_content(content: str) -> str:
    """
    Clean MDX content for embedding generation

    Args:
        content: Raw MDX content

    Returns:
        Cleaned text
    """
    # Remove JSX components
    content = re.sub(r'<[^>]+>', '', content)

    # Remove code blocks (keep inline code)
    content = re.sub(r'```[\s\S]*?```', '', content)

    # Remove images
    content = re.sub(r'!\[.*?\]\(.*?\)', '', content)

    # Remove extra whitespace
    content = re.sub(r'\n\s*\n', '\n\n', content)
    content = content.strip()

    return content


async def index_blog_posts(gemini: GeminiService) -> List[Dict]:
    """
    Index blog posts from MDX files

    Args:
        gemini: GeminiService instance

    Returns:
        List of embedding documents
    """
    embeddings = []

    # Path to blog posts
    blog_posts_dir = Path(__file__).parent.parent.parent.parent / "apps" / "blog" / "src" / "posts"

    if not blog_posts_dir.exists():
        print(f"⚠️ Blog posts directory not found: {blog_posts_dir}")
        return embeddings

    # Process each locale
    for locale_dir in blog_posts_dir.iterdir():
        if not locale_dir.is_dir():
            continue

        locale = locale_dir.name
        print(f"\n📁 Processing locale: {locale}")

        # Process each MDX file
        for mdx_file in locale_dir.glob("*.mdx"):
            try:
                print(f"  📄 Reading: {mdx_file.name}")

                # Read file
                content = mdx_file.read_text(encoding='utf-8')

                # Extract frontmatter and content
                frontmatter, text = extract_frontmatter(content)

                # Clean content
                cleaned_text = clean_mdx_content(text)

                if not cleaned_text or len(cleaned_text) < 50:
                    print(f"  ⚠️ Skipping (too short): {mdx_file.name}")
                    continue

                # Generate embedding
                print(f"  🔄 Generating embedding...")
                embedding = await gemini.embed_text(cleaned_text)

                # Create document
                doc = {
                    "slug": mdx_file.stem,
                    "locale": locale,
                    "title": frontmatter.get("title", mdx_file.stem),
                    "content_type": "blog",
                    "embedding": embedding,
                    "text": cleaned_text[:1000],  # Store first 1000 chars
                    "url": f"/catalog/{mdx_file.stem}",
                    "metadata": {
                        "title": frontmatter.get("title", mdx_file.stem),
                    "url": f"/catalog/{mdx_file.stem}",

                        "date": frontmatter.get("date", ""),
                        "tags": frontmatter.get("tags", "").split(",") if frontmatter.get("tags") else [],
                        "category": frontmatter.get("category", ""),
                        "author": frontmatter.get("author", "Jaeil Lee"),
                    }
                }

                embeddings.append(doc)
                print(f"  ✅ Indexed: {doc['title']}")

            except Exception as e:
                print(f"  ❌ Error processing {mdx_file.name}: {e}")

    return embeddings


async def index_documents(gemini: GeminiService) -> List[Dict]:
    """
    Index documents (resumes, cover letters) from MDX files

    Args:
        gemini: GeminiService instance

    Returns:
        List of embedding documents
    """
    embeddings = []

    # Path to documents
    documents_dir = Path(__file__).parent.parent.parent.parent / "apps" / "blog" / "documents"

    if not documents_dir.exists():
        print(f"⚠️ Documents directory not found: {documents_dir}")
        return embeddings

    print(f"\n📁 Processing documents")

    # Process each document type
    for type_dir in documents_dir.iterdir():
        if not type_dir.is_dir():
            continue

        doc_type = type_dir.name
        print(f"  📂 Type: {doc_type}")

        # Process each MDX file
        for mdx_file in type_dir.glob("*.mdx"):
            # Skip templates
            if mdx_file.name.startswith("_"):
                continue

            try:
                print(f"    📄 Reading: {mdx_file.name}")

                # Read file
                content = mdx_file.read_text(encoding='utf-8')

                # Extract frontmatter and content
                frontmatter, text = extract_frontmatter(content)

                # Clean content
                cleaned_text = clean_mdx_content(text)

                if not cleaned_text or len(cleaned_text) < 50:
                    print(f"    ⚠️ Skipping (too short): {mdx_file.name}")
                    continue

                # Generate embedding
                print(f"    🔄 Generating embedding...")
                embedding = await gemini.embed_text(cleaned_text)

                # Determine locale from frontmatter
                locale = frontmatter.get("locale", "ko")

                # Create document
                doc = {
                    "slug": mdx_file.stem,
                    "locale": locale,
                    "title": frontmatter.get("title", mdx_file.stem),
                    "content_type": doc_type,
                    "embedding": embedding,
                    "text": cleaned_text[:1000],
                    "url": f"/documents/{doc_type}/{mdx_file.stem}",
                    "metadata": {
                        "title": frontmatter.get("title", mdx_file.stem),
                        "url": f"/documents/{doc_type}/{mdx_file.stem}",
                        "type": frontmatter.get("type", doc_type),
                        "status": frontmatter.get("status", ""),
                        "company": frontmatter.get("company", ""),
                        "targetPosition": frontmatter.get("targetPosition", ""),
                    }
                }

                embeddings.append(doc)
                print(f"    ✅ Indexed: {doc['title']}")

            except Exception as e:
                print(f"    ❌ Error processing {mdx_file.name}: {e}")

    return embeddings


async def main():
    """Main indexing function"""
    print("=" * 60)
    print("🚀 Starting content indexing with Gemini API")
    print("=" * 60)

    try:
        # Initialize services
        print("\n🔧 Initializing Gemini service...")
        gemini = GeminiService()

        # Index blog posts
        print("\n📝 Indexing blog posts...")
        blog_embeddings = await index_blog_posts(gemini)

        # Index documents
        print("\n📄 Indexing documents...")
        doc_embeddings = await index_documents(gemini)

        # Combine all embeddings
        all_embeddings = blog_embeddings + doc_embeddings

        if not all_embeddings:
            print("\n⚠️ No content found to index!")
            return

        # Save to vector store
        print(f"\n💾 Upserting {len(all_embeddings)} embeddings to database...")
        vector_store = VectorStore()
        vector_store.upsert_embeddings(all_embeddings)

        # Print summary
        print("\n" + "=" * 60)
        print("✅ Indexing completed successfully!")
        print("=" * 60)
        print(f"\nTotal indexed: {len(all_embeddings)}")
        print(f"  - Blog posts: {len(blog_embeddings)}")
        print(f"  - Documents: {len(doc_embeddings)}")

        # Print stats by locale
        stats = vector_store.get_stats()
        print(f"\nBy locale:")
        for locale, count in stats["by_locale"].items():
            print(f"  - {locale}: {count}")

        print(f"\nBy content type:")
        for content_type, count in stats["by_content_type"].items():
            print(f"  - {content_type}: {count}")

        print(f"\n📦 Data saved directly to Supabase Postgres")

    except Exception as e:
        print(f"\n❌ Error during indexing: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
