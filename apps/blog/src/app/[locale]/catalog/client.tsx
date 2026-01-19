"use client";

import { KineticCatalog } from "@/components/kinetic/kinetic-catalog";
import { Post } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";

interface CatalogClientProps {
  initialPosts: Post[];
}

export default function CatalogClient({ initialPosts }: CatalogClientProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const handlePostClick = (post: Post) => {
    router.push(withLocalePath(locale, `/catalog/${post.slug}`));
  };

  return (
    <KineticCatalog
      posts={initialPosts}
      onPostClick={handlePostClick}
      onBack={handleBack}
    />
  );
}
