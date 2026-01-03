import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { getVSCodeAPI } from '../vscode-api';
import { setLanguage, t } from '../i18n';
import TagManager from '../components/TagManager';
import '../components/Dashboard.css';

const vscode = getVSCodeAPI();

export default function TagManagerView() {
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
      <TagManager items={data.wip} />
    </div>
  );
}
