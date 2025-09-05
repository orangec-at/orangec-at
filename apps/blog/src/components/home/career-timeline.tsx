import { designTokens } from "@/lib/design-tokens";

export default function CareerTimeline() {
  const experiences = [
    {
      company: "마이다스아이티",
      role: "프론트엔드 개발자",
      period: "2022.10 ~ 2024.03",
      team: "셀원 | DX개발셀",
      description: "건설용 구조엔지니어링 소프트웨어의 구독모델 전환을 위한 웹서비스 개발",
      highlights: [
        "20인 규모 웹개발팀에서 프로젝트 메인 프론트엔드 개발자로 활동",
        "Adobe Creative Cloud 벤치마킹하여 건축설계 관련 협업 플랫폼 구축",
        "회원정보 페이지, SSO 로그인 등 인증/인가 관련 핵심 기능 개발",
        "모노레포 아키텍처 도입을 통한 코드베이스 통합 관리"
      ],
      techStack: "React, TypeScript, Next.js, Recoil, React-Query, Yarn Workspace"
    },
    {
      company: "(주) 피큐레잇",
      role: "프론트엔드 개발자",
      period: "2022.03 ~ 2022.09",
      team: "연구원 | 프로덕트팀",
      description: "북마크 기능을 메인으로 한 SNS 성 앱서비스 개발 및 사내 웹서비스 개발",
      highlights: [
        "15인 규모 스타트업에서 핵심 프론트엔드 개발자로 활동",
        "MVP 단계에서 합류하여 제품 초기 개발에 기여",
        "마케팅 퍼널 트래킹을 위한 사내 신규 웹서비스 개발",
        "레거시 프로덕트 컴포넌트 통합을 위한 디자인시스템 구축"
      ],
      techStack: "React, TypeScript, React Native, Next.js, Zustand, React Query"
    },
    {
      company: "(주) 시큐어넷",
      role: "풀스택 개발자",
      period: "2020.06 ~ 2021.12",
      team: "매니저 | 서비스개발",
      description: "제품시험 인증서 관리 서비스 유지보수 및 영업관리를 위한 신규 백오피스 개발",
      highlights: [
        "5인 규모 스타트업에서 핵심 웹개발자로 활동",
        "엑셀과 메신저 기반 수작업을 효율적인 백오피스 시스템으로 전환",
        "영업관리자 인터뷰 및 와이어프레임 설계부터 개발까지 A to Z 경험",
        "서버 및 데이터베이스 관리 등 인프라 구축 경험 확보"
      ],
      techStack: "React, Redux, Spring Boot, Oracle Database, Ubuntu Server"
    }
  ];

  return (
    <section className="max-w-3xl mx-auto space-y-8">
      <h2 className={`${designTokens.typography.section} text-center`}>Work Experience</h2>
      
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-6 relative">
            {/* Timeline dot */}
            <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-400 rounded-full"></div>
            
            <div className="space-y-3">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className={designTokens.typography.cardTitle}>{exp.company}</h3>
                  <p className="text-gray-600">{exp.team} | {exp.role}</p>
                </div>
                <span className="text-sm text-gray-500 font-medium mt-1 md:mt-0">
                  {exp.period}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              
              {/* Highlights */}
              <ul className="space-y-1 text-sm text-gray-600">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1 flex-shrink-0">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              
              {/* Tech Stack */}
              <div className="pt-2">
                <span className="text-xs text-gray-500 font-medium">주요 기술: </span>
                <span className="text-xs text-gray-600">{exp.techStack}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}