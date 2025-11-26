import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * HTML 엔티티를 디코딩합니다.
 * 백엔드에서 인코딩된 특수문자(&lt;, &#39; 등)를 원래 문자로 변환합니다.
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') return text;

  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}
