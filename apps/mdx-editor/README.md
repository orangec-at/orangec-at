# MDX Editor

A standalone MDX editor with real-time preview, block-based editing, and PDF export capabilities.

## Features

- 📝 Real-time MDX preview
- 🧩 Block-based content insertion
- 💾 File save/load (development mode)
- 📄 PDF export via print
- ⌨️ Keyboard shortcuts
- 🎨 Syntax highlighting
- 🌗 Dark mode support

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

The editor will be available at [http://localhost:7072](http://localhost:7072)

### Build for production

```bash
pnpm build
pnpm start
```

## Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save document
- `Cmd/Ctrl + B` - Toggle sidebar
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + Shift + F` - Format/Beautify code
- `Cmd/Ctrl + P` - Print/Export PDF

## Project Structure

```
apps/mdx-editor/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   │   └── documents/
│   │   │       ├── save/      # Save documents
│   │   │       └── preview/   # Compile MDX preview
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/       # React components
│   │   ├── document-editor.tsx
│   │   └── mdx-components.tsx
│   ├── lib/             # Utilities
│   │   ├── document-blocks.ts
│   │   └── mdx-registry.ts
│   └── types/           # TypeScript types
├── documents/           # Saved MDX files (gitignored)
└── package.json
```

## Customization

### Adding Custom Blocks

Edit `src/lib/document-blocks.ts` to add custom content blocks:

```typescript
{
  id: "my-block",
  name: "My Custom Block",
  nameKo: "나만의 블록",
  icon: "Star",
  category: "special",
  template: `## My Custom Template\n\nContent here\n`,
}
```

### Adding Custom Components

Edit `src/lib/mdx-registry.ts` to register custom MDX components:

```typescript
const COMPONENT_REGISTRY: ComponentMeta[] = [
  {
    id: "my-component",
    name: "My Component",
    nameKo: "나의 컴포넌트",
    icon: "Box",
    category: "ui",
    template: "<MyComponent>\n  Content\n</MyComponent>",
  },
];
```

## Development Notes

- File saving only works in development mode (`NODE_ENV !== "production"`)
- Saved documents are stored in the `documents/` directory
- The editor uses `next-mdx-remote` for MDX compilation
- Print styles are optimized for A4 paper size

## License

Private - Part of OrangeC monorepo
