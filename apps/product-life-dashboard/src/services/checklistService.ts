import * as fs from 'fs';
import { VaultParser } from '../vaultParser';

export class ChecklistService {
  constructor(private vaultParser: VaultParser) {}

  async addChecklist(text: string): Promise<void> {
    const weeklyPath = this.vaultParser.getWeeklyFilePath();

    if (!fs.existsSync(weeklyPath)) {
      throw new Error('주간 체크리스트 파일을 찾을 수 없습니다');
    }

    const content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    // 마지막 체크리스트 항목 찾기
    let lastChecklistIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].match(/^- \[([ x])\]/)) {
        lastChecklistIndex = i;
        break;
      }
    }

    const newLine = `- [ ] ${text}`;

    if (lastChecklistIndex === -1) {
      lines.push(newLine);
    } else {
      lines.splice(lastChecklistIndex + 1, 0, newLine);
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async toggleChecklist(index: number): Promise<void> {
    const weeklyPath = this.vaultParser.getWeeklyFilePath();
    const content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    const checklistRegex = /^- \[([ x])\]\s+(.+)/;
    let checklistCount = 0;
    let targetLineIndex = -1;
    let completedItem = '';

    // 완료되지 않은 항목만 카운트
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }

      const match = lines[i].match(checklistRegex);
      if (match && match[1] === ' ') {
        if (checklistCount === index) {
          targetLineIndex = i;
          completedItem = lines[i].replace('[ ]', '[x]');
          break;
        }
        checklistCount++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('체크리스트 항목을 찾을 수 없습니다');
    }

    // 항목 제거
    lines.splice(targetLineIndex, 1);

    // 완료된 섹션 찾기 또는 생성
    let completedSectionIndex = lines.findIndex(line =>
      line.startsWith('# 완료된 체크리스트')
    );

    if (completedSectionIndex === -1) {
      lines.push('', '# 완료된 체크리스트', completedItem);
    } else {
      lines.splice(completedSectionIndex + 1, 0, completedItem);
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async updateChecklistPriority(
    index: number,
    priority: 'P1' | 'P2' | 'P3' | undefined
  ): Promise<void> {
    const weeklyPath = this.vaultParser.getWeeklyFilePath();
    const content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    const checklistWithPriorityRegex = /^- \[([ x])\]\s+\[(P[123])\]\s+(.+)/;
    const checklistRegex = /^- \[([ x])\]\s+(.+)/;
    let checklistCount = 0;
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }

      const priorityMatch = lines[i].match(checklistWithPriorityRegex);
      const match = lines[i].match(checklistRegex);

      if ((priorityMatch || match) && (priorityMatch?.[1] === ' ' || match?.[1] === ' ')) {
        if (checklistCount === index) {
          targetLineIndex = i;
          break;
        }
        checklistCount++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('체크리스트 항목을 찾을 수 없습니다');
    }

    const line = lines[targetLineIndex];
    const priorityMatch = line.match(checklistWithPriorityRegex);
    const normalMatch = line.match(checklistRegex);

    if (priority) {
      if (priorityMatch) {
        lines[targetLineIndex] = line.replace(/\[P[123]\]/, `[${priority}]`);
      } else if (normalMatch) {
        const state = normalMatch[1];
        const text = normalMatch[2];
        lines[targetLineIndex] = `- [${state}] [${priority}] ${text}`;
      }
    } else {
      if (priorityMatch) {
        const state = priorityMatch[1];
        const text = priorityMatch[3];
        lines[targetLineIndex] = `- [${state}] ${text}`;
      }
    }

    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }

  async deleteChecklist(index: number): Promise<void> {
    const weeklyPath = this.vaultParser.getWeeklyFilePath();
    const content = fs.readFileSync(weeklyPath, 'utf-8');
    const lines = content.split('\n');

    const checklistWithPriorityRegex = /^- \[([ x])\]\s+\[(P[123])\]\s+(.+)/;
    const checklistRegex = /^- \[([ x])\]\s+(.+)/;
    let checklistCount = 0;
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# 완료된 체크리스트')) {
        break;
      }

      const priorityMatch = lines[i].match(checklistWithPriorityRegex);
      const match = lines[i].match(checklistRegex);

      if ((priorityMatch || match) && (priorityMatch?.[1] === ' ' || match?.[1] === ' ')) {
        if (checklistCount === index) {
          targetLineIndex = i;
          break;
        }
        checklistCount++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('체크리스트 항목을 찾을 수 없습니다');
    }

    lines.splice(targetLineIndex, 1);
    fs.writeFileSync(weeklyPath, lines.join('\n'), 'utf-8');
  }
}
