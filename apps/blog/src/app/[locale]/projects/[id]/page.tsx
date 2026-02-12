import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { Button } from "@orangec-at/design";
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
    <div className="container-narrow py-section">
      <div className="space-y-8">
          <Link
            href={withLocalePath(locale, "/projects")}
            className="inline-flex items-center gap-2 text-small text-muted-foreground transition-colors hover:text-foreground"
          >
          <ArrowLeft size={20} />
          {t("backToList")}
        </Link>

        <div className="space-y-6">
          <h1 className="text-display font-serif tracking-tight text-foreground">
            {projectTitle}
          </h1>

          <div className="flex flex-wrap gap-4">
            {project.url && (
              <Button asChild className="rounded-full">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} />
                  {t("liveSite")}
                </a>
              </Button>
            )}
            {project.github && (
              <Button asChild variant="secondary" className="rounded-full">
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

          <div className="space-y-3">
            <h3 className="text-h3 text-foreground">
              {t("techStack")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-accent/40 px-3 py-1 text-small font-medium text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.image && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="relative h-96 w-full overflow-hidden rounded-xl bg-surface">
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

        <div className="space-y-8">
          <h2 className="text-h2 font-serif text-foreground">
            {t("overview")}
          </h2>
          <p className="text-body leading-relaxed text-muted-foreground">
            {projectDescription}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 text-h3 text-foreground">
                {t("keyFeatures")}
              </h3>
              <div className="text-small text-muted-foreground">
                {projectKeyFeatures && projectKeyFeatures.length > 0 ? (
                  <ul className="space-y-2">
                    {projectKeyFeatures.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="mr-2 text-ember-accent">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("keyFeaturesPlaceholder")}</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 text-h3 text-foreground">
                {t("challenges")}
              </h3>
              <div className="text-small text-muted-foreground">
                {projectChallenges && projectChallenges.length > 0 ? (
                  <ul className="space-y-2">
                    {projectChallenges.map((challenge) => (
                      <li key={challenge} className="flex items-start">
                        <span className="mr-2 text-ember-accent">⚡</span>
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

          {blogPostsMeta.length > 0 && (
            <div className="mt-12 rounded-2xl border border-ember-accent/30 bg-accent/30 p-6">
              <h3 className="mb-4 text-h3 text-foreground">
                {t("relatedPosts")}
              </h3>
              <p className="mb-4 text-small text-muted-foreground">
                {t("relatedPostsDescription")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {blogPostsMeta.map((post) => (
                  <div
                    key={post.slug}
                    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-ember-accent/40"
                  >
                    <h4 className="mb-2 text-small font-semibold text-foreground">
                      {post.title}
                    </h4>
                    {post.date && (
                      <p className="mb-3 text-micro text-muted-foreground">
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
                      <Link href={withLocalePath(locale, `/blog/${post.slug}`)}>
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
