import { WipItem } from '../types';

interface TagManagerProps {
  items: WipItem[];
}

export default function TagManager({ items }: TagManagerProps) {
  // 모든 태그와 각 태그의 사용 횟수 계산
  const tagStats = items.reduce((acc, item) => {
    if (item.category) {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const tagEntries = Object.entries(tagStats).sort((a, b) => b[1] - a[1]);
  const untaggedCount = items.filter(item => !item.category).length;

  return (
    <div className="section">
      <div className="section-title">🏷️ 태그 관리</div>
      <div className="tag-manager">
        <div className="tag-stats">
          {tagEntries.map(([tag, count]) => (
            <div key={tag} className="tag-stat-item">
              <span className="tag-badge">{tag}</span>
              <span className="tag-count">{count}개 항목</span>
            </div>
          ))}
          {untaggedCount > 0 && (
            <div className="tag-stat-item warning">
              <span className="tag-badge no-tag">태그 없음</span>
              <span className="tag-count">{untaggedCount}개 항목</span>
            </div>
          )}
        </div>
        {tagEntries.length === 0 && untaggedCount === 0 && (
          <div className="empty-state">WIP 항목이 없습니다</div>
        )}
      </div>
    </div>
  );
}
