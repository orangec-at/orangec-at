import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { IStorageProvider } from '../storage/IStorageProvider';

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
  action?: {
    type: 'add_checklist' | 'add_wip' | 'set_priority';
    data: any;
  };
}

/**
 * Claude Code CLI와 통합하여 AI 기능 제공
 * - 진행상황 분석
 * - 대화형 관리 (체크리스트/WIP 자동 추가)
 * - 우선순위 제안
 */
export class AIService {
  private storage: IStorageProvider;
  private outputChannel: vscode.OutputChannel;

  constructor(storage: IStorageProvider) {
    this.storage = storage;
    this.outputChannel = vscode.window.createOutputChannel('Product Life AI');
  }

  /**
   * Claude Code CLI 실행
   */
  private async executeClaudeCLI(prompt: string): Promise<AIResponse> {
    return new Promise((resolve) => {
      try {
        this.outputChannel.appendLine(`🤖 AI 요청: ${prompt.substring(0, 100)}...`);

        const claude = spawn('claude', ['-p', prompt], {
          shell: true,
          env: process.env
        });

        let stdout = '';
        let stderr = '';

        claude.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        claude.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        claude.on('close', (code) => {
          if (code === 0) {
            this.outputChannel.appendLine(`✅ AI 응답 완료 (${stdout.length} chars)`);
            resolve({ success: true, content: stdout.trim() });
          } else {
            this.outputChannel.appendLine(`❌ AI 실행 실패: ${stderr}`);
            resolve({
              success: false,
              content: '',
              error: stderr || `Exit code: ${code}`
            });
          }
        });

        // 타임아웃 (30초)
        setTimeout(() => {
          claude.kill();
          resolve({
            success: false,
            content: '',
            error: 'Timeout (30s)'
          });
        }, 30000);

      } catch (error) {
        this.outputChannel.appendLine(`❌ AI 실행 예외: ${error}`);
        resolve({
          success: false,
          content: '',
          error: String(error)
        });
      }
    });
  }

  /**
   * 현재 데이터 수집
   */
  private async getCurrentContext(): Promise<string> {
    const wipItems = await this.storage.getWipItems();
    const checklistAll = await this.storage.getChecklistItems();
    const checklist = checklistAll.filter(c => !c.completed);
    const todayMode = this.storage.getTodayMode();

    return `
## 현재 상황

**진행 중인 작업 (WIP): ${wipItems.length}개**
${wipItems.map((w, i) => `${i + 1}. [${w.category || 'None'}] ${w.title} - ${w.progress}%`).join('\n')}

**체크리스트: ${checklist.length}개**
${checklist.map((c, i) => {
  const priority = c.priority ? `[${c.priority}] ` : '';
  const status = c.completed ? '✅' : '⬜';
  return `${i + 1}. ${status} ${priority}${c.text}`;
}).join('\n')}

**오늘의 모드**
${todayMode.emoji} ${todayMode.mode}
`.trim();
  }

  /**
   * 진행상황 분석
   */
  async analyzeProgress(): Promise<AIResponse> {
    const context = await this.getCurrentContext();

    const prompt = `당신은 개인 생산성 분석 전문가입니다.

${context}

위 데이터를 분석하여 다음을 제공해주세요:
1. 전체 진행률 평가 (0-100%)
2. 주요 성과 (최대 3개)
3. 개선이 필요한 영역 (최대 3개)
4. 다음 액션 아이템 (최대 3개)

간결하고 실행 가능한 조언을 제공해주세요.`;

    return this.executeClaudeCLI(prompt);
  }

  /**
   * 대화형 관리 - 사용자 질문에 AI가 응답 + 자동 액션 수행
   */
  async chat(userMessage: string): Promise<AIResponse> {
    const context = await this.getCurrentContext();

    const prompt = `당신은 개인 생산성 관리 어시스턴트입니다.

${context}

사용자 질문: "${userMessage}"

위 현재 상황을 바탕으로 사용자의 질문에 답변하거나 작업을 수행해주세요.

만약 사용자가 체크리스트나 WIP를 추가하라고 요청하면, 다음 형식으로 **마지막 줄에** JSON을 포함하세요:

ACTION_JSON: {"type": "add_checklist", "text": "추가할 내용"}
또는
ACTION_JSON: {"type": "add_wip", "title": "작업 제목"}

예시:
- "장보기 추가해줘" → 체크리스트에 "장보기"를 추가합니다! ACTION_JSON: {"type": "add_checklist", "text": "장보기"}
- "블로그 글쓰기 작업 시작" → WIP에 추가했습니다! ACTION_JSON: {"type": "add_wip", "title": "블로그 글쓰기"}

답변은 한국어로 간결하게 제공하고, 액션이 필요하면 마지막에 JSON을 포함하세요.`;

    const response = await this.executeClaudeCLI(prompt);

    if (response.success) {
      // ACTION_JSON 파싱
      const actionMatch = response.content.match(/ACTION_JSON:\s*(\{.+\})/);
      if (actionMatch) {
        try {
          const action = JSON.parse(actionMatch[1]);
          this.outputChannel.appendLine(`🎬 액션 실행: ${JSON.stringify(action)}`);

          // 액션 실행
          if (action.type === 'add_checklist' && action.text) {
            await this.storage.addChecklistItem(action.text);
            this.outputChannel.appendLine(`✅ 체크리스트 추가: ${action.text}`);
          } else if (action.type === 'add_wip' && action.title) {
            await this.storage.addWipItem(action.title);
            this.outputChannel.appendLine(`✅ WIP 추가: ${action.title}`);
          }

          // ACTION_JSON 제거한 응답 반환
          response.content = response.content.replace(/ACTION_JSON:\s*\{.+\}/, '').trim();
          response.action = action;
        } catch (error) {
          this.outputChannel.appendLine(`⚠️ JSON 파싱 실패: ${error}`);
        }
      }
    }

    return response;
  }

  /**
   * 우선순위 제안
   */
  async suggestPriority(): Promise<AIResponse> {
    const context = await this.getCurrentContext();

    const prompt = `당신은 작업 우선순위 결정 전문가입니다.

${context}

위 체크리스트 항목들의 우선순위를 분석하여:
1. 각 항목에 대한 권장 우선순위 (P1/P2/P3)
2. 우선순위 결정 근거

형식:
[항목 번호] [권장 우선순위] - 근거

간결하게 제공해주세요.`;

    return this.executeClaudeCLI(prompt);
  }

  /**
   * Output 채널 표시
   */
  showOutputChannel(): void {
    this.outputChannel.show();
  }
}
