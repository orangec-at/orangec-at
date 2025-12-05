import * as vscode from 'vscode';
import { ComponentRegistry } from '../registry/component-registry';

export class MDXCompletionProvider implements vscode.CompletionItemProvider {
  constructor(private registry: ComponentRegistry) {}

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);

    // 1. Import 문 자동완성
    if (this.isImportContext(linePrefix)) {
      return this.provideImportCompletions();
    }

    // 2. JSX 컴포넌트 태그 자동완성
    if (this.isComponentContext(linePrefix)) {
      return this.provideComponentCompletions();
    }

    // 3. 컴포넌트 속성 자동완성
    if (this.isAttributeContext(linePrefix)) {
      return this.provideAttributeCompletions(linePrefix);
    }

    return [];
  }

  /**
   * Import 문 컨텍스트 확인
   */
  private isImportContext(linePrefix: string): boolean {
    return /import\s+\{[^}]*$/.test(linePrefix) ||
           /from\s+['"][^'"]*$/.test(linePrefix);
  }

  /**
   * 컴포넌트 태그 컨텍스트 확인 (< 다음)
   */
  private isComponentContext(linePrefix: string): boolean {
    return /<[A-Z]?[a-z]*$/.test(linePrefix);
  }

  /**
   * 속성 컨텍스트 확인
   */
  private isAttributeContext(linePrefix: string): boolean {
    return /<[A-Z]\w+\s+\w*$/.test(linePrefix);
  }

  /**
   * Import 자동완성 제공
   */
  private provideImportCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    // 레지스트리의 모든 컴포넌트
    for (const name of this.registry.getComponentNames()) {
      const component = this.registry.getComponent(name);
      if (!component) continue;

      const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
      item.detail = component.nameKo;
      item.documentation = new vscode.MarkdownString(
        `**${component.name}**\n\n${component.description || ''}\n\n` +
        `카테고리: ${component.category}\n\n` +
        `\`\`\`tsx\n${component.template}\n\`\`\``
      );

      // Import 경로 제공
      if (component.importPath) {
        item.insertText = name;
        item.command = {
          command: 'mdx-editor.addImport',
          title: 'Add Import',
          arguments: [name, component.importPath]
        };
      }

      items.push(item);
    }

    return items;
  }

  /**
   * 컴포넌트 태그 자동완성 제공
   */
  private provideComponentCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const name of this.registry.getComponentNames()) {
      const component = this.registry.getComponent(name);
      if (!component) continue;

      const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
      item.detail = `${component.nameKo} (${component.category})`;

      // 자동으로 닫는 태그와 함께 삽입
      const snippet = new vscode.SnippetString();

      // 템플릿에서 자기 닫는 태그인지 확인
      if (component.template.includes('/>')) {
        snippet.appendText(`${name} `);
        snippet.appendPlaceholder('props');
        snippet.appendText(' />');
      } else {
        snippet.appendText(`${name}>`);
        snippet.appendPlaceholder('children');
        snippet.appendText(`</${name}>`);
      }

      item.insertText = snippet;
      item.documentation = new vscode.MarkdownString(
        `**${component.name}** - ${component.nameKo}\n\n` +
        (component.description ? `${component.description}\n\n` : '') +
        `\`\`\`tsx\n${component.template}\n\`\`\``
      );

      items.push(item);
    }

    return items;
  }

  /**
   * 컴포넌트 속성 자동완성 제공
   */
  private provideAttributeCompletions(linePrefix: string): vscode.CompletionItem[] {
    // 현재 컴포넌트 이름 추출
    const match = linePrefix.match(/<([A-Z]\w+)/);
    if (!match) return [];

    const componentName = match[1];
    const component = this.registry.getComponent(componentName);
    if (!component) return [];

    // 템플릿에서 props 추출 (간단한 파싱)
    const propsMatch = component.template.matchAll(/(\w+)=\{?/g);
    const items: vscode.CompletionItem[] = [];

    for (const propMatch of propsMatch) {
      const propName = propMatch[1];
      const item = new vscode.CompletionItem(propName, vscode.CompletionItemKind.Property);
      item.insertText = new vscode.SnippetString(`${propName}={$1}`);
      items.push(item);
    }

    return items;
  }
}

/**
 * 블록 스니펫 자동완성 제공
 */
export class BlockSnippetProvider implements vscode.CompletionItemProvider {
  constructor(private registry: ComponentRegistry) {}

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[]> {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);

    // 빈 줄이나 마크다운 컨텍스트에서만 블록 제안
    if (linePrefix.trim().length === 0 || /^#+\s*$/.test(linePrefix)) {
      return this.provideBlockCompletions();
    }

    return [];
  }

  private provideBlockCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];
    const blocks = this.registry.getBlocks();

    for (const block of blocks) {
      const item = new vscode.CompletionItem(
        `[Block] ${block.name}`,
        vscode.CompletionItemKind.Snippet
      );

      item.detail = block.nameKo;
      item.documentation = new vscode.MarkdownString(
        `**${block.name}** - ${block.nameKo}\n\n` +
        `카테고리: ${block.category}\n\n` +
        `\`\`\`mdx\n${block.template}\n\`\`\``
      );

      item.insertText = new vscode.SnippetString(block.template);
      item.sortText = `0_${block.category}_${block.name}`; // 카테고리별 정렬

      items.push(item);
    }

    return items;
  }
}
