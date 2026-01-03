# Session Start Command

새로운 작업 세션을 시작합니다. 현재 프로젝트 상태를 파악하고 작업을 이어갑니다.

---

## 실행 단계

### 1. 현재 작업 상태 확인 (필수)

```
Read: dev/active/CURRENT-WORK.md
```

이 파일에서 확인할 것:
- **Active Task**: 현재 진행 중인 주요 작업
- **Current Focus**: 구체적으로 해야 할 항목
- **Blockers / Notes**: 알아야 할 제약사항

### 2. Git 상태 확인

```bash
git status
git log -3 --oneline
```

- Uncommitted 변경사항 확인
- 최근 커밋 히스토리 파악

### 3. WIP 목록 확인 (선택)

```
Read: vault/projects/current-wip.md
```

- 전체 진행 중인 프로젝트 목록
- 우선순위 파악

---

## 출력 형식

상태 파악 후 다음 형식으로 요약:

```markdown
## Session Started

**현재 작업**: [CURRENT-WORK.md의 Active Task]
**진행률**: [Overall Progress에서 현재 단계]

### 이어서 할 작업
- [ ] [Current Focus의 첫 번째 미완료 항목]
- [ ] [두 번째 항목]

### 주의사항
- [Blockers / Notes에서 중요한 항목]

---
무엇부터 시작할까요?
```

---

## 중요

- 이 커맨드는 **모든 새 세션 시작 시** 실행해야 합니다
- 다른 에이전트가 작업 중이었다면 그 컨텍스트를 이어받습니다
- 불명확한 부분이 있으면 사용자에게 확인 요청
