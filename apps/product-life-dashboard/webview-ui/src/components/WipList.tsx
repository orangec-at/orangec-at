import { useState } from 'react';
import { WipItem } from '../types';
import { t, Language } from '../i18n';

interface WipListProps {
  items: WipItem[];
  onUpdateTag: (index: number, newTag: string) => void;
  onUpdateProgress?: (index: number, progress: number) => void;
  onCompleteWip?: (index: number) => void;
  onDeleteWip?: (index: number) => void;
  onReorderWip?: (fromIndex: number, toIndex: number) => void;
  language?: Language;
}

export default function WipList({ items, onUpdateTag, onUpdateProgress, onCompleteWip, onDeleteWip, onReorderWip, language = 'ko' }: WipListProps) {
  const translations = t();
  const COMMON_TAGS = [
    translations.tags.product,
    translations.tags.marketing,
    translations.tags.career,
    translations.tags.buffer,
    translations.tags.life
  ];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [editingProgressIndex, setEditingProgressIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleTagClick = (index: number) => {
    setEditingIndex(index);
    setShowCustomInput(false);
    setCustomTag('');
  };

  const handleTagSelect = (index: number, tag: string) => {
    onUpdateTag(index, tag);
    setEditingIndex(null);
    setShowCustomInput(false);
    setCustomTag('');
  };

  const handleCustomTagSubmit = (index: number) => {
    if (customTag.trim()) {
      onUpdateTag(index, customTag.trim());
      setEditingIndex(null);
      setShowCustomInput(false);
      setCustomTag('');
    }
  };

  const handleProgressClick = (index: number) => {
    setEditingProgressIndex(index);
  };

  const handleProgressChange = (index: number, newProgress: number) => {
    if (onUpdateProgress) {
      onUpdateProgress(index, newProgress);
    }
  };

  const handleProgressBlur = () => {
    setEditingProgressIndex(null);
  };

  const handleComplete = (index: number) => {
    if (onCompleteWip) {
      onCompleteWip(index);
    }
  };

  const handleDeleteClick = (index: number) => {
    setDeletingIndex(index);
  };

  const handleDeleteConfirm = (index: number) => {
    if (onDeleteWip) {
      onDeleteWip(index);
    }
    setDeletingIndex(null);
  };

  const handleDeleteCancel = () => {
    setDeletingIndex(null);
  };

  return (
    <div className="section">
      <div className="wip-list">
        {items.length === 0 ? (
          <div className="empty-state">{language === 'ko' ? 'WIP 항목 없음' : 'No WIP items'}</div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="wip-item">
              {deletingIndex === index ? (
                <div className="delete-confirm">
                  <span>{language === 'ko' ? '정말 삭제하시겠습니까?' : 'Delete this item?'}</span>
                  <div className="delete-confirm-buttons">
                    <button
                      className="confirm-btn delete"
                      onClick={() => handleDeleteConfirm(index)}
                    >
                      {language === 'ko' ? '삭제' : 'Delete'}
                    </button>
                    <button
                      className="confirm-btn cancel"
                      onClick={handleDeleteCancel}
                    >
                      {language === 'ko' ? '취소' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="wip-header">
                {editingIndex === index ? (
                  <div className="tag-editor">
                    <div className="tag-selector">
                      {COMMON_TAGS.map((tag) => (
                        <button
                          key={tag}
                          className="tag-option"
                          onClick={() => handleTagSelect(index, tag)}
                        >
                          {tag}
                        </button>
                      ))}
                      <button
                        className="tag-option custom"
                        onClick={() => setShowCustomInput(!showCustomInput)}
                      >
                        {translations.tagManager.customTag}
                      </button>
                    </div>
                    {showCustomInput && (
                      <div className="custom-tag-input">
                        <input
                          type="text"
                          placeholder={translations.tagManager.newTagPlaceholder}
                          value={customTag}
                          onChange={(e) => setCustomTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleCustomTagSubmit(index)}
                          autoFocus
                        />
                        <button onClick={() => handleCustomTagSubmit(index)}>✓</button>
                        <button onClick={() => setEditingIndex(null)}>✕</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <span
                    className={`wip-category ${!item.category ? 'no-tag' : ''}`}
                    onClick={() => handleTagClick(index)}
                    style={{ cursor: 'pointer' }}
                    title={language === 'ko' ? '클릭하여 태그 변경' : 'Click to change tag'}
                  >
                    {item.category || translations.wip.noTag}
                  </span>
                )}
                <span className="wip-title">{item.title}</span>
                <div className="wip-actions">
                  <button
                    className="action-btn complete"
                    onClick={() => handleComplete(index)}
                    title={language === 'ko' ? '완료' : 'Complete'}
                  >
                    ✓
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteClick(index)}
                    title={language === 'ko' ? '삭제' : 'Delete'}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {editingProgressIndex === index ? (
                <div className="progress-editor">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={item.progress}
                    onChange={(e) => handleProgressChange(index, parseInt(e.target.value))}
                    onBlur={handleProgressBlur}
                    className="progress-slider"
                    autoFocus
                  />
                  <div className="progress-text">{item.progress}%</div>
                </div>
              ) : (
                <div onClick={() => handleProgressClick(index)} style={{ cursor: 'pointer' }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="progress-text">{item.progress}%</div>
                </div>
              )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
