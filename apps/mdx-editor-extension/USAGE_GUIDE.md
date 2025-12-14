# MDX Editor Extension - 사용 가이드

## 🚀 빠른 시작

### 1. Extension 설치 및 실행

```bash
# Extension 디렉토리로 이동
cd apps/mdx-editor-extension

# 의존성 설치
npm install

# TypeScript 컴파일
npm run compile

# VSCode에서 Extension 개발 모드 실행
# VSCode에서 F5 키를 누르거나
# Run > Start Debugging 선택
```

### 2. Extension 개발 호스트에서 테스트

1. **F5** 키를 누르면 새 VSCode 창이 열립니다 (Extension Development Host)
2. 이 창에서 workspace 폴더를 엽니다 (현재 프로젝트 루트)
3. MDX 파일을 엽니다 (예: `apps/blog/documents/resumes/dunamu.mdx`)
4. 기능을 테스트합니다!

## ✨ 주요 기능 사용법

### 1. Component Autocomplete (컴포넌트 자동완성)

#### Import 문에서 자동완성
```mdx
import { Re|  ← 여기서 자동완성 트리거
```
- `Re`를 입력하면 `ResumeTable`, `ResumeSection` 등이 제안됩니다
- 선택하면 자동으로 import 경로가 추가됩니다

#### JSX 태그에서 자동완성
```mdx
<Re|  ← 여기서 자동완성 트리거
```
- `<Re`를 입력하면 컴포넌트 목록이 나타납니다
- 선택하면 닫는 태그도 자동으로 추가됩니다

#### 컴포넌트 Props 자동완성
```mdx
<ResumeTable |  ← 여기서 속성 자동완성
```

### 2. Go to Definition (정의로 이동)

```mdx
<ResumeTable>  ← Cmd+클릭하면 컴포넌트 정의로 이동
  ...
</ResumeTable>
```

- **Mac**: `Cmd+클릭`
- **Windows/Linux**: `Ctrl+클릭`
- 컴포넌트 정의 파일이 열립니다 (`apps/blog/src/components/resume/index.ts`)

### 3. Hover Documentation (호버 문서)

```mdx
<ResumeTable>  ← 마우스를 올리면 문서 표시
```

컴포넌트 위에 마우스를 올리면:
- 컴포넌트 이름과 설명
- 카테고리 정보
- Import 경로
- 템플릿 예제

### 4. Real-Time Preview (실시간 미리보기)

#### 미리보기 열기
- **단축키**: `Cmd+Shift+V` (Mac) / `Ctrl+Shift+V` (Windows/Linux)
- **메뉴**: Command Palette (`Cmd+Shift+P`) > "MDX: Open Preview"
- **아이콘**: 에디터 우측 상단의 미리보기 아이콘 클릭

#### 미리보기 특징
- 파일을 수정하면 자동으로 업데이트 (500ms 디바운스)
- VSCode 테마 자동 적용 (다크/라이트 모드)
- 컴포넌트는 placeholder로 표시됩니다

### 5. Block Snippets (블록 스니펫)

#### Quick Pick으로 블록 삽입
- **단축키**: `Cmd+Shift+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
- **메뉴**: Command Palette > "MDX: Insert Block"

#### 사용 가능한 블록 카테고리
1. **Headings** - 제목 (H1, H2, H3)
2. **Content** - 문단, 볼드, 인용문
3. **Lists** - 글머리 기호, 번호 목록
4. **Resume Sections** - 기본 정보, 경력, 프로젝트, 학력
5. **Components** - ResumeTable, Card, Button 등 60+ 컴포넌트
6. **Special** - STAR 기법, 지원 동기 등

#### 컴포넌트 삽입 시 자동 Import
블록 삽입 후 해당 컴포넌트에 import가 필요하면 자동으로 제안합니다.

## 🔧 설정

### Workspace 설정
`.vscode/settings.json`:
```json
{
  "mdxEditor.registryPath": "src/lib/mdx-registry.ts",
  "mdxEditor.blocksPath": "src/lib/document-blocks.ts",
  "mdxEditor.previewEnabled": true
}
```

### 경로 변경
프로젝트 구조가 다르면 경로를 수정하세요:
```json
{
  "mdxEditor.registryPath": "apps/blog/src/lib/mdx-registry.ts",
  "mdxEditor.blocksPath": "apps/blog/src/lib/document-blocks.ts"
}
```

## 🎯 실전 예제

### 예제 1: 이력서 작성

1. **새 MDX 파일 생성**:
   ```bash
   apps/blog/documents/resumes/my-resume.mdx
   ```

2. **프론트매터 추가**:
   ```mdx
   ---
   title: "내 이력서"
   type: "resume"
   status: "draft"
   ---
   ```

3. **블록 삽입** (`Cmd+Shift+I`):
   - "Info Section" 선택 → 기본 정보 템플릿 삽입
   - "Career Section" 선택 → 경력 템플릿 삽입

4. **컴포넌트 사용**:
   ```mdx
   <ResumeTable>  ← 자동완성으로 삽입
     <tbody>
       <Tr>
         <TdLabel>이름</TdLabel>
         <TdValue>홍길동</TdValue>
       </Tr>
     </tbody>
   </ResumeTable>
   ```

5. **미리보기** (`Cmd+Shift+V`)로 확인

### 예제 2: 컴포넌트 Import

1. **자동완성으로 컴포넌트 선택**:
   ```mdx
   <Badge|  ← 자동완성 트리거
   ```

2. **Import 추가 제안**:
   - 컴포넌트를 삽입하면 "Add import?" 메시지 표시
   - "Yes" 선택

3. **자동으로 추가됨**:
   ```mdx
   import { Badge } from "@/components/ui/badge";

   <Badge variant="default">뱃지</Badge>
   ```

## 🐛 디버깅

### Extension 로그 확인
1. Extension Development Host에서
2. View > Output
3. "Extension Host" 선택
4. `console.log()` 출력 확인

### Registry 새로고침
컴포넌트를 추가/수정한 후:
```
Cmd+Shift+P > MDX: Refresh Component Registry
```

### 일반적인 문제 해결

#### "Registry file not found" 경고
- `.vscode/settings.json`에서 `mdxEditor.registryPath` 확인
- 경로가 workspace root 기준인지 확인

#### 자동완성이 작동하지 않음
1. Extension이 활성화되었는지 확인 (Output 패널)
2. Registry가 로드되었는지 확인
3. 파일 확장자가 `.mdx`인지 확인

#### 미리보기가 업데이트되지 않음
- 파일을 저장했는지 확인 (`Cmd+S`)
- 미리보기를 닫고 다시 열기
- Extension Development Host 재시작 (F5)

## 📦 Extension 패키징

### VSIX 파일 생성
```bash
# 패키지 빌드
npm run package

# 생성된 파일
mdx-editor-0.1.0.vsix
```

### 로컬 설치
```bash
code --install-extension mdx-editor-0.1.0.vsix
```

### Marketplace 배포 (선택사항)
```bash
# vsce 로그인
vsce login orangec-at

# 배포
vsce publish
```

## 🔍 고급 기능

### 1. 커스텀 블록 추가

`src/lib/document-blocks.ts`에 새 블록 추가:
```typescript
{
  id: "my-custom-block",
  name: "My Custom Block",
  nameKo: "내 커스텀 블록",
  icon: "Star",
  category: "special",
  template: `## Custom Section\n\nContent here\n\n`
}
```

Registry 새로고침하면 바로 사용 가능!

### 2. 커스텀 컴포넌트 추가

`src/lib/mdx-registry.ts`에 컴포넌트 등록:
```typescript
MyComponent: {
  component: MyComponent,
  meta: {
    id: "my-component",
    name: "My Component",
    nameKo: "내 컴포넌트",
    category: "ui",
    template: `<MyComponent prop="value" />`
  }
}
```

### 3. Snippets JSON 생성

개발 도구로 snippets.json 파일 생성:
```
Cmd+Shift+P > MDX: Generate Snippets
```

생성된 JSON을 `snippets/mdx-blocks.json`에 저장하면 네이티브 스니펫으로도 사용 가능!

## 💡 팁과 트릭

### 1. 빠른 컴포넌트 삽입
- `<`만 입력해도 자동완성이 트리거됩니다
- 컴포넌트 이름의 일부만 입력해도 검색됩니다

### 2. 키보드 단축키 활용
- `Cmd+Shift+V`: 미리보기 토글
- `Cmd+Shift+I`: 블록 삽입
- `Cmd+Click`: 정의로 이동

### 3. Multi-Cursor 활용
여러 컴포넌트를 동시에 수정할 때:
```mdx
<Badge>텍스트1</Badge>
<Badge>텍스트2</Badge>
<Badge>텍스트3</Badge>
```
`Badge`를 선택하고 `Cmd+D`로 multi-cursor 활성화

### 4. Format on Save
`.vscode/settings.json`:
```json
{
  "[mdx]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 🎓 학습 자료

### Extension 개발 참고
- [VSCode Extension API](https://code.visualstudio.com/api)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [MDX Documentation](https://mdxjs.com/)

### 프로젝트 관련
- `apps/blog/src/lib/mdx-registry.ts` - 컴포넌트 레지스트리
- `apps/blog/src/lib/document-blocks.ts` - 블록 정의
- `apps/blog/src/components/` - 실제 컴포넌트 구현

---

**Happy MDX Writing! 🚀**

문제가 있거나 기능 요청이 있으면 이슈를 생성해주세요!
