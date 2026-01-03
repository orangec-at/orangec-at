"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_1 = require("react");
const QuickAdd_1 = __importDefault(require("./QuickAdd"));
const WipList_1 = __importDefault(require("./WipList"));
const Checklist_1 = __importDefault(require("./Checklist"));
require("./Dashboard.css");
const vscode = window.acquireVsCodeApi();
function Dashboard() {
    const [data, setData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // Extension → Webview 메시지 수신
        const handleMessage = (event) => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    console.log('📊 Dashboard 데이터 수신:', message.data);
                    setData(message.data);
                    break;
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    const handleAddTodo = (text) => {
        console.log('📤 TODO 추가 요청:', text);
        vscode.postMessage({
            type: 'addTodo',
            text
        });
    };
    if (!data) {
        return (<div className="loading">
        <div className="loading-spinner"></div>
        <p>데이터 로딩중...</p>
      </div>);
    }
    return (<div className="dashboard">
      <div className="header">
        <div className="mode">
          <span className="mode-emoji">{data.todayEmoji}</span>
          <span className="mode-text">{data.todayMode}</span>
        </div>
      </div>

      <QuickAdd_1.default onAdd={handleAddTodo}/>
      <WipList_1.default items={data.wip}/>
      <Checklist_1.default items={data.checklist}/>
    </div>);
}
//# sourceMappingURL=Dashboard.js.map