# Claude Code Infrastructure

프로덕션 환경에서 검증된 Claude Code infrastructure로, 자동 skill 활성화, dev docs 시스템, 그리고 프로젝트별 가이드라인을 제공합니다.

---

## 📁 디렉토리 구조

```
.claude/
├── README.md              # 이 파일
├── SETUP.md              # 설정 가이드
├── settings.local.json   # Claude Code 설정
├── hooks/                # 자동화 hooks
│   ├── skill-activation-prompt.ts    # Skill 자동 활성화
│   └── post-tool-use-tracker.sh      # 파일 변경 추적
├── skills/               # Skills 라이브러리
│   ├── skill-rules.json  # Skill 활성화 규칙
│   └── frontend-dev-guidelines/
│       └── SKILL.md      # Next.js + React 가이드라인
├── agents/               # 전문 agents (선택)
└── commands/             # Slash commands (선택)
```

---

## 🚀 빠른 시작

### 1. Hooks 활성화

`.claude/settings.local.json` 파일에 다음을 추가하세요:

```json
{
  "UserPromptSubmit": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.ts"
        }
      ]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "Edit|MultiEdit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-tool-use-tracker.sh"
        }
      ]
    }
  ]
}
```

### 2. Hook 실행 권한 부여

```bash
chmod +x .claude/hooks/*.ts .claude/hooks/*.sh
```

### 3. 테스트

Claude Code를 실행하고 다음 프롬프트를 입력:

```
"Create a new React component for the homepage"
```

✅ **기대 결과:** `frontend-dev-guidelines` skill이 자동으로 제안됨

---

## 🎯 핵심 기능

### 1. 자동 Skill 활성화

**문제:** Claude가 프로젝트 가이드라인을 자동으로 적용하지 않음

**해결:** Hooks + skill-rules.json

- 사용자 프롬프트 분석
- 관련 skill 자동 제안
- 컨텍스트에 맞는 가이드라인 로드

**예시:**
```
Input: "Add a new page for the blog"
→ frontend-dev-guidelines 자동 활성화
→ Next.js 15 App Router 패턴 적용
```

### 2. Progressive Disclosure (500줄 규칙)

**원칙:** 각 skill은 500줄 이하 유지

**구조:**
```
skill-name/
  SKILL.md          # <500줄 (개요)
  resources/
    topic-1.md      # 심화 내용
    topic-2.md
```

**이점:** 토큰 효율 40~60% 향상

### 3. Dev Docs 시스템

**목적:** Context 리셋 후에도 작업 연속성 유지

**구조:**
```
dev/active/
  [task]-plan.md      # 전략 계획
  [task]-context.md   # 핵심 정보
  [task]-tasks.md     # 작업 체크리스트
```

**사용법:**
```bash
# 새 작업 시작
/dev-docs auth-system

# Context 리셋 후 복구
/continue auth-system
```

---

## 📚 Skills 라이브러리

### 1. frontend-dev-guidelines
**우선순위:** 높음  
**대상:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**트리거:** component, page, layout, react, tailwind

**주요 내용:**
- Server/Client Components 패턴
- Tailwind CSS 4 스타일링
- Radix UI 통합
- Framer Motion 애니메이션
- TypeScript 타입 안전성
- next-intl i18n 패턴

### 2. mdx-content-guidelines
**우선순위:** 중간  
**대상:** MDX 블로그 컨텐츠  
**트리거:** mdx, blog, article, content, frontmatter

**주요 내용:**
- Frontmatter 스키마
- MDX 컴포넌트 패턴
- gray-matter 사용법
- 컨텐츠 구조화

### 3. typescript-quality
**우선순위:** 높음  
**대상:** TypeScript 코드 품질  
**트리거:** type, interface, zod, validation

**주요 내용:**
- Strict mode 설정
- Zod 스키마 패턴
- Type safety 베스트 프랙티스

### 4. vault-management
**우선순위:** 낮음  
**대상:** 개인 노트 시스템  
**트리거:** vault, note, daily, weekly

### 5. build-and-deployment
**우선순위:** 중간  
**대상:** Vercel 배포  
**트리거:** build, deploy, vercel, production

---

## 🔧 Hooks 시스템

### UserPromptSubmit Hook
**파일:** `hooks/skill-activation-prompt.ts`

**역할:**
1. 사용자 프롬프트 분석
2. skill-rules.json 규칙 매칭
3. 관련 skills 자동 제안

**작동 방식:**
```
User: "Create a new component"
  ↓
skill-activation-prompt.ts 실행
  ↓
keywords: ["component"] 매칭
  ↓
frontend-dev-guidelines 제안
  ↓
Claude가 skill 로드
```

### PostToolUse Hook
**파일:** `hooks/post-tool-use-tracker.sh`

**역할:**
1. Edit/MultiEdit/Write 후 실행
2. 변경된 파일 추적
3. 영향받은 리포지토리 식별

---

## 🛠️ 커스터마이징

### 새 Skill 추가

1. **디렉토리 생성:**
   ```bash
   mkdir -p .claude/skills/your-skill/resources
   ```

2. **SKILL.md 작성:**
   ```markdown
   # Your Skill Name
   
   Quick Start Checklists, Core Principles, Examples
   ```

3. **skill-rules.json 업데이트:**
   ```json
   {
     "skillName": "your-skill",
     "priority": "medium",
     "triggers": {
       "keywords": ["your", "keywords"]
     }
   }
   ```

### Skill 우선순위

- **critical**: 즉시 차단, 반드시 적용
- **high**: 강력 권장
- **medium**: 제안
- **low**: 선택적 제안

### Skill 타입

- **block**: 반드시 로드해야 함 (차단)
- **suggest**: 제안만 (건너뛰기 가능)
- **warn**: 경고만 표시

---

## 📖 사용 예시

### Example 1: 새 컴포넌트 생성

```
User: "Create a button component with variants"

→ frontend-dev-guidelines 자동 활성화
→ Claude 응답:
  - Radix UI Slot 패턴 사용
  - class-variance-authority로 variants
  - Tailwind CSS 스타일링
  - TypeScript 타입 정의
```

### Example 2: MDX 블로그 포스트 작성

```
User: "Write a blog post about Next.js 15 features"

→ mdx-content-guidelines 자동 활성화
→ Claude 응답:
  - Frontmatter 스키마 적용
  - MDX 컴포넌트 사용
  - 적절한 파일 구조
```

### Example 3: TypeScript 타입 정의

```
User: "Add type definition for user profile"

→ typescript-quality 자동 활성화
→ Claude 응답:
  - Zod schema 생성
  - Type inference 활용
  - Strict mode 준수
```

---

## 🔍 Troubleshooting

### Hook이 실행되지 않을 때

1. **실행 권한 확인:**
   ```bash
   ls -la .claude/hooks/
   ```
   모든 파일이 `rwxr-xr-x` 권한이어야 함

2. **Node.js 확인:**
   ```bash
   node --version  # v18+
   ```

3. **settings.json 확인:**
   `$CLAUDE_PROJECT_DIR` 변수가 올바른지 확인

### Skill이 활성화되지 않을 때

1. **skill-rules.json 구문 확인:**
   ```bash
   cat .claude/skills/skill-rules.json | jq .
   ```

2. **트리거 키워드 확인:**
   프롬프트에 skill의 keywords가 포함되어 있는지 확인

3. **파일 경로 확인:**
   현재 파일이 skill의 filePaths 패턴과 일치하는지 확인

---

## 📚 추가 리소스

### 문서
- **SETUP.md**: 상세 설정 가이드
- **dev/active/README.md**: Dev docs 시스템 가이드
- **Memory**: `claude-code-infrastructure-guide` (프로젝트 메모리)

### 참고 자료
- [Claude Code Infrastructure Showcase](https://github.com/serithemage/claude-code-infrastructure-showcase)
- [6개월 극한 사용 경험담](https://rosettalens.com/s/ko/claude-code-is-a-beast-tips-from-6-months-of-hardcore-use)

---

## 🎓 베스트 프랙티스

### Skills 작성
- ✅ 500줄 이하 유지
- ✅ Progressive disclosure 활용
- ✅ 명확한 트리거 규칙
- ✅ 실전 예제 포함

### Hooks 사용
- ✅ 필수 2개(skill-activation, post-tool-use)부터 시작
- ✅ 선택적 hooks는 프로젝트 크기 고려
- ✅ 성능에 영향 주는 hooks는 신중히 추가

### Dev Docs
- ✅ 작업 이름은 간결하게 (kebab-case)
- ✅ 정기적으로 업데이트
- ✅ 완료된 작업은 archive로 이동
- ✅ 동시 작업은 3개 이하 유지

---

## 🚀 다음 단계

Infrastructure 설정 완료 후:

1. **프로젝트별 Skills 추가**: 도메인 특화 가이드라인
2. **Agents 활용**: 복잡한 작업에 전문 agents 사용
3. **Hooks 최적화**: 프로젝트 규모에 맞게 조정
4. **Memory MCP 통합**: 장기 프로젝트 결정사항 추적

---

## 📊 효과

초기 설정 투자: **2일**  
시간 절약: **최소 10배 이상**

### 주요 이점
- ✅ 일관된 코드 패턴 자동 적용
- ✅ Context 리셋 후에도 작업 연속성 유지
- ✅ 토큰 효율 40~60% 향상
- ✅ 프로젝트 가이드라인 자동 준수

---

## 📝 라이센스 & 크레딧

이 infrastructure는 다음을 기반으로 구축되었습니다:
- [Claude Code Infrastructure Showcase](https://github.com/serithemage/claude-code-infrastructure-showcase)
- 6개월 프로덕션 환경 검증

**프로젝트:** OrangeC-AT Blog  
**기술 스택:** Next.js 15 • React 19 • TypeScript • Tailwind CSS 4

---

**시작하기:**

```bash
# 1. SETUP.md 읽기
cat .claude/SETUP.md

# 2. settings.local.json 설정
# 3. Hook 권한 부여
chmod +x .claude/hooks/*.ts .claude/hooks/*.sh

# 4. 테스트
# Claude Code 실행 후:
"Create a new React component"
```

✨ **Happy Coding with Claude Code!**
