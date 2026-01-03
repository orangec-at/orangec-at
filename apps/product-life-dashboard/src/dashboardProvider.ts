import * as vscode from 'vscode';
import * as path from 'path';
import { VaultParser } from './vaultParser';

export class DashboardProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private vaultParser: VaultParser;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this.vaultParser = new VaultParser();
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    console.log('🎨 resolveWebviewView 호출됨');
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    console.log('📄 HTML 생성 중...');
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Webview → Extension 메시지 수신 리스너
    webviewView.webview.onDidReceiveMessage(
      async (message) => {
        console.log('📨 Webview 메시지 수신:', message);

        switch (message.type) {
          case 'addTodo':
            await this._handleAddTodo(message.text);
            break;
        }
      }
    );

    console.log('🔄 데이터 업데이트 시작...');
    this._update();
  }

  public refresh() {
    this._update();
  }

  private async _handleAddTodo(text: string) {
    try {
      console.log(`📝 TODO 추가 시도: ${text}`);

      // vault 경로 가져오기
      const vaultPath = this.vaultParser.getVaultPath();
      if (!vaultPath) {
        vscode.window.showErrorMessage('vault 경로를 찾을 수 없습니다');
        return;
      }

      const wipFilePath = path.join(vaultPath, 'projects', 'current-wip.md');

      // 파일 읽기
      const fs = await import('fs');
      const content = fs.readFileSync(wipFilePath, 'utf-8');

      // WIP 섹션에 새 항목 추가
      const lines = content.split('\n');
      const wipSectionIndex = lines.findIndex(line => line.startsWith('# 진행중인 작업'));

      if (wipSectionIndex === -1) {
        vscode.window.showErrorMessage('WIP 섹션을 찾을 수 없습니다');
        return;
      }

      // 마지막 번호 찾기
      let lastNumber = 0;
      for (let i = wipSectionIndex + 1; i < lines.length; i++) {
        const match = lines[i].match(/^(\d+)\./);
        if (match) {
          lastNumber = Math.max(lastNumber, parseInt(match[1]));
        } else if (lines[i].startsWith('#')) {
          break;  // 다음 섹션 도달
        }
      }

      // 새 항목 추가
      const newNumber = lastNumber + 1;
      const newLine = `${newNumber}. ${text} - 0% 시작`;

      // WIP 리스트 끝에 추가
      let insertIndex = wipSectionIndex + 2;  // 헤더 다음 줄
      while (insertIndex < lines.length && lines[insertIndex].match(/^\d+\./)) {
        insertIndex++;
      }

      lines.splice(insertIndex, 0, newLine);

      // 파일 쓰기
      fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');

      console.log(`✅ TODO 추가 완료: ${newLine}`);
      vscode.window.showInformationMessage(`추가됨: ${text}`);

      // Dashboard 업데이트 (파일 쓰기 완료 후 약간의 딜레이)
      setTimeout(() => {
        this._update();
      }, 100);
    } catch (error) {
      console.error('❌ TODO 추가 실패:', error);
      vscode.window.showErrorMessage(`TODO 추가 실패: ${error}`);
    }
  }

  private async _update() {
    if (!this._view) {
      console.warn('⚠️ _view가 없어서 업데이트 불가');
      return;
    }

    try {
      console.log('📊 vault 데이터 파싱 시작...');
      const data = await this.vaultParser.parse();
      console.log('✅ 파싱 완료:', JSON.stringify(data, null, 2));

      console.log('📤 webview에 메시지 전송...');
      this._view.webview.postMessage({ type: 'update', data });
      console.log('✅ 메시지 전송 완료');
    } catch (error) {
      console.error('❌ Dashboard update 실패:', error);
      vscode.window.showErrorMessage(`Dashboard 로드 실패: ${error}`);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview.js')
    );

    return `<!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource};">
          <title>Product Life Dashboard</title>
          <style>
            body {
              padding: 10px;
              font-family: var(--vscode-font-family);
              font-size: var(--vscode-font-size);
              color: var(--vscode-foreground);
            }

            .header {
              padding: 15px 0;
              border-bottom: 1px solid var(--vscode-panel-border);
              margin-bottom: 15px;
            }

            .mode {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .section {
              margin-bottom: 20px;
            }

            .section-title {
              font-size: 12px;
              font-weight: bold;
              color: var(--vscode-descriptionForeground);
              margin-bottom: 10px;
              text-transform: uppercase;
            }

            .wip-item {
              padding: 8px;
              margin-bottom: 8px;
              background: var(--vscode-editor-background);
              border-left: 3px solid var(--vscode-button-background);
              border-radius: 3px;
            }

            .wip-title {
              font-size: 13px;
              margin-bottom: 5px;
            }

            .wip-category {
              display: inline-block;
              font-size: 11px;
              padding: 2px 6px;
              background: var(--vscode-badge-background);
              color: var(--vscode-badge-foreground);
              border-radius: 3px;
              margin-right: 5px;
            }

            .progress-bar {
              width: 100%;
              height: 6px;
              background: var(--vscode-input-background);
              border-radius: 3px;
              overflow: hidden;
            }

            .progress-fill {
              height: 100%;
              background: var(--vscode-button-background);
              transition: width 0.3s ease;
            }

            .checklist-item {
              padding: 6px 0;
              display: flex;
              align-items: center;
              font-size: 13px;
            }

            .checklist-item.completed {
              opacity: 0.6;
              text-decoration: line-through;
            }

            .checkbox {
              margin-right: 8px;
            }

            .stats {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              background: var(--vscode-editor-background);
              border-radius: 3px;
              margin-top: 10px;
            }

            .stat {
              text-align: center;
            }

            .stat-value {
              font-size: 20px;
              font-weight: bold;
              color: var(--vscode-button-background);
            }

            .stat-label {
              font-size: 11px;
              color: var(--vscode-descriptionForeground);
            }

            .quick-add-form {
              display: flex;
              gap: 8px;
              margin-bottom: 15px;
            }

            .todo-input {
              flex: 1;
              padding: 8px 12px;
              background: var(--vscode-input-background);
              color: var(--vscode-input-foreground);
              border: 1px solid var(--vscode-input-border);
              border-radius: 4px;
              font-size: 13px;
              font-family: var(--vscode-font-family);
            }

            .todo-input:focus {
              outline: 1px solid var(--vscode-focusBorder);
              border-color: var(--vscode-focusBorder);
            }

            .add-btn {
              padding: 8px 16px;
              background: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              border-radius: 4px;
              font-size: 13px;
              cursor: pointer;
              white-space: nowrap;
            }

            .add-btn:hover {
              background: var(--vscode-button-hoverBackground);
            }

            .add-btn:active {
              opacity: 0.8;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="mode" id="current-mode">로딩중...</div>
          </div>

          <div class="section">
            <div class="section-title">➕ Quick Add</div>
            <div class="quick-add-form">
              <input
                type="text"
                id="todo-input"
                class="todo-input"
                placeholder="[제품/마케팅/커리어] 새 작업 입력..."
              />
              <button id="add-btn" class="add-btn">추가</button>
            </div>
          </div>

          <div class="section">
            <div class="section-title">⚡ 진행중 (WIP)</div>
            <div id="wip-list">
              <div style="opacity: 0.5; font-size: 12px;">데이터 로딩중...</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">✅ 이번 주 체크리스트</div>
            <div id="checklist">
              <div style="opacity: 0.5; font-size: 12px;">데이터 로딩중...</div>
            </div>
            <div class="stats">
              <div class="stat">
                <div class="stat-value" id="completed-count">0</div>
                <div class="stat-label">완료</div>
              </div>
              <div class="stat">
                <div class="stat-value" id="total-count">4</div>
                <div class="stat-label">전체</div>
              </div>
              <div class="stat">
                <div class="stat-value" id="progress-percent">0%</div>
                <div class="stat-label">진행률</div>
              </div>
            </div>
          </div>

          <script>
            const vscode = acquireVsCodeApi();

            // Extension → Webview 메시지 수신
            window.addEventListener('message', event => {
              const { type, data } = event.data;

              if (type === 'update') {
                updateDashboard(data);
              }
            });

            // Quick Add 버튼 클릭 이벤트
            document.addEventListener('DOMContentLoaded', () => {
              const input = document.getElementById('todo-input');
              const btn = document.getElementById('add-btn');

              const addTodo = () => {
                const text = input.value.trim();
                if (text) {
                  // Webview → Extension 메시지 전송
                  vscode.postMessage({
                    type: 'addTodo',
                    text: text
                  });
                  input.value = '';  // 입력창 비우기
                }
              };

              btn.addEventListener('click', addTodo);
              input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                  addTodo();
                }
              });
            });

            function updateDashboard(data) {
              // 오늘 모드
              document.getElementById('current-mode').textContent =
                \`\${data.todayEmoji} \${data.todayMode}\`;

              // WIP 표시
              const wipHtml = data.wip.length > 0
                ? data.wip.map(item => \`
                    <div class="wip-item">
                      <div class="wip-title">
                        <span class="wip-category">\${item.category}</span>
                        \${item.title}
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: \${item.progress}%"></div>
                      </div>
                    </div>
                  \`).join('')
                : '<div style="opacity: 0.5; font-size: 12px;">WIP 항목 없음</div>';

              document.getElementById('wip-list').innerHTML = wipHtml;

              // 체크리스트 표시
              const checklistHtml = data.checklist.length > 0
                ? data.checklist.map(item => \`
                    <div class="checklist-item \${item.completed ? 'completed' : ''}">
                      <span class="checkbox">\${item.completed ? '✅' : '⬜'}</span>
                      <span>\${item.text}</span>
                    </div>
                  \`).join('')
                : '<div style="opacity: 0.5; font-size: 12px;">체크리스트 없음</div>';

              document.getElementById('checklist').innerHTML = checklistHtml;

              // 통계
              const completed = data.checklist.filter(item => item.completed).length;
              const total = data.checklist.length || 4;
              const percent = Math.round((completed / total) * 100);

              document.getElementById('completed-count').textContent = completed;
              document.getElementById('total-count').textContent = total;
              document.getElementById('progress-percent').textContent = percent + '%';
            }
          </script>
        </body>
      </html>`;
  }
}
