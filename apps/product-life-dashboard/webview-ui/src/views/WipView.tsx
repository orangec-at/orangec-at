import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { getVSCodeAPI } from '../vscode-api';
import { setLanguage, t } from '../i18n';
import WipList from '../components/WipList';
import '../components/Dashboard.css';

const vscode = getVSCodeAPI();

export default function WipView() {
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

  const handleUpdateTag = (index: number, newTag: string) => {
    vscode.postMessage({
      type: 'updateTag',
      index,
      tag: newTag
    });
  };

  const handleUpdateProgress = (index: number, progress: number) => {
    vscode.postMessage({
      type: 'updateProgress',
      index,
      progress
    });
  };

  const handleCompleteWip = (index: number) => {
    vscode.postMessage({
      type: 'completeWip',
      index
    });
  };

  const handleDeleteWip = (index: number) => {
    vscode.postMessage({
      type: 'deleteWip',
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

  console.log('📊 WIP View 데이터:', data);

  return (
    <div>
      <div className="header">
        <div className="mode">
          <span className="mode-emoji">{data.todayEmoji}</span>
          <span className="mode-text">{data.todayMode}</span>
        </div>
      </div>
      <WipList
        items={data.wip}
        onUpdateTag={handleUpdateTag}
        onUpdateProgress={handleUpdateProgress}
        onCompleteWip={handleCompleteWip}
        onDeleteWip={handleDeleteWip}
        language={data.language}
      />
    </div>
  );
}
