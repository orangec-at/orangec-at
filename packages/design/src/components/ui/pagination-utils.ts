export type PageItem = number | 'ellipsis';

export interface BuildPageItemsOptions {
  total: number; // total pages
  current: number; // 0-based current page
  minVisible?: number; // 최소 숫자 개수 (ellipsis 제외)
  boundaryCount?: number; // 양끝 고정 개수
}

/**
 * TanStack Table과 호환되는 페이지네이션 아이템 생성 함수
 * boundaryCount와 siblingCount 개념을 사용해 최소 노출 개수를 보장
 */
export function buildPageItems(opts: BuildPageItemsOptions): PageItem[] {
  const {total, current} = opts;
  const minVisible = Math.max(3, opts.minVisible ?? 7);
  const boundaryCount = Math.max(1, opts.boundaryCount ?? 1);

  if (total <= minVisible) {
    return Array.from({length: total}, (_, i) => i);
  }

  // 최소 개수 기준으로 siblings 계산
  const baseSiblings = Math.max(1, Math.floor((minVisible - 1 - 2 * boundaryCount) / 2));

  const lastPage = total - 1;

  // 초기 윈도우(중앙)
  let start = current - baseSiblings;
  let end = current + baseSiblings;

  // 경계 보정
  if (start < boundaryCount) {
    const shift = boundaryCount - start;
    start += shift;
    end += shift;
  }
  if (end > lastPage - boundaryCount) {
    const shift = end - (lastPage - boundaryCount);
    start -= shift;
    end -= shift;
  }

  // 다시 경계 클램프
  start = Math.max(boundaryCount, start);
  end = Math.min(lastPage - boundaryCount, end);

  // 중앙 구간 길이가 모자라면 확장하여 최소 개수 보장
  const need = minVisible - 2 * boundaryCount - (end - start + 1);
  if (need > 0) {
    const addLeft = Math.ceil(need / 2);
    const addRight = Math.floor(need / 2);
    start = Math.max(boundaryCount, start - addLeft);
    end = Math.min(lastPage - boundaryCount, end + addRight);
  }

  const items: PageItem[] = [];

  // 시작 고정
  for (let i = 0; i < boundaryCount; i++) {
    items.push(i);
  }

  // 시작 ellipsis
  if (start > boundaryCount) {
    if (start === boundaryCount + 1) {
      items.push(boundaryCount);
    } else {
      items.push('ellipsis');
    }
  }

  // 중앙 윈도우
  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  // 끝 ellipsis
  if (end < lastPage - boundaryCount) {
    if (end === lastPage - boundaryCount - 1) {
      items.push(lastPage - boundaryCount);
    } else {
      items.push('ellipsis');
    }
  }

  // 끝 고정
  for (let i = lastPage - boundaryCount + 1; i <= lastPage; i++) {
    items.push(i);
  }

  return items;
}
