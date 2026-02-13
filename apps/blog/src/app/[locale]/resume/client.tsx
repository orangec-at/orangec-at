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
import { useTranslations } from "next-intl";

interface TranslatedEducation {
  date: string;
  school: string;
  major: string;
}

interface TranslatedExperience {
  period: string;
  company: string;
  position: string;
  department: string;
  rank: string;
}

interface TranslatedLanguage {
  name: string;
  score: string;
}

interface TranslatedComputerSkill {
  name: string;
  level: string;
}

interface TranslatedCertificate {
  name: string;
  issuer: string;
  year: string;
}

interface TranslatedProject {
  company: string;
  name: string;
  period: string;
  description: string;
  achievements?: string[];
  techStack?: string[];
}

export default function ResumeClient() {
  const t = useTranslations("resume");

  const educationData = t.raw("data.education") as TranslatedEducation[];
  const experienceData = t.raw("data.experience") as TranslatedExperience[];
  const languagesData = t.raw("data.languages") as TranslatedLanguage[];
  const computerSkillsData = t.raw(
    "data.computerSkills"
  ) as TranslatedComputerSkill[];
  const certificatesData = t.raw(
    "data.certificates"
  ) as TranslatedCertificate[];
  const projectsData = t.raw("data.projects") as TranslatedProject[];
  const introductionText = t("data.introduction");

  const resumeData: ResumeData = {
    introduction: introductionText,
    personalInfo: {
      nameKorean: t("data.koreanName"),
      nameEnglish: t("data.englishName"),
      birthDate: t("data.birthDate"),
      email: t("data.emailAddress"),
      phone: t("data.phoneNumber"),
      sns: t("data.snsLink"),
      twitter: t("data.twitter"),
      linkedin: t("data.linkedin"),
      blog: t("data.blog"),
      address: t("data.address"),
      photoUrl: "/images/avatar.png",
    },
    military: {
      branch: t("data.militaryBranch"),
      status: t("data.militaryStatus"),
      rank: t("data.militaryRank"),
      location: t("data.militaryLocation"),
      period: t("data.militaryPeriod"),
      veteranStatus: t("data.veteranStatus"),
    },
    education: educationData.map((edu) => ({
      date: edu.date,
      school: edu.school,
      major: edu.major,
    })),
    experience: experienceData.map((exp) => ({
      period: exp.period,
      company: exp.company,
      position: exp.position,
      department: exp.department,
      rank: exp.rank,
    })),
    skills: {
      languages: languagesData.map((lang) => ({
        language: lang.name,
        certification: lang.score,
      })),
      computer: computerSkillsData.map((skill) => ({
        name: skill.name,
        level: t(`skills.level.${skill.level}`),
      })),
    },
    certificates: certificatesData.map((cert) => ({
      name: cert.name,
      issuer: cert.issuer,
      year: cert.year,
    })),
    projects: projectsData.map((proj) => ({
      company: proj.company,
      name: proj.name,
      period: proj.period,
      description: proj.description,
      achievements: proj.achievements,
      techStack: proj.techStack,
    })),
  };

  const hasMilitaryData = resumeData.military.branch !== "-";

  return (
    <main className="container-default pb-section space-y-8">
      <div className="mx-auto mb-10 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {t("title")}
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
