# MDX Editor - VSCode용 고급 MDX 지원

컴포넌트 자동완성, 정의로 이동, 실시간 미리보기, 스마트 스니펫 등 MDX 파일을 TypeScript처럼 개발할 수 있게 해 주는 VSCode 확장입니다.

## ✨ 주요 기능

### 🎯 컴포넌트 자동완성
- **똑똑한 Import 제안**: `<` 를 입력하면 설명과 함께 모든 컴포넌트를 보여줍니다.
- **자동 Import**: 컴포넌트를 선택하면 import 문을 자동으로 추가합니다.
- **속성 자동완성**: 템플릿 기반으로 컴포넌트 prop 추천을 제공합니다.
- **문맥 인지**: import 문, JSX 태그, 속성마다 다른 추천을 제공합니다.

### 🔍 정의로 이동
- **Cmd+Click 이동**: 컴포넌트 정의로 바로 점프합니다.
- **호버 정보**: 호버 시 컴포넌트 상세, 템플릿, 사용 예시를 볼 수 있습니다.
- **Import 경로 링크**: import 경로를 클릭해 소스 파일을 엽니다.
- **교차 파일 지원**: 전체 컴포넌트 라이브러리를 가로질러 탐색합니다.

### 👁️ 실시간 미리보기
- **라이브 렌더링**: 타이핑하는 즉시 MDX 렌더링을 확인합니다.
- **나란히 보기**: 에디터 옆에서 프리뷰 패널이 열립니다.
- **테마 지원**: VSCode 테마(라이트/다크 모드)를 따릅니다.
- **컴포넌트 플레이스홀더**: 완전 렌더링이 어려울 때 컴포넌트 이름을 표시합니다.

### 📦 블록 스니펫
- **빠른 삽입**: `Cmd+Shift+I` 로 블록 픽커를 엽니다.
- **60개 이상의 템플릿**: 제목, 리스트, 표, 섹션 등 미리 만든 블록 제공.
- **컴포넌트 라이브러리**: 한 번의 클릭으로 전체 컴포넌트 템플릿 삽입.
- **분류 정리**: 유형별(Heading, Content, Resume, Components 등)로 구성.

## 🚀 설치

### 사전 준비
- VSCode 1.85.0 이상
- `src/lib/mdx-registry.ts`, `src/lib/document-blocks.ts` 가 있는 프로젝트

### 소스에서 설치

1. **확장을 프로젝트에 클론 또는 복사**:
   ```bash
   # 이미 apps/mdx-editor-extension/ 경로에 위치해 있습니다.
   ```

2. **의존성 설치**:
   ```bash
   cd apps/mdx-editor-extension
   npm install
   ```

3. **확장 컴파일**:
   ```bash
   npm run compile
   ```

4. **VSCode에 설치**:
   - VSCode를 열고
   - `F5` 를 눌러 Extension Development Host 실행
   - 혹은 패키징 후 설치: `npm run package` 실행 후 생성된 `.vsix` 파일 설치

## ⚙️ 설정

워크스페이스의 `.vscode/settings.json` 에 아래를 추가하세요.

```json
{
  "mdxEditor.registryPath": "src/lib/mdx-registry.ts",
  "mdxEditor.blocksPath": "src/lib/document-blocks.ts",
  "mdxEditor.previewEnabled": true
}
```

### 설정 옵션

| Setting | 기본값 | 설명 |
|---------|-------|------|
| `mdxEditor.registryPath` | `"src/lib/mdx-registry.ts"` | MDX 컴포넌트 레지스트리 경로 |
| `mdxEditor.blocksPath` | `"src/lib/document-blocks.ts"` | 문서 블록 파일 경로 |
| `mdxEditor.previewEnabled` | `true` | 실시간 미리보기 활성/비활성 |

## 🎮 사용법

### 컴포넌트 자동완성

1. **import 문에서**:
   ```mdx
   import { Re|  <-- 입력하면 컴포넌트 제안 표시
   ```

2. **JSX 태그에서**:
   ```mdx
   <Re|  <-- 입력하면 컴포넌트 제안 표시
   ```

3. **컴포넌트 속성**:
   ```mdx
   <ResumeTable |  <-- prop 제안 받기
   ```

### 정의로 이동

- 컴포넌트 이름 위에서 **Cmd+Click**(Mac) 또는 **Ctrl+Click**(Windows/Linux) 하면 정의로 이동합니다.
- 컴포넌트에 **호버**하면 문서와 템플릿을 볼 수 있습니다.

### 미리보기 패널

- 미리보기 열기: `Cmd+Shift+V`(Mac) 또는 `Ctrl+Shift+V`(Windows/Linux)
- 에디터 타이틀 바의 미리보기 아이콘을 클릭해도 됩니다.
- 입력 시 자동으로 갱신됩니다(500ms 디바운스).

### 블록 삽입

- 빠른 픽커: `Cmd+Shift+I`(Mac) 또는 `Ctrl+Shift+I`(Windows/Linux)
- 혹은 "MDX: Insert Block" 명령 실행
- 분류된 블록/컴포넌트 목록에서 선택

## 📋 명령어

| Command | 단축키 | 설명 |
|---------|--------|------|
| `MDX: Open Preview` | `Cmd+Shift+V` | 나란히 프리뷰 패널 열기 |
| `MDX: Insert Block` | `Cmd+Shift+I` | 블록 픽커 열기 |
| `MDX: Refresh Component Registry` | - | 컴포넌트 정의 새로고침 |
| `MDX: Generate Snippets` | - | snippets.json 생성(개발용) |

## 🏗️ 구조

```
mdx-editor-extension/
├── src/
│   ├── extension.ts              # 메인 진입점
│   ├── registry/
│   │   └── component-registry.ts # mdx-registry.ts 파싱
│   ├── language/
│   │   ├── completion-provider.ts  # 자동완성
│   │   └── definition-provider.ts  # 정의로 이동
│   ├── preview/
│   │   └── preview-panel.ts      # Webview 프리뷰
│   └── snippets/
│       └── block-snippets.ts     # 블록 삽입
├── syntaxes/
│   └── mdx.tmLanguage.json       # 문법 하이라이트
└── media/
    └── preview.css               # 프리뷰 스타일
```

## 🔧 개발

### 소스에서 빌드

```bash
# 의존성 설치
npm install

# TypeScript 컴파일
npm run compile

# 워치 모드(자동 재컴파일)
npm run watch

# .vsix 패키징
npm run package
```

### 테스트

1. VSCode에서 `F5` 를 눌러 Extension Development Host 실행
2. 워크스페이스의 MDX 파일을 엽니다.
3. 기능을 테스트하세요:
   - `<` 를 입력해 자동완성 확인
   - 컴포넌트에서 Cmd+Click
   - `Cmd+Shift+V` 로 프리뷰 열기
   - `Cmd+Shift+I` 로 블록 삽입

### 디버깅

- TypeScript 파일에 브레이크포인트를 설정하세요.
- `console.log()` 는 Debug Console에 출력됩니다.
- "Extension Host" 출력 채널에서 로그를 확인하세요.

## 🧩 프로젝트와의 통합

이 확장은 다음 구성을 가진 프로젝트와 함께 작동하도록 설계되었습니다.

1. **컴포넌트 레지스트리** (`src/lib/mdx-registry.ts`):
   ```typescript
   export const MDX_COMPONENT_REGISTRY = {
     ComponentName: {
       component: ComponentImplementation,
       meta: {
         id: "component-id",
         name: "Component Name",
         nameKo: "컴포넌트 이름",
         category: "ui",
         template: `<ComponentName />`
       }
     }
   };
   ```

2. **문서 블록** (`src/lib/document-blocks.ts`):
   ```typescript
   export const DOCUMENT_BLOCKS = [
     {
       id: "block-id",
       name: "Block Name",
       nameKo: "블록 이름",
       icon: "IconName",
       category: "content",
       template: "## Heading\n\nContent"
     }
   ];
   ```

## 📝 지원되는 기능

- ✅ JSX 태그에서 컴포넌트 자동완성
- ✅ import 문 자동완성
- ✅ 정의로 이동(Cmd+Click)
- ✅ 호버 문서
- ✅ 실시간 미리보기
- ✅ 퀵 픽으로 블록 스니펫
- ✅ 자동 Import 제안
- ✅ 문법 하이라이트
- ✅ import 내 문서 링크
- 🔜 컴포넌트 props IntelliSense
- 🔜 진단/오류 검사
- 🔜 리팩터링 지원

## 🤝 기여하기

이 확장은 `@orangec-at` 모노레포의 일부입니다. 기여하려면:

1. `apps/mdx-editor-extension/`에서 변경을 만듭니다.
2. `F5`(Extension Development Host)로 테스트합니다.
3. `npm run compile` 로 빌드합니다.
4. Pull Request를 제출합니다.

## 📄 라이선스

MIT

## 🙏 감사의 말

다음으로 제작되었습니다:
- VSCode Extension API
- TypeScript
- next-mdx-remote (프리뷰 컴파일)
- 공식 MDX TextMate 문법의 MDX syntax

---

**TypeScript 같은 개발 경험으로 MDX를 즐기세요! 🚀**
