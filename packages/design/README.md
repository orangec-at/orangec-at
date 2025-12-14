# @orangec-at/design/

OrangeCat 블로그 프로젝트를 위한 디자인 시스템 패키지입니다.
DPP Design System을 기반으로 구축되었습니다.

## 설치

이 패키지는 monorepo의 일부이므로 workspace를 통해 자동으로 설치됩니다.

```bash
pnpm install
```

## 사용 방법

### 기본 import

```tsx
import { Button, KRDSHeading, KRDSBody, Badge } from "@orangec-at/design/";
```

### Typography 컴포넌트

#### KRDS Typography (권장)

```tsx
import { KRDSHeading, KRDSBody, KRDSLabel } from "@orangec-at/design/";

// Headings
<KRDSHeading variant="xlarge">Extra Large Heading</KRDSHeading>
<KRDSHeading variant="large">Large Heading</KRDSHeading>
<KRDSHeading variant="medium">Medium Heading</KRDSHeading>
<KRDSHeading variant="small">Small Heading</KRDSHeading>

// Body Text
<KRDSBody variant="large">Large body text</KRDSBody>
<KRDSBody variant="medium">Medium body text</KRDSBody>
<KRDSBody variant="small">Small body text</KRDSBody>

// Labels
<KRDSLabel variant="large">Large label</KRDSLabel>
<KRDSLabel variant="medium">Medium label</KRDSLabel>
<KRDSLabel variant="small">Small label</KRDSLabel>
```

#### 기타 Typography

```tsx
import { Display, Heading, Title, Body, Detail, Label } from "@orangec-at/design/";

<Display variant="l-700">Display Large</Display>
<Heading variant="m-700">Heading Medium</Heading>
<Title variant="xl-700">Title Extra Large</Title>
<Body variant="l-400">Body Large</Body>
<Detail variant="m-400">Detail Medium</Detail>
<Label variant="s-700">Label Small Bold</Label>
```

### Button 컴포넌트

```tsx
import { Button } from "@orangec-at/design/";

// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="xsmall">X-Small</Button>
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
<Button size="xlarge">X-Large</Button>

// With Icon
<Button icon={<IconComponent />} iconPosition="left">
  Button with Icon
</Button>
```

### Badge 컴포넌트

```tsx
import { Badge } from "@orangec-at/design/";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Form 컴포넌트

```tsx
import { Input, Textarea, Checkbox, RadioGroup, Select } from "@orangec-at/design/";

// Input
<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Enter email" />

// Textarea
<Textarea placeholder="Enter description" />

// Checkbox
<Checkbox id="terms" />

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Dialog 컴포넌트

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@orangec-at/design/";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>;
```

### Accordion 컴포넌트

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@orangec-at/design/";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2</AccordionContent>
  </AccordionItem>
</Accordion>;
```

### 유틸리티 함수

```tsx
import { cn } from "@orangec-at/design/";

// Tailwind 클래스를 조건부로 병합
<div className={cn("base-class", condition && "conditional-class")} />;
```

## 사용 가능한 컴포넌트

### UI Components

- Accordion
- Alert
- Badge
- Breadcrumb
- Button
- Calendar
- Card Section
- Category Selector
- Checkbox
- Chip
- Confirm Dialog
- Content Table
- Data Table
- Date Picker
- Dialog
- Dropdown Menu
- File Upload
- Form Field
- Input
- Modal
- Notice List Table
- Page Frame
- Pagination
- Password Input
- Popover
- Radio Group
- Select
- Stepper
- Table
- Table Pagination
- Tabs
- Textarea
- Typography
- Validation Error

### Typography Components

- Display
- Heading
- Hero
- Title
- Body
- Detail
- Label
- Link
- KRDSDisplay
- KRDSHeading
- KRDSBody
- KRDSLabel
- KRDSNavigation

## 예시

실제 사용 예시는 `apps/blog/src/components/resume/design-system-example.tsx` 파일을 참고하세요.

## 스타일링

이 디자인 시스템은 Tailwind CSS를 사용합니다. Tailwind 설정이 프로젝트에 포함되어 있는지 확인하세요.

## 개발

```bash
# 타입 체크
pnpm --filter @orangec-at/design/ typecheck
```

## 라이선스

Private
