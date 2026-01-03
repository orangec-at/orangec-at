import * as vscode from "vscode";
import {
  QuickAddViewProvider,
  WipViewProvider,
  ChecklistViewProvider,
  TagManagerViewProvider,
  SettingsViewProvider
} from "./viewProviders";
import { AIService } from "./services/aiService";
import { IStorageProvider } from "./storage/IStorageProvider";
import { VaultStorageProvider } from "./storage/VaultStorageProvider";
import { VSCodeStorageProvider } from "./storage/VSCodeStorageProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 Product Life Dashboard 활성화!");

  // Storage Provider 선택
  const config = vscode.workspace.getConfiguration('productLife');
  const storageMode = config.get<string>('storageMode', 'vault');

  let storage: IStorageProvider;
  if (storageMode === 'vscode') {
    storage = new VSCodeStorageProvider(context);
    console.log("📦 VS Code Storage Mode 활성화");
  } else {
    storage = new VaultStorageProvider();
    console.log("📂 Vault Storage Mode 활성화");
  }

  // 각 뷰 Provider 생성 (Storage 전달)
  const quickAddProvider = new QuickAddViewProvider(context.extensionUri, storage);
  const wipProvider = new WipViewProvider(context.extensionUri, storage);
  const checklistProvider = new ChecklistViewProvider(context.extensionUri, storage);
  const tagManagerProvider = new TagManagerViewProvider(context.extensionUri, storage);
  const settingsProvider = new SettingsViewProvider(context.extensionUri, storage);

  // Provider 등록
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "productLifeQuickAdd",
      quickAddProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "productLifeWip",
      wipProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "productLifeChecklist",
      checklistProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "productLifeTagManager",
      tagManagerProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "productLifeSettings",
      settingsProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  console.log("✅ 모든 Provider 등록 완료!");

  // AI Service 초기화 (이미 생성된 storage 사용)
  const aiService = new AIService(storage);
  console.log("🤖 AI Service 초기화 완료!");

  // 커맨드들
  context.subscriptions.push(
    vscode.commands.registerCommand("productLife.openDashboard", () => {
      vscode.commands.executeCommand("productLifeWip.focus");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("productLife.refresh", () => {
      quickAddProvider.refresh();
      wipProvider.refresh();
      checklistProvider.refresh();
      tagManagerProvider.refresh();
      settingsProvider.refresh();
    })
  );

  // AI 명령어들
  context.subscriptions.push(
    vscode.commands.registerCommand("productLife.ai.analyzeProgress", async () => {
      try {
        vscode.window.showInformationMessage("🤖 AI가 진행상황을 분석 중입니다...");
        aiService.showOutputChannel();

        const response = await aiService.analyzeProgress();

        if (response.success) {
          vscode.window.showInformationMessage("✅ AI 분석 완료!");
          // Output 채널에 결과 표시
        } else {
          vscode.window.showErrorMessage(`❌ AI 분석 실패: ${response.error}`);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ 오류: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("productLife.ai.chat", async () => {
      try {
        const userMessage = await vscode.window.showInputBox({
          prompt: "💬 AI에게 무엇을 물어볼까요?",
          placeHolder: "예: 오늘 뭐 해야 해?, 우선순위 알려줘, 장보기 추가해줘"
        });

        if (!userMessage) {
          return;
        }

        vscode.window.showInformationMessage(`🤖 AI가 생각 중: "${userMessage}"`);
        aiService.showOutputChannel();

        const response = await aiService.chat(userMessage);

        if (response.success) {
          vscode.window.showInformationMessage("✅ AI 응답 완료!");

          // 액션이 실행되었으면 UI 새로고침
          if (response.action) {
            setTimeout(() => {
              quickAddProvider.refresh();
              wipProvider.refresh();
              checklistProvider.refresh();
              console.log("🔄 AI 액션 후 UI 새로고침");
            }, 100);
          }
        } else {
          vscode.window.showErrorMessage(`❌ AI 응답 실패: ${response.error}`);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ 오류: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("productLife.ai.suggestPriority", async () => {
      try {
        vscode.window.showInformationMessage("🎯 AI가 우선순위를 분석 중입니다...");
        aiService.showOutputChannel();

        const response = await aiService.suggestPriority();

        if (response.success) {
          vscode.window.showInformationMessage("✅ 우선순위 제안 완료!");
        } else {
          vscode.window.showErrorMessage(`❌ 우선순위 제안 실패: ${response.error}`);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ 오류: ${error}`);
      }
    })
  );
}

export function deactivate() {}
