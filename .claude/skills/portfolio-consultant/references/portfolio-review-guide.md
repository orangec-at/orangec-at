# 포트폴리오 리뷰 및 개선 가이드

## 리뷰 프레임워크

### IMPACT 평가 기준

각 프로젝트를 다음 6가지 기준으로 평가:

1. **I**ntroduction - 첫인상 (10점)
2. **M**essage - 핵심 메시지 (20점)
3. **P**roblem - 문제 정의 (15점)
4. **A**pproach - 접근 방법 (25점)
5. **C**ode - 코드 품질 (20점)
6. **T**angible - 구체적 성과 (10점)

**총점 100점 기준**:
- 90-100: 탁월함 (Top 5%)
- 80-89: 우수 (Top 20%)
- 70-79: 양호 (평균 이상)
- 60-69: 보통 (개선 필요)
- 60 미만: 재작업 권장

## 1. Introduction (첫인상) - 10점

### 평가 항목
- [ ] 프로젝트 이름이 명확하고 기억에 남는가?
- [ ] 한 줄 설명이 5초 안에 이해되는가?
- [ ] 썸네일/스크린샷이 매력적인가?
- [ ] 라이브 데모 링크가 있는가?

### 체크리스트

**나쁜 예**:
```
Project: Website
Description: A website built with React
```

**좋은 예**:
```
YogaDay - 요가 스튜디오 예약 플랫폼
"소규모 요가 스튜디오를 위한 올인원 예약 시스템"
🔗 Live Demo | 📱 Mobile App | 📊 Admin Dashboard
```

### 점수 가이드
- 10점: 프로페셔널한 브랜딩, 즉시 이해되는 가치
- 7점: 명확하지만 평범
- 4점: 설명 부족, 무엇인지 불분명
- 0점: 프로젝트 이름만 있음

## 2. Message (핵심 메시지) - 20점

### 평가 항목
- [ ] 누구를 위한 프로젝트인가?
- [ ] 어떤 가치를 제공하는가?
- [ ] 왜 이 프로젝트를 만들었는가?
- [ ] 기술적 하이라이트는 무엇인가?

### STAR 프레임워크 적용

```
S (Situation): 상황/배경
T (Task): 해결해야 할 과제
A (Action): 취한 행동
R (Result): 결과/성과
```

**예시**:

```markdown
## DrawHatha - AI 기반 요가 자세 교정 앱

### Situation
요가 초보자들은 자세가 정확한지 확인할 방법이 없어 부상 위험 존재

### Task
혼자서도 정확한 자세를 배울 수 있는 모바일 앱 필요

### Action
- React Native로 크로스플랫폼 개발
- TensorFlow Lite로 실시간 자세 분석
- 음성 피드백으로 즉각적인 교정

### Result
- 10명의 활성 사용자
- 평균 주 3회 사용
- 자세 정확도 85% 향상 피드백
```

### 점수 가이드
- 20점: STAR 모두 명확, 설득력 있음
- 15점: 대부분 명확하지만 일부 부족
- 10점: 기본 정보만 있음
- 5점: 무엇을 했는지만 나열
- 0점: 설명 없음

## 3. Problem (문제 정의) - 15점

### 평가 항목
- [ ] 해결하려는 문제가 명확한가?
- [ ] 왜 이 문제가 중요한가?
- [ ] 기존 솔루션의 한계는?
- [ ] 타겟 사용자가 구체적인가?

### 좋은 문제 정의 공식

```
[대상]은 [상황]에서 [문제]를 겪는다.
기존 [솔루션A, B]는 [한계점] 때문에 부족하다.
```

**예시**:

❌ **나쁜 문제 정의**:
```
요가 앱이 필요해서 만들었습니다.
```

✅ **좋은 문제 정의**:
```
요가 초보자(대상)는 집에서 혼자 연습할 때(상황) 
자세가 정확한지 확인할 방법이 없다(문제).

기존 솔루션:
- 유튜브 영상: 일방향 피드백만 가능
- 오프라인 수업: 시간/비용 제약
- 기존 앱들: 자세 분석 정확도 낮음

→ 실시간 AI 분석 + 음성 피드백으로 해결
```

### 점수 가이드
- 15점: 문제가 명확하고 공감 가능, 기존 솔루션 분석
- 12점: 문제는 명확하나 깊이 부족
- 8점: 문제 언급만 있음
- 4점: 문제보다 기술 중심 설명
- 0점: 문제 정의 없음

## 4. Approach (접근 방법) - 25점

### 평가 항목
- [ ] 기술 스택 선택 이유가 설명되었나?
- [ ] 아키텍처가 시각화되었나?
- [ ] 주요 기술적 챌린지와 해결책은?
- [ ] 의사결정 근거가 있나?

### 기술 스택 설명 템플릿

```markdown
## 기술 스택 및 선택 이유

### Frontend
- **Next.js 14**: SSR로 SEO 최적화, App Router로 성능 개선
- **TypeScript**: 타입 안전성으로 런타임 에러 90% 감소
- **Tailwind CSS**: 빠른 프로토타이핑, 일관된 디자인 시스템

### Backend
- **NestJS**: TypeScript 기반, 확장 가능한 아키텍처
- **Prisma**: 타입 안전 ORM, 마이그레이션 관리 용이
- **PostgreSQL**: 관계형 데이터 처리, ACID 보장

### Infrastructure
- **Vercel**: 자동 배포, Edge Functions
- **Supabase**: PostgreSQL + Auth + Storage 통합
- **Cloudinary**: 이미지 최적화, CDN

### 왜 이 조합인가?
1. TypeScript 일관성: Frontend-Backend 타입 공유
2. 개발 속도: Next.js + Vercel로 빠른 배포
3. 비용 효율: Supabase 무료 플랜으로 시작
```

### 아키텍처 다이어그램 필수

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│   Next.js    │─────▶│  NestJS API │
│   (React)   │◀─────│   (SSR)      │◀─────│   (REST)    │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌─────────────┐
                     │   Vercel     │      │  Supabase   │
                     │   (Edge)     │      │ (Postgres)  │
                     └──────────────┘      └─────────────┘
```

### 기술적 챌린지 예시

```markdown
## 주요 챌린지와 해결

### Challenge 1: 실시간 자세 분석 성능
**문제**: TensorFlow.js가 모바일에서 너무 느림 (3-5초)
**시도**:
1. Web Worker 사용 → 2초로 개선
2. 모델 경량화 → 1초로 개선
3. TensorFlow Lite로 전환 → 0.3초 달성 ✅

**배운 점**: 
프레임워크 선택보다 최적화가 더 중요. 
네이티브 모듈 사용이 정답일 수 있음.

### Challenge 2: 이미지 스토리지 비용
**문제**: Supabase Storage 용량 초과 (월 10,000원)
**해결**: 
- Cloudinary 무료 플랜 전환
- 자동 압축으로 용량 70% 절감
- CDN으로 로딩 속도 2배 향상

**결과**: 비용 0원, 성능 향상
```

### 점수 가이드
- 25점: 모든 선택에 명확한 근거, 챌린지 해결 과정 상세
- 20점: 기술 스택과 기본 이유 설명
- 15점: 기술 스택 나열, 간단한 설명
- 10점: 기술 스택만 나열
- 0점: 기술 정보 없음

## 5. Code (코드 품질) - 20점

### 평가 항목
- [ ] README에 설치/실행 가이드가 있나?
- [ ] 코드가 읽기 쉽고 일관적인가?
- [ ] 주석과 문서화가 적절한가?
- [ ] 테스트가 있나?
- [ ] Git 히스토리가 깔끔한가?

### README 필수 섹션

```markdown
# 프로젝트명

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation
```bash
git clone https://github.com/username/project
cd project
pnpm install
```

### Environment Variables
```env
DATABASE_URL=
API_KEY=
```

### Running
```bash
pnpm dev        # 개발 서버
pnpm build      # 프로덕션 빌드
pnpm test       # 테스트 실행
```

## 📁 Project Structure
```
src/
├── app/           # Next.js App Router
├── components/    # React 컴포넌트
├── lib/           # 유틸리티
└── types/         # TypeScript 타입
```

## 🧪 Testing
```bash
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
```

## 📝 API Documentation
[링크] or Swagger

## 🤝 Contributing
[기여 가이드]

## 📄 License
MIT
```

### 코드 품질 체크리스트

**Good Code Signs**:
- [ ] 함수/변수명이 명확
- [ ] 한 함수가 한 가지 일만
- [ ] 매직 넘버 없이 상수 사용
- [ ] 에러 핸들링
- [ ] TypeScript 타입 정의

**예시**:

❌ **나쁜 코드**:
```typescript
function f(x, y) {
  if (x > 100) return y * 2;
  return y * 3;
}
```

✅ **좋은 코드**:
```typescript
const PREMIUM_THRESHOLD = 100;
const PREMIUM_MULTIPLIER = 2;
const STANDARD_MULTIPLIER = 3;

function calculatePrice(userLevel: number, basePrice: number): number {
  const isPremium = userLevel > PREMIUM_THRESHOLD;
  const multiplier = isPremium ? PREMIUM_MULTIPLIER : STANDARD_MULTIPLIER;
  
  return basePrice * multiplier;
}
```

### Git Commit 메시지

❌ **나쁜 커밋**:
```
update
fix bug
asdf
```

✅ **좋은 커밋**:
```
feat: Add user authentication with JWT
fix: Resolve memory leak in image upload
refactor: Extract payment logic into service layer
docs: Update API documentation
```

### 점수 가이드
- 20점: README 완벽, 코드 깔끔, 테스트 있음
- 15점: README 양호, 코드 읽기 쉬움
- 10점: 기본 README, 코드 평균 수준
- 5점: 문서 부족, 코드 개선 필요
- 0점: README 없음, 코드 난잡

## 6. Tangible (구체적 성과) - 10점

### 평가 항목
- [ ] 정량적 지표가 있나?
- [ ] 실사용 증거가 있나?
- [ ] 피드백이나 후기가 있나?
- [ ] 비즈니스 임팩트는?

### 성과 측정 템플릿

```markdown
## 📊 프로젝트 성과

### 사용자 지표
- 활성 사용자: 10명 (1년간)
- 월 평균 사용: 500회
- 사용자 유지율: 70%

### 기술적 성과
- 페이지 로딩: 0.8초 (평균)
- API 응답 시간: 100ms
- 테스트 커버리지: 85%
- Lighthouse 점수: 95점

### 비즈니스 임팩트
- 예약 처리 자동화로 관리 시간 70% 절감
- 문자 대신 카카오 알림으로 월 10만원 절감
- 노쇼율 30% → 5% 감소

### 사용자 피드백
"관리가 너무 편해졌어요!" - 강사 A
"앱이 직관적이라 배우기 쉬워요" - 회원 B
```

### 증거 자료

**포함하면 좋은 것들**:
- 스크린샷/데모 영상
- 사용자 후기 스크린샷
- Analytics 대시보드
- 성능 측정 결과
- Before/After 비교

### 점수 가이드
- 10점: 구체적 수치, 실사용 증거 명확
- 7점: 일부 지표 있음
- 4점: 정성적 설명만
- 0점: 성과 언급 없음

## 종합 리뷰 체크리스트

### 최소 기준 (Pass)
- [ ] 프로젝트가 실제로 작동함
- [ ] README에 설치/실행 방법
- [ ] 코드가 GitHub에 공개
- [ ] 무엇을 만들었는지 설명

### 좋은 수준 (Good)
- [ ] 위 모든 항목
- [ ] 문제와 해결 방법 명확
- [ ] 기술 선택 이유 설명
- [ ] 코드 품질 양호
- [ ] 일부 성과 지표

### 탁월한 수준 (Excellent)
- [ ] 위 모든 항목
- [ ] 라이브 데모 가능
- [ ] 케이스 스터디 수준 문서
- [ ] 깨끗한 코드, 테스트
- [ ] 구체적 성과와 증거
- [ ] 배운 점과 개선 계획

## 개선 우선순위 가이드

점수가 낮은 순서대로 개선:

### 1순위 (즉시 수정)
- README 없음 → 기본 README 작성
- 실행 불가 → 버그 수정, 설치 가이드
- 프로젝트 설명 없음 → 한 줄 요약

### 2순위 (이번 주)
- 코드 품질 낮음 → 리팩토링
- 문제 정의 불명확 → STAR 프레임워크 적용
- 기술 스택 나열만 → 선택 이유 추가

### 3순위 (이번 달)
- 성과 지표 없음 → 데이터 수집, 스크린샷
- 라이브 데모 없음 → 배포
- 테스트 없음 → 주요 기능 테스트 추가

### 4순위 (장기)
- 케이스 스터디 작성
- 기술 블로그 글 작성
- 영문 번역

## 실전 리뷰 예시

### 프로젝트: YogaDay

**IMPACT 점수**:
- Introduction: 9/10 (명확한 설명, 라이브 데모 있음)
- Message: 18/20 (STAR 프레임워크 적용, 약간 더 구체적이면 좋음)
- Problem: 14/15 (문제 정의 명확, 기존 솔루션 분석 훌륭)
- Approach: 22/25 (기술 스택 이유 설명, 아키텍처 다이어그램 있으면 완벽)
- Code: 15/20 (README 양호, 테스트 추가 필요)
- Tangible: 8/10 (사용자 수, 피드백 있음, 정량 지표 더 추가)

**총점: 86/100** (우수)

**개선 제안**:
1. 아키텍처 다이어그램 추가
2. 주요 기능에 대한 테스트 코드 작성
3. 성능 지표 추가 (로딩 시간, API 응답 등)

## 마무리 체크리스트

포트폴리오 업데이트 전 최종 점검:

- [ ] 오타/문법 오류 확인
- [ ] 모든 링크 작동 확인
- [ ] 스크린샷 최신 버전으로 업데이트
- [ ] 모바일에서도 잘 보이는지 확인
- [ ] 친구/동료에게 피드백 요청
- [ ] GitHub 커밋 메시지 정리
- [ ] 라이센스 파일 추가
- [ ] .gitignore 설정 확인

완벽한 포트폴리오는 없습니다. 중요한 것은 지속적인 개선입니다.
