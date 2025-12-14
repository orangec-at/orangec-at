import * as vscode from 'vscode';
import { ComponentRegistry } from '../registry/component-registry';

/**
 * 블록 삽입 Quick Pick UI
 */
export async function showBlockPicker(registry: ComponentRegistry) {
  const blocks = registry.getBlocks();

  // 카테고리별로 그룹화
  const categories = new Map<string, typeof blocks>();
  blocks.forEach(block => {
    if (!categories.has(block.category)) {
      categories.set(block.category, []);
    }
    categories.get(block.category)!.push(block);
  });

  // Quick Pick 아이템 생성
  const items: vscode.QuickPickItem[] = [];

  // 각 카테고리별로 아이템 추가
  for (const [category, categoryBlocks] of categories) {
    // 카테고리 헤더
    items.push({
      label: '',
      kind: vscode.QuickPickItemKind.Separator,
      description: getCategoryLabel(category)
    });

    // 블록들
    categoryBlocks.forEach(block => {
      items.push({
        label: `$(${getIconForCategory(block.category)}) ${block.name}`,
        description: block.nameKo,
        detail: block.template.substring(0, 100).replace(/\n/g, ' '),
        // @ts-ignore - custom data
        blockId: block.id,
        blockTemplate: block.template
      });
    });
  }

  // Quick Pick 표시
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a block to insert',
    matchOnDescription: true,
    matchOnDetail: true
  });

  if (selected && 'blockTemplate' in selected) {
    insertBlockAtCursor((selected as any).blockTemplate);
  }
}

/**
 * 커서 위치에 블록 삽입
 */
function insertBlockAtCursor(template: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const position = editor.selection.active;

  editor.edit(editBuilder => {
    // 현재 줄이 비어있지 않으면 새 줄 추가
    const currentLine = editor.document.lineAt(position.line);
    const prefix = currentLine.text.trim().length > 0 ? '\n\n' : '';

    editBuilder.insert(position, prefix + template);
  });
}

/**
 * 카테고리별 라벨
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    heading: 'Headings',
    content: 'Content',
    list: 'Lists',
    section: 'Resume Sections',
    component: 'Components',
    special: 'Special'
  };
  return labels[category] || category;
}

/**
 * 카테고리별 아이콘
 */
function getIconForCategory(category: string): string {
  const icons: Record<string, string> = {
    heading: 'symbol-text',
    content: 'file-text',
    list: 'list-unordered',
    section: 'layout',
    component: 'symbol-class',
    special: 'star'
  };
  return icons[category] || 'symbol-misc';
}

/**
 * 컴포넌트 삽입 Quick Pick
 */
export async function showComponentPicker(registry: ComponentRegistry) {
  const componentNames = registry.getComponentNames();
  const items: vscode.QuickPickItem[] = [];

  for (const name of componentNames) {
    const component = registry.getComponent(name);
    if (!component) continue;

    items.push({
      label: `$(symbol-class) ${component.name}`,
      description: component.nameKo,
      detail: `Category: ${component.category}`,
      // @ts-ignore
      componentName: name,
      componentTemplate: component.template
    });
  }

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a component to insert',
    matchOnDescription: true,
    matchOnDetail: true
  });

  if (selected && 'componentTemplate' in selected) {
    insertBlockAtCursor((selected as any).componentTemplate);

    // Import 추가 제안
    const componentName = (selected as any).componentName;
    const component = registry.getComponent(componentName);
    if (component?.importPath) {
      await addImportIfMissing(componentName, component.importPath);
    }
  }
}

/**
 * Import 문이 없으면 추가
 */
async function addImportIfMissing(componentName: string, importPath: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const document = editor.document;
  const text = document.getText();

  // 이미 import 되어 있는지 확인
  const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${componentName}\\b[^}]*\\}\\s+from\\s+['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
  if (importRegex.test(text)) {
    return; // 이미 import 됨
  }

  // Import 추가 여부 묻기
  const answer = await vscode.window.showInformationMessage(
    `Add import for ${componentName}?`,
    'Yes',
    'No'
  );

  if (answer !== 'Yes') {
    return;
  }

  // 프론트매터 다음에 import 추가
  const frontmatterMatch = text.match(/^---[\s\S]*?---\n/);
  const insertPosition = frontmatterMatch
    ? document.positionAt(frontmatterMatch[0].length)
    : new vscode.Position(0, 0);

  const importStatement = `import { ${componentName} } from "${importPath}";\n`;

  await editor.edit(editBuilder => {
    editBuilder.insert(insertPosition, importStatement);
  });

  vscode.window.showInformationMessage(`Added import for ${componentName}`);
}

/**
 * Snippet Generator - snippets.json 파일 생성
 */
export function generateSnippetsJson(registry: ComponentRegistry): string {
  const snippets: Record<string, any> = {};
  const blocks = registry.getBlocks();

  blocks.forEach(block => {
    const snippetKey = `mdx-${block.id}`;
    snippets[snippetKey] = {
      prefix: [`mdx-${block.id}`, block.name.toLowerCase().replace(/\s+/g, '-')],
      body: block.template.split('\n'),
      description: `${block.name} - ${block.nameKo}`
    };
  });

  // 컴포넌트도 추가
  for (const name of registry.getComponentNames()) {
    const component = registry.getComponent(name);
    if (!component) continue;

    snippets[`component-${name}`] = {
      prefix: [`mdx-${name.toLowerCase()}`, name.toLowerCase()],
      body: component.template.split('\n'),
      description: `${component.name} - ${component.nameKo}`
    };
  }

  return JSON.stringify(snippets, null, 2);
}
