# OrangeC-AT 프로젝트 운용 가이드

> **목적**: 이 레포지토리를 lifeOS로 운용하기 위한 통합 가이드

---

## 1. 프로젝트 개요

```
orangec-at/
├── .agent/              # Antigravity IDE (Gemini)
├── .claude/             # OpenCode (Claude/Codex)
├── .serena/             # Serena memories (동기화 가능)
├── apps/                # 실제 프로젝트들
│   ├── blog/            # 메인 블로그/포트폴리오
│   ├── mdx-editor/      # MDX 에디터
│   └── product-life-dashboard/
├── vault/               # Second Brain
│   ├── career/          # 이력서, JD 분석
│   ├── content/outputs/ # 생성된 콘텐츠
│   ├── goals/           # 목표 관리
│   ├── journal/         # 저널
│   └── wins/            # 성취 기록
├── dev/active/          # 활성 작업 상태
│   └── CURRENT-WORK.md  # 핵심! 모든 에이전트가 읽어야 함
├── docs/                # 프로젝트 문서
└── services/            # RAG 등 서비스
```

---

## 2. Multi-Agent 운용

### 2.1 OpenCode (Claude/Codex) - 터미널

**용도**: 코드 작업, 아키텍처, 복잡한 로직

```bash
# 세션 시작
opencode

# LLM 전환 (토큰 소진 시)
# Claude → Codex → Gemini 순서로 fallback
```

**특징**:
- Sisyphus 에이전트 (오케스트레이션)
- 서브에이전트 위임 (explore, librarian, oracle 등)
- Todo 추적 hook
- Serena memory 연동

### 2.2 Antigravity IDE (Gemini)

**용도**: IDE 내 작업, 콘텐츠 생성

**설정 위치**: `.agent/`

**콘텐츠 생성 워크플로우**:
```
1. URL 분석 → planner.md
2. 브리프 생성 → vault/content/outputs/brief.md
3. 콘텐츠 생성 → vault/content/outputs/
   - blog.md
   - newsletter.md
   - sns.md
```

**주의사항**: `.agent/ANTIGRAVITY_SAFETY_RULES.md` 필독

### 2.3 Serena (Cross-session Memory)

**용도**: 세션 간 컨텍스트 유지

**위치**: `.serena/memories/`

**동기화 가능**: 
- `.serena/memories/`만 git에 포함하면 다른 환경에서 memory 공유 가능
- `.serena/cache/`는 gitignore 유지 (로컬 캐시)

---

## 3. 세션 연속성 프로토콜

### 3.1 세션 시작 시 (모든 에이전트 공통)

```markdown
1. CURRENT-WORK.md 읽기
   Read: dev/active/CURRENT-WORK.md

2. Git 상태 확인
   git status
   git diff --stat HEAD~1

3. (선택) Serena memories 확인
   ls .serena/memories/
```

### 3.2 세션 종료/중단 시

```markdown
1. CURRENT-WORK.md 업데이트
   - Last Updated 타임스탬프 갱신
   - Updated By 세션 정보 기록
   - 완료 항목 체크 [x]
   - 다음 세션 노트 추가

2. Commit 전 확인
   - 작업 완료 시에만 commit
   - 중간 상태 commit 금지
```

---

## 4. 콘텐츠 생성 워크플로우

### 4.1 Antigravity 콘텐츠 팀

```
content-marketing-team.md (오케스트레이터)
├── planner.md           → brief.md 생성
├── blog-writer.md       → blog.md 생성
├── newsletter-writer.md → newsletter.md 생성
├── thread-writer.md     → sns.md (Twitter)
├── linkedin-writer.md   → sns.md (LinkedIn)
└── reviewer.md          → review-report.md
```

### 4.2 생성물 저장 위치

```
vault/content/outputs/
├── brief.md          # 콘텐츠 브리프
├── blog.md           # 블로그 포스트
├── newsletter.md     # 뉴스레터
├── sns.md            # SNS 콘텐츠
└── review-report.md  # 검수 리포트
```

---

## 5. 데이터 보호 규칙

### 5.1 보호 폴더 (절대 건드리지 말 것)

| 폴더 | 용도 |
|------|------|
| `.claude/` | OpenCode 설정 |
| `.agent/` | Antigravity 설정 |
| `.git/` | Git 저장소 |
| `.serena/` | Serena memories |
| `vault/` | Second Brain |

### 5.2 삭제/이동 시 필수 절차

1. 변경 목록 작성
2. 사용자 승인 받기
3. 백업 생성
4. 실행

---

## 6. 개발 명령어

```bash
# 전체 개발 서버
pnpm dev

# 블로그만 실행
pnpm --filter blog dev

# 빌드
pnpm build

# 타입 체크
pnpm typecheck
```

---

## 7. Serena 동기화 설정 (다른 컴퓨터에서 사용 시)

### 현재 상태
- `.serena/` 전체가 gitignore에 포함됨

### 동기화하려면

`.gitignore` 수정:
```diff
- .serena/
+ .serena/cache/
```

이렇게 하면:
- ✅ `.serena/memories/` - Git에 포함 (동기화됨)
- ✅ `.serena/project.yml` - Git에 포함 (설정 공유)
- ❌ `.serena/cache/` - Git 제외 (로컬 캐시)

**주의**: memories에 민감한 정보가 있으면 동기화 전 확인 필요

---

## 8. Quick Reference

### 파일별 역할

| 파일 | 역할 | 업데이트 주기 |
|------|------|--------------|
| `dev/active/CURRENT-WORK.md` | 현재 작업 상태 | 매 세션 |
| `.claude/skills/core-strategist.md` | 행동 패턴 가이드 | 컨텍스트 변경 시 |
| `vault/goals/` | 목표/우선순위 | 주간/월간 |
| `vault/journal/` | 일일 기록 | 일간 |

### Agent별 책임

| Agent | 주 용도 | 참조 설정 |
|-------|---------|----------|
| OpenCode (Claude) | 코드, 아키텍처 | `.claude/` |
| OpenCode (Codex) | 코드 (fallback) | `.claude/` |
| Antigravity (Gemini) | IDE 작업, 콘텐츠 | `.agent/` |
| Serena | Memory 관리 | `.serena/` |

---

## 9. 트러블슈팅

### Q: Antigravity가 .claude 폴더를 건드렸어요
A: `.agent/ANTIGRAVITY_SAFETY_RULES.md` 확인. Git에서 복구: `git checkout .claude/`

### Q: 다른 컴퓨터에서 메모리가 없어요
A: `.gitignore`에서 `.serena/` 대신 `.serena/cache/`만 제외하도록 수정

### Q: 토큰이 다 떨어졌어요
A: `.claude/rules/model-fallback.md` 규칙에 따라 Claude → Codex → Gemini 순서로 전환

---

*Last Updated: 2026-01-08*
