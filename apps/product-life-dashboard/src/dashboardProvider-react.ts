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
          case 'webviewReady':
            console.log('✅ Webview 준비 완료! 데이터 전송 시작...');
            this._update();
            break;
          case 'refresh':
            console.log('🔄 수동 새로고침 요청됨');
            this._update();
            break;
          case 'addTodo':
            await this._handleAddTodo(message.text);
            break;
          case 'toggleChecklist':
            await this._handleToggleChecklist(message.index);
            break;
          case 'updateTag':
            await this._handleUpdateTag(message.index, message.tag);
            break;
        }
      }
    );
  }

  public refresh() {
    this._update();
  }

  private async _handleAddTodo(text: string) {
    try {
      console.log(`📝 TODO 추가 시도: ${text}`);

      const vaultPath = this.vaultParser.getVaultPath();
      if (!vaultPath) {
        vscode.window.showErrorMessage('vault 경로를 찾을 수 없습니다');
        return;
      }

      const wipFilePath = path.join(vaultPath, 'projects', 'current-wip.md');

      const fs = await import('fs');
      const content = fs.readFileSync(wipFilePath, 'utf-8');

      const lines = content.split('\n');
      const wipSectionIndex = lines.findIndex(line => line.startsWith('# 진행중인 작업'));

      if (wipSectionIndex === -1) {
        vscode.window.showErrorMessage('WIP 섹션을 찾을 수 없습니다');
        return;
      }

      let lastNumber = 0;
      for (let i = wipSectionIndex + 1; i < lines.length; i++) {
        const match = lines[i].match(/^(\d+)\./);
        if (match) {
          lastNumber = Math.max(lastNumber, parseInt(match[1]));
        } else if (lines[i].startsWith('#')) {
          break;
        }
      }

      const newNumber = lastNumber + 1;
      const newLine = `${newNumber}. ${text} - 0% 시작`;

      let insertIndex = wipSectionIndex + 2;
      while (insertIndex < lines.length && lines[insertIndex].match(/^\d+\./)) {
        insertIndex++;
      }

      lines.splice(insertIndex, 0, newLine);

      fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');

      console.log(`✅ TODO 추가 완료: ${newLine}`);
      vscode.window.showInformationMessage(`추가됨: ${text}`);

      setTimeout(() => {
        this._update();
      }, 100);
    } catch (error) {
      console.error('❌ TODO 추가 실패:', error);
      vscode.window.showErrorMessage(`TODO 추가 실패: ${error}`);
    }
  }

  private async _handleToggleChecklist(index: number) {
    try {
      console.log(`✅ 체크리스트 토글 시도: index ${index}`);

      const vaultPath = this.vaultParser.getVaultPath();
      if (!vaultPath) {
        vscode.window.showErrorMessage('vault 경로를 찾을 수 없습니다');
        return;
      }

      const weeklyPath = path.join(vaultPath, 'journal', 'weekly', '2025-W01.md');
      
      if (!require('fs').existsSync(weeklyPath)) {
        vscode.window.showErrorMessage('주간 체크리스트 파일을 찾을 수 없습니다');
        return;
      }

      const fs = await import('fs');
      const content = fs.readFileSync(weeklyPath, 'utf-8');
      const lines = content.split('\n');

      // 체크리스트 항목 찾기
      const checklistRegex = /^- \[([ x])\]\s+(.+)/;
      let checklistCount = 0;
      let targetLineIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (checklistRegex.test(lines[i])) {
          if (checklistCount === index) {
            targetLineIndex = i;
            break;
          }
          checklistCount++;
        }
      }

      if (targetLineIndex === -1) {
        vscode.window.showErrorMessage('체크리스트 항목을 찾을 수 없습니다');
        return;
      }

      // 토글: [ ] <-> [x]
      const match = lines[targetLineIndex].match(checklistRegex);
      if (match) {
        const currentState = match[1];
        const newState = currentState === 'x' ? ' ' : 'x';
        lines[targetLineIndex] = lines[targetLineIndex].replace(
          `- [${currentState}]`,
          `- [${newState}]`
        );
      }

      fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');

      console.log(`✅ 체크리스트 토글 완료: index ${index}`);
      
      setTimeout(() => {
        this._update();
      }, 100);
    } catch (error) {
      console.error('❌ 체크리스트 토글 실패:', error);
      vscode.window.showErrorMessage(`체크리스트 토글 실패: ${error}`);
    }
  }

  private async _handleUpdateTag(index: number, newTag: string) {
    try {
      console.log(`🏷️ 태그 업데이트 시도: index ${index}, tag ${newTag}`);

      const vaultPath = this.vaultParser.getVaultPath();
      if (!vaultPath) {
        vscode.window.showErrorMessage('vault 경로를 찾을 수 없습니다');
        return;
      }

      const wipFilePath = path.join(vaultPath, 'projects', 'current-wip.md');
      
      if (!require('fs').existsSync(wipFilePath)) {
        vscode.window.showErrorMessage('WIP 파일을 찾을 수 없습니다');
        return;
      }

      const fs = await import('fs');
      const content = fs.readFileSync(wipFilePath, 'utf-8');
      const lines = content.split('\n');

      // WIP 항목 찾기 (태그 있는 것과 없는 것 모두)
      const regexWithTag = /^\d+\.\s+\[(.+?)\]\s+(.+?)\s+-\s+(\d+)%/;
      const regexWithoutTag = /^\d+\.\s+([^\[].+?)\s+-\s+(\d+)%/;
      let wipCount = 0;
      let targetLineIndex = -1;
      let hasTag = false;

      for (let i = 0; i < lines.length; i++) {
        const matchWithTag = lines[i].match(regexWithTag);
        const matchWithoutTag = lines[i].match(regexWithoutTag);
        
        if (matchWithTag || matchWithoutTag) {
          if (wipCount === index) {
            targetLineIndex = i;
            hasTag = !!matchWithTag;
            break;
          }
          wipCount++;
        }
      }

      if (targetLineIndex === -1) {
        vscode.window.showErrorMessage('WIP 항목을 찾을 수 없습니다');
        return;
      }

      // 태그 업데이트
      const line = lines[targetLineIndex];
      if (hasTag) {
        // 기존 태그 교체: 1. [제품] Title - 80% → 1. [마케팅] Title - 80%
        lines[targetLineIndex] = line.replace(/\[(.+?)\]/, `[${newTag}]`);
      } else {
        // 태그 추가: 1. Title - 80% → 1. [제품] Title - 80%
        lines[targetLineIndex] = line.replace(/^(\d+\.\s+)/, `$1[${newTag}] `);
      }

      fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');

      console.log(`✅ 태그 업데이트 완료: index ${index} → ${newTag}`);
      vscode.window.showInformationMessage(`태그 업데이트: ${newTag}`);
      
      setTimeout(() => {
        this._update();
      }, 100);
    } catch (error) {
      console.error('❌ 태그 업데이트 실패:', error);
      vscode.window.showErrorMessage(`태그 업데이트 실패: ${error}`);
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
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview.css')
    );

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource};">
  <title>Product Life Dashboard</title>
  <link rel="stylesheet" href="${styleUri}">
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}
