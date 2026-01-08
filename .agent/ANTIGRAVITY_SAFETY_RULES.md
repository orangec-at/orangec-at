# ANTIGRAVITY CORE SAFETY RULES (DO NOT DELETE)

> **CRITICAL**: 이 규칙은 모든 작업 수행 시 **최우선 순위**로 고려되어야 한다. 사용자의 명시적인 승인 없이 이 규칙을 위반해서는 안 된다.

---

## PART 1: 절대 금지 (NEVER DO)

### 1.1 데이터 보존의 원칙 (NO DELETION WITHOUT BACKUP)
- **금지 행위**: 
  - `rm`, `rm -rf`, `rmdir` 등의 삭제 명령어를 **절대** 자동으로 실행하지 말 것.
  - `mv` 명령어로 대량의 폴더를 이동하거나 덮어쓰지 말 것.
- **보호 폴더** (절대 건드리지 말 것):
  - `.claude/` - OpenCode/Claude 설정
  - `.git/` - Git 저장소
  - `.env*` - 환경 변수
  - `vault/` - Second Brain (개인 노트)
  - `.serena/` - Serena memories
- **의무 사항**:
  - 파일을 수정하거나 구조를 변경해야 한다면, 항상 **백업(Backup)**을 먼저 생성할 것. (예: `cp -r .folder .folder_backup`)
  - Git 추적(Tracking)이 되지 않은 파일이 존재할 가능성을 항상 염두에 둘 것.

### 1.2 기존 설정 존중 (RESPECT LEGACY)
- 사용자 프로젝트에 이미 존재하는 설정 파일(`.claude`, `.vscode` 등)을 "내 방식대로" 바꾸거나 삭제하지 말 것.
- 새로운 기능을 추가할 때는 **기존 파일과 충돌하지 않는 새로운 경로**를 사용할 것.

### 1.3 사용자 승인 강화 (EXPLICIT APPROVAL)
- 구조 변경, 파일 삭제, 대규모 이동 작업은 반드시 사용자에게 **구체적인 변경 목록(Change List)**을 보여주고 승인을 받을 것.
- "이거 지워도 돼?"라고 묻기 전에는 절대 지우지 말 것.

---

## PART 2: 작업 전 필수 체크 (MUST DO BEFORE WORK)

### 2.1 컨텍스트 파악
```bash
# 1. 현재 작업 상태 확인 (필수)
Read: dev/active/CURRENT-WORK.md

# 2. Git 상태 확인
git status

# 3. 관련 메모리 확인 (선택)
ls .serena/memories/
```

### 2.2 프로젝트 구조 이해
```
orangec-at/
├── .agent/              # 너(Antigravity)의 설정
├── .claude/             # OpenCode 설정 (건드리지 말 것!)
├── apps/                # 실제 프로젝트들
├── vault/               # Second Brain
│   └── content/outputs/ # 콘텐츠 생성물 저장 위치
├── dev/active/          # 활성 작업 상태
└── docs/                # 문서
```

---

## PART 3: 코드 작업 가이드라인 (CODE WORK)

### 3.1 타입 안전성
- `as any`, `@ts-ignore`, `@ts-expect-error` **절대 금지**
- 타입 에러 발생 시 → 제대로 타입 정의할 것

### 3.2 기존 패턴 따르기
- 새 패턴 도입 전에 기존 코드 패턴 확인
- 불필요한 리팩토링 금지
- 버그 수정 시 최소한의 변경만

### 3.3 작업 완료 후
```bash
# 빌드 확인
pnpm build

# 타입 체크
pnpm typecheck
```

---

## PART 4: 콘텐츠 작업 가이드라인 (CONTENT WORK)

### 4.1 생성물 저장 위치
- **모든 콘텐츠 생성물**: `vault/content/outputs/`
- brief.md, blog.md, newsletter.md, sns.md 등

### 4.2 스타일 가이드
- `.agent/STYLE-GUIDE.md` 참조
- 톤앤매너: 친근하고 실용적
- 금지 단어: 혁신적인, 획기적인, 놀라운

---

## PART 5: 복구 대책 (RECOVERY PLAN)

위험한 작업(Destructive Action)을 수행하기 전:
1. 변경될 파일 목록 작성
2. 실패 시 복구 방법 계획
3. 사용자 승인 받기
4. 백업 생성
5. 그 다음에야 실행

---

## Quick Reference

| 상황 | 해야 할 것 | 하지 말 것 |
|------|-----------|-----------|
| 새 작업 시작 | `dev/active/CURRENT-WORK.md` 읽기 | 바로 코드 수정 |
| 파일 삭제 필요 | 사용자 승인 받기 | `rm` 바로 실행 |
| 타입 에러 | 제대로 타입 정의 | `as any` 사용 |
| 구조 변경 | 변경 목록 보여주기 | 그냥 실행 |
| 콘텐츠 생성 | `vault/content/outputs/`에 저장 | 루트에 저장 |
