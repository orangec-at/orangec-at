import * as fs from 'fs';
import * as path from 'path';
import { VaultParser } from '../vaultParser';

export class WipService {
  constructor(private vaultParser: VaultParser) {}

  private getWipFilePath(): string {
    const vaultPath = this.vaultParser.getVaultPath();
    if (!vaultPath) {
      throw new Error('vault 경로를 찾을 수 없습니다');
    }
    return path.join(vaultPath, 'projects', 'current-wip.md');
  }

  async addWip(text: string): Promise<void> {
    const wipFilePath = this.getWipFilePath();
    const content = fs.readFileSync(wipFilePath, 'utf-8');
    const lines = content.split('\n');
    const wipSectionIndex = lines.findIndex(line => line.startsWith('# 진행중인 작업'));

    if (wipSectionIndex === -1) {
      throw new Error('WIP 섹션을 찾을 수 없습니다');
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
  }

  async updateTag(index: number, newTag: string): Promise<void> {
    const wipFilePath = this.getWipFilePath();
    const content = fs.readFileSync(wipFilePath, 'utf-8');
    const lines = content.split('\n');

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
      throw new Error('WIP 항목을 찾을 수 없습니다');
    }

    const line = lines[targetLineIndex];
    if (hasTag) {
      lines[targetLineIndex] = line.replace(/\[(.+?)\]/, `[${newTag}]`);
    } else {
      lines[targetLineIndex] = line.replace(/^(\d+\.\s+)/, `$1[${newTag}] `);
    }

    fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');
  }

  async updateProgress(index: number, newProgress: number): Promise<void> {
    const wipFilePath = this.getWipFilePath();
    const content = fs.readFileSync(wipFilePath, 'utf-8');
    const lines = content.split('\n');

    const regexWithTag = /^\d+\.\s+\[(.+?)\]\s+(.+?)\s+-\s+(\d+)%/;
    const regexWithoutTag = /^\d+\.\s+([^\[].+?)\s+-\s+(\d+)%/;
    let wipCount = 0;
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const matchWithTag = lines[i].match(regexWithTag);
      const matchWithoutTag = lines[i].match(regexWithoutTag);

      if (matchWithTag || matchWithoutTag) {
        if (wipCount === index) {
          targetLineIndex = i;
          break;
        }
        wipCount++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('WIP 항목을 찾을 수 없습니다');
    }

    const line = lines[targetLineIndex];
    lines[targetLineIndex] = line.replace(/\d+%/, `${newProgress}%`);

    fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');
  }

  async completeWip(index: number): Promise<void> {
    const wipFilePath = this.getWipFilePath();
    const content = fs.readFileSync(wipFilePath, 'utf-8');
    const lines = content.split('\n');

    const regexWithTag = /^\d+\.\s+\[(.+?)\]\s+(.+?)\s+-\s+(\d+)%/;
    const regexWithoutTag = /^\d+\.\s+([^\[].+?)\s+-\s+(\d+)%/;
    let wipCount = 0;
    let targetLineIndex = -1;
    let completedItem = '';

    for (let i = 0; i < lines.length; i++) {
      const matchWithTag = lines[i].match(regexWithTag);
      const matchWithoutTag = lines[i].match(regexWithoutTag);

      if (matchWithTag || matchWithoutTag) {
        if (wipCount === index) {
          targetLineIndex = i;
          completedItem = lines[i].replace(/\d+%/, '100%');
          break;
        }
        wipCount++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('WIP 항목을 찾을 수 없습니다');
    }

    // Remove from WIP section
    lines.splice(targetLineIndex, 1);

    // Find or create completed section
    let completedSectionIndex = lines.findIndex(line => line.startsWith('# 완료된 작업'));

    if (completedSectionIndex === -1) {
      lines.push('', '# 완료된 작업', completedItem);
    } else {
      lines.splice(completedSectionIndex + 1, 0, completedItem);
    }

    // Renumber WIP items
    wipCount = 1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(regexWithTag)) {
        lines[i] = lines[i].replace(/^\d+\./, `${wipCount}.`);
        wipCount++;
      } else if (lines[i].match(regexWithoutTag)) {
        lines[i] = lines[i].replace(/^\d+\./, `${wipCount}.`);
        wipCount++;
      }
    }

    fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');
  }

  async deleteWip(index: number): Promise<void> {
    const wipFilePath = this.getWipFilePath();
    const content = fs.readFileSync(wipFilePath, 'utf-8');
    const lines = content.split('\n');

    const regexWithTag = /^\d+\.\s+\[(.+?)\]\s+(.+?)\s+-\s+(\d+)%/;
    const regexWithoutTag = /^\d+\.\s+([^\[].+?)\s+-\s+(\d+)%/;
    let wipCount = 0;
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const matchWithTag = lines[i].match(regexWithTag);
      const matchWithoutTag = lines[i].match(regexWithoutTag);

      if (matchWithTag || matchWithoutTag) {
        if (wipCount === index) {
          targetLineIndex = i;
          break;
        }
        wipCount++;
      }
    }

    if (targetLineIndex === -1) {
      throw new Error('WIP 항목을 찾을 수 없습니다');
    }

    // Remove the item
    lines.splice(targetLineIndex, 1);

    // Renumber WIP items
    wipCount = 1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(regexWithTag)) {
        lines[i] = lines[i].replace(/^\d+\./, `${wipCount}.`);
        wipCount++;
      } else if (lines[i].match(regexWithoutTag)) {
        lines[i] = lines[i].replace(/^\d+\./, `${wipCount}.`);
        wipCount++;
      }
    }

    fs.writeFileSync(wipFilePath, lines.join('\n'), 'utf-8');
  }
}
