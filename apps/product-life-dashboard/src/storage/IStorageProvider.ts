export interface WipItem {
  category?: string;
  title: string;
  progress: number;
}

export interface ChecklistItem {
  text: string;
  completed: boolean;
  priority?: 'P1' | 'P2' | 'P3';
}

export interface IStorageProvider {
  // WIP operations
  getWipItems(): Promise<WipItem[]>;
  addWipItem(title: string): Promise<void>;
  updateWipTag(index: number, tag: string): Promise<void>;
  updateWipProgress(index: number, progress: number): Promise<void>;
  completeWipItem(index: number): Promise<void>;
  deleteWipItem(index: number): Promise<void>;

  // Checklist operations
  getChecklistItems(): Promise<ChecklistItem[]>;
  getCompletedChecklistItems(): Promise<ChecklistItem[]>;
  addChecklistItem(text: string): Promise<void>;
  toggleChecklistItem(index: number): Promise<void>;
  updateChecklistPriority(index: number, priority: 'P1' | 'P2' | 'P3' | undefined): Promise<void>;
  deleteChecklistItem(index: number): Promise<void>;
  deleteCompletedChecklistItem(index: number): Promise<void>;

  // Common
  getTodayMode(): { emoji: string; mode: string };
}
