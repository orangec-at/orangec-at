# Session End Command

작업 세션을 종료하고 다음 세션을 위해 상태를 저장합니다.

---

## 실행 단계

### 1. 현재 작업 상태 요약

작업한 내용을 정리:
- 완료한 항목
- 진행 중인 항목
- 발견한 이슈/블로커

### 2. CURRENT-WORK.md 업데이트

```
Edit: dev/active/CURRENT-WORK.md
```

업데이트할 섹션:
1. **Last Updated**: 현재 시간 (KST)
2. **Updated By**: 현재 세션/에이전트 정보
3. **Current Focus**: 완료 항목 `[x]` 체크, 새 항목 추가
4. **Blockers / Notes**: 새로운 이슈 추가
5. **Key Files & Decisions**: 중요 변경사항 기록

### 3. Git 상태 확인

```bash
git status
git diff --stat
```

- Uncommitted 변경사항 목록
- 커밋 필요 여부 사용자에게 알림

---

## 출력 형식

```markdown
## Session Ended

**작업 시간**: [시작 ~ 종료]
**업데이트됨**: dev/active/CURRENT-WORK.md

### 완료한 작업
- [x] [완료 항목 1]
- [x] [완료 항목 2]

### 진행 중 (다음 세션에서 계속)
- [ ] [미완료 항목]

### Uncommitted Changes
- [파일 목록]

---
커밋을 생성할까요? (y/n)
```

---

## 중요

- **세션 종료 전 반드시 실행**하여 컨텍스트 손실 방지
- CURRENT-WORK.md 업데이트 없이 세션 종료 금지
- 다음 에이전트/세션이 이어받을 수 있도록 충분한 정보 기록
