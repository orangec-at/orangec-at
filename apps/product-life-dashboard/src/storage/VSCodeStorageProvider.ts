import * as vscode from 'vscode';
import { IStorageProvider, WipItem, ChecklistItem } from './IStorageProvider';

/**
 * VS Code Workspace State 기반 Storage Provider
 * - Vault 없이도 작동
 * - JSON 형태로 데이터 저장
 */
export class VSCodeStorageProvider implements IStorageProvider {
  private context: vscode.ExtensionContext;
  private readonly WIP_KEY = 'productLife.wip';
  private readonly CHECKLIST_KEY = 'productLife.checklist';

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  // ==================== WIP Operations ====================

  async getWipItems(): Promise<WipItem[]> {
    return this.context.workspaceState.get<WipItem[]>(this.WIP_KEY, []);
  }

  async addWipItem(title: string): Promise<void> {
    const items = await this.getWipItems();
    items.push({
      title,
      progress: 0
    });
    await this.context.workspaceState.update(this.WIP_KEY, items);
  }

  async updateWipTag(index: number, tag: string): Promise<void> {
    const items = await this.getWipItems();
    if (index >= 0 && index < items.length) {
      items[index].category = tag;
      await this.context.workspaceState.update(this.WIP_KEY, items);
    } else {
      throw new Error(`WIP 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  async updateWipProgress(index: number, progress: number): Promise<void> {
    const items = await this.getWipItems();
    if (index >= 0 && index < items.length) {
      items[index].progress = progress;
      await this.context.workspaceState.update(this.WIP_KEY, items);
    } else {
      throw new Error(`WIP 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  async completeWipItem(index: number): Promise<void> {
    const items = await this.getWipItems();
    if (index >= 0 && index < items.length) {
      // 완료된 항목은 삭제 (또는 별도 키에 저장할 수도 있음)
      items.splice(index, 1);
      await this.context.workspaceState.update(this.WIP_KEY, items);
    } else {
      throw new Error(`WIP 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  async deleteWipItem(index: number): Promise<void> {
    const items = await this.getWipItems();
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      await this.context.workspaceState.update(this.WIP_KEY, items);
    } else {
      throw new Error(`WIP 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  // ==================== Checklist Operations ====================

  async getChecklistItems(): Promise<ChecklistItem[]> {
    const allItems = this.context.workspaceState.get<ChecklistItem[]>(this.CHECKLIST_KEY, []);
    return allItems.filter(item => !item.completed);
  }

  async getCompletedChecklistItems(): Promise<ChecklistItem[]> {
    const allItems = this.context.workspaceState.get<ChecklistItem[]>(this.CHECKLIST_KEY, []);
    return allItems.filter(item => item.completed);
  }

  async addChecklistItem(text: string): Promise<void> {
    const items = await this.getChecklistItems();
    items.push({
      text,
      completed: false
    });
    await this.context.workspaceState.update(this.CHECKLIST_KEY, items);
  }

  async toggleChecklistItem(index: number): Promise<void> {
    const items = await this.getChecklistItems();

    // 완료되지 않은 항목만 카운트
    const activeItems = items.filter(item => !item.completed);

    if (index >= 0 && index < activeItems.length) {
      const targetItem = activeItems[index];
      const actualIndex = items.indexOf(targetItem);

      items[actualIndex].completed = true;
      await this.context.workspaceState.update(this.CHECKLIST_KEY, items);
    } else {
      throw new Error(`체크리스트 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  async updateChecklistPriority(
    index: number,
    priority: 'P1' | 'P2' | 'P3' | undefined
  ): Promise<void> {
    const items = await this.getChecklistItems();

    // 완료되지 않은 항목만 카운트
    const activeItems = items.filter(item => !item.completed);

    if (index >= 0 && index < activeItems.length) {
      const targetItem = activeItems[index];
      const actualIndex = items.indexOf(targetItem);

      items[actualIndex].priority = priority;
      await this.context.workspaceState.update(this.CHECKLIST_KEY, items);
    } else {
      throw new Error(`체크리스트 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  async deleteChecklistItem(index: number): Promise<void> {
    const items = await this.getChecklistItems();

    // 완료되지 않은 항목만 카운트
    const activeItems = items.filter(item => !item.completed);

    if (index >= 0 && index < activeItems.length) {
      const targetItem = activeItems[index];
      const actualIndex = items.indexOf(targetItem);

      items.splice(actualIndex, 1);
      await this.context.workspaceState.update(this.CHECKLIST_KEY, items);
    } else {
      throw new Error(`체크리스트 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
  }

  async deleteCompletedChecklistItem(index: number): Promise<void> {
    const allItems = this.context.workspaceState.get<ChecklistItem[]>(this.CHECKLIST_KEY, []);

    // 완료된 항목만 필터링
    const completedItems = allItems.filter(item => item.completed);

    if (index >= 0 && index < completedItems.length) {
      const targetItem = completedItems[index];
      const actualIndex = allItems.indexOf(targetItem);

      allItems.splice(actualIndex, 1);
      await this.context.workspaceState.update(this.CHECKLIST_KEY, allItems);
    } else {
      throw new Error(`완료된 체크리스트 항목 인덱스 ${index}를 찾을 수 없습니다`);
    }
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
}
