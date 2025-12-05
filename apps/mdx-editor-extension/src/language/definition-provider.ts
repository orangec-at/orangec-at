import * as vscode from 'vscode';
import { ComponentRegistry } from '../registry/component-registry';

/**
 * Go to Definition Provider
 * Cmd+클릭으로 컴포넌트 정의로 이동
 */
export class MDXDefinitionProvider implements vscode.DefinitionProvider {
  constructor(private registry: ComponentRegistry) {}

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Definition | undefined> {
    const wordRange = document.getWordRangeAtPosition(position, /[A-Z][a-zA-Z0-9]*/);
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);

    // 컴포넌트인지 확인
    const component = this.registry.getComponent(word);
    if (!component) {
      return undefined;
    }

    // 컴포넌트 파일 찾기
    const componentFile = await this.registry.findComponentFile(word);
    if (!componentFile) {
      vscode.window.showWarningMessage(`Component file not found for: ${word}`);
      return undefined;
    }

    // 파일 내에서 컴포넌트 정의 위치 찾기
    const location = await this.findComponentDefinitionInFile(componentFile, word);
    return location;
  }

  /**
   * 파일 내에서 컴포넌트 정의 위치 찾기
   */
  private async findComponentDefinitionInFile(
    filePath: string,
    componentName: string
  ): Promise<vscode.Location | undefined> {
    const document = await vscode.workspace.openTextDocument(filePath);
    const text = document.getText();

    // 여러 패턴으로 컴포넌트 정의 찾기
    const patterns = [
      // export function ComponentName
      new RegExp(`export\\s+function\\s+${componentName}\\b`, 'g'),
      // export const ComponentName =
      new RegExp(`export\\s+const\\s+${componentName}\\s*=`, 'g'),
      // function ComponentName
      new RegExp(`function\\s+${componentName}\\b`, 'g'),
      // const ComponentName =
      new RegExp(`const\\s+${componentName}\\s*=`, 'g'),
      // export { ComponentName }
      new RegExp(`export\\s*\\{[^}]*\\b${componentName}\\b`, 'g'),
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (match) {
        const position = document.positionAt(match.index);
        return new vscode.Location(document.uri, position);
      }
    }

    // 찾지 못한 경우 파일의 첫 줄로
    return new vscode.Location(document.uri, new vscode.Position(0, 0));
  }
}

/**
 * Hover Provider
 * 컴포넌트 위에 마우스를 올렸을 때 정보 표시
 */
export class MDXHoverProvider implements vscode.HoverProvider {
  constructor(private registry: ComponentRegistry) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    const wordRange = document.getWordRangeAtPosition(position, /[A-Z][a-zA-Z0-9]*/);
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);
    const component = this.registry.getComponent(word);

    if (!component) {
      return undefined;
    }

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`### ${component.name}\n\n`);
    markdown.appendMarkdown(`**${component.nameKo}**\n\n`);

    if (component.description) {
      markdown.appendMarkdown(`${component.description}\n\n`);
    }

    markdown.appendMarkdown(`**Category:** ${component.category}\n\n`);

    if (component.importPath) {
      markdown.appendCodeblock(`import { ${word} } from "${component.importPath}";`, 'typescript');
    }

    markdown.appendMarkdown('\n**Template:**\n\n');
    markdown.appendCodeblock(component.template, 'tsx');

    markdown.isTrusted = true;

    return new vscode.Hover(markdown, wordRange);
  }
}

/**
 * Document Link Provider
 * Import 경로를 클릭 가능한 링크로 만들기
 */
export class MDXDocumentLinkProvider implements vscode.DocumentLinkProvider {
  constructor(private registry: ComponentRegistry) {}

  async provideDocumentLinks(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentLink[]> {
    const links: vscode.DocumentLink[] = [];
    const text = document.getText();

    // import 문 찾기
    const importPattern = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importPattern.exec(text)) !== null) {
      const [fullMatch, imports, importPath] = match;
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + fullMatch.length);

      // @/ 경로를 실제 파일 경로로 변환
      if (importPath.startsWith('@/')) {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (workspaceRoot) {
          const relativePath = importPath.replace('@/', 'src/');
          const fullPath = vscode.Uri.file(`${workspaceRoot}/${relativePath}`);

          const link = new vscode.DocumentLink(
            new vscode.Range(startPos, endPos),
            fullPath
          );
          link.tooltip = `Go to ${importPath}`;
          links.push(link);
        }
      }
    }

    return links;
  }
}
