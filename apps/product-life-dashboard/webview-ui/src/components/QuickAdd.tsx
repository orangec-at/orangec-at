import { useState, KeyboardEvent } from 'react';

interface QuickAddProps {
  onAdd: (text: string) => void;
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const text = input.trim();
    if (text) {
      onAdd(text);
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="section">
      <div className="section-title">➕ Quick Add</div>
      <div className="quick-add-form">
        <input
          type="text"
          className="todo-input"
          placeholder="[제품/마케팅/커리어] 새 작업 입력..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-btn" onClick={handleAdd}>
          추가
        </button>
      </div>
    </div>
  );
}
