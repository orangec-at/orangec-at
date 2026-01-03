import { useState } from 'react';
import { ChecklistItem } from '../types';

interface ChecklistProps {
  items: ChecklistItem[];
  completedItems?: ChecklistItem[];
  onToggle: (index: number) => void;
  onUpdatePriority?: (index: number, priority: 'P1' | 'P2' | 'P3' | undefined) => void;
  onDelete?: (index: number) => void;
  onDeleteCompleted?: (index: number) => void;
}

export default function Checklist({ items, completedItems = [], onToggle, onUpdatePriority, onDelete, onDeleteCompleted }: ChecklistProps) {
  const [editingPriorityIndex, setEditingPriorityIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [deletingCompletedIndex, setDeletingCompletedIndex] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  const completedCount = completedItems.length;
  const totalCount = items.length + completedItems.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const renderChecklistItem = (item: any, index: number, isCompleted: boolean = false) => {
    const isDeletingThis = isCompleted
      ? deletingCompletedIndex === index
      : deletingIndex === index;

    if (isDeletingThis) {
      return (
        <div key={index} className="delete-confirm">
          <span>정말 삭제하시겠습니까?</span>
          <div className="delete-confirm-buttons">
            <button
              className="confirm-btn delete"
              onClick={() => {
                if (isCompleted && onDeleteCompleted) {
                  onDeleteCompleted(index);
                  setDeletingCompletedIndex(null);
                } else if (!isCompleted && onDelete) {
                  onDelete(index);
                  setDeletingIndex(null);
                }
              }}
            >
              삭제
            </button>
            <button
              className="confirm-btn cancel"
              onClick={() => {
                if (isCompleted) {
                  setDeletingCompletedIndex(null);
                } else {
                  setDeletingIndex(null);
                }
              }}
            >
              취소
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`checklist-item ${isCompleted ? 'completed' : ''}`}
        style={isCompleted ? { opacity: 0.6, color: '#888' } : {}}
      >
        <span
          className="checkbox"
          onClick={() => !isCompleted && onToggle(index)}
          style={{ cursor: isCompleted ? 'default' : 'pointer' }}
        >
          {isCompleted ? '✅' : '⬜'}
        </span>

        {!isCompleted && editingPriorityIndex === index ? (
          <div className="tag-editor" onClick={(e) => e.stopPropagation()}>
            <div className="tag-selector">
              <button
                className="tag-option"
                onClick={() => {
                  if (onUpdatePriority) onUpdatePriority(index, 'P1');
                  setEditingPriorityIndex(null);
                }}
              >
                🔴 P1
              </button>
              <button
                className="tag-option"
                onClick={() => {
                  if (onUpdatePriority) onUpdatePriority(index, 'P2');
                  setEditingPriorityIndex(null);
                }}
              >
                🟡 P2
              </button>
              <button
                className="tag-option"
                onClick={() => {
                  if (onUpdatePriority) onUpdatePriority(index, 'P3');
                  setEditingPriorityIndex(null);
                }}
              >
                🟢 P3
              </button>
              <button
                className="tag-option"
                onClick={() => {
                  if (onUpdatePriority) onUpdatePriority(index, undefined);
                  setEditingPriorityIndex(null);
                }}
              >
                ✕ None
              </button>
            </div>
          </div>
        ) : (
          <span
            className={`wip-category ${item.priority ? `priority-${item.priority.toLowerCase()}` : 'no-priority'}`}
            onClick={(e) => {
              if (!isCompleted) {
                e.stopPropagation();
                setEditingPriorityIndex(index);
              }
            }}
            style={{ cursor: isCompleted ? 'default' : 'pointer' }}
          >
            {item.priority ? `${item.priority === 'P1' ? '🔴' : item.priority === 'P2' ? '🟡' : '🟢'} ${item.priority}` : '⚪ None'}
          </span>
        )}

        <span className="checklist-text">{item.text}</span>

        <div className="wip-actions">
          <button
            className="action-btn delete"
            onClick={() => {
              if (isCompleted) {
                setDeletingCompletedIndex(index);
              } else {
                setDeletingIndex(index);
              }
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <div className="section-title">✅ 이번 주 체크리스트</div>
      <div className="checklist">
        {items.length === 0 && completedItems.length === 0 ? (
          <div className="empty-state">체크리스트 없음</div>
        ) : (
          <>
            {/* 미완료 항목 */}
            {items.map((item, index) => renderChecklistItem(item, index, false))}

            {/* 완료된 항목 섹션 */}
            {completedItems.length > 0 && (
              <>
                <div
                  className="completed-header"
                  onClick={() => setShowCompleted(!showCompleted)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    marginTop: '12px',
                    borderTop: '1px solid #333',
                    color: '#888',
                    fontSize: '0.9em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{showCompleted ? '▼' : '▶'}</span>
                  <span>완료된 항목 ({completedItems.length})</span>
                </div>
                {showCompleted && completedItems.map((item, index) => renderChecklistItem(item, index, true))}
              </>
            )}
          </>
        )}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">완료</div>
        </div>
        <div className="stat">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">전체</div>
        </div>
        <div className="stat">
          <div className="stat-value">{progressPercent}%</div>
          <div className="stat-label">진행률</div>
        </div>
      </div>
    </div>
  );
}
