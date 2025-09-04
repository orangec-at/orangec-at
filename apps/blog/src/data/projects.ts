export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  url?: string;
  github?: string;
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Yoga Studio Website",
    description: "노코드 툴 기반 요가원 홈페이지 제작 프로젝트",
    techStack: ["Next.js", "TypeScript", "TailwindCSS"],
    url: "https://yogaday.love",
    github: "https://github.com/username/yoga-studio",
    image: "/images/yoga-studio.png",
  },
  {
    id: "2",
    title: "Draw Hatha",
    description: "요가기록 앱 제작 프로젝트",
    techStack: [
      "React Native CLI",
      "TypeScript",
      "styled-component",
      "NestJS",
      "Supabase",
      "OracleCloud",
    ],
    url: "https://apps.apple.com/us/app/yoga-journaling-drawhatha/id6689512757",
    github: "https://github.com/username/portfolio",
    image: "/images/drawhatha.png",
  },
];
