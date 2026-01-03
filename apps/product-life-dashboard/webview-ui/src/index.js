"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
const Dashboard_1 = __importDefault(require("./components/Dashboard"));
const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}
const root = (0, client_1.createRoot)(container);
root.render(<Dashboard_1.default />);
//# sourceMappingURL=index.js.map