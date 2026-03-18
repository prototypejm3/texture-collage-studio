import { WallSettings, WallLayout, WallBackground, FrameStyle, HangingStyle } from '@/types/wall';
import { LayoutGrid, AlignJustify, Columns, Star, Sparkles, Pencil, Check, Frame, Move, Camera, X, Lamp } from 'lucide-react';
import { useState, useRef } from 'react';

interface WallCustomizerProps {
  settings: WallSettings;
  onUpdate: (updates: Partial<WallSettings>) => void;
  onApplyFrameToAll?: (style: FrameStyle) => void;
  onApplyHangingToAll?: (style: HangingStyle) => void;
  isPremium: boolean;
}

const layouts: { value: WallLayout; label: string; icon: React.ReactNode }[] = [
  { value: 'freeform', label: 'Freeform', icon: <Move className="w-3.5 h-3.5" /> },
  { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: 'single', label: 'List', icon: <AlignJustify className="w-3.5 h-3.5" /> },
];

const backgrounds: { value: WallBackground; label: string; preview?: string; previewColor?: string }[] = [
  { value: 'clean-white', label: 'Clean White', previewColor: 'hsl(0 0% 98%)' },
  { value: 'white-brick', label: 'White Brick', preview: '/walls/white-brick.png' },
  { value: 'brick', label: 'Brick', preview: '/walls/brick.png' },
  { value: 'dark-brick', label: 'Dark Brick', preview: '/walls/dark-brick.png' },
  { value: 'gray-brick', label: 'Gray Brick', preview: '/walls/gray-brick.png' },
  { value: 'black-brick', label: 'Black Brick', preview: '/walls/black-brick.png' },
  { value: 'black-stone', label: 'Black Stone', preview: '/walls/black-stone.png' },
  { value: 'concrete', label: 'Concrete', preview: '/walls/concrete.png' },
];

const allFrameStyles: { value: FrameStyle; label: string }[] = [
  { value: 'shadow-box', label: 'Shadow Box' },
  { value: 'gold', label: 'Gold' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'copper', label: 'Copper' },
  { value: 'silver', label: 'Silver' },
  { value: 'black', label: 'Black' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'wood', label: 'Wood' },
  { value: 'floating', label: 'Floating' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'none', label: 'None' },
];

const hangingStyles: { value: HangingStyle; label: string; emoji: string }[] = [
  { value: 'floating', label: 'Floating', emoji: '✨' },
  { value: 'string', label: 'String', emoji: '🧵' },
  { value: 'spotlight', label: 'Spotlight', emoji: '🔦' },
  { value: 'hook', label: 'Hook', emoji: '🪝' },
  { value: 'shelf', label: 'Shelf', emoji: '🪵' },
];

export function WallCustomizer({ settings, onUpdate, onApplyFrameToAll, onApplyHangingToAll, isPremium }: WallCustomizerProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(settings.title);
  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showHangingMenu, setShowHangingMenu] = useState(false);
  const wallPhotoRef = useRef<HTMLInputElement>(null);

  const handleWallPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ background: 'custom', customWallImage: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isDark = ['black-brick', 'black-concrete', 'dark-brick', 'black-stone'].includes(settings.background);

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
              className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-background/40 hover:text-background/70' : 'text-muted-foreground/60 hover:text-foreground/60'}`}
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

        {/* Hanging style picker */}
        {isPremium && onApplyHangingToAll && (
          <div className="relative">
            <button
              onClick={() => setShowHangingMenu(!showHangingMenu)}
              className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-background/40 hover:text-background/70' : 'text-muted-foreground/60 hover:text-foreground/60'}`}
              title="Display style"
            >
              <Lamp className="w-3.5 h-3.5" />
            </button>
            {showHangingMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowHangingMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                  <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Display style</p>
                  {hangingStyles.map(hs => (
                    <button
                      key={hs.value}
                      onClick={() => { onApplyHangingToAll(hs.value); setShowHangingMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${settings.defaultHangingStyle === hs.value ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      <span>{hs.emoji}</span> {hs.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Background picker */}
        {isPremium && (
          <div className="flex items-center gap-1.5">
            {backgrounds.map(bg => (
              <button
                key={bg.value}
                onClick={() => onUpdate({ background: bg.value })}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 overflow-hidden ${
                  settings.background === bg.value ? 'border-primary scale-110 shadow-md' : 'border-border/40'
                }`}
                title={bg.label}
              >
                {bg.preview ? (
                  <img src={bg.preview} alt={bg.label} className="w-full h-full object-cover" />
                ) : (
                  <span className="block w-full h-full" style={{ backgroundColor: bg.previewColor }} />
                )}
              </button>
            ))}
            {/* Custom wall photo */}
            <button
              onClick={() => wallPhotoRef.current?.click()}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 overflow-hidden flex items-center justify-center ${
                settings.background === 'custom' ? 'border-primary scale-110 shadow-md' : 'border-border/40'
              }`}
              title="Upload your own wall photo"
              style={settings.background === 'custom' && settings.customWallImage ? {
                backgroundImage: `url(${settings.customWallImage})`,
                backgroundSize: 'cover',
              } : { backgroundColor: 'hsl(var(--secondary))' }}
            >
              {!(settings.background === 'custom' && settings.customWallImage) && (
                <Camera className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
            <input
              ref={wallPhotoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleWallPhoto}
            />
          </div>
        )}
      </div>
    </div>
  );
}
