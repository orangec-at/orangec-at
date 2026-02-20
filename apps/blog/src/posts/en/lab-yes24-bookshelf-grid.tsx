"use client";

import type { MDXFrontmatter } from "@/types/frontmatter";
import {
  CodeBlock,
  ColorSwatch,
  LabLayout,
  StateMachineFlow,
} from "@/components/lab";
import type { LensData } from "@/components/lab";

export const meta: MDXFrontmatter = {
  title: "YES24 — 서재 Bookshelf Grid",
  date: "2026-02-19",
  tags: ["lab", "component", "business-logic", "design", "UIUX", "mobile"],
  description:
    "YES24 모바일 서재의 그리드 뷰를 5가지 렌즈(컴포넌트, 비즈니스, 디자인, UX, 기술)로 분석한 연구일지",
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
          {`BookshelfScreen
├── ScreenHeader (Title + IconButton[])
├── TabNavigation (3 tabs, active underline)
├── ListToolbar (count + viewToggle + filter + edit)
├── BookGrid (3-column)
│   └── BookCard
│       ├── CoverImage
│       ├── DownloadOverlay? (conditional)
│       ├── StackBadge? (conditional)
│       └── StatusFooter (OwnershipBadge | SubscriptionBadge)
└── BottomTabBar (3 tabs)`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          BookCard Props Interface
        </p>
        <CodeBlock>
          {`interface BookCardProps {
  coverUrl: string
  ownership: 'owned' | 'subscription'
  subscriptionDaysLeft?: number
  isDownloaded: boolean
  stackCount?: number
  onPress: () => void
}`}
        </CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Conditional Rendering Patterns
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">boolean</span>{" "}
            &mdash; DownloadOverlay (isDownloaded)
          </li>
          <li>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">optional number</span>{" "}
            &mdash; StackBadge (stackCount?)
          </li>
          <li>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400">union</span>{" "}
            &mdash; OwnershipBadge | SubscriptionBadge (ownership)
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
        <p className="mb-2 text-sm font-medium text-foreground">
          Domain Entities
        </p>
        <CodeBlock>
          {`Book {
  id, title, coverUrl
  ownership: Owned | Subscription
  downloadStatus
  seriesInfo
  bookshelf
}

Bookshelf { id, type, name, books }

User { ownedBooks, subscriptionBooks, bookshelves }`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ownership State Machine
        </p>
        <StateMachineFlow
          states={[
            ["미소유", "구매", "소장"],
            ["미소유", "구독", "구독중", "만료", "재구독"],
            ["구독중", "구매", "소장"],
          ]}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Download State Machine
        </p>
        <StateMachineFlow
          states={[["미다운로드", "다운로드중", "다운로드됨", "삭제", "미다운로드"]]}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Data Flow
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "서재 진입",
            "API GET /bookshelf/{type}",
            "Book[] + ownership + downloadStatus",
            "클라이언트 daysLeft 계산",
            "렌더링 분기",
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
          <ColorSwatch color="#F5F5F5" label="헤더 배경" />
          <ColorSwatch color="#000000" label="활성 탭" />
          <ColorSwatch color="#999999" label="비활성 탭" />
          <ColorSwatch color="#666666" label="소장 텍스트" />
          <ColorSwatch color="#4CAF50" label="sam 뱃지" />
          <ColorSwatch color="rgba(0,0,0,0.3)" label="다운로드 오버레이" />
          <ColorSwatch color="#E0E0E0" label="버튼 테두리" />
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
                <th className="pb-2 pr-4 font-medium">Weight</th>
                <th className="pb-2 font-medium">Size</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">서재 헤더</td>
                <td className="py-2 pr-4">Bold</td>
                <td className="py-2">18-20px</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">탭 라벨</td>
                <td className="py-2 pr-4">Medium</td>
                <td className="py-2">14-15px</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">카운트</td>
                <td className="py-2 pr-4">Regular</td>
                <td className="py-2">13px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">뱃지</td>
                <td className="py-2 pr-4">Regular / Bold</td>
                <td className="py-2">11-12px</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Grid Layout Spec
        </p>
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex aspect-[1/1.4] items-center justify-center rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground"
              >
                1:1.4
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>3-column</span>
            <span>~8px col gap</span>
            <span>~12px row gap</span>
            <span>~16px padding</span>
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
        <p className="mb-3 text-sm font-medium text-foreground">User Flow</p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "앱 진입",
            '하단 탭 "서재"',
            "기본책장",
            "스크롤 탐색",
          ].map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                {step}
              </span>
              {i < 3 && (
                <span className="text-sm text-muted-foreground">&rarr;</span>
              )}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 pl-4">
          {["책 탭 (읽기)", "다운로드", "필터", "편집"].map((action) => (
            <span
              key={action}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {action}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Nudge Analysis
        </p>
        <div className="space-y-3">
          {[
            {
              nudge: '잔여일 표시 ("sam 163일 남음")',
              mechanism: "시간 제한",
              goal: "읽기 촉진",
            },
            {
              nudge: "다운로드 오버레이",
              mechanism: "시각적 장벽",
              goal: "다운로드 유도",
            },
            {
              nudge: "기본책장 = 기본 탭",
              mechanism: "풍성한 서재 인상",
              goal: "만족감 형성",
            },
            {
              nudge: "10권 카운트",
              mechanism: "수집 가시화",
              goal: "수집 욕구 자극",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/30"
            >
              <p className="text-sm font-medium text-foreground">
                {item.nudge}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium">{item.mechanism}</span>
                {" "}
                &rarr; {item.goal}
              </p>
            </div>
          ))}
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
          API Structure (추정)
        </p>
        <CodeBlock>
          {`GET /api/bookshelf?type=default&page=1&size=20
{
  totalCount: 10,
  books: [{
    id: "book_123",
    coverUrl: "https://cdn.yes24.com/...",
    ownership: {
      type: "owned" | "subscription",
      provider?: "sam",
      expiresAt?: "..."
    },
    downloadStatus: "downloaded" | "not_downloaded",
    series?: { id: "series_456", bookCount: 2 }
  }]
}`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Merge Logic
        </p>
        <CodeBlock>
          {`function mergeBookData(serverBook, localStore) {
  const localData = localStore.find(
    l => l.bookId === serverBook.id
  )
  return {
    ...serverBook,
    isDownloaded: !!localData,
    daysLeft:
      serverBook.ownership.type === 'subscription'
        ? daysBetween(new Date(), serverBook.ownership.expiresAt)
        : undefined
  }
}`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          3-Tier Image Caching
        </p>
        <div className="flex items-center gap-3">
          {[
            { label: "L1 메모리 캐시", sub: "fastest" },
            { label: "L2 디스크 캐시", sub: "persistent" },
            { label: "L3 CDN", sub: "origin" },
          ].map((tier, i) => (
            <span key={i} className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-card px-3 py-2 text-center shadow-sm">
                <p className="text-xs font-medium text-foreground">
                  {tier.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{tier.sub}</p>
              </div>
              {i < 2 && (
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
/*  Lens data                                                          */
/* ------------------------------------------------------------------ */

const lenses: LensData[] = [
  {
    id: "component",
    label: "Component",
    observe: <ComponentObserve />,
    analysis: [
      {
        title: "BookCard의 조건부 렌더링 설계",
        body: "4가지 조건부 요소를 boolean/optional/union으로 구분하여 props의 의도를 명확히 전달한다.",
      },
      {
        title: "ListToolbar의 범용성",
        body: "count + viewToggle + filter + edit 패턴은 목록형 화면 어디든 재사용 가능한 구조다.",
      },
      {
        title: "상태 뱃지의 Discriminated Union",
        body: "ownership 타입에 따라 OwnershipBadge 또는 SubscriptionBadge를 분기 렌더링하는 구조.",
      },
      {
        title: "오버레이 레이어 순서",
        body: "Z-index 충돌 없이 CoverImage → DownloadOverlay → StackBadge 순으로 정보를 층층이 쌓는다.",
      },
    ],
    insights: [
      {
        title: "ListToolbar 패턴",
        body: "count + viewToggle + filter + edit를 한 줄에 배치하는 범용 컴포넌트로 추출 가능하다.",
      },
      {
        title: "조건부 오버레이 설계",
        body: "boolean/optional/union으로 명확히 구분하면 props가 예측 가능해지고 테스트가 쉬워진다.",
      },
      {
        title: "Discriminated Union으로 상태 뱃지",
        body: "union type으로 타입 안전성과 확장성을 확보할 수 있다.",
      },
      {
        title: "도메인 특화 카드 > 범용 카드",
        body: "도메인 로직이 많으면 전용 카드가 범용 카드보다 깔끔하다.",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    observe: <BusinessObserve />,
    analysis: [
      {
        title: "소유 모델의 복잡성",
        body: "소유 상태 x 다운로드 상태 = 4가지 조합. UI에서 레이어링으로 해결한다.",
      },
      {
        title: "daysLeft의 비즈니스 의도",
        body: "구독 갱신이나 구매 전환을 유도하는 비즈니스 드라이버 역할을 한다.",
      },
      {
        title: "책장 분류의 도메인 로직",
        body: "세 번째 탭만 기기 상태 기준으로 분류 - 도메인 순수성보다 사용자 시나리오를 우선한다.",
      },
      {
        title: "필터와 편집의 도메인 액션",
        body: "도서 수 증가 시 관리 복잡성을 완화하기 위한 장치.",
      },
    ],
    insights: [
      {
        title: "독립적 상태 축 레이어링",
        body: "두 독립 상태(소유/다운로드)를 UI의 다른 레이어에 배치하면 교차 조합을 시각적으로 표현할 수 있다.",
      },
      {
        title: "Computed 속성의 비즈니스 드라이버",
        body: "서버 원본 -> 클라이언트 계산 -> 행동 유도. daysLeft처럼 계산된 값이 비즈니스 행동을 이끈다.",
      },
      {
        title: "도메인 순수성 vs 사용자 시나리오",
        body: "핵심 시나리오에 맞추면 도메인 순수성을 약간 포기해도 더 나은 설계가 된다.",
      },
      {
        title: "배치 액션의 진입 시점",
        body: "관리 부담이 생기는 시점에 필터/편집 같은 도구를 제공하는 것이 적절하다.",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    observe: <DesignObserve />,
    analysis: [
      {
        title: "커버 중심 디자인",
        body: "UI 프레임은 무채색으로 절제하고, 책 커버가 유일한 비주얼 포인트가 되게 한다.",
      },
      {
        title: "뱃지 색상의 심리적 설계",
        body: "소장 = 회색(안정/완료), sam = 초록(활성/행동유도). 상태에 감정을 매핑한다.",
      },
      {
        title: "정보 밀도 vs 여백 균형",
        body: "한 화면에 6-9권 노출 + 충분한 여백으로 시각적 숨통을 확보한다.",
      },
      {
        title: "버튼 3단계 위계",
        body: "아이콘만(주요) -> 테두리+라벨(보조) -> 테두리+아이콘(토글)으로 중요도를 시각화한다.",
      },
    ],
    insights: [
      {
        title: "콘텐츠 중심 UI에서의 색상 제한",
        body: "UI 프레임은 무채색, 유채색은 시스템 상태에만 사용하는 원칙.",
      },
      {
        title: "상태 색상의 심리적 매핑",
        body: "회색 = 완료, 초록 = 활성, 빨간 = 경고. 상태별 색상에 감정적 의미를 부여한다.",
      },
      {
        title: "3열 그리드 + 1:1.4 비율",
        body: "모바일 썸네일 그리드의 범용 패턴. 책, 앱, 상품 카드에 두루 적용 가능하다.",
      },
      {
        title: "버튼 3단계 위계",
        body: "새 디자인 시스템을 만들 때 버튼 위계의 시작점으로 참고할 수 있다.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX",
    observe: <UxObserve />,
    analysis: [
      {
        title: "시간 기반 넛지",
        body: "손실 회피 + 가치 인지 심리 효과로 사용을 촉진한다.",
      },
      {
        title: "부드러운 장벽 (Soft Barrier)",
        body: '완전 차단이 아닌 "한 단계 더" 전달. 반투명 오버레이로 접근 가능하지만 행동을 유도한다.',
      },
      {
        title: "기본 탭의 감정 설계",
        body: "사용 빈도순이 아닌 감정 순서: 만족감 -> 정리 -> 실용. 첫 인상을 극대화한다.",
      },
      {
        title: "편집 모드의 진입 비용",
        body: "파괴적 액션을 모드로 격리하여 실수를 방지한다.",
      },
    ],
    insights: [
      {
        title: "시간 기반 넛지 패턴",
        body: "만료일 잔여 표시로 사용 촉진. 구독, 쿠폰 등에 범용 적용 가능하다.",
      },
      {
        title: "부드러운 장벽",
        body: '반투명 오버레이로 "한 단계 더" 전달. 로그인 필요, 프리미엄 등에 적용 가능하다.',
      },
      {
        title: "기본 탭의 감정 설계",
        body: "첫 번째 탭 = 가장 좋은 인상을 주는 것. 사용 빈도가 아닌 감정을 기준으로 정렬한다.",
      },
      {
        title: "모드 분리로 실수 방지",
        body: "파괴적 액션은 별도 모드에 격리하여 일반 탐색과 분리한다.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    observe: <TechObserve />,
    analysis: [
      {
        title: "이중 데이터 소스 패턴",
        body: "서버(소유 정보) + 로컬(다운로드 상태)을 merge하여 하나의 ViewModel을 생성한다.",
      },
      {
        title: "이미지 캐싱 전략",
        body: "메모리 -> 디스크 -> CDN 3단 캐싱으로 이미지 그리드의 성능을 확보한다.",
      },
      {
        title: "탭 간 데이터 공유",
        body: "같은 데이터셋의 클라이언트 사이드 필터링으로 탭 전환 시 재요청 없이 즉시 전환.",
      },
      {
        title: "다운로드 관리의 복잡성",
        body: "백그라운드 처리, 큐, 저장공간, 상태 동기화 등 독립적 관리가 필요한 영역.",
      },
    ],
    insights: [
      {
        title: "이중 데이터 소스 merge",
        body: "서버 + 로컬 -> ViewModel. 오프라인 앱의 표준 패턴이다.",
      },
      {
        title: "3단 이미지 캐싱",
        body: "메모리 -> 디스크 -> CDN. 이미지 그리드 UI의 표준 전략이다.",
      },
      {
        title: "클라이언트 사이드 필터링",
        body: "소규모 데이터는 서버 재요청 없이 즉시 탭 전환이 가능하다.",
      },
      {
        title: "오프라인 기능의 기술적 비용",
        body: "다운로드/오프라인은 독립 관리가 필요할 만큼 복잡한 영역이다.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function LabYes24BookshelfGrid() {
  return (
    <LabLayout
      meta={meta}
      lenses={lenses}
      deviceType="mobile"
      screenshotSrc="/images/lab/yes24-bookshelf-grid/01-main.png"
      screenshotAlt="YES24 모바일 서재 그리드 뷰 스크린샷"
    />
  );
}
