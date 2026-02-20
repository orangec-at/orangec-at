"use client";

import type { MDXFrontmatter } from "@/types/frontmatter";
import { LabLayout, CodeBlock, ColorSwatch, StateMachineFlow } from "@/components/lab";
import type { LensData } from "@/components/lab";

export const meta: MDXFrontmatter = {
  title: "강남맛집 — Home",
  date: "2026-02-20",
  tags: ["lab", "component", "business-logic", "design", "UIUX", "web"],
  description:
    "강남맛집 리뷰 플랫폼 홈 화면을 5가지 렌즈로 분석한 연구일지",
  author: "Jaeil Lee",
  category: "lab",
  layout: "custom",
  relatedProjects: [],
  featured: false,
  draft: false,
};

/* ------------------------------------------------------------------ */
/*  Lens: Component                                                    */
/* ------------------------------------------------------------------ */

function ComponentObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Component Tree
        </p>
        <CodeBlock>
          {`HomePage
├── Header
│   ├── UtilityBar (고객센터, 광고문의, 로그인, 회원가입)
│   └── MainGNB
│       ├── Logo
│       ├── SearchBar ("방문 없이 편리한 슬기로운 리뷰생활")
│       └── NavMenu (홈, 지역, 제품, 기자단, 클립, ...)
├── InlineBanner ("포인트 지급 취소 및 환급 정책 변경 안내")
├── HeroBannerSection (3-column)
│   ├── PromoBanner ("우리가게 홍보하기")
│   ├── CampaignBanner ("스페셜 캠페인")
│   └── GuideBanner ("리뷰어 이용매뉴얼")
└── PopularCampaignSection
    ├── SectionHeader ("인기 캠페인")
    └── CampaignGrid (n-column)
        └── CampaignCard
            ├── RankBadge (리본 형태, 좌상단)
            ├── Thumbnail (실사 이미지)
            └── TagBadge? ("스페셜 캠페인" 등)`}
        </CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key Components
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">SearchBar</span>{" "}
            &mdash; 검색 + 가치 제안(Value Proposition) 힌트 텍스트
          </li>
          <li>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">CampaignCard</span>{" "}
            &mdash; 랭킹 뱃지 + 썸네일 + 태그, 정보 압축형
          </li>
          <li>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400">HeroBanner</span>{" "}
            &mdash; 3개 고정 슬롯 (광고주, 리뷰어, 온보딩)
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: Business Logic                                               */
/* ------------------------------------------------------------------ */

function BusinessObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Two-sided Market
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs font-semibold text-foreground">광고주</p>
            <p className="mt-1 text-[11px] text-muted-foreground">소상공인, 브랜드</p>
            <p className="mt-1 text-[11px] text-muted-foreground">&ldquo;우리가게 홍보하기&rdquo;</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs font-semibold text-foreground">리뷰어</p>
            <p className="mt-1 text-[11px] text-muted-foreground">블로거, 인플루언서</p>
            <p className="mt-1 text-[11px] text-muted-foreground">&ldquo;선정확률 높은 캠페인&rdquo;</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Value Flow
        </p>
        <StateMachineFlow
          states={[
            ["광고주 캠페인 등록", "플랫폼 큐레이션", "리뷰어 신청"],
            ["리뷰어 선정", "리뷰 콘텐츠 생산", "광고주 노출 확보"],
          ]}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ranking & Curation
        </p>
        <div className="space-y-2">
          {[
            { label: "인기 캠페인", detail: "조회 기반 랭킹, 상위 노출" },
            { label: "스페셜 캠페인", detail: "단가 높은 프리미엄 매물" },
            { label: "선정확률 높은 캠페인", detail: "리뷰어 전환율 극대화" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: Design                                                       */
/* ------------------------------------------------------------------ */

function DesignObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Color Palette
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ColorSwatch color="#FF6000" label="브랜드 오렌지 (포인트)" />
          <ColorSwatch color="#FFFFFF" label="배경" />
          <ColorSwatch color="#F5F5F5" label="섹션 배경 (라이트 그레이)" />
          <ColorSwatch color="#333333" label="본문 텍스트" />
          <ColorSwatch color="#999999" label="보조 텍스트" />
          <ColorSwatch color="#E53935" label="랭킹 뱃지 (리본)" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Design Principles
        </p>
        <div className="space-y-2">
          {[
            { title: "무채색 베이스 + 단일 포인트 컬러", desc: "화려한 썸네일이 주인공, UI는 뒤로 빠짐" },
            { title: "플랫 & 클린", desc: "그림자/3D 최소화, 선과 여백으로 구역 분리" },
            { title: "이미지 중심 (70%+)", desc: "실사 음식 사진이 UI 면적 대부분 차지" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.title}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ribbon Badge
        </p>
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="inline-flex flex-col items-start">
            <div className="relative rounded-r-md bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              1위
              <div className="absolute -bottom-1 left-0 border-l-[6px] border-t-[4px] border-l-transparent border-t-red-700" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              모서리를 접은 리본 형태 &mdash; 평면 카드에 입체 포인트 제공
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: UX                                                           */
/* ------------------------------------------------------------------ */

function UxObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          2-Tier Header
        </p>
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-card px-3 py-1.5">
              <span className="text-[10px] text-muted-foreground">Logo</span>
              <span className="flex-1 mx-3 rounded border border-dashed border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground text-center">
                Search Bar
              </span>
              <span className="text-[10px] text-muted-foreground">고객센터 | 광고문의 | 로그인</span>
            </div>
            <div className="flex gap-2 rounded-md border border-dashed border-border bg-card px-3 py-1.5">
              {["홈", "지역", "제품", "기자단", "클립", "스페셜", "선정확률↑"].map((tab) => (
                <span key={tab} className="text-[10px] text-muted-foreground">{tab}</span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            유틸리티 바 + 메인 GNB 2단 구조 &mdash; 다양한 카테고리를 한 번에 노출
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Multi-axis Browse
        </p>
        <div className="space-y-2">
          {[
            { axis: "경험 형태", examples: "지역 (오프라인 방문) vs 제품 (배송)" },
            { axis: "역량 조건", examples: "기자단 (고급) vs 일반 캠페인" },
            { axis: "캠페인 특성", examples: "스페셜, 선정확률 높은, 인기" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.axis}</p>
              <p className="text-[11px] text-muted-foreground">{item.examples}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Onboarding in Banner
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-foreground">
            &ldquo;리뷰어 이용매뉴얼&rdquo; 배너
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            메인 배너 3개 중 1개를 온보딩에 할당 &mdash; 신규 유저 CS 문의를 줄이고 퍼스트 타임 경험 마찰 최소화
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: Tech                                                         */
/* ------------------------------------------------------------------ */

function TechObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Image Pipeline (추정)
        </p>
        <CodeBlock>
          {`// 다량의 캠페인 썸네일 최적화 파이프라인
Upload → CDN → On-the-fly Resize
  ├── WebP 변환 (브라우저 지원 시)
  ├── Lazy Loading (viewport 진입 시)
  └── Skeleton Placeholder (로딩 중)`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ranking Architecture (추정)
        </p>
        <StateMachineFlow
          states={[
            ["조회/클릭 이벤트", "집계 (시간 단위)", "Redis 캐시"],
            ["Redis 캐시", "API 서빙", "클라이언트 렌더링"],
          ]}
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          CQRS/Cache-Aside 패턴 &mdash; 불특정 다수 조회에 DB 직접 쿼리 방지
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Performance Considerations
        </p>
        <div className="space-y-2">
          {[
            { label: "FCP 최적화", detail: "스켈레톤 UI + 이미지 Lazy Loading" },
            { label: "CDN Resize", detail: "원본 → 썸네일 사이즈 on-the-fly 변환" },
            { label: "캐시 전략", detail: "인기 랭킹 10분~1시간 단위 갱신" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens data                                                          */
/* ------------------------------------------------------------------ */

const lenses: LensData[] = [
  {
    id: "component",
    label: "Component",
    observe: <ComponentObserve />,
    analysis: [
      {
        title: "2단 헤더 구조",
        body: "유틸리티 메뉴 + 메인 GNB로 포털형 서비스의 다양한 카테고리를 한 번에 노출하면서도 시각적 위계를 유지한다.",
      },
      {
        title: "정보 압축형 CampaignCard",
        body: "순위 뱃지, 마감 임박, 캠페인 종류를 직관적 뱃지로 처리하여 카드 하나에 핵심 정보를 응축한다.",
      },
    ],
    insights: [
      {
        title: "배너 슬롯의 퍼널 분리",
        body: "다양한 이해관계자(광고주, 리뷰어)를 가진 플랫폼에서 메인 배너를 통해 주요 퍼널(광고주 모집, 스페셜 캠페인 유입, 신규 리뷰어 교육)을 명확하게 분리하는 레이아웃 설계.",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    observe: <BusinessObserve />,
    analysis: [
      {
        title: "양면 시장(Two-sided Market)",
        body: "광고주(소상공인)와 리뷰어(블로거) 양쪽의 니즈를 동시에 해결하는 중개 비즈니스 모델.",
      },
      {
        title: "캠페인 랭킹 큐레이션",
        body: "인기/스페셜/선정확률 높은 캠페인으로 차등 노출하여 퀄리티 높은 매물을 상단에 하이라이팅한다.",
      },
    ],
    insights: [
      {
        title: "검색창 힌트 = Value Proposition",
        body: "검색창의 힌트 텍스트('방문 없이 편리한...')를 활용해 핵심 가치 제안을 신규 방문자에게 자연스럽게 전달하는 넛지 설계.",
      },
      {
        title: "불안감 해소 필터",
        body: "'선정확률 높은 캠페인' 같은 맞춤형 필터 탭을 GNB로 별도 파생시켜 리뷰어의 당첨 불안감을 덜어주고 전환율(CVR)을 높인다.",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    observe: <DesignObserve />,
    analysis: [
      {
        title: "컬러 심리학 적용",
        body: "오렌지 계열은 식욕을 돋우고 활기를 상징하여 맛집 도메인 정체성과 어우러진다.",
      },
      {
        title: "초점 유도형 배경",
        body: "화이트/라이트 그레이의 중립 배경으로 화려한 캠페인 썸네일에 100% 시선이 가도록 유도한다.",
      },
    ],
    insights: [
      {
        title: "무채색 베이스 + 단일 포인트 컬러",
        body: "다채로운 썸네일이 많은 플랫폼에서 UI 프레임은 무채색, 포인트는 단일 브랜드 컬러로 철저히 뒤로 빠져야 한다.",
      },
      {
        title: "리본 뱃지의 입체감",
        body: "평면적 카드 UI에 모서리를 접은 리본 형태의 랭킹 뱃지를 넣어 시각적 입체 포인트를 제공한다.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX",
    observe: <UxObserve />,
    analysis: [
      {
        title: "온보딩 마찰 최소화",
        body: "이용 매뉴얼을 메인 배너 3개 중 하나로 할당하여 퍼스트 타임 유저의 진입 장벽과 CS 문의를 낮춘다.",
      },
      {
        title: "다면적 탐색(Multi-axis Browse)",
        body: "경험 형태(지역/제품), 역량 조건(기자단), 캠페인 특성(스페셜)으로 다축 분류하여 맞춤 탐색 제공.",
      },
    ],
    insights: [
      {
        title: "인라인 공지 패턴",
        body: "대형 팝업 대신 GNB 바로 아래 단일 텍스트 라인으로 필수 공지를 노출하여 사용자 흐름을 끊지 않는 현대적 패턴.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    observe: <TechObserve />,
    analysis: [
      {
        title: "이미지 최적화 파이프라인",
        body: "다량의 썸네일 로딩 시 WebP 변환 + CDN On-the-fly Resize + Lazy Loading으로 네트워크 병목을 억제한다.",
      },
      {
        title: "CQRS/Cache-Aside 랭킹",
        body: "불특정 다수가 조회하는 인기 랭킹은 시간 단위로 Redis 캐싱하여 DB 직접 쿼리를 방지한다.",
      },
    ],
    insights: [
      {
        title: "FCP 우선 아키텍처",
        body: "이미지 중심 플랫폼에서 Lazy Loading + 스켈레톤 UI를 첫 스프린트부터 아키텍처에 반영해야 쾌적한 First Contentful Paint를 달성할 수 있다.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function LabGangnamMatzipHome() {
  return (
    <LabLayout
      meta={meta}
      lenses={lenses}
      deviceType="desktop"
      screenshotSrc="/images/lab/gangnam-matzip-home/01-main.png"
      screenshotAlt="강남맛집 홈페이지 스크린샷"
    />
  );
}
