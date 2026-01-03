import { createRoot } from 'react-dom/client';
import QuickAddView from './views/QuickAddView';
import WipView from './views/WipView';
import ChecklistView from './views/ChecklistView';
import TagManagerView from './views/TagManagerView';
import SettingsView from './views/SettingsView';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// viewType을 data attribute에서 가져오기
const viewType = container.getAttribute('data-view-type') || 'wip';

console.log('🎨 View Type:', viewType);

const root = createRoot(container);

// viewType에 따라 다른 컴포넌트 렌더링
switch (viewType) {
  case 'quickAdd':
    root.render(<QuickAddView />);
    break;
  case 'wip':
    root.render(<WipView />);
    break;
  case 'checklist':
    root.render(<ChecklistView />);
    break;
  case 'tagManager':
    root.render(<TagManagerView />);
    break;
  case 'settings':
    root.render(<SettingsView />);
    break;
  default:
    root.render(<div>Unknown view type: {viewType}</div>);
}
