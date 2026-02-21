import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { Button } from "@orangec-at/design";
import { getBlogPostsMeta } from "@/lib/blog-utils.server";
import { getRelatedBlogSlugs } from "@/data/connections";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const projectTitle = project.titleEn || project.title;
  const projectDescription = project.descriptionEn || project.description;
  const projectKeyFeatures = project.keyFeaturesEn || project.keyFeatures;
  const projectChallenges = project.challengesEn || project.challenges;

  // connections.ts에서 관련 블로그 포스트 가져오기
  const relatedBlogSlugs = getRelatedBlogSlugs(id);
  const blogPostsMeta =
    relatedBlogSlugs.length > 0 ? await getBlogPostsMeta(relatedBlogSlugs) : [];

  return (
    <div className="container-narrow pb-section">
      <div className="space-y-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-small text-muted-foreground transition-colors hover:text-foreground"
          >
          <ArrowLeft size={20} />
          Back to projects
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
                  Live Site
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
                  GitHub
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-3">
              <h3 className="text-h3 text-foreground">
                Tech Stack
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
            Project Overview
          </h2>
          <p className="text-body leading-relaxed text-muted-foreground">
            {projectDescription}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 text-h3 text-foreground">
                Key Features
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
                  <p>You can describe the key features of this project here.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-3 text-h3 text-foreground">
                Technical Challenges
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
                  <p>Describe the major challenges and solutions from development.</p>
                )}
              </div>
            </div>
          </div>

          {blogPostsMeta.length > 0 && (
            <div className="mt-12 rounded-2xl border border-ember-accent/30 bg-accent/30 p-6">
              <h3 className="mb-4 text-h3 text-foreground">
                Related Blog Posts
              </h3>
              <p className="mb-4 text-small text-muted-foreground">
                Dive deeper into the build process and technical insights for this project.
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
                          "en-US"
                        )}
                      </p>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        Read More
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
