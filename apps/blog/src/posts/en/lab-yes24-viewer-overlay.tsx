"use client";

import type { MDXFrontmatter } from "@/types/frontmatter";
import { CodeBlock, ColorSwatch, LabLayout, LayerStack } from "@/components/lab";
import type { LensData } from "@/components/lab";

export const meta: MDXFrontmatter = {
  title: "YES24 — eBook Viewer Overlay",
  date: "2026-02-20",
  tags: ["lab", "component", "business-logic", "design", "UIUX", "mobile"],
  description:
    "YES24 모바일 eBook 뷰어의 오버레이 UI를 5가지 렌즈로 분석한 연구일지",
  author: "Jaeil Lee",
  category: "lab",
  relatedProjects: [],
  featured: false,
  draft: false,
};

export const layout = "custom" as const;

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
          {`ViewerScreen
├── StatusBar (System)
├── HeaderOverlay (Top Bar)
│   ├── BackButton (← icon)
│   ├── TitleLabel ("자기신뢰")
│   └── ActionGroup
│       ├── CommentButton (chat bubble)
│       ├── SearchButton (magnifying glass)
│       └── BookmarkButton (ribbon)
├── ContentArea (Scrollable/Paginated)
│   └── RenderedText (HTML/Canvas)
└── FooterOverlay (Bottom Bar)
    ├── ProgressBar (Slider + 62%)
    └── ControlBar
        ├── TOCButton (list icon)
        ├── HighlightButton (pen icon)
        ├── SettingsButton (Aa icon)
        ├── RotationLock (lock icon)
        └── MoreButton (gear icon)`}
        </CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Atomic Components
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">IconButton</span>{" "}
            &mdash; 44x44pt touch target, 다양한 아이콘으로 재사용
          </li>
          <li>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">Slider</span>{" "}
            &mdash; full-width 진행률 표시 + thumb 인터랙션
          </li>
          <li>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400">OverlayPanel</span>{" "}
            &mdash; header/footer 컨테이너, isVisible로 토글
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
          Key Features
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "읽기 진행률", detail: "62% 슬라이더" },
            { label: "댓글/리뷰", detail: "소셜 리딩" },
            { label: "하이라이트/메모", detail: "사용자 생성 데이터" },
            { label: "DRM 뷰어", detail: "콘텐츠 보호" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card px-3 py-2 text-center shadow-sm"
            >
              <p className="text-xs font-medium text-foreground">
                {item.label}
              </p>
              <p className="text-[10px] text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Value Flow
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "편안한 독서 경험",
            "완독률 상승",
            "댓글/메모 축적",
            "플랫폼 lock-in",
            "다음 구매",
          ].map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                {step}
              </span>
              {i < 4 && (
                <span className="text-sm text-muted-foreground">&rarr;</span>
              )}
            </span>
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
          <ColorSwatch color="#FFFFFF" label="배경" />
          <ColorSwatch color="#333333" label="본문 텍스트" />
          <ColorSwatch color="#4A90D9" label="프로그레스 바" />
          <ColorSwatch color="#888888" label="UI 아이콘 (thin line)" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Typography Spec
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Element</th>
                <th className="pb-2 pr-4 font-medium">Style</th>
                <th className="pb-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">본문</td>
                <td className="py-2 pr-4">Serif</td>
                <td className="py-2">고전적 책 느낌</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">UI 라벨</td>
                <td className="py-2 pr-4">Sans-serif</td>
                <td className="py-2">앱 인터페이스 느낌</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">진행률</td>
                <td className="py-2 pr-4">Sans-serif, Medium</td>
                <td className="py-2">상태 정보 표시</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Layout Spec
        </p>
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-card px-3 py-2">
              <span className="text-[10px] text-muted-foreground">&larr;</span>
              <span className="text-xs text-muted-foreground">Title</span>
              <span className="flex gap-1.5">
                {["chat", "search", "bookmark"].map((icon) => (
                  <span
                    key={icon}
                    className="inline-flex h-5 w-5 items-center justify-center rounded border border-dashed border-border text-[8px] text-muted-foreground"
                  >
                    {icon[0]}
                  </span>
                ))}
              </span>
            </div>
            {/* Content */}
            <div className="flex aspect-[3/4] items-center justify-center rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground">
              Content Area
            </div>
            {/* Footer */}
            <div className="space-y-1 rounded-md border border-dashed border-border bg-card px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-blue-400/40">
                  <div className="h-1 w-3/5 rounded-full bg-blue-500" />
                </div>
                <span className="text-[10px] text-muted-foreground">62%</span>
              </div>
              <div className="flex justify-between">
                {["TOC", "pen", "Aa", "lock", "gear"].map((icon) => (
                  <span
                    key={icon}
                    className="text-[9px] text-muted-foreground"
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Header 44-56pt</span>
            <span>Footer 2-row</span>
            <span>충분한 좌우 여백</span>
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
          Interaction Model
        </p>
        <div className="space-y-3">
          {[
            {
              gesture: "화면 중앙 탭",
              result: "오버레이 토글 (show/hide)",
            },
            {
              gesture: "슬라이더 드래그",
              result: "빠른 페이지 이동",
            },
            {
              gesture: "좌우 스와이프",
              result: "페이지 넘김 (기본 모드)",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-3"
            >
              <p className="text-sm font-medium text-foreground">
                {item.gesture}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                &rarr; {item.result}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Mode Switching
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-foreground">
            하이라이트 모드 (펜 아이콘 활성화)
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium">기본 모드</span>: 스와이프 = 페이지 넘김
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">하이라이트 모드</span>: 드래그 = 텍스트 선택
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground italic">
            같은 제스처(드래그)가 모드에 따라 다른 결과를 생성
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
          Key State (추정)
        </p>
        <CodeBlock>
          {`interface ViewerState {
  isOverlayVisible: boolean
  currentLocation: string   // CFI or percentage
  fontSize: number
  themeMode: 'light' | 'sepia' | 'dark'
  isHighlightMode: boolean
}`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Rendering (추정)
        </p>
        <CodeBlock>
          {`// WebView 기반 ePub 렌더링
// ePub = HTML/CSS → WebView에서 렌더링
// 한글 양쪽 정렬 + 커스텀 폰트
// 폰트 크기 변경 시 전체 reflow 필요`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          4-Layer View Architecture
        </p>
        <LayerStack
          layers={[
            { label: "Layer 4: UI Overlay", sub: "Header + Footer (toggleable)", color: "border-blue-400 bg-blue-50 dark:bg-blue-950/30" },
            { label: "Layer 3: Touch", sub: "Gesture recognizers (tap, swipe, drag)", color: "border-amber-400 bg-amber-50 dark:bg-amber-950/30" },
            { label: "Layer 2: Content", sub: "WebView / ePub renderer", color: "border-green-400 bg-green-50 dark:bg-green-950/30" },
            { label: "Layer 1: Background", sub: "Theme color (white / sepia / dark)", color: "border-zinc-400 bg-zinc-50 dark:bg-zinc-800/30" },
          ]}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          * 위에서 아래로 z-index 순서. 리더앱, 지도앱, 드로잉앱 등 캔버스 기반 앱의 범용 패턴
        </p>
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
        title: "Overlay vs Content 분리",
        body: "오버레이와 콘텐츠의 엄격한 분리로 몰입 모드를 지원한다. isOverlayVisible 하나로 전체 크롬을 토글.",
      },
      {
        title: "Header = 책 단위 액션 / Footer = 뷰어 설정",
        body: "Header는 콘텐츠 메타(뒤로가기, 검색, 북마크), Footer는 뷰어 제어(진행률, 설정). 관심사 분리가 명확하다.",
      },
      {
        title: "IconButton 재사용",
        body: "다양한 아이콘으로 반복 사용되는 단일 컴포넌트. 44x44pt 터치 타겟을 일관되게 보장한다.",
      },
    ],
    insights: [
      {
        title: "Transient Chrome 패턴",
        body: "UI 크롬과 캔버스(콘텐츠)를 분리하고 isOverlayVisible boolean으로 토글. 리더앱의 핵심 패턴이며 비디오 플레이어, 지도앱 등에도 동일하게 적용된다.",
      },
      {
        title: "Header/Footer의 관심사 분리",
        body: "Header는 콘텐츠 메타(뒤로가기, 검색, 북마크), Footer는 뷰어 제어(진행률, 설정). 기능이 늘어도 각 영역 역할이 명확하여 확장에 유리하다.",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    observe: <BusinessObserve />,
    analysis: [
      {
        title: "리텐션 전략",
        body: "댓글 기능으로 독서의 고독한 행위를 플랫폼 커뮤니티에 연결. 체류 시간과 소셜 끈끈이를 증가시킨다.",
      },
      {
        title: "하이라이트 = 전환 비용",
        body: "사용자 생성 데이터(메모/하이라이트)가 쌓이면 플랫폼 이탈 비용이 높아진다.",
      },
      {
        title: "읽기 편의 = 전환율",
        body: "편안한 독서 경험은 완독률을 높이고 다음 구매로 이어지는 핵심 퍼널이다.",
      },
    ],
    insights: [
      {
        title: "Social Reading vs Deep Reading",
        body: "댓글 버튼을 상단 1차 액션에 배치한 건 순수 몰입보다 참여를 우선한 비즈니스 판단. YES24가 소셜 생태계를 핵심 차별화/리텐션 지표로 본다는 의미.",
      },
      {
        title: "Lock-in by Content Creation",
        body: "하이라이트/메모로 사용자의 지적 자산이 플랫폼에 묶이는 패턴. 다른 SaaS에서도 사용자가 데이터를 생성하게 하면 전환 비용이 올라간다.",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    observe: <DesignObserve />,
    analysis: [
      {
        title: "시각 위계",
        body: "본문 텍스트(1순위) > 파란 슬라이더(2순위, 상태 표시) > UI 아이콘(3순위, 균일 웨이트). 콘텐츠 우선의 명확한 위계.",
      },
      {
        title: "Content First, UI Second",
        body: "UI가 콘텐츠의 \"프레임\" 역할. 얇은 라인 아이콘과 중립 색상으로 간섭을 최소화한다.",
      },
      {
        title: "어포던스",
        body: "슬라이더 thumb(동그라미)로 인터랙션을 유도하고, 표준 아이콘 메타포로 인지 부하를 감소시킨다.",
      },
    ],
    insights: [
      {
        title: "콘텐츠 프레임 디자인",
        body: "사용자 콘텐츠가 주인공인 앱에서 UI는 \"액자\" 역할. 유채색은 상태 표시(파란 슬라이더)에만 허용하는 원칙.",
      },
      {
        title: "세리프/산세리프 이중 서체",
        body: "본문(세리프)과 UI(산세리프)를 구분하면 \"이건 책, 이건 앱\"이라는 암묵적 경계가 생긴다. 콘텐츠와 인터페이스의 인지적 분리.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX",
    observe: <UxObserve />,
    analysis: [
      {
        title: "Control Paradox",
        body: "사용자는 컨트롤이 필요하지만 컨트롤은 읽기를 방해한다. 해법: on-demand 오버레이로 필요할 때만 노출.",
      },
      {
        title: "모드 전환으로 실수 방지",
        body: "하이라이트 모드를 명시적으로 분리하여 페이지 넘기다 실수로 형광펜 치는 사고를 방지한다.",
      },
      {
        title: "설정의 접근성",
        body: "Aa(폰트), 밝기, 화면 잠금 등을 Footer에 배치하여 읽기 마찰을 최소화한다.",
      },
    ],
    insights: [
      {
        title: "User Control vs Simplicity",
        body: "복잡한 기능(검색, 목차, 설정, 하이라이트)을 오버레이 뒤에 숨겨서 물리적 책의 단순함과 디지털의 파워를 동시에 제공한다.",
      },
      {
        title: "모드 전환 = 안전 장치",
        body: "같은 제스처(드래그)가 맥락에 따라 다른 결과를 낳을 때, 명시적 모드 전환은 실수를 막는 핵심 UX 패턴이다.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    observe: <TechObserve />,
    analysis: [
      {
        title: "Reflow 엔진",
        body: "폰트 크기 변경 시 전체 페이지 재계산이 필요하다. 백그라운드 스레드에서 처리해야 UI 블로킹을 방지할 수 있다.",
      },
      {
        title: "레이어드 뷰 아키텍처",
        body: "Background -> Content -> Touch -> UI 4단 레이어로 관심사를 분리한다. 각 레이어가 독립적으로 변경 가능.",
      },
      {
        title: "슬라이더 실시간 바인딩",
        body: "슬라이더 position과 scrollOffset/currentPage 간 양방향 바인딩. 드래그 중 실시간 페이지 프리뷰가 핵심.",
      },
    ],
    insights: [
      {
        title: "Reflow Logic",
        body: "동적 페이지네이션이 eBook 리더의 핵심 기술 과제. PDF(고정)와 달리 폰트 설정 변경마다 \"총 페이지 수\"를 재계산해야 한다.",
      },
      {
        title: "4-Layer View Architecture",
        body: "Background -> Content -> Touch -> UI 순서로 레이어를 쌓는 구조는 리더앱뿐 아니라 지도앱, 드로잉앱 등 캔버스 기반 앱의 범용 패턴이다.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function LabYes24ViewerOverlay() {
  return (
    <LabLayout
      meta={meta}
      lenses={lenses}
      deviceType="mobile"
      screenshotSrc="/images/lab/yes24-viewer-overlay/01-main.png"
      screenshotAlt="YES24 모바일 eBook 뷰어 오버레이 스크린샷"
    />
  );
}
