"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Checklist;
function Checklist({ items }) {
    const completedCount = items.filter(item => item.completed).length;
    const totalCount = items.length || 1;
    const progressPercent = Math.round((completedCount / totalCount) * 100);
    return (<div className="section">
      <div className="section-title">✅ 이번 주 체크리스트</div>
      <div className="checklist">
        {items.length === 0 ? (<div className="empty-state">체크리스트 없음</div>) : (items.map((item, index) => (<div key={index} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
              <span className="checkbox">
                {item.completed ? '✅' : '⬜'}
              </span>
              <span className="checklist-text">{item.text}</span>
            </div>)))}
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
    </div>);
}
//# sourceMappingURL=Checklist.js.map