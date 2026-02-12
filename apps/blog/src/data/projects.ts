export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  techStack: string[];
  url?: string;
  github?: string;
  image?: string;
  images?: string[];
  relatedBlogPosts?: string[]; // 블로그 포스트 slug 배열
  keyFeatures?: string[]; // 주요 기능
  challenges?: string[]; // 개발 과정의 도전과 해결책
  keyFeaturesEn?: string[]; // 주요 기능 (영문)
  challengesEn?: string[]; // 개발 과정의 도전과 해결책 (영문)
  featured?: boolean; // Show on homepage
  category?: string; // "enterprise" | "fullstack" | "mobile" | "internal"
  duration?: string; // "Sep 2025 - Jan 2026"
  durationEn?: string;
  role?: string; // "Solo Developer" | "Frontend Lead"
  roleEn?: string;
  impact?: string[]; // Measurable outcome statements
  impactEn?: string[];
  liveUrl?: string; // Separate from github — the actual product URL
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Drawhatha (요가 저널링 iOS 앱)",
    titleEn: "Drawhatha (Yoga journaling iOS app)",
    description:
      "요가 수련 과정을 기록하고 분석할 수 있는 iOS 앱. React Native CLI로 제작하여 App Store 배포.",
    descriptionEn:
      "iOS app to log and analyze yoga practice. Built with React Native CLI and shipped to the App Store.",
    techStack: [
      "React Native CLI",
      "TypeScript",
      "styled-components",
      "NestJS",
      "Supabase",
      "Oracle Cloud",
    ],
    url: "https://apps.apple.com/us/app/yoga-journaling-drawhatha/id6689512757",
    image: "/images/projects/drawhatha.png",
    relatedBlogPosts: ["from-idea-to-app-store-in-3-months"],
    keyFeatures: [
      "요가 세션 기록 및 분석",
      "개인 맞춤 통계 제공",
      "오프라인 동기화",
      "Apple HealthKit 연동"
    ],
    challenges: [
      "React Native CLI에서 App Store 배포 과정 최적화",
      "Supabase와 React Native 간 실시간 동기화 구현",
      "iOS 심사 통과를 위한 앱 정책 준수"
    ],
    keyFeaturesEn: [
      "Log and analyze yoga sessions",
      "Personalized statistics",
      "Offline sync",
      "Apple HealthKit integration"
    ],
    challengesEn: [
      "Optimized App Store submission with React Native CLI",
      "Built real-time sync between Supabase and React Native",
      "Complied with iOS review policies"
    ],
    featured: true,
    category: "mobile",
    duration: "2024.03 - 현재",
    durationEn: "Mar 2024 - Present",
    role: "풀스택 단독 개발",
    roleEn: "Solo Full-Stack Developer",
    impact: [
      "아이디어→App Store 출시까지 3개월 단독 개발",
      "React Native CLI + NestJS + Docker 풀스택 아키텍처",
      "Apple HealthKit 연동으로 요가 세션 데이터 통합",
      "사용자 피드백 기반 지속적 개선 운영 중",
    ],
    impactEn: [
      "Idea to App Store in 3 months, solo development",
      "Full-stack architecture: React Native CLI + NestJS + Docker",
      "Apple HealthKit integration for yoga session data",
      "Continuous improvement driven by user feedback",
    ],
    liveUrl:
      "https://apps.apple.com/kr/app/yoga-journaling-drawhatha/id6689512757",
  },
  {
    id: "2",
    title: "YogaDay (요가 원데이클래스 플랫폼)",
    titleEn: "YogaDay (One-day yoga class platform)",
    description:
      "Next.js 기반 풀스택으로 만든 요가 클래스 예약/관리 플랫폼. App Router, Prisma, NextAuth, Tailwind/shadcn.ui를 활용해 사용자/강사/관리자 플로우를 구현하고 SEO·성능을 최적화.",
    descriptionEn:
      "Next.js full-stack platform for yoga class booking/management. Built with App Router, Prisma, NextAuth, Tailwind/shadcn.ui, covering user/instructor/admin flows with SEO and performance optimizations.",
    techStack: [
      "Next.js (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "NextAuth",
      "Zustand",
      "React Query"
    ],
    url: "https://www.yogaday.love",
    github: "",
    image: "/images/projects/yogaday.png",
    relatedBlogPosts: ["shipping-fullstack-booking-platform-solo"],
    keyFeatures: [
      "요가 클래스 조회/예약, 강사 프로필·클래스 관리",
      "이메일 기반 로그인과 역할 분리 (사용자/강사/관리자)",
      "App Router + Prisma로 풀스택 API/DB 모델링, SEO 최적화",
      "Tailwind + shadcn/ui로 반응형 UI, 예약 플로우 개선"
    ],
    keyFeaturesEn: [
      "Yoga class browsing/booking plus instructor profiles and class management",
      "Email-based login with clear roles (user/instructor/admin)",
      "Full-stack API/DB modeling with App Router + Prisma, SEO tuning",
      "Responsive UI with Tailwind + shadcn/ui, streamlined booking flow"
    ],
    challenges: [
      "App Router와 Server/Client Component 패턴에 맞춘 구조 설계",
      "Prisma 스키마로 사용자/강사/클래스/예약 도메인 모델링",
      "세션 및 권한 관리 체계 설계",
      "Core Web Vitals 개선과 메타데이터·사이트맵 설정"
    ],
    challengesEn: [
      "Architected for App Router with Server/Client Components",
      "Modeled user/instructor/class/booking domain via Prisma schema",
      "Designed session and role management without third-party OAuth",
      "Improved Core Web Vitals plus metadata and sitemap for SEO"
    ],
    featured: true,
    category: "fullstack",
    duration: "2024.08 - 현재",
    durationEn: "Aug 2024 - Present",
    role: "풀스택 단독 개발",
    roleEn: "Solo Full-Stack Developer",
    impact: [
      "기획→디자인→개발→배포→SEO 전 과정 단독 수행",
      "사용자/강사/관리자 3-role 인증 시스템 설계",
      "App Router + Prisma로 풀스택 API/DB 모델링",
      "Core Web Vitals 최적화 및 Vercel 자동 배포",
    ],
    impactEn: [
      "Solo end-to-end: planning → design → development → deployment → SEO",
      "Designed 3-role auth system (user/instructor/admin)",
      "Full-stack API/DB modeling with App Router + Prisma",
      "Core Web Vitals optimization with Vercel auto-deployment",
    ],
    liveUrl: "https://www.yogaday.love",
  },
  {
    id: "3",
    title: "건축/설계 SaaS & 백오피스",
    titleEn: "Architecture SaaS & Back-office",
    description:
      "구독 전환 백오피스(RPM)와 건축/설계 특화 클라우드 스토리지(MWS)의 프론트엔드를 담당. 회원·구독·라이선스 관리와 대용량 파일/버전·협업 기능을 React/Next.js로 구현.",
    descriptionEn:
      "Owned frontend for RPM (subscription back-office) and MWS (architecture-focused cloud storage). Built member/subscription/license management plus large-file/versioning and collaboration features with React/Next.js.",
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Recoil",
      "React Query",
      "Emotion",
      "Styled-components",
      "Yarn Workspaces",
    ],
    url: "",
    github: "",
    image: "/images/projects/midas.png",
    relatedBlogPosts: ["nextjs-fullstack-development"],
    keyFeatures: [
      "구독 전환 백오피스: 회원/제품/구독/결제 관리, 관리자 권한 체계",
      "클라우드 스토리지: 대용량 파일 청크 업로드, 버전/공유/권한 관리",
      "협업 기능: 댓글·알림·드래그앤드롭 업로드, 가상 스크롤 기반 파일 트리",
      "모노레포(Next.js)에서 Recoil + React Query로 클라이언트/서버 상태 분리"
    ],
    keyFeaturesEn: [
      "Subscription back-office: member/product/subscription/billing with admin roles",
      "Cloud storage: large-file chunk uploads, versioning, sharing, permissions",
      "Collaboration: comments, notifications, drag-and-drop uploads, virtualized file tree",
      "Monorepo (Next.js) with Recoil + React Query separating client/server state"
    ],
    challenges: [
      "복잡한 폼·테이블 상태를 Recoil로 모듈화하고 React Query로 서버 동기화",
      "대용량 파일 업로드/버전 관리 UI 성능 최적화(가상화·지연 로딩)",
      "백엔드와 ERD/API 명세를 공동 설계하며 에러 포맷/페이지네이션 개선"
    ],
    challengesEn: [
      "Modularized complex form/table state with Recoil and synced via React Query",
      "Optimized large-file upload/versioning UI with virtualization and lazy loading",
      "Co-designed ERD/API with backend, improving error format and pagination"
    ]
  },
  {
    id: "4",
    title: "피큐레잇 (북마크 기반 SNS 앱)",
    titleEn: "Pikurate (Bookmark-based social app)",
    description:
      "웹으로 운영되던 북마크 SNS를 React Native 크로스 플랫폼 앱으로 전환. 북마크 수집/공유, 소셜 피드, 네이티브 공유, 푸시 알림을 모바일에 최적화.",
    descriptionEn:
      "Migrated the bookmark SNS web service to a React Native cross-platform app. Optimized mobile UX for bookmark collection/sharing, social feed, native share, and push notifications.",
    techStack: [
      "React Native CLI",
      "TypeScript",
      "Redux Toolkit",
      "React Query",
      "Styled-components",
      "React Navigation",
      "FCM",
    ],
    url: "https://www.pikurate.com",
    github: "",
    image: "/images/projects/pikurate.png",
    keyFeatures: [
      "북마크 수집/관리 및 소셜 피드 공유",
      "iOS/Android 네이티브 공유 시트 연동",
      "푸시 알림 및 딥링크 처리",
      "오프라인 캐시와 리스트 가상화로 성능 최적화"
    ],
    keyFeaturesEn: [
      "Bookmark collection/management and social feed sharing",
      "Native share sheets for iOS/Android",
      "Push notifications and deep linking",
      "Offline cache and list virtualization for performance"
    ],
    challenges: [
      "웹→모바일 전환을 위한 레이아웃/컴포넌트 재설계",
      "플랫폼별 네이티브 모듈(공유/알림) 통합",
      "긴 리스트 성능 최적화와 이미지 로딩 개선"
    ],
    challengesEn: [
      "Redesigned layouts/components for web→mobile migration",
      "Integrated platform-specific native modules (share/notifications)",
      "Optimized long list performance and image loading"
    ]
  },
  {
    id: "6",
    title: "영업관리 백오피스 (시큐어넷)",
    titleEn: "Sales Operations Back Office (SecureNet)",
    description:
      "엑셀/메신저로 운영되던 영업 프로세스를 백오피스 웹앱으로 전환. 리드-견적-계약 파이프라인, 자동 리포트, 권한 기반 접근 제어를 구축.",
    descriptionEn:
      "Converted spreadsheet- and chat-driven sales ops into a back-office web app. Built lead→estimate→contract pipeline, automated reports, and role-based access control.",
    techStack: [
      "React",
      "TypeScript",
      "Redux",
      "Redux-Saga",
      "CSS Modules",
      "Spring Boot",
      "Java",
      "MyBatis",
      "Oracle DB",
    ],
    url: "",
    github: "",
    image: "/images/projects/securenet.png",
    keyFeatures: [
      "리드→상담→견적→계약 단계별 파이프라인 관리",
      "영업 대시보드 및 실시간 진행 현황",
      "자동 리포트/알림으로 수작업 제거",
      "권한 기반 접근 제어와 감사 로그"
    ],
    keyFeaturesEn: [
      "Pipeline across lead → consult → estimate → contract stages",
      "Sales dashboard with real-time status",
      "Automated reports/notifications replacing manual work",
      "Role-based access control and audit trail"
    ],
    challenges: [
      "영업 도메인 모델링과 상태 전이 설계",
      "다단계 프로세스 비동기 로직을 Redux-Saga로 정리",
      "백엔드와 공동으로 ERD/API 명세 수립 및 성능 튜닝"
    ],
    challengesEn: [
      "Modeled sales domain and state transitions",
      "Tamed multi-step async flows with Redux-Saga",
      "Co-designed ERD/API with backend and tuned performance"
    ]
  },
  {
    id: "7",
    title: "전기차 배터리 DPP 플랫폼",
    titleEn: "EV Battery Digital Product Passport",
    description:
      "Admin/Data/User 3개 프론트엔드를 갖춘 전기차 배터리 DPP 플랫폼. 배터리 생애주기 데이터를 관리하고, OAuth/KCB 인증, 대용량 테이블, 공통 디자인 시스템을 포함한 멀티 프론트엔드 아키텍처를 설계/구현.",
    descriptionEn:
      "Three-front architecture (Admin/Data/User) for EV battery Digital Product Passport. Built lifecycle data management, OAuth/KCB identity, large data tables, and a shared design system.",
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "TailwindCSS",
      "Radix UI",
      "TanStack Query",
      "Zustand",
      "Axios",
      "React Hook Form",
      "Zod",
      "Jest",
      "Testing Library"
    ],
    url: "",
    github: "",
    image: "/images/projects/battery.png",
    relatedBlogPosts: ["building-3-frontend-architecture-ev-battery"],
    keyFeatures: [
      "Admin/Data/User 3개 프론트 분리 배포 아키텍처",
      "배터리 패스포트·API 키·역할/권한·승인 워크플로우",
      "OAuth(Google/Kakao/Naver)+KCB 본인인증, Axios 인터셉터로 토큰 자동 관리",
      "TanStack Query 캐싱·낙관적 업데이트, 대용량 테이블 가상화",
      "공통 디자인 시스템: Radix UI + Tailwind + CVA 기반 재사용 컴포넌트"
    ],
    keyFeaturesEn: [
      "Three separate deployable fronts: Admin, Data provider, User",
      "Battery passport, API keys, RBAC, and approval workflows",
      "OAuth (Google/Kakao/Naver) + KCB identity with Axios token interceptors",
      "TanStack Query caching/optimistic updates, virtualized large tables",
      "Shared design system: Radix UI + Tailwind + CVA component library"
    ],
    challenges: [
      "3개 프로젝트의 인증/권한/토큰 흐름을 통합 설계",
      "대용량 배터리 데이터 테이블 성능 최적화(가상화·페이지네이션)",
      "공통 디자인 시스템 구축으로 UI 일관성 확보와 생산성 향상",
      "Zod + React Hook Form으로 복잡한 다단계 폼 검증"
    ],
    challengesEn: [
      "Unified auth/role/token flows across three projects",
      "Optimized large battery data tables with virtualization/pagination",
      "Built a shared design system for consistent UI and faster delivery",
      "Validated complex multi-step forms with Zod + React Hook Form"
    ],
    featured: true,
    category: "enterprise",
    duration: "2025.09 - 2026.01",
    durationEn: "Sep 2025 - Jan 2026",
    role: "프론트엔드 개발 (프리랜서)",
    roleEn: "Frontend Developer (Freelance)",
    impact: [
      "Admin/Data/User 3개 프론트엔드 단독 설계 및 구현",
      "Radix UI + Tailwind + CVA 기반 공통 디자인 시스템 구축",
      "OAuth(Google/Kakao/Naver) + KCB 본인인증 통합 설계",
      "TanStack Query 캐싱 전략으로 대용량 테이블 렌더링 최적화",
    ],
    impactEn: [
      "Sole architect & developer for 3 separate frontend deployments",
      "Built shared design system with Radix UI + Tailwind + CVA",
      "Unified OAuth (Google/Kakao/Naver) + KCB identity across all apps",
      "Optimized large data tables with TanStack Query caching strategy",
    ],
  },
];

export const FEATURED_PROJECTS: Project[] = [
  PROJECTS.find((p) => p.id === "7")!, // DPP — Enterprise
  PROJECTS.find((p) => p.id === "2")!, // YogaDay — Full-stack
  PROJECTS.find((p) => p.id === "1")!, // Drawhatha — Mobile
];
