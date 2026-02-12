"use client";

import { useEffect, useMemo, useState } from "react";
import { Project } from "@/data/projects";
import { Card } from "@orangec-at/design";
import { Badge } from "@orangec-at/design";
import { Title, Body, TypographyLink } from "@orangec-at/design/blog";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { MdClose } from "react-icons/md";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("projects");
  const locale = useLocale();
  const title = locale === "ko" ? project.title : project.titleEn || project.title;
  const description =
    locale === "ko" ? project.description : project.descriptionEn || project.description;
  const images = useMemo(
    () => (project.images && project.images.length > 0 ? project.images : project.image ? [project.image] : []),
    [project.images, project.image]
  );
  const [slide, setSlide] = useState(0);
  const hasSlides = images.length > 1;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
        className="mx-auto w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-none focus:outline-none focus:ring-2 focus:ring-ember-accent/60"
      >
        <div className="flex flex-col h-full">
          {project.image && (
            <Image
              src={project.image}
              alt={title}
              width={800}
              height={450}
              className="w-full h-44 object-cover"
            />
          )}
          <div className="flex-1 p-4 space-y-3">
            <Title variant="l-700" className="text-foreground">
              {title}
            </Title>
            <Body variant="m-400" className="leading-relaxed text-muted-foreground">
              {description}
            </Body>
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 4).map((tech) => (
                  <Badge
                    key={tech}
                    className="rounded-full border border-border bg-accent/40 px-3 py-1 text-micro font-medium text-foreground"
                  >
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 4 && (
                  <Badge className="rounded-full border border-border bg-accent/40 px-3 py-1 text-micro font-medium text-foreground">
                    +{project.techStack.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="px-4 pb-4 flex justify-end">
            <TypographyLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              variant="m-400"
              className="text-muted-foreground hover:text-ember-accent"
            >
              {t("viewMore")}
            </TypographyLink>
          </div>
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <Card className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MdClose size={22} />
            </button>

            <div className="flex flex-col gap-4 p-6 overflow-y-auto">
              <div className="flex justify-center">
                <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-surface">
                  {images.length > 0 ? (
                    <>
                      <Image
                        key={images[slide]}
                        src={images[slide]}
                        alt={title}
                        width={1200}
                        height={900}
                        sizes="(min-width: 1024px) 70vw, 100vw"
                        quality={92}
                        priority={open}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {hasSlides && (
                        <>
                          <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/85 p-2 shadow transition-colors hover:bg-background"
                            onClick={() => setSlide((prev) => (prev - 1 + images.length) % images.length)}
                            aria-label="Previous"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/85 p-2 shadow transition-colors hover:bg-background"
                            onClick={() => setSlide((prev) => (prev + 1) % images.length)}
                            aria-label="Next"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                            {images.map((_, idx) => (
                              <span
                                key={`${project.id}-dot-${idx}`}
                                 className={`h-2 w-2 rounded-full ${idx === slide ? "bg-ember-accent" : "bg-muted"}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      {t("viewDetails")}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Title variant="xl-700" className="text-foreground">
                    {title}
                  </Title>
                  <Body variant="m-400" className="leading-relaxed text-muted-foreground">
                    {description}
                  </Body>
                </div>

                {project.techStack.length > 0 && (
                  <div className="space-y-2">
                    <Body variant="s-700" className="uppercase tracking-wide text-muted-foreground">
                      {t("techStack")}
                    </Body>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                         <Badge key={tech} className="rounded-full border border-border bg-accent/40 px-3 py-1 text-micro font-medium text-foreground">
                           {tech}
                         </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="space-y-3">
                    <Body variant="s-700" className="uppercase tracking-wide text-muted-foreground">
                      {t("keyFeatures")}
                    </Body>
                    <div className="space-y-2 text-muted-foreground">
                      {(locale === "ko" ? project.keyFeatures : project.keyFeaturesEn || project.keyFeatures).map((feature) => (
                        <div key={feature} className="flex items-start gap-2 leading-relaxed">
                          <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.challenges && project.challenges.length > 0 && (
                  <div className="space-y-3">
                    <Body variant="s-700" className="uppercase tracking-wide text-muted-foreground">
                      {t("challenges")}
                    </Body>
                    <div className="space-y-2 text-muted-foreground">
                      {(locale === "ko" ? project.challenges : project.challengesEn || project.challenges).map((challenge) => (
                        <div key={challenge} className="flex items-start gap-2 leading-relaxed">
                          <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400" />
                          <span>{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(project.url || project.github) && (
                  <div className="flex flex-wrap gap-4">
                    {project.url && (
                      <TypographyLink
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        variant="m-400"
                        className="text-ember-accent hover:text-ember-accent-dim"
                      >
                        {t("liveSite")}
                      </TypographyLink>
                    )}
                    {project.github && (
                      <TypographyLink
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        variant="m-400"
                        className="text-ember-accent hover:text-ember-accent-dim"
                      >
                        {t("github")}
                      </TypographyLink>
                    )}
                  </div>
                )}

                {project.relatedBlogPosts && project.relatedBlogPosts.length > 0 && (
                  <div className="space-y-2">
                    <Body variant="s-700" className="uppercase tracking-wide text-muted-foreground">
                      {t("relatedPosts")}
                    </Body>
                    <div className="flex flex-wrap gap-2">
                      {project.relatedBlogPosts.map((slug) => (
                        <TypographyLink
                          key={slug}
                          href={withLocalePath(locale, `/blog/${slug}`)}
                          variant="s-400"
                          className="text-ember-accent hover:text-ember-accent-dim"
                        >
                          {t("readMore")}
                        </TypographyLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
