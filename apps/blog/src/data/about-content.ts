export const ABOUT_CONTENT = {
  name: "Jaeil Lee",
  title: "Full-stack Developer & Product Builder",
  titleKo: "풀스택 개발자 & 프로덕트 빌더",

  story: [
    "I build products fast. With 4.5 years of experience across web, mobile, and enterprise applications, I specialize in turning ideas into shipped software - often solo, always with ownership.",
    "I started my career in chemical engineering, but found my real passion in building things people use. Since 2021, I've shipped 6 products including an iOS app on the App Store, a yoga class booking platform, and enterprise-grade multi-frontend architectures.",
    "My approach is problem-first: understand the pain, choose the simplest tech that solves it, ship fast, iterate based on real feedback. I use AI tools daily to move at 10x speed without sacrificing quality.",
  ],
  storyKo: [
    "저는 제품을 빠르게 만듭니다. 웹, 모바일, 엔터프라이즈 애플리케이션에 걸친 4.5년의 경험으로, 아이디어를 출시된 소프트웨어로 만드는 것을 전문으로 합니다.",
    "화학공학을 전공했지만, 사람들이 사용하는 것을 만드는 데서 진정한 열정을 찾았습니다. 2021년 이후 App Store에 출시된 iOS 앱, 요가 클래스 예약 플랫폼, 엔터프라이즈급 멀티 프론트엔드 아키텍처를 포함해 6개의 제품을 출시했습니다.",
    "제 접근 방식은 문제 우선입니다: 고통을 이해하고, 해결하는 가장 단순한 기술을 선택하고, 빠르게 출시하고, 실제 피드백을 기반으로 개선합니다.",
  ],

  techStack: {
    frontend: [
      "React",
      "Next.js 15",
      "TypeScript",
      "React Native",
      "Tailwind CSS",
      "Radix UI",
    ],
    backend: [
      "NestJS",
      "Prisma",
      "REST API",
      "PostgreSQL",
      "Supabase",
      "Redis",
    ],
    infrastructure: [
      "Docker",
      "Vercel",
      "AWS",
      "Oracle Cloud",
      "GitHub Actions",
      "pnpm Monorepo",
    ],
    ai: [
      "Claude Code",
      "RAG (Retrieval-Augmented Generation)",
      "AI-Powered Development",
    ],
  },

  career: [
    {
      year: "2025",
      role: "Freelance Developer",
      roleKo: "프리랜서 개발자",
      company: "DPP Platform",
      description: "3-frontend enterprise architecture",
      descriptionKo: "3-프론트엔드 엔터프라이즈 아키텍처",
    },
    {
      year: "2024",
      role: "Solo Builder",
      roleKo: "1인 개발",
      company: "Drawhatha & YogaDay",
      description: "App Store + Full-stack platform",
      descriptionKo: "App Store 출시 + 풀스택 플랫폼",
    },
    {
      year: "2022-2024",
      role: "Frontend Developer",
      roleKo: "프론트엔드 개발자",
      company: "MIDAS IT",
      description: "Cloud SaaS & SSO architecture",
      descriptionKo: "클라우드 SaaS & SSO 아키텍처",
    },
    {
      year: "2022",
      role: "Frontend Developer",
      roleKo: "프론트엔드 개발자",
      company: "Pikurate",
      description: "Web -> Mobile migration",
      descriptionKo: "웹 -> 모바일 마이그레이션",
    },
  ],

  availability: {
    type: "Part-time (20h/week) or Full-time",
    typeKo: "파트타임 (주 20시간) 또는 풀타임",
    start: "Immediate",
    startKo: "즉시 가능",
    timezone: "UTC+9 (flexible for US/EU hours)",
    timezoneKo: "UTC+9 (미국/유럽 시간 유연)",
    style: "Remote, async-friendly",
    styleKo: "원격, 비동기 친화",
  },
} as const;
