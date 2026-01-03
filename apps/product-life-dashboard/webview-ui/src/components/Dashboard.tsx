import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import QuickAdd from './QuickAdd';
import WipList from './WipList';
import Checklist from './Checklist';
import TagManager from './TagManager';
import './Dashboard.css';

const vscode = window.acquireVsCodeApi();

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    console.log('🎨 React Dashboard 마운트됨!');

    // Extension → Webview 메시지 수신
    const handleMessage = (event: MessageEvent) => {
      console.log('📨 메시지 수신:', event.data);
      const message = event.data;

      switch (message.type) {
        case 'update':
          console.log('📊 Dashboard 데이터 수신:', message.data);
          setData(message.data);
          break;
        default:
          console.log('⚠️ 알 수 없는 메시지 타입:', message.type);
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('✅ 메시지 리스너 등록 완료');

    // React 준비 완료 → Extension에게 데이터 요청
    console.log('📤 Extension에게 데이터 요청 중...');
    vscode.postMessage({ type: 'webviewReady' });

    return () => {
      console.log('🔥 메시지 리스너 제거');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleAddTodo = (text: string) => {
    console.log('📤 TODO 추가 요청:', text);
    vscode.postMessage({
      type: 'addTodo',
      text
    });
  };

  const handleRefresh = () => {
    console.log('🔄 새로고침 요청');
    vscode.postMessage({ type: 'refresh' });
  };

  const handleToggleChecklist = (index: number) => {
    console.log('✅ 체크리스트 토글:', index);
    vscode.postMessage({
      type: 'toggleChecklist',
      index
    });
  };

  const handleUpdateTag = (index: number, newTag: string) => {
    console.log('🏷️ 태그 업데이트:', index, newTag);
    vscode.postMessage({
      type: 'updateTag',
      index,
      tag: newTag
    });
  };

  if (!data) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>데이터 로딩중...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="header">
        <div className="mode">
          <span className="mode-emoji">{data.todayEmoji}</span>
          <span className="mode-text">{data.todayMode}</span>
        </div>
        <button className="refresh-btn" onClick={handleRefresh} title="새로고침">
          🔄
        </button>
      </div>

      <QuickAdd onAdd={handleAddTodo} />
      <TagManager items={data.wip} />
      <WipList items={data.wip} onUpdateTag={handleUpdateTag} />
      <Checklist items={data.checklist} onToggle={handleToggleChecklist} />
    </div>
  );
}
