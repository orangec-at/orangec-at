# Claude Code Infrastructure Setup Guide

이 가이드는 프로젝트에 Claude Code infrastructure를 설정하는 방법을 단계별로 안내합니다.

---

## 📋 목차

1. [Prerequisites](#prerequisites)
2. [Phase 1: Hooks 설정 (필수)](#phase-1-hooks-설정-필수)
3. [Phase 2: Skills 활성화 (필수)](#phase-2-skills-활성화-필수)
4. [Phase 3: Dev Docs 시스템 (선택)](#phase-3-dev-docs-시스템-선택)
5. [Phase 4: 추가 커스터마이징 (선택)](#phase-4-추가-커스터마이징-선택)
6. [검증 및 테스트](#검증-및-테스트)

---

## Prerequisites

- Claude Code CLI 설치 완료
- Node.js 18+ (TypeScript hooks 실행용)
- pnpm/npm/yarn (패키지 관리자)

---

## Phase 1: Hooks 설정 (필수)

### 1.1. settings.json 업데이트

`.claude/settings.local.json` (또는 `.claude/settings.json`) 파일에 다음 hooks 설정을 추가하세요:

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

**설명:**
- **UserPromptSubmit**: 사용자 프롬프트 전에 skill 자동 활성화 체크
- **PostToolUse**: 파일 편집 후 변경 사항 추적

### 1.2. Hooks 실행 권한 부여

```bash
chmod +x .claude/hooks/skill-activation-prompt.ts
chmod +x .claude/hooks/post-tool-use-tracker.sh
```

### 1.3. TypeScript/Node.js Dependencies (선택)

TypeScript hook이 제대로 작동하려면 Node.js가 설치되어 있어야 합니다. 일반적으로 이미 설치되어 있으며, 별도의 dependencies는 필요하지 않습니다.

---

## Phase 2: Skills 활성화 (필수)

### 2.1. 현재 설정된 Skills

다음 skills가 이미 설정되어 있습니다:

1. **frontend-dev-guidelines** (우선순위: 높음)
   - Next.js 15, React 19, TypeScript, Tailwind CSS 가이드라인
   
2. **mdx-content-guidelines** (우선순위: 중간)
   - MDX 블로그 컨텐츠 작성 가이드라인
   
3. **vault-management** (우선순위: 낮음)
   - Vault 노트 관리 시스템 가이드라인
   
4. **typescript-quality** (우선순위: 높음)
   - TypeScript 타입 안전성 및 품질 가이드라인
   
5. **build-and-deployment** (우선순위: 중간)
   - Vercel 빌드 및 배포 가이드라인

### 2.2. Skill 자동 활성화 테스트

Claude Code를 실행하고 다음과 같은 프롬프트를 입력해보세요:

```
"Create a new React component for the blog homepage"
```

**예상 결과:**
- `skill-activation-prompt.ts` hook이 실행됨
- "frontend-dev-guidelines" skill이 자동으로 제안됨
- Claude가 skill을 로드하고 가이드라인에 따라 컴포넌트 생성

### 2.3. skill-rules.json 커스터마이징

필요에 따라 `.claude/skills/skill-rules.json`을 수정하여:
- 새로운 키워드 추가
- 파일 경로 패턴 수정
- 우선순위 조정

**예시:**
```json
{
  "keywords": [
    "component",
    "frontend",
    "react",
    "your-custom-keyword"  // 추가
  ]
}
```

---

## Phase 3: Dev Docs 시스템 (선택)

### 3.1. Dev Docs 디렉토리 확인

이미 `dev/active/` 디렉토리가 생성되어 있습니다. README를 확인하세요:

```bash
cat dev/active/README.md
```

### 3.2. Slash Commands 생성 (선택)

Dev docs 시스템을 사용하려면 다음 slash commands를 생성할 수 있습니다:

**`.claude/commands/dev-docs.md`:**
```markdown
# Create Dev Docs

Create comprehensive development documentation for the current task:

1. Generate `dev/active/[task-name]-plan.md` with strategic plan
2. Generate `dev/active/[task-name]-context.md` with key files and decisions
3. Generate `dev/active/[task-name]-tasks.md` with task checklist

Task name: ${1:task-name}
```

**`.claude/commands/continue.md`:**
```markdown
# Continue Task

Resume work on a task by loading its dev docs:

1. Read `dev/active/[task-name]-plan.md`
2. Read `dev/active/[task-name]-context.md`
3. Read `dev/active/[task-name]-tasks.md`
4. Continue from last checkpoint

Task name: ${1:task-name}
```

### 3.3. Dev Docs 사용법

```bash
# 새 작업 시작
/dev-docs auth-system

# Context 리셋 후 복구
/continue auth-system

# 진행 상황 업데이트
/dev-docs-update auth-system
```

---

## Phase 4: 추가 커스터마이징 (선택)

### 4.1. 새 Skill 추가

프로젝트에 특화된 새로운 skill을 추가하려면:

1. **Skill 디렉토리 생성:**
   ```bash
   mkdir -p .claude/skills/your-skill-name/resources
   ```

2. **SKILL.md 작성:**
   ```bash
   touch .claude/skills/your-skill-name/SKILL.md
   ```

3. **skill-rules.json 업데이트:**
   ```json
   {
     "skillName": "your-skill-name",
     "description": "Your skill description",
     "priority": "medium",
     "type": "suggest",
     "triggers": {
       "keywords": ["your", "keywords"],
       "intentPatterns": ["your.*pattern"],
       "filePaths": ["path/to/**/*.ts"]
     }
   }
   ```

### 4.2. Agents 추가 (선택)

전문화된 agents를 추가하려면:

```bash
mkdir -p .claude/agents
touch .claude/agents/your-agent.md
```

**예시 Agent (`.claude/agents/code-reviewer.md`):**
```markdown
You are a code architecture reviewer. Your role is to:

1. Review code for architectural consistency
2. Identify potential issues and anti-patterns
3. Suggest improvements aligned with project guidelines
4. Focus on maintainability and scalability

When reviewing code, check:
- Adherence to frontend-dev-guidelines
- TypeScript type safety
- Component composition patterns
- Performance considerations
```

### 4.3. 선택적 Hooks 추가

**TypeScript Check Hook (`.claude/hooks/tsc-check.sh`):**

이 hook은 파일 편집 후 TypeScript 에러를 자동으로 체크합니다.

⚠️ **주의:** 이 hook은 프로젝트가 클 경우 느릴 수 있습니다.

**settings.json에 추가:**
```json
{
  "Stop": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/tsc-check.sh"
        }
      ]
    }
  ]
}
```

**`.claude/hooks/tsc-check.sh` 생성:**
```bash
#!/bin/bash

# TypeScript type check
cd "$CLAUDE_WORKING_DIR"

# Blog app 체크
echo "Checking TypeScript in blog app..."
cd apps/blog
pnpm typecheck

exit 0
```

권한 부여:
```bash
chmod +x .claude/hooks/tsc-check.sh
```

---

## 검증 및 테스트

### 1. Hooks 작동 확인

Claude Code를 실행하고:

```
"Create a new button component"
```

**확인사항:**
- [ ] `skill-activation-prompt.ts`가 실행되어 "frontend-dev-guidelines" 제안
- [ ] Claude가 skill을 로드하고 가이드라인 적용

### 2. Skills 작동 확인

다양한 프롬프트로 각 skill이 적절히 활성화되는지 확인:

```
"Write a new MDX blog post about TypeScript"
→ mdx-content-guidelines 활성화 예상

"Add a new type definition for user profile"
→ typescript-quality 활성화 예상

"Deploy the blog to production"
→ build-and-deployment 활성화 예상
```

### 3. Dev Docs 시스템 확인

```
/dev-docs test-task
```

**확인사항:**
- [ ] `dev/active/test-task-plan.md` 생성됨
- [ ] `dev/active/test-task-context.md` 생성됨
- [ ] `dev/active/test-task-tasks.md` 생성됨

---

## 문제 해결

### Hook이 실행되지 않음

1. **실행 권한 확인:**
   ```bash
   ls -la .claude/hooks/
   ```
   모든 `.ts`와 `.sh` 파일이 실행 가능(`-rwxr-xr-x`)해야 합니다.

2. **settings.json 경로 확인:**
   `$CLAUDE_PROJECT_DIR` 변수가 올바른지 확인하세요.

3. **Node.js 설치 확인:**
   ```bash
   node --version
   ```

### Skill이 활성화되지 않음

1. **skill-rules.json 구문 확인:**
   ```bash
   cat .claude/skills/skill-rules.json | jq .
   ```

2. **키워드 및 패턴 확인:**
   프롬프트에 skill의 트리거 키워드가 포함되어 있는지 확인

3. **파일 경로 패턴 확인:**
   현재 작업 중인 파일이 skill의 `filePaths` 패턴과 일치하는지 확인

---

## 다음 단계

✅ Infrastructure 설정 완료 후:

1. **프로젝트별 Skills 추가**: 특정 도메인 지식이 필요한 경우
2. **Agents 활용**: 복잡한 작업에 전문화된 agents 사용
3. **Hooks 최적화**: 프로젝트 크기에 맞게 hook 성능 조정
4. **Memory MCP 통합**: 장기적인 프로젝트 결정사항 추적

---

## 참고 자료

- [Claude Code Infrastructure Showcase](https://github.com/serithemage/claude-code-infrastructure-showcase)
- [6개월 극한 사용 경험담](https://rosettalens.com/s/ko/claude-code-is-a-beast-tips-from-6-months-of-hardcore-use)
- Memory: `claude-code-infrastructure-guide` (프로젝트 메모리에 저장됨)

---

## 요약

이제 다음이 설정되었습니다:

✅ **Hooks System**: 자동 skill 활성화 및 파일 변경 추적  
✅ **Skills**: Next.js, MDX, TypeScript, Vault, Build/Deploy 가이드라인  
✅ **Dev Docs**: Context 리셋 방지 시스템  
✅ **Infrastructure**: 확장 가능한 Claude Code 워크플로우

**다음 명령으로 시작하세요:**
```
"Create a new React component for the homepage"
```

Claude가 자동으로 `frontend-dev-guidelines`를 로드하고 가이드라인에 따라 컴포넌트를 생성할 것입니다!
