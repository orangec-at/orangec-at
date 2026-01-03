import { useState, useEffect } from 'react';
import { getVSCodeAPI } from '../vscode-api';
import { setLanguage, t, Language } from '../i18n';
import '../components/Dashboard.css';

const vscode = getVSCodeAPI();

export default function SettingsView() {
  const [currentLang, setCurrentLang] = useState<Language>('ko');
  const [showApplied, setShowApplied] = useState(false);

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

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    vscode.postMessage({
      type: 'changeLanguage',
      language: lang
    });

    // Show "Applied" message
    setShowApplied(true);
    setTimeout(() => setShowApplied(false), 2000);
  };

  return (
    <div className="settings-container">
      <div className="section">
        <div className="section-title">{translations.settings.title}</div>

        <div className="setting-item">
          <div className="setting-label">{translations.settings.language}</div>
          <div className="setting-description">
            {translations.settings.languageDescription}
          </div>

          <div className="language-options">
            <label className="language-option">
              <input
                type="radio"
                name="language"
                value="ko"
                checked={currentLang === 'ko'}
                onChange={() => handleLanguageChange('ko')}
              />
              <span>{translations.settings.korean}</span>
            </label>

            <label className="language-option">
              <input
                type="radio"
                name="language"
                value="en"
                checked={currentLang === 'en'}
                onChange={() => handleLanguageChange('en')}
              />
              <span>{translations.settings.english}</span>
            </label>
          </div>

          {showApplied && (
            <div className="applied-message">
              ✓ {translations.settings.applied}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
