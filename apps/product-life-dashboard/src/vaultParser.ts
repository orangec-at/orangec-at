import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface DashboardData {
  todayEmoji: string;
  todayMode: string;
  wip: Array<{ category?: string; title: string; progress: number }>;
  checklist: Array<{ text: string; completed: boolean; priority?: 'P1' | 'P2' | 'P3' }>;
}

export class VaultParser {
  private vaultPath: string = '';
  private initialized: boolean = false;

  constructor() {
    // vault 경로 찾기는 나중에 (사용할 때) 수행
  }

  public ensureInitialized() {
    if (!this.initialized) {
      this.findVaultPath();
      this.initialized = true;
    }
  }

  public getVaultPath(): string {
    this.ensureInitialized();
    return this.vaultPath;
  }

  private findVaultPath() {
    // 1. Settings에서 사용자 설정 경로 확인
    const config = vscode.workspace.getConfiguration('productLife');
    const configuredPath = config.get<string>('vaultPath');

    if (configuredPath && fs.existsSync(configuredPath)) {
      this.vaultPath = configuredPath;
      console.log(`✅ Vault 찾음 (설정): ${this.vaultPath}`);
      return;
    }

    // 2. Workspace에서 'vault' 이름의 폴더 찾기
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      for (const folder of workspaceFolders) {
        // 폴더 이름이 'vault'인지 확인
        if (path.basename(folder.uri.fsPath) === 'vault') {
          this.vaultPath = folder.uri.fsPath;
          console.log(`✅ Vault 찾음 (workspace): ${this.vaultPath}`);
          return;
        }

        // 하위에 'vault' 폴더가 있는지 확인
        const vaultCandidate = path.join(folder.uri.fsPath, 'vault');
        if (fs.existsSync(vaultCandidate)) {
          this.vaultPath = vaultCandidate;
          console.log(`✅ Vault 찾음 (workspace/vault): ${this.vaultPath}`);
          return;
        }
      }
    }

    // 3. 못 찾으면 설정 안내
    console.warn('⚠️ vault 폴더를 찾을 수 없습니다');
    vscode.window.showWarningMessage(
      'vault 폴더를 찾을 수 없습니다. Settings에서 productLife.vaultPath를 설정해주세요.',
      'Settings 열기'
    ).then(selection => {
      if (selection === 'Settings 열기') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'productLife.vaultPath');
      }
    });
  }

  async parse(): Promise<DashboardData> {
    // vault 경로가 초기화되지 않았으면 지금 찾기
    this.ensureInitialized();

    const todayMode = this.getTodayMode();
    const wip = await this.getWIP();
    const checklist = await this.getChecklist();

    return {
      todayEmoji: todayMode.emoji,
      todayMode: todayMode.mode,
      wip,
      checklist
    };
  }

  private getTodayMode(): { emoji: string; mode: string } {
    const today = new Date().getDay(); // 0=일, 1=월, ...

    if (today === 1 || today === 2) {
      return { emoji: '🛠️', mode: '제품 모드 (Product Mode)' };
    } else if (today === 3) {
      return { emoji: '📝', mode: '마케팅 모드 (Marketing Mode)' };
    } else if (today === 4) {
      return { emoji: '💼', mode: '커리어 모드 (Career Mode)' };
    } else if (today === 5) {
      return { emoji: '🔧', mode: '버퍼 모드 (Buffer Mode)' };
    } else {
      return { emoji: '🌴', mode: '삶 모드 (Life Mode)' };
    }
  }

  public async getWIP(): Promise<Array<{ category?: string; title: string; progress: number }>> {
    const wipPath = path.join(this.vaultPath, 'projects', 'current-wip.md');
    console.log(`📂 WIP 파일 경로: ${wipPath}`);

    if (!fs.existsSync(wipPath)) {
      console.warn(`⚠️ WIP 파일 없음: ${wipPath}`);
      return [];
    }

    const content = fs.readFileSync(wipPath, 'utf-8');
    console.log(`📄 WIP 파일 읽음 (${content.length} bytes)`);

    // Markdown 파싱: 파일 순서대로 파싱
    // - With tag: 1. [제품] Title - 80% 완료
    // - Without tag: 1. Title - 80% 완료
    const regexWithTag = /^\d+\.\s+\[(.+?)\]\s+(.+?)\s+-\s+(\d+)%/;
    const regexWithoutTag = /^\d+\.\s+([^\[].+?)\s+-\s+(\d+)%/;
    const wip = [];

    // 파일 순서대로 한 줄씩 파싱
    const lines = content.split('\n');
    for (const line of lines) {
      const matchWithTag = line.match(regexWithTag);
      const matchWithoutTag = line.match(regexWithoutTag);
      
      if (matchWithTag) {
        wip.push({
          category: matchWithTag[1],
          title: matchWithTag[2],
          progress: parseInt(matchWithTag[3])
        });
      } else if (matchWithoutTag) {
        wip.push({
          category: undefined,
          title: matchWithoutTag[1],
          progress: parseInt(matchWithoutTag[2])
        });
      }
    }

    console.log(`✅ WIP 파싱 완료: ${wip.length}개 항목`);
    return wip;
  }

  public getWeeklyFilePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    
    // ISO 8601 week number calculation
    const target = new Date(now.valueOf());
    const dayNumber = (now.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    
    const weekString = `${year}-W${String(weekNumber).padStart(2, '0')}`;
    const weeklyDir = path.join(this.vaultPath, 'journal', 'weekly');
    
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(weeklyDir)) {
      fs.mkdirSync(weeklyDir, { recursive: true });
      console.log(`📁 주간 디렉토리 생성: ${weeklyDir}`);
    }
    
    const weeklyPath = path.join(weeklyDir, `${weekString}.md`);
    
    // 파일이 없으면 생성
    if (!fs.existsSync(weeklyPath)) {
      const template = `# ${weekString}\n\n## 이번 주 체크리스트\n\n`;
      fs.writeFileSync(weeklyPath, template, 'utf-8');
      console.log(`📄 주간 파일 생성: ${weeklyPath}`);
    }
    
    return weeklyPath;
  }

  public async getChecklist(): Promise<Array<{ text: string; completed: boolean; priority?: 'P1' | 'P2' | 'P3' }>> {
    const weeklyPath = this.getWeeklyFilePath();
    console.log(`📂 체크리스트 파일 경로: ${weeklyPath}`);

    if (!fs.existsSync(weeklyPath)) {
      console.warn(`⚠️ 체크리스트 파일 없음: ${weeklyPath}`);
      return [];
    }

    const content = fs.readFileSync(weeklyPath, 'utf-8');
    console.log(`📄 체크리스트 파일 읽음 (${content.length} bytes)`);

    // 완료된 섹션 이전의 미완료 항목만 파싱
    const lines = content.split('\n');
    const checklist = [];
    const checklistWithPriorityRegex = /^- \[([ x])\]\s+\[(P[123])\]\s+(.+)/;
    const checklistRegex = /^- \[([ x])\]\s+(.+)/;

    for (const line of lines) {
      // 완료된 섹션 발견하면 중단
      if (line.startsWith('# 완료된 체크리스트')) {
        break;
      }
      
      // 우선순위 있는 항목 먼저 체크
      const priorityMatch = line.match(checklistWithPriorityRegex);
      if (priorityMatch && priorityMatch[1] === ' ') {
        checklist.push({
          completed: false,
          priority: priorityMatch[2] as 'P1' | 'P2' | 'P3',
          text: priorityMatch[3]
        });
        continue;
      }
      
      // 우선순위 없는 항목
      const match = line.match(checklistRegex);
      if (match && match[1] === ' ') {
        checklist.push({
          completed: false,
          text: match[2]
        });
      }
    }

    console.log(`✅ 체크리스트 파싱 완료: ${checklist.length}개 항목`);
    return checklist;
  }

  public async getCompletedChecklist(): Promise<Array<{ text: string; completed: boolean; priority?: 'P1' | 'P2' | 'P3' }>> {
    const weeklyPath = this.getWeeklyFilePath();
    console.log(`📂 완료된 체크리스트 파일 경로: ${weeklyPath}`);

    if (!fs.existsSync(weeklyPath)) {
      console.warn(`⚠️ 체크리스트 파일 없음: ${weeklyPath}`);
      return [];
    }

    const content = fs.readFileSync(weeklyPath, 'utf-8');
    console.log(`📄 체크리스트 파일 읽음 (${content.length} bytes)`);

    // "# 완료된 체크리스트" 섹션 이후의 완료된 항목만 파싱
    const lines = content.split('\n');
    const completedList = [];
    const checklistWithPriorityRegex = /^- \[([ x])\]\s+\[(P[123])\]\s+(.+)/;
    const checklistRegex = /^- \[([ x])\]\s+(.+)/;
    let inCompletedSection = false;

    for (const line of lines) {
      // 완료된 섹션 시작
      if (line.startsWith('# 완료된 체크리스트')) {
        inCompletedSection = true;
        continue;
      }

      // 완료된 섹션 내에서만 파싱
      if (!inCompletedSection) {
        continue;
      }
      
      // 우선순위 있는 항목 먼저 체크
      const priorityMatch = line.match(checklistWithPriorityRegex);
      if (priorityMatch && priorityMatch[1] === 'x') {
        completedList.push({
          completed: true,
          priority: priorityMatch[2] as 'P1' | 'P2' | 'P3',
          text: priorityMatch[3]
        });
        continue;
      }
      
      // 우선순위 없는 항목
      const match = line.match(checklistRegex);
      if (match && match[1] === 'x') {
        completedList.push({
          completed: true,
          text: match[2]
        });
      }
    }

    console.log(`✅ 완료된 체크리스트 파싱 완료: ${completedList.length}개 항목`);
    return completedList;
  }
}
