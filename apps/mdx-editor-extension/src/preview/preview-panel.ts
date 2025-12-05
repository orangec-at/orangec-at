import * as vscode from 'vscode';
import * as path from 'path';

/**
 * MDX 미리보기 패널 관리
 */
export class MDXPreviewPanel {
 public static currentPanel: MDXPreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _updateTimeout: NodeJS.Timeout | undefined;
  private _latestContent = '';

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // 패널이 닫힐 때 정리
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // 메시지 처리 (에러/준비 신호)
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'error':
            vscode.window.showErrorMessage(message.text);
            return;
          case 'ready':
            this.pushContent();
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  /**
   * 미리보기 패널 생성 또는 표시
   */
  public static createOrShow(extensionUri: vscode.Uri, document: vscode.TextDocument) {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : undefined;

    // 이미 패널이 열려있으면 표시
    if (MDXPreviewPanel.currentPanel) {
      MDXPreviewPanel.currentPanel._panel.reveal(column);
      MDXPreviewPanel.currentPanel.update(document);
      return;
    }

    // 새 패널 생성
    const panel = vscode.window.createWebviewPanel(
      'mdxPreview',
      'MDX Preview',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'media'),
          vscode.Uri.joinPath(extensionUri, 'dist')
        ],
        retainContextWhenHidden: true
      }
    );

    MDXPreviewPanel.currentPanel = new MDXPreviewPanel(panel, extensionUri);
    MDXPreviewPanel.currentPanel._panel.webview.html =
      MDXPreviewPanel.currentPanel._getHtmlForWebview(MDXPreviewPanel.currentPanel._panel.webview);
    MDXPreviewPanel.currentPanel.update(document);
  }

  /**
   * 미리보기 업데이트
   */
  public update(document: vscode.TextDocument) {
    this._latestContent = document.getText();

    // 디바운스: 500ms 후에 업데이트
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
    }

    this._updateTimeout = setTimeout(() => {
      this.pushContent();
    }, 500);
  }

  /**
   * Webview에 현재 내용 전달
   */
  private pushContent() {
    if (!this._latestContent) return;
    this._panel.webview.postMessage({
      command: 'update',
      content: this._latestContent
    });
  }

  /**
   * Webview HTML 생성
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    // 스타일/스크립트 URI
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'preview.css')
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'preview.js')
    );

    // Nonce 생성 (보안)
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${styleUri}" rel="stylesheet">
  <title>MDX Preview</title>
</head>
<body>
  <div id="preview-container">
    <div id="loading">Rendering MDX...</div>
    <div id="preview-content"></div>
    <div id="error" style="display:none; color: red; padding: 20px;"></div>
  </div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  /**
   * 정리
   */
  public dispose() {
    MDXPreviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
