import { WallSettings, WallLayout, WallBackground, FrameStyle, HangingStyle, LightingPreset, AmbientSound } from '@/types/wall';
import { LayoutGrid, AlignJustify, Pencil, Check, Frame, Move, Lamp, Sun, Volume2, Tag, Wand2, Eye } from 'lucide-react';
import { useState } from 'react';

interface WallCustomizerProps {
  settings: WallSettings;
  onUpdate: (updates: Partial<WallSettings>) => void;
  onApplyFrameToAll?: (style: FrameStyle) => void;
  onApplyHangingToAll?: (style: HangingStyle) => void;
  onAutoCurate?: () => void;
  onStepBack?: () => void;
  isPremium: boolean;
}

const layouts: { value: WallLayout; label: string; icon: React.ReactNode }[] = [
  { value: 'freeform', label: 'Freeform', icon: <Move className="w-3.5 h-3.5" /> },
  { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: 'single', label: 'List', icon: <AlignJustify className="w-3.5 h-3.5" /> },
];

const backgrounds: { value: WallBackground; label: string; preview?: string; previewColor?: string }[] = [
  { value: 'white-brick', label: 'White Brick', preview: '/walls/white-brick.png' },
  { value: 'black-brick', label: 'Black Brick', preview: '/walls/black-brick.png' },
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

const lightingPresets: { value: LightingPreset; label: string; emoji: string }[] = [
  { value: 'none', label: 'Off', emoji: '○' },
  { value: 'gallery', label: 'Gallery', emoji: '🖼' },
  { value: 'golden-hour', label: 'Golden Hour', emoji: '🌅' },
  { value: 'dramatic', label: 'Dramatic', emoji: '🎭' },
  { value: 'soft-diffused', label: 'Soft', emoji: '☁️' },
];

const ambientSounds: { value: AmbientSound; label: string; emoji: string }[] = [
  { value: 'none', label: 'Off', emoji: '🔇' },
  { value: 'gallery', label: 'Gallery', emoji: '🏛' },
  { value: 'loft', label: 'Loft', emoji: '🏙' },
  { value: 'home', label: 'Home', emoji: '🏠' },
];

export function WallCustomizer({ settings, onUpdate, onApplyFrameToAll, onApplyHangingToAll, onAutoCurate, onStepBack, isPremium }: WallCustomizerProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(settings.title);
  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showHangingMenu, setShowHangingMenu] = useState(false);
  const [showLightingMenu, setShowLightingMenu] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const isDark = ['black-brick', 'black-concrete', 'dark-brick', 'black-stone'].includes(settings.background);
  const iconClass = (active?: boolean) => `p-1.5 rounded-md transition-colors ${
    active
      ? isDark ? 'bg-background/20 text-background' : 'bg-secondary text-primary'
      : isDark ? 'text-background/40 hover:text-background/70' : 'text-muted-foreground/60 hover:text-foreground/60'
  }`;

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
          <DropdownButton
            icon={<Frame className="w-3.5 h-3.5" />}
            isOpen={showFrameMenu}
            onToggle={() => setShowFrameMenu(!showFrameMenu)}
            onClose={() => setShowFrameMenu(false)}
            iconClass={iconClass()}
            title="Apply frame to all"
          >
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
          </DropdownButton>
        )}

        {/* Hanging style */}
        {isPremium && onApplyHangingToAll && (
          <DropdownButton
            icon={<Lamp className="w-3.5 h-3.5" />}
            isOpen={showHangingMenu}
            onToggle={() => setShowHangingMenu(!showHangingMenu)}
            onClose={() => setShowHangingMenu(false)}
            iconClass={iconClass()}
            title="Display style"
          >
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
          </DropdownButton>
        )}

        {/* Lighting presets */}
        {isPremium && (
          <DropdownButton
            icon={<Sun className="w-3.5 h-3.5" />}
            isOpen={showLightingMenu}
            onToggle={() => setShowLightingMenu(!showLightingMenu)}
            onClose={() => setShowLightingMenu(false)}
            iconClass={iconClass(settings.lightingPreset !== 'none')}
            title="Lighting"
          >
            <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Lighting</p>
            {lightingPresets.map(lp => (
              <button
                key={lp.value}
                onClick={() => { onUpdate({ lightingPreset: lp.value }); setShowLightingMenu(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${settings.lightingPreset === lp.value ? 'text-primary font-medium' : 'text-foreground'}`}
              >
                <span>{lp.emoji}</span> {lp.label}
              </button>
            ))}
          </DropdownButton>
        )}

        {/* Ambient sound */}
        {isPremium && (
          <DropdownButton
            icon={<Volume2 className="w-3.5 h-3.5" />}
            isOpen={showSoundMenu}
            onToggle={() => setShowSoundMenu(!showSoundMenu)}
            onClose={() => setShowSoundMenu(false)}
            iconClass={iconClass(settings.ambientSound !== 'none')}
            title="Ambient sound"
          >
            <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Ambiance</p>
            {ambientSounds.map(as => (
              <button
                key={as.value}
                onClick={() => { onUpdate({ ambientSound: as.value }); setShowSoundMenu(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${settings.ambientSound === as.value ? 'text-primary font-medium' : 'text-foreground'}`}
              >
                <span>{as.emoji}</span> {as.label}
              </button>
            ))}
          </DropdownButton>
        )}

        {/* Title cards toggle */}
        {isPremium && (
          <button
            onClick={() => onUpdate({ showTitleCards: !settings.showTitleCards })}
            className={iconClass(settings.showTitleCards)}
            title="Museum labels"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Auto-curate */}
        {isPremium && onAutoCurate && (
          <button onClick={onAutoCurate} className={iconClass()} title="Arrange for me">
            <Wand2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Step back */}
        {onStepBack && (
          <button onClick={onStepBack} className={iconClass()} title="Step back">
            <Eye className="w-3.5 h-3.5" />
          </button>
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable dropdown button ─── */
function DropdownButton({ icon, isOpen, onToggle, onClose, iconClass, title, children }: {
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  iconClass: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button onClick={onToggle} className={iconClass} title={title}>
        {icon}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute right-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
