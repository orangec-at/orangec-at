import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  date: string;
  slug: string;
  description?: string;
  author: string;
  category?: string;
  thumbnail?: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean;
}

export default function BlogCard({
  title,
  date,
  slug,
  description,
  author,
  category,
  thumbnail,
  readTime,
  tags = [],
  featured = false,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* 이미지 섹션 - 항상 표시 */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center group-hover:from-blue-100 group-hover:via-purple-100 group-hover:to-pink-100 transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-2 opacity-60">📝</div>
                <div className="text-sm font-medium text-gray-500">
                  {category || "Blog"}
                </div>
              </div>
            </div>
          )}

          {/* 카테고리와 읽기 시간 배지 */}
          <div className="absolute left-3 top-3 flex gap-2">
            {category && (
              <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                {category}
              </span>
            )}
            {readTime && (
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
                {readTime}
              </span>
            )}
          </div>

          {/* Featured 배지 */}
          {featured && (
            <div className="absolute right-3 top-3">
              <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="p-5">
          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {title}
          </h3>

          {description && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}

          {/* 태그 */}
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-600 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 작성자와 날짜 정보 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <time className="text-gray-500 dark:text-gray-400">{date}</time>
              </div>
            </div>

            {/* 북마크 아이콘 */}
            <button
              className="rounded-full p-1.5 text-gray-400 dark:text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={(e) => {
                e.preventDefault();
                // 북마크 기능 구현
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
