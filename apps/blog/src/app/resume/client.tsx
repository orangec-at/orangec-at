"use client";

import HomeHero from "@/components/home/home-hero";
import TechStack from "@/components/home/tech-stack";
import FeaturedProjects from "@/components/home/featured-projects";
import {
  CertificateSection,
  EducationSection,
  ExperienceSection,
  IntroductionSection,
  MilitarySection,
  PersonalInfoSection,
  ProjectHighlightsSection,
  ResumeData,
} from "@/components/resume";

const resumeData: ResumeData = {
  introduction:
    "I'm Jaeil Lee, a frontend developer who transforms complex data into intuitive UI.\n\nThroughout my service development career, I've consistently handled both frontend and back-office development. In this process, I've developed a keen interest in understanding complex data flows across various domains and restructuring them into user-centered interfaces.\n\nDesigning reusable components and establishing design systems based on them has been a particularly rewarding growth experience.\n\nI don't just stop at implementation; I think and act in ways that improve the whole team's productivity.",
  personalInfo: {
    nameKorean: "이재일",
    nameEnglish: "Lee Jaeil",
    birthDate: "-",
    email: "radio941016@gmail.com",
    phone: "",
    sns: "",
    twitter: "https://x.com/x_orangec_at",
    linkedin: "https://www.linkedin.com/in/orangec-at/",
    blog: "https://orangec-at.vercel.app",
    address: "",
    photoUrl: "/images/avatar.png",
  },
  military: {
    branch: "-",
    status: "-",
    rank: "-",
    location: "-",
    period: "-",
    veteranStatus: "-",
  },
  education: [
    {
      date: "Mar 2013 ~ Feb 2021",
      school: "Dongguk University",
      major: "Chemical & Biological Engineering",
    },
    {
      date: "Nov 2024 ~ Apr 2025",
      school: "LikeLion Duotone",
      major: "KDT Design School Cohort 4",
    },
  ],
  experience: [
    {
      period: "Sep 2025 ~ Present",
      company: "DPP Platform",
      position: "Frontend Developer",
      department: "Digital Product Passport (Next.js)",
      rank: "-",
    },
    {
      period: "Oct 2022 ~ Mar 2024",
      company: "MIDAS IT",
      position: "Frontend Developer",
      department: "Cell One - DX Dev",
      rank: "-",
    },
    {
      period: "Mar 2022 ~ Sep 2022",
      company: "Pikurate Inc.",
      position: "Frontend Developer",
      department: "Dev Team",
      rank: "Researcher",
    },
    {
      period: "Jun 2020 ~ Dec 2021",
      company: "SecureNet Inc.",
      position: "Full-stack Developer",
      department: "Service Dev",
      rank: "Manager",
    },
  ],
  skills: {
    languages: [{ language: "English", certification: "Conversational (OPIc)" }],
    computer: [
      { name: "React / Next.js", level: "Advanced" },
      { name: "React Native", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "NestJS", level: "Intermediate" },
    ],
  },
  certificates: [
    {
      name: "Engineer Information Processing",
      issuer: "Human Resources Development Service of Korea",
      year: "2021",
    },
    { name: "OPIc", issuer: "Multicampus", year: "2020" },
  ],
  projects: [
    {
      company: "DPP Platform",
      name: "Battery Digital Product Passport (Admin/Data/User Front)",
      period: "Sep 2025 ~ Present",
      description:
        "Built three Next.js fronts for EV battery lifecycle management across admin, data provider, and user portals.",
      achievements: ["Led FE architecture", "Unified design system across fronts"],
      techStack: ["Next.js", "TypeScript", "Zustand", "TanStack Query", "TanStack Table"],
    },
    {
      company: "Side Project",
      name: "Yoga Journaling App (React Native)",
      period: "Mar 2024 ~ Oct 2024",
      description:
        "Built a React Native app with pnpm monorepo and turborepo, plus a NestJS backend.",
      achievements: ["Launched on App Store", "Owned both frontend and backend"],
      techStack: ["React Native", "NestJS", "Zustand", "React Query", "Prisma"],
    },
  ],
};

export default function ResumeClient() {
  const hasMilitaryData = resumeData.military.branch !== "-";

  return (
    <main className="container-default pb-section space-y-8">
      <div className="mx-auto mb-10 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <HomeHero />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <TechStack />
          </div>
        </div>

        <FeaturedProjects />
      </div>
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-5">
        <div className="rounded-2xl border border-border bg-background p-8 md:p-12">
          <h1 className="mb-12 text-center text-h2 font-serif tracking-wide text-foreground md:text-display">
            Resume
          </h1>

          {resumeData.introduction && (
            <IntroductionSection content={resumeData.introduction} />
          )}

          <PersonalInfoSection data={resumeData.personalInfo} />

          {hasMilitaryData && <MilitarySection data={resumeData.military} />}

          <EducationSection data={resumeData.education} />

          <ExperienceSection data={resumeData.experience} />

          {resumeData.certificates && resumeData.certificates.length > 0 && (
            <CertificateSection data={resumeData.certificates} />
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <ProjectHighlightsSection data={resumeData.projects} />
          )}
        </div>
      </div>
    </main>
  );
}
