import { useState, useEffect } from 'react';
import { getVSCodeAPI } from '../vscode-api';
import { setLanguage, t, Language } from '../i18n';
import '../components/Dashboard.css';

const vscode = getVSCodeAPI();

export default function QuickAddView() {
  const [wipInput, setWipInput] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [currentLang, setCurrentLang] = useState<Language>('ko');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'update' && message.data?.language) {
        setLanguage(message.data.language);
        setCurrentLang(message.data.language);
      }
    };

    window.addEventListener('message', handleMessage);
    vscode.postMessage({ type: 'webviewReady' });

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const translations = t();

  const handleAddWip = () => {
    const text = wipInput.trim();
    if (text) {
      console.log('📤 WIP 추가 요청:', text);
      vscode.postMessage({
        type: 'addTodo',
        text
      });
      setWipInput('');
    }
  };

  const handleAddChecklist = () => {
    const text = checklistInput.trim();
    if (text) {
      console.log('📤 체크리스트 추가 요청:', text);
      vscode.postMessage({
        type: 'addChecklist',
        text
      });
      setChecklistInput('');
    }
  };

  return (
    <div className="quick-add-container">
      <div className="section">
        <div className="section-title">{translations.quickAdd.wipTitle}</div>
        <div className="quick-add-form">
          <input
            type="text"
            className="todo-input"
            placeholder={translations.quickAdd.wipPlaceholder}
            value={wipInput}
            onChange={(e) => setWipInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWip()}
          />
          <button className="add-btn" onClick={handleAddWip}>
            {translations.common.add}
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section-title">{translations.quickAdd.checklistTitle}</div>
        <div className="quick-add-form">
          <input
            type="text"
            className="todo-input"
            placeholder={translations.quickAdd.checklistPlaceholder}
            value={checklistInput}
            onChange={(e) => setChecklistInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddChecklist()}
          />
          <button className="add-btn" onClick={handleAddChecklist}>
            {translations.common.add}
          </button>
        </div>
      </div>
    </div>
  );
}
