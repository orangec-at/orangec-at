# Control Center Component

모듈화된 iOS 스타일의 제어센터 컴포넌트입니다. 각 컨트롤 아이템을 쉽게 추가, 수정, 제거할 수 있습니다.

## 구조

```
control-center/
├── control-center.tsx      # 메인 컴포넌트
├── control-center-trigger.tsx # 트리거 버튼
├── types.ts               # 타입 정의
├── config.tsx            # 기본 설정
├── items/                # 개별 아이템 컴포넌트들
│   ├── index.tsx
│   ├── connectivity-item.tsx
│   ├── media-item.tsx  
│   ├── theme-item.tsx
│   ├── quick-action-item.tsx
│   ├── slider-item.tsx
│   └── info-item.tsx
└── README.md
```

## 사용법

### 기본 사용

```tsx
import { ControlCenterTrigger } from "@/components/control-center/control-center-trigger";

export function App() {
  return (
    <div>
      <ControlCenterTrigger />
    </div>
  );
}
```

### 컨트롤 아이템 커스터마이징

`src/components/control-center/config.tsx` 파일을 수정하여 아이템을 추가/제거/수정할 수 있습니다:

```tsx
export const defaultControlCenterConfig: ControlCenterConfig = {
  items: [
    {
      id: "my-custom-action",
      type: "quick-action",
      size: "small", 
      title: "Custom Action",
      enabled: true,
      order: 10,
      icon: <MyIcon />,
      onClick: () => console.log("Custom action clicked!"),
    },
    // ... 기존 아이템들
  ],
};
```

## 아이템 타입

### 1. Connectivity Item (연결성)
여러 개의 연결 상태를 그룹으로 표시합니다.

```tsx
{
  id: "connectivity",
  type: "connectivity", 
  size: "large", // 4 columns
  items: [
    {
      id: "wifi",
      name: "WiFi",
      icon: <Wifi />,
      connected: true,
      onClick: () => toggleWifi(),
    }
  ]
}
```

### 2. Media Item (미디어)
현재 재생 중인 미디어를 표시합니다.

```tsx
{
  id: "media",
  type: "media",
  size: "medium", // 2 columns
  isPlaying: true,
  currentTrack: "Song Name - Artist",
  onClick: () => openMusicApp(),
}
```

### 3. Theme Item (테마)
다크/라이트 모드를 전환합니다.

```tsx
{
  id: "theme", 
  type: "theme",
  size: "large", // 4 columns
  currentTheme: "system",
  onThemeChange: (theme) => setTheme(theme),
}
```

### 4. Quick Action Item (빠른 동작)
단일 동작 버튼입니다.

```tsx
{
  id: "camera",
  type: "quick-action",
  size: "small", // 1 column
  icon: <Camera />,
  active: false,
  onClick: () => openCamera(),
}
```

### 5. Slider Item (슬라이더)
값을 표시하거나 조절하는 슬라이더입니다.

```tsx
{
  id: "volume",
  type: "slider", 
  size: "medium", // 2 columns
  icon: <Volume />,
  value: 65,
  max: 100,
  unit: "%",
  color: "bg-blue-500",
  onChange: (value) => setVolume(value),
}
```

### 6. Info Item (정보)
단순 텍스트 정보를 표시합니다.

```tsx
{
  id: "info",
  type: "info",
  size: "wide", // 6 columns (full width)
  content: "⌘⇧C로 열기 • ESC로 닫기",
}
```

## 사이즈 옵션

- `small`: 1 column (예: 빠른 동작 버튼)
- `medium`: 2 columns (예: 슬라이더)
- `large`: 4 columns (예: 연결성, 테마)
- `wide`: 6 columns (예: 정보 표시)

## 커스터마이징 팁

1. **새로운 아이템 타입 추가**: `types.ts`에 새 타입을 정의하고 `items/` 폴더에 컴포넌트를 만든 후 `items/index.tsx`에 등록

2. **아이템 순서 변경**: `config.tsx`에서 `order` 속성 수정

3. **아이템 활성화/비활성화**: `enabled` 속성으로 제어

4. **레이아웃 조정**: `layout.columns`, `layout.gap` 등으로 전체 레이아웃 조정

5. **테마 대응**: 모든 컴포넌트는 shadcn/ui의 시맨틱 컬러를 사용하여 자동으로 다크모드 지원

## 키보드 단축키

- `⌘⇧C`: Control Center 열기/닫기
- `ESC`: Control Center 닫기