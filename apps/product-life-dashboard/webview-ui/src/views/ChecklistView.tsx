import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { getVSCodeAPI } from '../vscode-api';
import { setLanguage, t } from '../i18n';
import Checklist from '../components/Checklist';
import '../components/Dashboard.css';

const vscode = getVSCodeAPI();

export default function ChecklistView() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'update') {
        if (message.data?.language) {
          setLanguage(message.data.language);
        }
        setData(message.data);
      }
    };

    window.addEventListener('message', handleMessage);
    vscode.postMessage({ type: 'webviewReady' });

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const translations = t();

  const handleToggleChecklist = (index: number) => {
    vscode.postMessage({
      type: 'toggleChecklist',
      index
    });
  };

  const handleUpdatePriority = (index: number, priority: 'P1' | 'P2' | 'P3' | undefined) => {
    vscode.postMessage({
      type: 'updateChecklistPriority',
      index,
      priority
    });
  };

  const handleDelete = (index: number) => {
    vscode.postMessage({
      type: 'deleteChecklist',
      index
    });
  };

  const handleDeleteCompleted = (index: number) => {
    vscode.postMessage({
      type: 'deleteCompletedChecklist',
      index
    });
  };

  if (!data) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>{translations.common.loading}</p>
      </div>
    );
  }

  return (
    <div>
      <Checklist 
        items={data.checklist} 
        completedItems={data.completedChecklist}
        onToggle={handleToggleChecklist}
        onUpdatePriority={handleUpdatePriority}
        onDelete={handleDelete}
        onDeleteCompleted={handleDeleteCompleted}
      />
    </div>
  );
}
