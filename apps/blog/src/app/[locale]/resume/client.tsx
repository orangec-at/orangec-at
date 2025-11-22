"use client";

import { useTranslations } from "next-intl";
import {
  PersonalInfoSection,
  MilitarySection,
  EducationSection,
  ExperienceSection,
  SkillsSection,
  IntroductionSection,
  CertificateSection,
  ProjectHighlightsSection,
  ResumeData,
} from "@/components/resume";

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

  // Get translated data from messages
  const educationData = t.raw("data.education") as TranslatedEducation[];
  const experienceData = t.raw("data.experience") as TranslatedExperience[];
  const languagesData = t.raw("data.languages") as TranslatedLanguage[];
  const computerSkillsData = t.raw("data.computerSkills") as TranslatedComputerSkill[];
  const certificatesData = t.raw("data.certificates") as TranslatedCertificate[];
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
      address: t("data.address"),
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

  // Check if military section has meaningful data
  const hasMilitaryData = resumeData.military.branch !== "-";

  return (
    <main className="relative px-4 py-8 md:px-16 md:py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 md:p-12 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-widest text-gray-900 dark:text-gray-100">
          {t("title")}
        </h1>

        {/* 자기소개 */}
        {resumeData.introduction && (
          <IntroductionSection content={resumeData.introduction} />
        )}

        {/* 인적사항 */}
        <PersonalInfoSection data={resumeData.personalInfo} />

        {/* 병역사항 - 데이터가 있는 경우에만 표시 */}
        {hasMilitaryData && <MilitarySection data={resumeData.military} />}

        {/* 학력사항 */}
        <EducationSection data={resumeData.education} />

        {/* 경력사항 */}
        <ExperienceSection data={resumeData.experience} />

        {/* 자격사항 */}
        {resumeData.certificates && resumeData.certificates.length > 0 && (
          <CertificateSection data={resumeData.certificates} />
        )}

        {/* 개인능력 */}
        <SkillsSection data={resumeData.skills} />

        {/* 주요 프로젝트 */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <ProjectHighlightsSection data={resumeData.projects} />
        )}
      </div>
    </main>
  );
}
