import * as fs from 'fs';
import * as path from 'path';
import { VaultParser } from '../vaultParser';
import { IStorageProvider, WipItem, ChecklistItem } from './IStorageProvider';

/**
 * Vault (Markdown 파일) 기반 Storage Provider
 * - vault/projects/current-wip.md
 * - vault/journal/weekly/YYYY-Www.md
 */
export class VaultStorageProvider implements IStorageProvider {
  private vaultParser: VaultParser;

  constructor() {
    this.vaultParser = new VaultParser();
    this.vaultParser.ensureInitialized();
  }

  // ==================== WIP Operations ====================

  async getWipItems(): Promise<WipItem[]> {
    return await this.vaultParser.getWIP();
  }

  async addWipItem(title: string): Promise<void> {
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }

    const wipPath = path.join(vaultPath, 'projects', 'current-wip.md');
    let content = fs.readFileSync(wipPath, 'utf-8');

    // 마지막 WIP 항목 찾기
    const lines = content.split('\n');
    let lastWipIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^\d+\.\s+\[/)) {
        lastWipIndex = i;
      }
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }
    }

    const newItem = `${lastWipIndex + 2}. [ ] ${title} - 0%`;

    if (lastWipIndex >= 0) {
      lines.splice(lastWipIndex + 1, 0, newItem);
    } else {
      // WIP 섹션 시작 부분에 추가
      const wipSectionIndex = lines.findIndex(l => l.startsWith('## 진행 중인 작업'));
      if (wipSectionIndex >= 0) {
        lines.splice(wipSectionIndex + 1, 0, '', newItem);
      }
    }

    fs.writeFileSync(wipPath, lines.join('\n'), 'utf-8');
  }

  async updateWipTag(index: number, tag: string): Promise<void> {
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }

    const wipPath = path.join(vaultPath, 'projects', 'current-wip.md');
    let content = fs.readFileSync(wipPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }

      const match = lines[i].match(/^(\d+)\.\s+\[(.*?)\]\s+(.+?)\s+-\s+(\d+)%/);
      if (match) {
        if (currentIndex === index) {
          const [, num, , title, progress] = match;
          lines[i] = `${num}. [${tag}] ${title} - ${progress}%`;
          break;
        }
        currentIndex++;
      }
    }

    fs.writeFileSync(wipPath, lines.join('\n'), 'utf-8');
  }

  async updateWipProgress(index: number, progress: number): Promise<void> {
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }

    const wipPath = path.join(vaultPath, 'projects', 'current-wip.md');
    let content = fs.readFileSync(wipPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }

      const match = lines[i].match(/^(\d+)\.\s+\[(.*?)\]\s+(.+?)\s+-\s+(\d+)%/);
      if (match) {
        if (currentIndex === index) {
          const [, num, tag, title] = match;
          lines[i] = `${num}. [${tag}] ${title} - ${progress}%`;
          break;
        }
        currentIndex++;
      }
    }

    fs.writeFileSync(wipPath, lines.join('\n'), 'utf-8');
  }

  async completeWipItem(index: number): Promise<void> {
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }

    const wipPath = path.join(vaultPath, 'projects', 'current-wip.md');
    let content = fs.readFileSync(wipPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    let targetLine = '';
    let targetLineIndex = -1;

    // 완료할 항목 찾기
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }

      if (lines[i].match(/^\d+\.\s+\[/)) {
        if (currentIndex === index) {
          targetLine = lines[i];
          targetLineIndex = i;
          break;
        }
        currentIndex++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('WIP 항목을 찾을 수 없습니다');
    }

    // 완료된 작업 섹션 찾기
    let completedSectionIndex = lines.findIndex(l => l.startsWith('# 완료된 작업'));

    // 항목 제거
    lines.splice(targetLineIndex, 1);

    // 완료된 섹션에 추가 (번호 제거)
    const completedItem = targetLine.replace(/^\d+\.\s+/, '- ');

    if (completedSectionIndex === -1) {
      lines.push('', '# 완료된 작업', '', completedItem);
    } else {
      lines.splice(completedSectionIndex + 2, 0, completedItem);
    }

    // WIP 항목 번호 재정렬
    let wipNumber = 1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }
      const match = lines[i].match(/^(\d+)\.\s+(.+)/);
      if (match) {
        lines[i] = `${wipNumber}. ${match[2]}`;
        wipNumber++;
      }
    }

    fs.writeFileSync(wipPath, lines.join('\n'), 'utf-8');
  }

  async deleteWipItem(index: number): Promise<void> {
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }

    const wipPath = path.join(vaultPath, 'projects', 'current-wip.md');
    let content = fs.readFileSync(wipPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }

      if (lines[i].match(/^\d+\.\s+\[/)) {
        if (currentIndex === index) {
          targetLineIndex = i;
          break;
        }
        currentIndex++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('WIP 항목을 찾을 수 없습니다');
    }

    lines.splice(targetLineIndex, 1);

    // 번호 재정렬
    let wipNumber = 1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 작업')) {
        break;
      }
      const match = lines[i].match(/^(\d+)\.\s+(.+)/);
      if (match) {
        lines[i] = `${wipNumber}. ${match[2]}`;
        wipNumber++;
      }
    }

    fs.writeFileSync(wipPath, lines.join('\n'), 'utf-8');
  }

  // ==================== Checklist Operations ====================

  async getChecklistItems(): Promise<ChecklistItem[]> {
    return await this.vaultParser.getChecklist();
  }

  async getCompletedChecklistItems(): Promise<ChecklistItem[]> {
    return await this.vaultParser.getCompletedChecklist();
  }

  async addChecklistItem(text: string): Promise<void> {
    const weeklyPath = this.getWeeklyFilePath();
    let content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    // 마지막 체크리스트 항목 찾기
    let lastChecklistIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }
      if (lines[i].match(/^- \[([ x])\]/)) {
        lastChecklistIndex = i;
      }
    }

    const newItem = `- [ ] ${text}`;

    if (lastChecklistIndex >= 0) {
      lines.splice(lastChecklistIndex + 1, 0, newItem);
    } else {
      // 체크리스트 섹션 시작 부분에 추가
      const sectionIndex = lines.findIndex(l => l.includes('체크리스트'));
      if (sectionIndex >= 0) {
        lines.splice(sectionIndex + 1, 0, '', newItem);
      }
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async toggleChecklistItem(index: number): Promise<void> {
    const weeklyPath = this.getWeeklyFilePath();
    let content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    let targetLineIndex = -1;
    let targetLine = '';

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }

      const match = lines[i].match(/^- \[([ x])\]\s+(.+)/);
      if (match && match[1] === ' ') {
        if (currentIndex === index) {
          targetLineIndex = i;
          targetLine = lines[i];
          break;
        }
        currentIndex++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('체크리스트 항목을 찾을 수 없습니다');
    }

    // 완료 처리
    const completedItem = targetLine.replace('[ ]', '[x]');
    lines.splice(targetLineIndex, 1);

    // 완료된 섹션 찾기
    let completedSectionIndex = lines.findIndex(l => l.startsWith('# 완료된 체크리스트'));

    if (completedSectionIndex === -1) {
      lines.push('', '# 완료된 체크리스트', '', completedItem);
    } else {
      lines.splice(completedSectionIndex + 2, 0, completedItem);
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async updateChecklistPriority(
    index: number,
    priority: 'P1' | 'P2' | 'P3' | undefined
  ): Promise<void> {
    const weeklyPath = this.getWeeklyFilePath();
    let content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    const checklistWithPriorityRegex = /^- \[([ x])\]\s+\[(P[123])\]\s+(.+)/;
    const checklistRegex = /^- \[([ x])\]\s+(.+)/;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }

      const priorityMatch = lines[i].match(checklistWithPriorityRegex);
      if (priorityMatch && priorityMatch[1] === ' ') {
        if (currentIndex === index) {
          if (priority) {
            lines[i] = `- [ ] [${priority}] ${priorityMatch[3]}`;
          } else {
            lines[i] = `- [ ] ${priorityMatch[3]}`;
          }
          break;
        }
        currentIndex++;
        continue;
      }

      const match = lines[i].match(checklistRegex);
      if (match && match[1] === ' ') {
        if (currentIndex === index) {
          if (priority) {
            lines[i] = `- [ ] [${priority}] ${match[2]}`;
          }
          break;
        }
        currentIndex++;
      }
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async deleteChecklistItem(index: number): Promise<void> {
    const weeklyPath = this.getWeeklyFilePath();
    let content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }

      if (lines[i].match(/^- \[([ x])\]\s+/) && lines[i].match(/\[ \]/)) {
        if (currentIndex === index) {
          lines.splice(i, 1);
          break;
        }
        currentIndex++;
      }
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async deleteCompletedChecklistItem(index: number): Promise<void> {
    const weeklyPath = this.getWeeklyFilePath();
    let content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    let currentIndex = 0;
    let inCompletedSection = false;

    for (let i = 0; i < lines.length; i++) {
      // 완료된 섹션 시작
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        inCompletedSection = true;
        continue;
      }

      // 완료된 섹션 내에서만 처리
      if (!inCompletedSection) {
        continue;
      }

      // 완료된 체크리스트 항목 찾기
      if (lines[i].match(/^- \[x\]\s+/)) {
        if (currentIndex === index) {
          lines.splice(i, 1);
          break;
        }
        currentIndex++;
      }
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  // ==================== Common ====================

  getTodayMode(): { emoji: string; mode: string } {
    const today = new Date().getDay(); // 0=일, 1=월, ...
    const modes = [
      { emoji: '🌙', mode: '휴식' }, // 일요일
      { emoji: '🔥', mode: '집중' }, // 월요일
      { emoji: '💪', mode: '실행' }, // 화요일
      { emoji: '🎯', mode: '목표' }, // 수요일
      { emoji: '🚀', mode: '속도' }, // 목요일
      { emoji: '🎨', mode: '창작' }, // 금요일
      { emoji: '⚡', mode: '에너지' } // 토요일
    ];
    return modes[today];
  }

  // ==================== Private Helpers ====================

  private getWeeklyFilePath(): string {
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
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }

    const weeklyDir = path.join(vaultPath, 'journal', 'weekly');

    if (!fs.existsSync(weeklyDir)) {
      fs.mkdirSync(weeklyDir, { recursive: true });
    }

    const weeklyPath = path.join(weeklyDir, `${weekString}.md`);

    if (!fs.existsSync(weeklyPath)) {
      const template = `# ${weekString}\n\n## 이번 주 체크리스트\n\n`;
      fs.writeFileSync(weeklyPath, template, 'utf-8');
    }

    return weeklyPath;
  }
}
