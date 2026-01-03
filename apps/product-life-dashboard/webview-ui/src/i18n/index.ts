import { ko } from './ko';
import { en } from './en';

export type Language = 'ko' | 'en';

const translations = {
  ko,
  en,
};

let currentLanguage: Language = 'ko';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t() {
  return translations[currentLanguage];
}

export { ko, en };
