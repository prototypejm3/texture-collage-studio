import { WallSettings, WallLayout, WallBackground } from '@/types/wall';
import { LayoutGrid, AlignJustify, Columns, Star, Pencil, Check } from 'lucide-react';
import { useState } from 'react';

interface WallCustomizerProps {
  settings: WallSettings;
  onUpdate: (updates: Partial<WallSettings>) => void;
  isPremium: boolean;
}

const layouts: { value: WallLayout; label: string; icon: React.ReactNode }[] = [
  { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-4 h-4" /> },
  { value: 'masonry', label: 'Masonry', icon: <Columns className="w-4 h-4" /> },
  { value: 'single', label: 'Column', icon: <AlignJustify className="w-4 h-4" /> },
  { value: 'featured', label: 'Featured', icon: <Star className="w-4 h-4" /> },
];

const backgrounds: { value: WallBackground; label: string; color: string }[] = [
  { value: 'warm-white', label: 'Warm White', color: 'hsl(40, 20%, 97%)' },
  { value: 'cream', label: 'Cream', color: 'hsl(38, 30%, 92%)' },
  { value: 'soft-gray', label: 'Soft Gray', color: 'hsl(220, 10%, 92%)' },
  { value: 'charcoal', label: 'Charcoal', color: 'hsl(220, 15%, 22%)' },
  { value: 'paper', label: 'Paper', color: 'hsl(38, 20%, 88%)' },
  { value: 'linen', label: 'Linen', color: 'hsl(35, 15%, 85%)' },
];

export function WallCustomizer({ settings, onUpdate, isPremium }: WallCustomizerProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(settings.title);

  return (
    <div className="flex flex-wrap items-center gap-4 px-1">
      {/* Title */}
      <div className="flex items-center gap-2 mr-auto">
        {editingTitle ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { onUpdate({ title: titleDraft }); setEditingTitle(false); } }}
              className="text-xl font-bold bg-transparent border-b-2 border-primary outline-none text-foreground w-48"
            />
            <button onClick={() => { onUpdate({ title: titleDraft }); setEditingTitle(false); }} className="p-1 text-primary">
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <h1
            className="text-xl font-bold text-foreground cursor-pointer flex items-center gap-2 group"
            onClick={() => { setTitleDraft(settings.title); setEditingTitle(true); }}
          >
            {settings.title}
            <Pencil className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </h1>
        )}
      </div>

      {/* Layout picker */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
        {layouts.map(l => {
          const locked = l.value !== 'grid' && !isPremium;
          return (
            <button
              key={l.value}
              onClick={() => !locked && onUpdate({ layout: l.value })}
              className={`p-1.5 rounded-md transition-colors ${
                settings.layout === l.value
                  ? 'bg-background text-primary shadow-sm'
                  : locked
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
              title={locked ? 'Premium only' : l.label}
            >
              {l.icon}
            </button>
          );
        })}
      </div>

      {/* Background picker */}
      {isPremium && (
        <div className="flex items-center gap-1.5">
          {backgrounds.map(bg => (
            <button
              key={bg.value}
              onClick={() => onUpdate({ background: bg.value })}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                settings.background === bg.value ? 'border-primary scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: bg.color }}
              title={bg.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}
