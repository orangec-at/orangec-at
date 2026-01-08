# 번역 시스템 구현 계획 (next-intl 기반)

## 1. 프로젝트 구조 변경

### 현재 라우트 구조
```
/blog/[slug] → 블로그 포스트
/projects/[id] → 프로젝트 상세
/contact → 연락처
```

### 변경될 라우트 구조  
```
/[locale]/blog/[slug] → 블로그 포스트 (ko/en)
/[locale]/projects/[id] → 프로젝트 상세 (ko/en)
/[locale]/contact → 연락처 (ko/en)
```

## 2. 설치 및 설정

### 패키지 설치
```bash
yarn add next-intl
```

### 설정 파일들
- `messages/ko.json` - 한국어 번역
- `messages/en.json` - 영어 번역  
- `next.config.ts` - next-intl 설정 추가
- `middleware.ts` - 로케일 라우팅
- `i18n.ts` - 번역 설정

## 3. 단계별 구현 계획

### Phase 1: 기본 설정 (1-2일)
1. next-intl 패키지 설치
2. 미들웨어 설정으로 `/ko`, `/en` 라우팅
3. 기본 번역 파일 생성
4. 루트 레이아웃 수정

### Phase 2: 컴포넌트 번역 (2-3일)  
1. 네비게이션 컴포넌트 번역
2. 홈페이지 섹션별 번역
3. 연락처 페이지 번역
4. 푸터 및 공통 컴포넌트 번역

### Phase 3: 블로그 시스템 (2-3일)
1. MDX 콘텐츠 로케일별 분리
2. 블로그 메타데이터 번역
3. 블로그 목록/상세 페이지 번역
4. 프로젝트 페이지 번역

### Phase 4: SEO 및 최적화 (1일)
1. 메타데이터 로케일별 설정
2. sitemap.xml 다국어 지원
3. hreflang 태그 설정
4. 언어 전환 UI 구현

## 4. 파일 구조 예시

```
apps/blog/
├── messages/
│   ├── en.json
│   └── ko.json
├── src/
│   ├── i18n.ts
│   ├── middleware.ts
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── blog/
│   │       ├── projects/
│   │       └── contact/
│   └── posts/
│       ├── ko/
│       │   └── *.mdx
│       └── en/
│           └── *.mdx
```

## 5. 기술적 고려사항

### URL 구조
- 기본 로케일: `/ko` (한국어 우선)  
- 대체 로케일: `/en` (영어)
- 자동 감지: Accept-Language 헤더 기반

### MDX 콘텐츠 처리
- 로케일별 폴더 분리 (`posts/ko/`, `posts/en/`)
- 동일한 slug로 언어별 매핑
- frontmatter에 locale 정보 추가

### SEO 최적화
- 각 페이지별 hreflang 태그
- 로케일별 sitemap 생성
- OpenGraph 메타데이터 번역

## 6. 예상 번들 크기 영향

- next-intl 추가: +15-20KB gzipped
- 번역 파일들: +5-10KB (트리셰이킹으로 최적화)
- 전체 영향: 현재 번들 대비 약 2% 증가

## 7. 구현 우선순위

1. **High**: 네비게이션, 홈페이지 핵심 섹션
2. **Medium**: 블로그 목록/상세, 프로젝트 페이지  
3. **Low**: 연락처 폼, 푸터, 기타 텍스트