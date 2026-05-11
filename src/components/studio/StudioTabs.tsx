import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { StudioTab, MAX_TABS } from '@/hooks/useStudioTabs';
import { cn } from '@/lib/utils';

interface Props {
  tabs: StudioTab[];
  activeTabId: string;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
  onRename: (id: string, name: string) => void;
  kidMode?: boolean;
}

export function StudioTabs({ tabs, activeTabId, onSwitch, onAdd, onClose, onRename, kidMode }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEdit = (tab: StudioTab) => {
    setEditingId(tab.id);
    setDraft(tab.name);
  };

  const commitEdit = () => {
    if (editingId) {
      const name = draft.trim() || 'Frame';
      onRename(editingId, name);
    }
    setEditingId(null);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 border-b overflow-x-auto shrink-0',
        kidMode ? 'bg-[#fdf6ee] border-[#d6c4a8]' : 'bg-background border-border',
      )}
      style={{ scrollbarWidth: 'thin' }}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => !isActive && onSwitch(tab.id)}
            onDoubleClick={() => startEdit(tab)}
            className={cn(
              'group flex items-center gap-1.5 px-3 py-1.5 rounded-t-md border cursor-pointer select-none text-sm transition-colors shrink-0',
              isActive
                ? kidMode
                  ? 'bg-[#fff8ec] border-[#b8956a] border-b-transparent text-[#5a3e1f] font-semibold'
                  : 'bg-card border-border border-b-transparent text-foreground font-semibold'
                : kidMode
                  ? 'bg-[#f0e4cf] border-transparent text-[#7a5e3a] hover:bg-[#f5ecda]'
                  : 'bg-muted border-transparent text-muted-foreground hover:bg-accent',
            )}
          >
            {editingId === tab.id ? (
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitEdit();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="bg-transparent outline-none w-20 text-sm"
              />
            ) : (
              <span className="truncate max-w-[120px]">{tab.name}</span>
            )}
            {tabs.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); onClose(tab.id); }}
                className="opacity-50 hover:opacity-100 hover:text-destructive transition-opacity"
                aria-label="Close frame"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
      {tabs.length < MAX_TABS && (
        <button
          onClick={onAdd}
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-colors shrink-0',
            kidMode
              ? 'text-[#7a5e3a] hover:bg-[#f0e4cf]'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
          title="New frame"
          aria-label="Add new frame"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
