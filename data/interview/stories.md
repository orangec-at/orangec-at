# STAR Story Bank (공용)

각 스토리에 태그를 붙여두고 면접 때 JD에 맞게 선택하세요. `{METRIC_TODO}` 자리는 실제 수치로 교체.

## 배터리 여권 플랫폼 (2025.09-2025.11, 프리랜서, FE)
- 태그: ops, data, auth, perf, collab
- 상황/과제: 전기차 배터리 여권 생산·유통·사용·재활용을 추적/관리하는 초기 포털을 설계·구현, 대용량 데이터 신뢰성과 인증/권한 요구.
- 행동:
  - Next.js(App Router)+TS 설계, SSR/CSR 혼합 전략으로 데이터 노출·렌더 안정화.
  - React Query+Zustand로 서버/뷰 상태 분리, 캐싱·프리패칭 설계.
  - OAuth2(Google/카카오/네이버) 간편 로그인, JWT/Refresh 파이프라인 정비.
  - React Hook Form+Zod로 폼/검증 체계화.
  - Stepper UI로 배터리 이력 검색/신청/확인 3단계 플로우 명시.
  - BIN별 API 캐싱, 네트워크 재시도/토큰 교체 로직으로 안정성 확보.
  - README/ESLint/Prettier/패키지 스크립트로 협업 온보딩 시간 단축.
- 결과:
  - 제조사 소속 루트 탐색 시간 ~70% 단축({METRIC_TODO}→{METRIC_TODO}).
  - 세션 단절 없는 열람 경험, 폼 오류율 {METRIC_TODO}%↓.
  - 온보딩 시간 {METRIC_TODO}→{METRIC_TODO}.

## 자원/권한 관리 어드민 (2024.09-현재, FE 리드)
- 태그: admin, permissions, logging, perf, collab, delivery
- 상황/과제: 운영팀 권한/자원 관리 어드민, 공통 UI와 권한/감사 요구, 빠른 화면 추가.
- 행동:
  - 공통 Form/Table 컴포넌트화로 화면 개발 리드타임 단축.
  - 역할/권한 가드, 감사 로그 표준화, 라우팅/액션 제한 정리.
  - React Query 캐싱/프리패칭으로 리스트↔상세 전환 체감 속도 개선.
  - 백엔드/디자인과 요구·스키마 협의, Docker 배포 파이프라인 협업.
- 결과:
  - 신규 화면 개발 리드타임 {METRIC_TODO}% 단축.
  - 리스트→상세 전환 체감 속도 {METRIC_TODO}% 개선.
  - 배포 리드타임/빈도 {METRIC_TODO}.

## 피큐레잇 대시보드
- 태그: dashboard, perf, ci-cd, caching
- 상황/과제: 대시보드 초기 로드/인터랙션 성능 문제, 데이터/뷰 상태 혼재.
- 행동:
  - React Query + Zustand로 서버/클라이언트 상태 분리, 캐시 정책 최적화.
  - 코드 스플리팅·메모이제이션으로 렌더 최소화.
  - CI/CD 개선으로 릴리스 리드타임 단축.
- 결과:
  - 초기 로드 {METRIC_TODO}% 개선, 상호작용 지연 {METRIC_TODO}ms↓.
  - 배포 빈도/리드타임 {METRIC_TODO}.

## 시큐어넷 운영 어드민
- 태그: admin, compliance, forms, quality
- 상황/과제: 보안/컴플라이언스 반영한 관리자 UX 개선, 입력 오류·접근 제어 이슈.
- 행동:
  - 접근 제어/로그 노출 강화, 역할별 뷰/액션 제한.
  - react-hook-form + 에러 가이드로 입력 오류 감소.
- 결과:
  - 입력 오류/재처리 건수 {METRIC_TODO}% 감소.
  - 접근 제어 관련 문의/이슈 {METRIC_TODO}% 감소.

## 마이다스아이티 관리자
- 태그: admin, components, storybook, api-standards
- 상황/과제: 관리자 화면 일관성/QA 이슈.
- 행동:
  - 테이블/필터/배치액션 공통 컴포넌트, 스토리북 문서화.
  - API 에러/페이징 표준화로 QA 이슈 감소.
- 결과:
  - QA 버그 {METRIC_TODO}% 감소.
  - 신규 화면 개발 시간 {METRIC_TODO}% 단축.

## DrawHatha (요가 트래킹, 개인)
- 태그: mobile, admin, api, ops
- 상황/과제: 모바일 트래킹+백오피스+API를 단독 구축.
- 행동:
  - RN + React Query로 세션 데이터 캐싱/동기화.
  - Nest.js + PostgreSQL API, 운영 어드민(Next.js) 동시 구축.
  - 빌드/배포 자동화, 모니터링 기본 세팅.
- 결과:
  - 세션 동기화 실패율 {METRIC_TODO}%↓.
  - 배포 파이프라인 구축으로 릴리스 시간 {METRIC_TODO} 단축.
