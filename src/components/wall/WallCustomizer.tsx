import { WallSettings, WallLayout, WallBackground, FrameStyle } from '@/types/wall';
import { LayoutGrid, AlignJustify, Columns, Star, Sparkles, Pencil, Check, Frame } from 'lucide-react';
import { useState } from 'react';

interface WallCustomizerProps {
  settings: WallSettings;
  onUpdate: (updates: Partial<WallSettings>) => void;
  onApplyFrameToAll?: (style: FrameStyle) => void;
  isPremium: boolean;
}

const layouts: { value: WallLayout; label: string; icon: React.ReactNode }[] = [
  { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: 'masonry', label: 'Masonry', icon: <Columns className="w-3.5 h-3.5" /> },
  { value: 'single', label: 'Gallery', icon: <AlignJustify className="w-3.5 h-3.5" /> },
  { value: 'featured', label: 'Featured', icon: <Star className="w-3.5 h-3.5" /> },
  { value: 'curated', label: 'Curated', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const backgrounds: { value: WallBackground; label: string; color: string }[] = [
  { value: 'brick', label: 'Brick', color: 'hsl(10, 45%, 45%)' },
  { value: 'concrete', label: 'Concrete', color: 'hsl(210, 5%, 70%)' },
  { value: 'limewash', label: 'Limewash', color: 'hsl(38, 20%, 88%)' },
  { value: 'black-brick', label: 'Black Brick', color: 'hsl(0, 0%, 18%)' },
  { value: 'black-concrete', label: 'Black Concrete', color: 'hsl(210, 5%, 22%)' },
  { value: 'white-brick', label: 'White Brick', color: 'hsl(40, 15%, 93%)' },
];

const allFrameStyles: { value: FrameStyle; label: string }[] = [
  { value: 'gold', label: 'Gold' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'copper', label: 'Copper' },
  { value: 'silver', label: 'Silver' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'shadow-box', label: 'Shadow Box' },
  { value: 'wood', label: 'Wood' },
  { value: 'floating', label: 'Floating' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'none', label: 'None' },
];

export function WallCustomizer({ settings, onUpdate, onApplyFrameToAll, isPremium }: WallCustomizerProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(settings.title);
  const [showFrameMenu, setShowFrameMenu] = useState(false);

  const isDark = ['black-brick', 'black-concrete'].includes(settings.background);

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
              className={`text-lg font-light tracking-wide bg-transparent border-b border-primary/40 outline-none w-48 ${isDark ? 'text-background' : 'text-foreground'}`}
            />
            <button onClick={() => { onUpdate({ title: titleDraft }); setEditingTitle(false); }} className="p-1 text-primary/60 hover:text-primary">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <h1
            className={`text-lg font-light tracking-wide cursor-pointer flex items-center gap-2 group ${isDark ? 'text-background/80' : 'text-foreground/70'}`}
            onClick={() => { setTitleDraft(settings.title); setEditingTitle(true); }}
          >
            {settings.title}
            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Layout picker */}
        <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${isDark ? 'bg-background/10' : 'bg-secondary/50'}`}>
          {layouts.map(l => {
            const locked = l.value !== 'grid' && !isPremium;
            return (
              <button
                key={l.value}
                onClick={() => !locked && onUpdate({ layout: l.value })}
                className={`p-1.5 rounded-md transition-colors ${
                  settings.layout === l.value
                    ? isDark ? 'bg-background/20 text-background' : 'bg-background text-primary shadow-sm'
                    : locked
                      ? 'text-muted-foreground/30 cursor-not-allowed'
                      : isDark ? 'text-background/40 hover:text-background/70' : 'text-muted-foreground/60 hover:text-foreground/60'
                }`}
                title={locked ? 'Premium only' : l.label}
              >
                {l.icon}
              </button>
            );
          })}
        </div>

        {/* Apply frame to all */}
        {isPremium && onApplyFrameToAll && (
          <div className="relative">
            <button
              onClick={() => setShowFrameMenu(!showFrameMenu)}
              className={`p-1.5 rounded-md transition-colors ${isCharcoal ? 'text-background/40 hover:text-background/70' : 'text-muted-foreground/60 hover:text-foreground/60'}`}
              title="Apply frame to all"
            >
              <Frame className="w-3.5 h-3.5" />
            </button>
            {showFrameMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFrameMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                  <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Apply to all</p>
                  {allFrameStyles.map(fs => (
                    <button
                      key={fs.value}
                      onClick={() => { onApplyFrameToAll(fs.value); setShowFrameMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${settings.defaultFrameStyle === fs.value ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Background picker */}
        {isPremium && (
          <div className="flex items-center gap-1">
            {backgrounds.map(bg => (
              <button
                key={bg.value}
                onClick={() => onUpdate({ background: bg.value })}
                className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${
                  settings.background === bg.value ? 'border-primary scale-110 shadow-sm' : 'border-border/50'
                }`}
                style={{ backgroundColor: bg.color }}
                title={bg.label}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
