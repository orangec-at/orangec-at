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

export interface DashboardData {
  todayEmoji: string;
  todayMode: string;
  wip: WipItem[];
  checklist: ChecklistItem[];
  completedChecklist: ChecklistItem[];
  language: 'ko' | 'en';
}

export interface VSCodeAPI {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

declare global {
  interface Window {
    acquireVsCodeApi(): VSCodeAPI;
  }
}
