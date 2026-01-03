import * as vscode from 'vscode';
import { VaultParser } from './vaultParser';
import { IStorageProvider } from './storage/IStorageProvider';

type ViewType = 'quickAdd' | 'wip' | 'checklist' | 'tagManager' | 'settings';

export class BaseViewProvider implements vscode.WebviewViewProvider {
  protected static instances: BaseViewProvider[] = [];
  protected _view?: vscode.WebviewView;
  protected vaultParser: VaultParser;
  protected storage: IStorageProvider;
  private viewType: ViewType;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    viewType: ViewType,
    storage: IStorageProvider
  ) {
    this.vaultParser = new VaultParser();
    this.storage = storage;
    this.viewType = viewType;
    BaseViewProvider.instances.push(this);
  }

  protected static refreshAll() {
    console.log('🔄 모든 view refresh');
    BaseViewProvider.instances.forEach(instance => {
      instance.refresh();
    });
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    console.log(`🎨 ${this.viewType} View 초기화`);
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      await this.handleMessage(message);
    });
  }

  protected async handleMessage(message: any) {
    console.log(`📨 ${this.viewType} 메시지:`, message);

    switch (message.type) {
      case 'webviewReady':
        console.log('✅ Webview 준비 완료');
        this._update();
        break;
      case 'refresh':
        console.log('🔄 새로고침 요청');
        this._update();
        break;
      case 'changeLanguage':
        await this._handleChangeLanguage(message.language);
        break;
    }
  }

  private async _handleChangeLanguage(language: 'ko' | 'en') {
    try {
      console.log(`🌐 언어 변경: ${language}`);
      const config = vscode.workspace.getConfiguration('productLife');
      await config.update('language', language, vscode.ConfigurationTarget.Global);

      vscode.window.showInformationMessage(
        `언어가 변경되었습니다: ${language === 'ko' ? '한국어' : 'English'}`
      );

      setTimeout(() => BaseViewProvider.refreshAll(), 100);
    } catch (error) {
      console.error('❌ 언어 변경 실패:', error);
      vscode.window.showErrorMessage(`언어 변경 실패: ${error}`);
    }
  }

  public refresh() {
    this._update();
  }

  protected async _update() {
    if (!this._view) {
      console.warn(`⚠️ ${this.viewType} View가 없어서 업데이트 불가`);
      return;
    }

    try {
      console.log(`📊 ${this.viewType} 데이터 파싱 시작...`);

      // Storage에서 데이터 읽기
      const wip = await this.storage.getWipItems();
      const checklist = await this.storage.getChecklistItems();
      const completedChecklist = await this.storage.getCompletedChecklistItems();
      const todayMode = this.storage.getTodayMode();

      const data = {
        todayEmoji: todayMode.emoji,
        todayMode: todayMode.mode,
        wip,
        checklist,
        completedChecklist
      };

      const config = vscode.workspace.getConfiguration('productLife');
      const language = config.get<'ko' | 'en'>('language', 'ko');

      console.log(`✅ ${this.viewType} 파싱 완료:`, {
        wip: data.wip.length,
        checklist: data.checklist.length,
        completedChecklist: data.completedChecklist.length,
        language
      });

      this._view.webview.postMessage({
        type: 'update',
        viewType: this.viewType,
        data: {
          ...data,
          language
        }
      });
      console.log(`📤 ${this.viewType} 메시지 전송 완료`);
    } catch (error) {
      console.error(`❌ ${this.viewType} Update 실패:`, error);
      vscode.window.showErrorMessage(`${this.viewType} 업데이트 실패: ${error}`);
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
  <title>Product Life</title>
  <link rel="stylesheet" href="${styleUri}">
</head>
<body>
  <div id="root" data-view-type="${this.viewType}"></div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}

// QuickAdd ViewProvider
export class QuickAddViewProvider extends BaseViewProvider {
  constructor(extensionUri: vscode.Uri, storage: IStorageProvider) {
    super(extensionUri, 'quickAdd', storage);
  }

  protected async handleMessage(message: any) {
    console.log('🔔 QuickAddViewProvider 메시지 받음:', message);
    await super.handleMessage(message);

    try {
      switch (message.type) {
        case 'addTodo':
          console.log('✍️ WIP 추가:', message.text);
          await this.storage.addWipItem(message.text);
          vscode.window.showInformationMessage(`WIP 추가: ${message.text}`);
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'addChecklist':
          console.log('✍️ 체크리스트 추가:', message.text);
          await this.storage.addChecklistItem(message.text);
          vscode.window.showInformationMessage(`체크리스트 추가: ${message.text}`);
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
      }
    } catch (error) {
      console.error(`❌ QuickAdd 처리 실패:`, error);
      vscode.window.showErrorMessage(`처리 실패: ${error}`);
    }
  }
}

// WIP ViewProvider
export class WipViewProvider extends BaseViewProvider {
  constructor(extensionUri: vscode.Uri, storage: IStorageProvider) {
    super(extensionUri, 'wip', storage);
  }

  protected async handleMessage(message: any) {
    await super.handleMessage(message);

    try {
      switch (message.type) {
        case 'updateTag':
          await this.storage.updateWipTag(message.index, message.tag);
          vscode.window.showInformationMessage(`태그 업데이트: ${message.tag}`);
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'updateProgress':
          await this.storage.updateWipProgress(message.index, message.progress);
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'completeWip':
          await this.storage.completeWipItem(message.index);
          vscode.window.showInformationMessage('✅ 작업 완료!');
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'deleteWip':
          await this.storage.deleteWipItem(message.index);
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
      }
    } catch (error) {
      console.error(`❌ WIP 처리 실패:`, error);
      vscode.window.showErrorMessage(`처리 실패: ${error}`);
    }
  }
}

// Checklist ViewProvider
export class ChecklistViewProvider extends BaseViewProvider {
  constructor(extensionUri: vscode.Uri, storage: IStorageProvider) {
    super(extensionUri, 'checklist', storage);
  }

  protected async handleMessage(message: any) {
    console.log('🔔 ChecklistViewProvider 메시지 받음:', message);
    await super.handleMessage(message);

    try {
      console.log('🎯 메시지 타입:', message.type);
      switch (message.type) {
        case 'addChecklist':
          console.log('✍️ 체크리스트 추가 시작:', message.text);
          await this.storage.addChecklistItem(message.text);
          vscode.window.showInformationMessage(`체크리스트 추가: ${message.text}`);
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'toggleChecklist':
          await this.storage.toggleChecklistItem(message.index);
          vscode.window.showInformationMessage('✅ 체크리스트 완료!');
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'updateChecklistPriority':
          await this.storage.updateChecklistPriority(
            message.index,
            message.priority
          );
          vscode.window.showInformationMessage(
            `우선순위 업데이트: ${message.priority || 'None'}`
          );
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'deleteChecklist':
          await this.storage.deleteChecklistItem(message.index);
          vscode.window.showInformationMessage('✅ 체크리스트 삭제!');
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
        case 'deleteCompletedChecklist':
          await this.storage.deleteCompletedChecklistItem(message.index);
          vscode.window.showInformationMessage('✅ 완료된 체크리스트 삭제!');
          setTimeout(() => BaseViewProvider.refreshAll(), 100);
          break;
      }
    } catch (error) {
      console.error(`❌ Checklist 처리 실패:`, error);
      vscode.window.showErrorMessage(`처리 실패: ${error}`);
    }
  }
}

// TagManager ViewProvider
export class TagManagerViewProvider extends BaseViewProvider {
  constructor(extensionUri: vscode.Uri, storage: IStorageProvider) {
    super(extensionUri, 'tagManager', storage);
  }
}

// Settings ViewProvider
export class SettingsViewProvider extends BaseViewProvider {
  constructor(extensionUri: vscode.Uri, storage: IStorageProvider) {
    super(extensionUri, 'settings', storage);
  }
}
