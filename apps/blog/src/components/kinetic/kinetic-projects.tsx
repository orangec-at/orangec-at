"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Code2 } from "lucide-react";

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  year: string;
  link?: string;
  repo?: string;
  featured?: boolean;
}

interface KineticProjectsProps {
  title?: string;
  projects?: Project[];
}

const DEFAULT_PROJECTS: Project[] = [
  {
    title: "DrawHatha",
    description: "Yoga practice tracking app with 1-year operation and active user base.",
    techStack: ["React Native", "TypeScript", "NestJS", "Supabase"],
    year: "2024",
    link: "https://apps.apple.com/kr/app/yoga-journaling-drawhatha/id6689512757",
  },
  {
    title: "YogaDay",
    description: "Centralized yoga one-day class platform to aggregate fragmented information.",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
    year: "2024",
    link: "https://yogaday.love",
  },
  {
    title: "Cloud Storage",
    description: "Enterprise-grade cloud storage system architecture and frontend implementation.",
    techStack: ["React", "Recoil", "Optimization"],
    year: "2023",
  }
];

export function KineticProjects({
  title = "Selected\nWorks",
  projects = DEFAULT_PROJECTS,
}: KineticProjectsProps) {
  return (
    <section className="bg-[#f4f1ea] dark:bg-black py-12 md:py-16 border-t border-[#1c1917]/10 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-2 block">
              (03)
            </span>
            <h2 className="font-serif text-[clamp(32px,6vw,64px)] md:text-[5vw] leading-[0.9] text-[#1c1917] dark:text-white uppercase font-bold">
              {title}
            </h2>
          </div>
          <div className="hidden md:block">
            <Code2 className="w-12 h-12 text-[#1c1917] dark:text-white opacity-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group relative border-t border-[#1c1917] dark:border-white py-8 md:py-10 hover:bg-white/50 dark:hover:bg-zinc-900/50 transition-colors duration-500"
            >
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-between items-start">
                <div className="w-full md:w-1/3">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-mono text-kinetic-orange text-sm">
                      {project.year}
                    </span>
                    <span className="h-px flex-1 bg-[#1c1917]/20 dark:bg-white/20"></span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1c1917] dark:text-white uppercase leading-none group-hover:translate-x-2 transition-transform duration-300">
                    {project.title}
                  </h3>
                </div>

                <div className="w-full md:w-1/3">
                  <p className="font-mono text-sm md:text-base text-[#78716c] dark:text-white/70 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-[#1c1917]/5 dark:bg-white/10 text-[#1c1917] dark:text-white font-mono text-xs uppercase rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-auto flex md:flex-col gap-4 md:items-end justify-start md:justify-start">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-sm uppercase text-[#1c1917] dark:text-white hover:text-kinetic-orange transition-colors group/link"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:rotate-45" />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-sm uppercase text-[#78716c] dark:text-white/60 hover:text-[#1c1917] dark:hover:text-white transition-colors group/link"
                    >
                      <span>Code</span>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
