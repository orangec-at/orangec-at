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
    title: "Drawhatha (요가 저널링 iOS 앱)",
    description:
      "요가 수련 과정을 기록하고 분석할 수 있는 iOS 앱. React Native CLI로 제작하여 App Store 배포.",
    techStack: [
      "React Native CLI",
      "TypeScript",
      "styled-components",
      "NestJS",
      "Supabase",
      "Oracle Cloud",
    ],
    url: "https://apps.apple.com/us/app/yoga-journaling-drawhatha/id6689512757",
    github: "https://github.com/username/drawhatha",
    image: "/images/projects/drawhatha.png",
  },
  {
    id: "2",
    title: "Yogaday (원데이 클래스 플랫폼)",
    description:
      "요가 강사와 수강생을 연결하는 원데이 클래스 플랫폼. 예약 및 결제 기능 포함.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Supabase"],
    url: "https://yogaday.love",
    github: "https://github.com/username/yogaday",
    image: "/images/projects/yogaday.png",
  },
  {
    id: "3",
    title: "건축설계 SaaS 개발 및 관리자 개발",
    description:
      "기업용 SaaS 협업 툴 프론트엔드 개발. 프로젝트 관리 및 로그인 기능, 관리자 개발 담당.",
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Recoil",
      "React Query",
      "Emotion",
    ],
    url: "https://members.midasuser.com", // 실제 URL 있으면 교체
    github: "",
    image: "/images/projects/midas.png",
  },
  {
    id: "4",
    title: "피큐레잇 (콘텐츠 큐레이션 플랫폼)",
    description:
      "사용자가 다양한 콘텐츠를 큐레이션하고 공유할 수 있는 서비스. 추천 알고리즘과 북마크 기능을 포함.",
    techStack: [
      "ReactNative",
      "TypeScript",
      "zustand",
      "Styled-components",
      "tanstack-query",
    ],
    url: "https://www.pikurate.com", // 실제 서비스 링크
    github: "",
    image: "/images/projects/pikurate.png",
  },
  {
    id: "6",
    title: "사내 백오피스 시스템",
    description:
      "회원 관리, 결제, 통계 모니터링 기능을 제공하는 백오피스 개발. 권한 기반 접근 제어 포함.",
    techStack: ["Next.js", "TypeScript", "Prisma", "TailwindCSS", "Vercel"],
    url: "",
    github: "https://github.com/username/admin",
    image: "/images/projects/securenet.png",
  },
];

export const FEATURED_PROJECTS: Project[] = [
  PROJECTS[0], // Drawhatha
  PROJECTS[1], // Yogaday
  PROJECTS[2], // SaaS 협업 플랫폼
  // 필요하다면 PROJECTS[4] 대시보드도 추가 가능
];
