"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { Title, Body, Detail } from "../ui/typography";

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
  category,
  thumbnail,
  readTime,
  tags = [],
  featured = false,
}: BlogCardProps) {
  const t = useTranslations("blog");
  const locale = useLocale();

  return (
    <Link href={withLocalePath(locale, `/catalog/${slug}`)} className="block h-full">
      <article className="group relative flex h-full flex-col overflow-hidden bg-transparent">
        <div className="relative aspect-[4/3] overflow-hidden bg-wood-100 dark:bg-wood-900">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-wood-100 dark:bg-wood-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2 opacity-40 text-wood-600 dark:text-wood-400">📝</div>
                <div className="text-sm font-medium text-wood-700 dark:text-wood-300">
                  {category || t("defaultCategory")}
                </div>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            {category && (
              <span className="muji-label px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-sm">
                {category}
              </span>
            )}
            {readTime && (
              <span className="muji-label px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-sm">
                {readTime}
              </span>
            )}
          </div>

          {featured && (
            <div className="absolute right-3 top-3">
              <span className="muji-label px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm">
                ★ {t("featured")}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <Title
            variant="m-700"
            as="h3"
            className="mb-3 text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-300 line-clamp-2"
          >
            {title}
          </Title>

          {description && (
            <Body variant="s-400" className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-3">
              {description}
            </Body>
          )}

          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="muji-label inline-flex px-2 py-1 text-[11px] tracking-wide"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="muji-label inline-flex px-2 py-1 text-[11px] tracking-wide">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-200/70 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <time>
                <Detail variant="s-400" className="text-gray-600 dark:text-gray-400">
                  {date}
                </Detail>
              </time>
            </div>

            <button
              className="p-1.5 text-gray-500 dark:text-gray-500 transition-colors hover:bg-wood-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={(e) => {
                e.preventDefault();
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
