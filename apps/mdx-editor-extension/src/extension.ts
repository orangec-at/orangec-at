import * as vscode from 'vscode';
import { ComponentRegistry } from './registry/component-registry';
import { MDXCompletionProvider, BlockSnippetProvider } from './language/completion-provider';
import { MDXDefinitionProvider, MDXHoverProvider, MDXDocumentLinkProvider } from './language/definition-provider';
import { MDXPreviewPanel } from './preview/preview-panel';
import { showBlockPicker, showComponentPicker, generateSnippetsJson } from './snippets/block-snippets';

let registry: ComponentRegistry;

/**
 * Extension 활성화
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('MDX Editor extension is now active!');

  // 워크스페이스 루트 확인
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('Please open a workspace to use MDX Editor features');
    return;
  }

  // 컴포넌트 레지스트리 초기화
  registry = new ComponentRegistry(workspaceFolder.uri.fsPath);

  try {
    await registry.loadRegistry();
    vscode.window.showInformationMessage('MDX Editor: Registry loaded successfully');
  } catch (error) {
    console.error('Failed to load registry:', error);
    vscode.window.showWarningMessage('MDX Editor: Failed to load component registry');
  }

  // Language Features 등록
  registerLanguageFeatures(context);

  // Commands 등록
  registerCommands(context);

  // Document 변경 감지 (미리보기 업데이트)
  registerDocumentListeners(context);

  console.log('MDX Editor: All features registered');
}

/**
 * Language Features 등록
 */
function registerLanguageFeatures(context: vscode.ExtensionContext) {
  const mdxSelector: vscode.DocumentSelector = { language: 'mdx', scheme: 'file' };

  // 1. Completion Provider (자동완성)
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    mdxSelector,
    new MDXCompletionProvider(registry),
    '<', '{', ' ', '"', "'"
  );

  // 2. Block Snippet Provider
  const blockSnippetProvider = vscode.languages.registerCompletionItemProvider(
    mdxSelector,
    new BlockSnippetProvider(registry),
    '\n'
  );

  // 3. Definition Provider (Go to Definition)
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    mdxSelector,
    new MDXDefinitionProvider(registry)
  );

  // 4. Hover Provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    mdxSelector,
    new MDXHoverProvider(registry)
  );

  // 5. Document Link Provider
  const linkProvider = vscode.languages.registerDocumentLinkProvider(
    mdxSelector,
    new MDXDocumentLinkProvider(registry)
  );

  context.subscriptions.push(
    completionProvider,
    blockSnippetProvider,
    definitionProvider,
    hoverProvider,
    linkProvider
  );
}

/**
 * Commands 등록
 */
function registerCommands(context: vscode.ExtensionContext) {
  // 1. 미리보기 열기
  const previewCommand = vscode.commands.registerCommand('mdx-editor.preview', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'mdx') {
      vscode.window.showWarningMessage('Please open an MDX file first');
      return;
    }

    MDXPreviewPanel.createOrShow(context.extensionUri, editor.document);
  });

  // 2. 블록 삽입
  const insertBlockCommand = vscode.commands.registerCommand('mdx-editor.insertBlock', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'mdx') {
      vscode.window.showWarningMessage('Please open an MDX file first');
      return;
    }

    await showBlockPicker(registry);
  });

  // 3. 컴포넌트 삽입
  const insertComponentCommand = vscode.commands.registerCommand('mdx-editor.insertComponent', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'mdx') {
      vscode.window.showWarningMessage('Please open an MDX file first');
      return;
    }

    await showComponentPicker(registry);
  });

  // 4. 레지스트리 새로고침
  const refreshRegistryCommand = vscode.commands.registerCommand('mdx-editor.refreshRegistry', async () => {
    try {
      await registry.loadRegistry();
      vscode.window.showInformationMessage('MDX Editor: Registry refreshed');
    } catch (error) {
      vscode.window.showErrorMessage('Failed to refresh registry: ' + error);
    }
  });

  // 5. Import 추가 (internal command)
  const addImportCommand = vscode.commands.registerCommand(
    'mdx-editor.addImport',
    async (componentName: string, importPath: string) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const document = editor.document;
      const text = document.getText();

      // 이미 import 되어 있는지 확인
      const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${componentName}\\b`);
      if (importRegex.test(text)) {
        return; // 이미 import 됨
      }

      // 프론트매터 이후 첫 줄에 import 추가
      const frontmatterMatch = text.match(/^---[\s\S]*?---\n/);
      const insertPosition = frontmatterMatch
        ? document.positionAt(frontmatterMatch[0].length)
        : new vscode.Position(0, 0);

      await editor.edit(editBuilder => {
        editBuilder.insert(insertPosition, `import { ${componentName} } from "${importPath}";\n`);
      });
    }
  );

  // 6. Snippets JSON 생성 (개발용)
  const generateSnippetsCommand = vscode.commands.registerCommand('mdx-editor.generateSnippets', async () => {
    const snippetsJson = generateSnippetsJson(registry);
    const document = await vscode.workspace.openTextDocument({
      content: snippetsJson,
      language: 'json'
    });
    await vscode.window.showTextDocument(document);
  });

  context.subscriptions.push(
    previewCommand,
    insertBlockCommand,
    insertComponentCommand,
    refreshRegistryCommand,
    addImportCommand,
    generateSnippetsCommand
  );
}

/**
 * Document Listeners 등록
 */
function registerDocumentListeners(context: vscode.ExtensionContext) {
  // 문서 변경 시 미리보기 업데이트
  const changeListener = vscode.workspace.onDidChangeTextDocument(event => {
    if (event.document.languageId === 'mdx' && MDXPreviewPanel.currentPanel) {
      MDXPreviewPanel.currentPanel.update(event.document);
    }
  });

  // 활성 에디터 변경 시 미리보기 업데이트
  const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor?.document.languageId === 'mdx' && MDXPreviewPanel.currentPanel) {
      MDXPreviewPanel.currentPanel.update(editor.document);
    }
  });

  context.subscriptions.push(changeListener, editorChangeListener);
}

/**
 * Extension 비활성화
 */
export function deactivate() {
  console.log('MDX Editor extension is now deactivated');
}
