"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WipList;
function WipList({ items }) {
    return (<div className="section">
      <div className="section-title">⚡ 진행중 (WIP)</div>
      <div className="wip-list">
        {items.length === 0 ? (<div className="empty-state">WIP 항목 없음</div>) : (items.map((item, index) => (<div key={index} className="wip-item">
              <div className="wip-header">
                <span className="wip-category">{item.category}</span>
                <span className="wip-title">{item.title}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.progress}%` }}/>
              </div>
              <div className="progress-text">{item.progress}%</div>
            </div>)))}
      </div>
    </div>);
}
//# sourceMappingURL=WipList.js.map