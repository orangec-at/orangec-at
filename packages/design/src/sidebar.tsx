'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const components = [
  {
    category: '기본 (Basic)',
    items: [
      { name: 'Button', path: '/button' },
      { name: 'Input', path: '/input' },
      { name: 'Typography', path: '/typography' },
      { name: 'Badge', path: '/badge' },
      { name: 'Chip', path: '/chip' },
      { name: 'Alert', path: '/alert' },
    ],
  },
  {
    category: '폼 (Form)',
    items: [
      { name: 'Form Field', path: '/form-field' },
      { name: 'Checkbox', path: '/checkbox' },
      { name: 'Radio Group', path: '/radio-group' },
      { name: 'Select', path: '/select' },
      { name: 'Textarea', path: '/textarea' },
      { name: 'Password Input', path: '/password-input' },
      { name: 'Date Picker', path: '/date-picker' },
      { name: 'Address Input', path: '/address-input' },
      { name: 'File Upload', path: '/file-upload' },
      { name: 'Validation', path: '/validation' },
    ],
  },
  {
    category: '내비게이션 (Navigation)',
    items: [
      { name: 'Breadcrumb', path: '/breadcrumb' },
      { name: 'Tabs', path: '/tabs' },
      { name: 'Pagination', path: '/pagination' },
      { name: 'Stepper', path: '/stepper' },
      { name: 'Accordion', path: '/accordion' },
    ],
  },
  {
    category: '데이터 (Data)',
    items: [
      { name: 'Table', path: '/table' },
      { name: 'Data Table', path: '/data-table' },
      { name: 'Content Table', path: '/content-table' },
      { name: 'Notice List Table', path: '/notice-list-table' },
      { name: 'Category Selector', path: '/category-selector' },
    ],
  },
  {
    category: '오버레이 (Overlay)',
    items: [
      { name: 'Dialog', path: '/dialog' },
      { name: 'Modal', path: '/modal' },
      { name: 'Confirm Dialog', path: '/confirm-dialog' },
      { name: 'Popover', path: '/popover' },
      { name: 'Dropdown Menu', path: '/dropdown-menu' },
    ],
  },
  {
    category: '레이아웃 (Layout)',
    items: [
      { name: 'Page Frame', path: '/page-frame' },
      { name: 'Card Section', path: '/card-section' },
      { name: 'Agreement Item', path: '/agreement-item' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold text-gray-900 mb-1">DPP Design System</h1>
          <p className="text-sm text-gray-500">Component Library</p>
        </Link>
      </div>

      <nav className="px-4 pb-6">
        {components.map((section) => (
          <div key={section.category} className="mb-6">
            <h2 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.category}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`
                        block px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
