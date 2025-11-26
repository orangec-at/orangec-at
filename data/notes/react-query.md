# React Query Study Notes

## 키 설계
- 형식: `['resource', { id, filters... }]`로 object 키 사용 → 필터 조합 캐싱 가능.
- 리스트 vs 상세 분리: `['users', query]` / `['user', id]`.
- 상위 키 invalidate: 리스트 invalidate 후 필요한 상세는 selective invalidate.

## 캐싱/인밸리데이션 전략
- 기본: staleTime 넉넉히(서버 주기·변경 빈도 기준) + cacheTime 적정 관리.
- 리스트 요청 후 상세 prefetch: `queryClient.prefetchQuery(['user', id], fn)`.
- 뮤테이션 후: 관련 키만 invalidate → `['users']`, `['user', id]`.
- SSR/CSR 혼합: 서버에서 dehydrated state, 클라이언트 hydrate. 페이지/라우트 전환 빈도 높을 때 prefetch + keepPreviousData.

## 페이징/필터
- 키에 필터 포함: `['transactions', { page, size, status, search }]`.
- 무한 스크롤: `useInfiniteQuery` with `getNextPageParam`, concat 시 메모리 관리.
- 검색 디바운스: 입력값을 300–500ms 디바운스 후 키에 반영.

## 에러/리트라이
- 리트라이: 1~2회 제한, 권한/validation 오류는 리트라이 금지 → `retry: (failures, err) => err.status >= 500 ? 2 : 0`.
- 에러 핸들러: 글로벌(onError)에서 토스트/로그, 권한 오류는 로그인 리다이렉트.

## 옵티미스틱 업데이트
- 리스트/상세 캐시 동시 수정 → `onMutate`에서 snapshot, `onError`에서 rollback.
- 경쟁 상태 방지: mutation key 구분, 동일 리소스 연속 업데이트 시 큐잉 고려.

## 성능 팁
- select로 데이터 슬라이싱 → 불필요 리렌더 방지.
- `enabled` 조건으로 쿼리 지연: 필수 파라미터 없을 때 호출 방지.
- 큰 리스트는 `keepPreviousData: true` + skeleton 대신 이전 페이지 유지.
- React 19/Next App Router: 서버에서 fetch + `dehydrate` 후 클라이언트에서 `useQuery` 재사용.

## 폼/스냅샷
- React Hook Form 연동 시: 제출 성공 후 invalidate 대상만 지정.
- Form wizard/Stepper: 단계별 저장은 mutation batching, 최종 제출 전 임시 캐시.

## 지표/회고 포인트
- 초기 로드/전환 시간 % 개선, 캐시 적중률, 에러/재시도 감소, API 호출 수 절감.
- 배터리 여권: BIN 캐시로 탐색 시간 ~70% 단축 {METRIC_TODO}.
- 자원/권한 어드민: 리스트↔상세 전환 체감 속도 {METRIC_TODO}% 개선.
