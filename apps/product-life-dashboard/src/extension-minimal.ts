import * as vscode from 'vscode';

class MinimalProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView) {
    console.log('🎉 resolveWebviewView 호출됨!!!');

    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              padding: 20px;
              color: var(--vscode-foreground);
              font-family: var(--vscode-font-family);
            }
            h1 { color: #4EC9B0; }
          </style>
        </head>
        <body>
          <h1>🎉 성공!</h1>
          <p>WebviewView가 작동합니다!</p>
          <p>시간: ${new Date().toLocaleTimeString()}</p>
        </body>
      </html>
    `;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 MINIMAL Extension 활성화!');

  const provider = new MinimalProvider();

  console.log('📝 Provider 등록 시작...');
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('productLifeDashboard', provider)
  );
  console.log('✅ Provider 등록 완료!');
}

export function deactivate() {}
