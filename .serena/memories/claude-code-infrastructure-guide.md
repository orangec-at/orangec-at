# Claude Code Infrastructure 구축 가이드

## 출처
- [6개월 극한 사용 경험담](https://rosettalens.com/s/ko/claude-code-is-a-beast-tips-from-6-months-of-hardcore-use)
- [Infrastructure Showcase](https://github.com/serithemage/claude-code-infrastructure-showcase)

---

## 핵심 철학

> "Claude가 너를 위해 뭘 할지 묻지 말고, Claude에게 어떤 컨텍스트를 줄 수 있을지 물어라"

- **플래닝이 핵심**: 계획 없이 구현 금지
- **자동화 우선**: Hooks + skill-rules.json으로 자동 활성화
- **Progressive Disclosure**: 500줄 이하 유지, 리소스 분할
- **Dev Docs 시스템**: Context 리셋 방지

---

## 1. 디렉토리 구조

```
.claude/
├── skills/              # 자동 활성화 skills
│   ├── [skill-name]/
│   │   ├── SKILL.md     # <500줄 개요
│   │   └── resources/   # 심화 내용들
│   └── skill-rules.json # 자동 활성화 규칙
├── hooks/               # 자동화 파이프라인
│   ├── skill-activation-prompt.ts (필수)
│   ├── post-tool-use-tracker.sh (필수)
│   ├── tsc-check.sh (선택)
│   └── prettier-format.sh (선택)
├── agents/              # 전문 에이전트들
└── commands/            # Slash commands

dev/
└── active/              # Dev docs 패턴
    ├── [task]-plan.md
    ├── [task]-context.md
    └── [task]-tasks.md
```

---

## 2. Skill 자동 활성화 시스템 (핵심)

### 문제점
수천 줄의 가이드라인을 만들어도 Claude가 자동으로 활용하지 않음

### 해결책: Hooks + skill-rules.json

**skill-rules.json 구조:**
```json
{
  "skills": [
    {
      "skillName": "backend-dev-guidelines",
      "triggers": {
        "keywords": ["backend", "api", "route", "controller"],
        "intentPatterns": ["(create|add).*?(route|endpoint|api)"],
        "filePaths": ["apps/*/src/routes/**", "apps/*/src/controllers/**"],
        "fileContentPatterns": ["import.*express", "router\\.(get|post)"]
      }
    }
  ]
}
```

**작동 흐름:**
1. UserPromptSubmit hook이 프롬프트 분석
2. skill-rules.json에서 트리거 규칙 확인
3. 관련 skills 자동 제안/로드
4. Progressive disclosure로 필요한 리소스만 로드

---

## 3. Skills 구조 (500줄 규칙)

### 베스트 프랙티스
- **메인 파일**: SKILL.md는 500줄 이하 (개요)
- **리소스 분할**: 상세 내용은 resources/ 폴더로
- **토큰 효율**: 40~60% 향상

### 필수 Skills
1. **backend-dev-guidelines** (304줄)
   - Routes → Controllers → Services → Repositories 패턴
   - Error handling, Sentry 통합
   
2. **frontend-dev-guidelines** (398줄)
   - React 19, TypeScript 패턴
   - Component 구조, State 관리
   
3. **skill-developer** (426줄)
   - Skills 생성/관리 메타 스킬
   
4. **database-verification**
   - 컬럼명 오류 방지 가드레일

---

## 4. Hooks 파이프라인

### 필수 Hooks (바로 사용 가능)
1. **skill-activation-prompt.ts** (UserPromptSubmit)
   - 프롬프트 분석 → skill 자동 제안
   
2. **post-tool-use-tracker.sh** (PostToolUse)
   - Tool 사용 패턴 추적

### 선택 Hooks (커스터마이징 필요)
3. **prettier-format.sh** (Stop)
   - 수정된 파일 자동 포맷
   
4. **tsc-check.sh** (Stop)
   - TypeScript 에러 즉시 포착
   - 5개 미만: 표시 / 5개 이상: 자동 해결 권고
   
5. **error-handling-reminder.sh** (Stop)
   - Sentry 캡처, try-catch 확인

**실행 순서:**
User Prompt → Skill Activation → Claude 응답 → Prettier → Build Check → Error Reminder → Auto Fix

---

## 5. Dev Docs 시스템

### 목적
Context 리셋 후에도 작업 연속성 유지

### 3-파일 구조
```
dev/active/
├── [task-name]-plan.md      # 승인된 전략 계획
├── [task-name]-context.md   # 핵심 파일/결정사항
└── [task-name]-tasks.md     # 작업 체크리스트
```

### 사용 방법
- `/dev-docs` 명령으로 자동 생성
- Context 리셋 후 `/continue` 명령으로 복구
- `/dev-docs-update`로 진행 상황 업데이트

---

## 6. 전문 Agents (10개)

### 품질 관리
- code-architecture-reviewer: 아키텍처 일관성 리뷰
- code-refactor-master: Refactoring 계획/실행
- refactor-planner: Refactoring 전략 수립

### 테스트/디버깅
- auth-route-tester: 인증된 endpoints 테스트
- frontend-error-fixer: Frontend 에러 디버깅
- auto-error-resolver: TypeScript 에러 자동 수정

### 전략/문서
- plan-reviewer: 개발 계획 리뷰
- documentation-architect: 포괄적 문서 생성
- web-research-specialist: 기술 이슈 리서치

---

## 7. Slash Commands

### 핵심 명령어
- `/dev-docs`: 구조화된 dev documentation 생성
- `/dev-docs-update`: Context 리셋 전 문서 업데이트
- `/code-review`: 아키텍처 관점 리뷰
- `/build-and-fix`: 빌드 후 모든 에러 수정
- `/route-research-for-testing`: 영향 라우트 탐색

---

## 8. 통합 워크플로우

### Phase 1: Hook 설정 (15분)
1. skill-activation-prompt.ts 복사
2. post-tool-use-tracker.sh 복사
3. settings.json에 hooks 등록
4. Dependencies 설치

### Phase 2: 첫 Skill 추가 (10분)
1. 프로젝트에 맞는 skill 선택
2. Skill 디렉토리 복사
3. skill-rules.json 생성
4. 트리거 규칙 커스터마이징

### Phase 3: 테스트 & 반복 (5분)
1. Skill 자동 활성화 확인
2. 트리거 규칙 조정
3. 필요시 추가 skills 통합

---

## 9. 추가 도구

### PM2 백엔드 프로세스 관리
- 마이크로서비스 통합 관리
- 실시간 로그 접근
- 자동 재시작

### Memory MCP
- 프로젝트 결정사항 추적
- 아키텍처 히스토리 유지

### BetterTouchTool
- 앱 전환 핫키
- 상대 경로 URL 복사 자동화

---

## 10. 핵심 원칙

### Skill 작성
- 500줄 이하 유지
- Progressive disclosure
- 명확한 트리거 규칙

### Workflow
- 플래닝 먼저
- 자주 재프롬프트
- 풍부한 컨텍스트 제공

### 품질
- 자동 포맷
- 빌드 체크
- 에러 핸들링

---

## 결론

초기 2일 투자로 최소 10배 이상의 시간 절약 효과. "계획 → 스킬 자동 활성화 → Dev Docs → Hooks 기반 QA → 전문 에이전트"의 통합 시스템이 가장 효율적.