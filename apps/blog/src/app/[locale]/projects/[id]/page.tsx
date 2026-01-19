import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { Button } from "@orangec-at/design";
import { designTokens } from "@/lib/design-tokens";
import { getBlogPostsMeta } from "@/lib/blog-utils.server";
import { getRelatedBlogSlugs } from "@/data/connections";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { withLocalePath } from "@/lib/locale-path";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const projectTitle =
    locale === "ko" ? project.title : project.titleEn || project.title;
  const projectDescription =
    locale === "ko" ? project.description : project.descriptionEn || project.description;
  const projectKeyFeatures =
    locale === "ko"
      ? project.keyFeatures
      : project.keyFeaturesEn || project.keyFeatures;
  const projectChallenges =
    locale === "ko"
      ? project.challenges
      : project.challengesEn || project.challenges;

  // connections.ts에서 관련 블로그 포스트 가져오기
  const relatedBlogSlugs = getRelatedBlogSlugs(id);
  const blogPostsMeta =
    relatedBlogSlugs.length > 0 ? await getBlogPostsMeta(relatedBlogSlugs) : [];

  return (
    <div className="min-h-screen bg-[#f4f1ea] dark:bg-zinc-900">
      <div className="container mx-auto px-4 pt-28 md:pt-32 pb-8 max-w-4xl">
        {/* Back Button */}
          <Link
            href={withLocalePath(locale, "/projects")}
            className="inline-flex items-center gap-2 text-[#78716c] dark:text-gray-400 hover:text-[#1c1917] dark:hover:text-white mb-8 transition-colors"
          >
          <ArrowLeft size={20} />
          {t("backToList")}
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className={`${designTokens.typography.hero} mb-4`}>
            {projectTitle}
          </h1>

          {/* Project Links */}
          <div className="flex gap-4 mb-6">
            {project.url && (
              <Button asChild>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} />
                  {t("liveSite")}
                </a>
              </Button>
            )}
            {project.github && (
              <Button asChild variant="secondary">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} />
                  {t("github")}
                </a>
              </Button>
            )}
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1c1917] dark:text-white mb-3">
              {t("techStack")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-white dark:bg-zinc-800 text-[#1c1917] dark:text-gray-300 rounded-full text-sm font-medium border border-stone-200 dark:border-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
              <Image
                src={project.image}
                alt={projectTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Project Description */}
        <div className="prose max-w-none">
          <h2 className={`${designTokens.typography.section} mb-4`}>
            {t("overview")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
            {projectDescription}
          </p>

          {/* Key Features & Challenges */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3
                className={`${designTokens.typography.cardTitle} mb-3 text-gray-900 dark:text-white`}
              >
                {t("keyFeatures")}
              </h3>
              <div className="text-gray-700 dark:text-gray-300">
                {projectKeyFeatures && projectKeyFeatures.length > 0 ? (
                  <ul className="space-y-2">
                    {projectKeyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("keyFeaturesPlaceholder")}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3
                className={`${designTokens.typography.cardTitle} mb-3 text-gray-900 dark:text-white`}
              >
                {t("challenges")}
              </h3>
              <div className="text-gray-700 dark:text-gray-300">
                {projectChallenges && projectChallenges.length > 0 ? (
                  <ul className="space-y-2">
                    {projectChallenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">⚡</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("challengesPlaceholder")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Related Blog Posts */}
          {blogPostsMeta.length > 0 && (
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <h3
                className={`${designTokens.typography.cardTitle} mb-4 text-gray-900 dark:text-white`}
              >
                {t("relatedPosts")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("relatedPostsDescription")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {blogPostsMeta.map((post) => (
                  <div
                    key={post.slug}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h4>
                    {post.date && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {new Date(post.date).toLocaleDateString(
                          locale === "ko" ? "ko-KR" : "en-US"
                        )}
                      </p>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={withLocalePath(locale, `/catalog/${post.slug}`)}>
                        {t("readMore")}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
