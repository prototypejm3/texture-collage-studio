import { WallSettings, WallLayout, WallBackground, FrameStyle, HangingStyle, LightingPreset, AmbientSound } from '@/types/wall';
import { LayoutGrid, AlignJustify, Check, Frame, Move, Lamp, Volume2, Tag, Wand2, Eye, Lock, LampDesk, GalleryVerticalEnd } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WallCustomizerProps {
  settings: WallSettings;
  onUpdate: (updates: Partial<WallSettings>) => void;
  onApplyFrameToAll?: (style: FrameStyle) => void;
  onApplyHangingToAll?: (style: HangingStyle) => void;
  onAutoCurate?: () => void;
  onStepBack?: () => void;
  onRequestUpgrade?: () => void;
  isPremium: boolean;
}

const layouts: { value: WallLayout; label: string; icon: React.ReactNode }[] = [
  { value: 'freeform', label: 'Freeform', icon: <Move className="w-3.5 h-3.5" /> },
  { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: 'single', label: 'List', icon: <AlignJustify className="w-3.5 h-3.5" /> },
];

const backgrounds: { value: WallBackground; label: string; kidLabel?: string; fill: string; borderColor: string }[] = [
  { value: 'white-brick', label: 'Cloud', kidLabel: '☁️ Cloud', fill: '#f5f5f0', borderColor: '#e2ddd6' },
  { value: 'wood-birch-wall', label: 'Sunset', kidLabel: '☀️ Sunset', fill: '#fef3e8', borderColor: '#e2ddd6' },
  { value: 'mint', label: 'Sage', kidLabel: '🌿 Sage', fill: '#edf4ed', borderColor: '#e2ddd6' },
  { value: 'blush', label: 'Blush', kidLabel: '💕 Blush', fill: '#fdf0f0', borderColor: '#e2ddd6' },
  { value: 'red', label: 'Apple', kidLabel: '🍎 Apple', fill: '#fdf0f0', borderColor: '#e2ddd6' },
  { value: 'green', label: 'Forest', kidLabel: '🌲 Forest', fill: '#e8f4e8', borderColor: '#e2ddd6' },
  { value: 'wood-oak-wall', label: 'Linen', kidLabel: '🧸 Linen', fill: '#f5ede0', borderColor: '#e2ddd6' },
];

function WallIconCloud() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <ellipse cx="15" cy="22" rx="7" ry="5" fill="white"/>
      <ellipse cx="22" cy="19" rx="8" ry="6" fill="white"/>
      <ellipse cx="28" cy="22" rx="6" ry="4.5" fill="white"/>
      <line x1="8" y1="30" x2="32" y2="30" stroke="#e2ddd6" strokeWidth="1"/>
    </svg>
  );
}

function WallIconSunset() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="7" fill="#fbbf24"/>
      <line x1="20" y1="7" x2="20" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="29" x2="20" y2="33" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="14" x2="12" y2="17" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28" y1="23" x2="31" y2="26" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28" y1="14" x2="31" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function WallIconSage() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="15" y="26" width="10" height="8" rx="2" fill="#c4956a"/>
      <line x1="20" y1="12" x2="20" y2="26" stroke="#6b8a5e" strokeWidth="1.5"/>
      <ellipse cx="16" cy="18" rx="4" ry="3" fill="#22c55e" transform="rotate(-20 16 18)"/>
      <ellipse cx="24" cy="16" rx="4" ry="3" fill="#4ade80" transform="rotate(20 24 16)"/>
      <ellipse cx="20" cy="13" rx="3.5" ry="2.5" fill="#22c55e"/>
    </svg>
  );
}

function WallIconBlush() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M20 30 C20 30, 8 20, 8 15 C8 10, 13 8, 20 14 C27 8, 32 10, 32 15 C32 20, 20 30, 20 30Z" fill="#f9a8d4"/>
      <path d="M14 10 C14 10, 10 7, 10 5.5 C10 4, 12 3, 14 5 C16 3, 18 4, 18 5.5 C18 7, 14 10, 14 10Z" fill="#f472b6"/>
      <path d="M27 9 C27 9, 24.5 7, 24.5 6 C24.5 5, 25.5 4.5, 27 5.5 C28.5 4.5, 29.5 5, 29.5 6 C29.5 7, 27 9, 27 9Z" fill="#f472b6"/>
    </svg>
  );
}

function WallIconApple() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M20 10 C14 10, 10 15, 10 22 C10 29, 15 33, 20 33 C25 33, 30 29, 30 22 C30 15, 26 10, 20 10Z" fill="#e05c5c"/>
      <ellipse cx="16" cy="18" rx="3" ry="4" fill="white" opacity="0.3"/>
      <line x1="20" y1="10" x2="20" y2="7" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="23" cy="8" rx="3" ry="2" fill="#22c55e" transform="rotate(30 23 8)"/>
    </svg>
  );
}

function WallIconForest() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <polygon points="20,6 10,28 30,28" fill="#22c55e"/>
      <rect x="18" y="28" width="4" height="6" fill="#c4956a"/>
      <polygon points="20,8 22,8 20,6" fill="#fbbf24"/>
      <circle cx="20" cy="7" r="2" fill="#fbbf24"/>
    </svg>
  );
}

function WallIconLinen() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <ellipse cx="20" cy="24" rx="10" ry="11" fill="#c4956a"/>
      <ellipse cx="20" cy="27" rx="6" ry="7" fill="#d9a97c"/>
      <circle cx="14" cy="14" r="4" fill="#c4956a"/>
      <circle cx="26" cy="14" r="4" fill="#c4956a"/>
      <circle cx="14" cy="14" r="2" fill="#d9a97c"/>
      <circle cx="26" cy="14" r="2" fill="#d9a97c"/>
    </svg>
  );
}

const wallIcons: Record<string, React.FC> = {
  'white-brick': WallIconCloud,
  'wood-birch-wall': WallIconSunset,
  'mint': WallIconSage,
  'blush': WallIconBlush,
  'red': WallIconApple,
  'green': WallIconForest,
  'wood-oak-wall': WallIconLinen,
};

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

const hangingStyles: { value: HangingStyle; label: string; emoji: string; group?: string }[] = [
  { value: 'floating', label: 'Floating', emoji: '✨', group: 'Style' },
  { value: 'string', label: 'String', emoji: '🧵', group: 'String' },
  { value: 'lighted-string', label: 'Lighted', emoji: '💡', group: 'String' },
  { value: 'metal-wire', label: 'Metal', emoji: '🔗', group: 'String' },
  { value: 'hemp', label: 'Hemp', emoji: '🌿', group: 'String' },
  { value: 'white-string', label: 'White', emoji: '🤍', group: 'String' },
  { value: 'braided', label: 'Braided', emoji: '🪢', group: 'String' },
  { value: 'pink-yarn', label: 'Pink Yarn', emoji: '🩷', group: 'String' },
  { value: 'beaded', label: 'Beaded', emoji: '📿', group: 'String' },
  { value: 'hook', label: 'Hook', emoji: '🪝', group: 'Style' },
  { value: 'shelf', label: 'Shelf', emoji: '🪵', group: 'Style' },
  { value: 'silver-screw', label: 'Silver Screw', emoji: '🔩', group: 'Nail' },
  { value: 'red-tack', label: 'Red Tack', emoji: '📌', group: 'Nail' },
  { value: 'cork-tack', label: 'Cork Tack', emoji: '🟤', group: 'Nail' },
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

export function WallCustomizer({ settings, onUpdate, onApplyFrameToAll, onApplyHangingToAll, onAutoCurate, onStepBack, onRequestUpgrade, isPremium }: WallCustomizerProps) {
  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showHangingMenu, setShowHangingMenu] = useState(false);
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);
  const [showLightingMenu, setShowLightingMenu] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const handlePremiumClick = (action: () => void) => {
    if (!isPremium) {
      onRequestUpgrade?.();
      return;
    }
    action();
  };

  const iconClass = (active?: boolean, locked?: boolean) => `relative p-2 rounded-full border shadow-sm transition-colors ${
    locked
      ? 'bg-popover text-muted-foreground/40 border-border cursor-not-allowed'
      : active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-popover text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
  }`;

  return (
    <div className="flex flex-wrap items-center gap-4 px-1">
      <div className="mr-auto" />

      <div className="flex items-center gap-2.5">
        {/* Layout picker — grid is free, others are premium */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 rounded-full border border-border bg-popover p-1 shadow-sm">
            {layouts.map(l => {
              const locked = l.value !== 'grid' && !isPremium;
              return (
                <button
                  key={l.value}
                  onClick={() => locked ? onRequestUpgrade?.() : onUpdate({ layout: l.value })}
                  className={`relative p-2 rounded-full border shadow-sm transition-colors ${
                    settings.layout === l.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : locked
                        ? 'bg-popover text-muted-foreground/40 border-border cursor-not-allowed'
                        : 'bg-popover text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                  }`}
                  title={locked ? 'Premium — unlock to use' : l.label}
                >
                  {l.icon}
                  {locked && <Lock className="w-2 h-2 absolute -top-0.5 -right-0.5 text-primary/60" />}
                </button>
              );
            })}
          </div>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Layout</span>
        </div>

        {/* Apply frame to all */}
        <PremiumIconButton
          icon={<Frame className="w-3.5 h-3.5" />}
          isPremium={isPremium}
          isOpen={showFrameMenu}
          onToggle={() => isPremium ? setShowFrameMenu(!showFrameMenu) : onRequestUpgrade?.()}
          onClose={() => setShowFrameMenu(false)}
          iconClass={iconClass(false, !isPremium)}
          title="Apply frame to all"
          label="Frames"
        >
          <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Apply to all</p>
          {allFrameStyles.map(fs => (
            <button
              key={fs.value}
              onClick={() => { onApplyFrameToAll?.(fs.value); setShowFrameMenu(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${settings.defaultFrameStyle === fs.value ? 'text-primary font-medium' : 'text-foreground'}`}
            >
              {fs.label}
            </button>
          ))}
        </PremiumIconButton>

        {/* Hanging style */}
        <PremiumIconButton
          icon={<GalleryVerticalEnd className="w-3.5 h-3.5" />}
          isPremium={isPremium}
          isOpen={showHangingMenu}
          onToggle={() => isPremium ? setShowHangingMenu(!showHangingMenu) : onRequestUpgrade?.()}
          onClose={() => setShowHangingMenu(false)}
          iconClass={iconClass(settings.defaultHangingStyle !== 'floating', !isPremium)}
          title="Hanging style"
          label="Hanging"
        >
          {['Style', 'String', 'Nail'].map(group => {
            const items = hangingStyles.filter(h => h.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">{group}</p>
                {items.map(hs => (
                  <button
                    key={hs.value}
                    onClick={() => { onApplyHangingToAll?.(hs.value); setShowHangingMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${settings.defaultHangingStyle === hs.value ? 'text-primary font-medium' : 'text-foreground'}`}
                  >
                    <span>{hs.emoji}</span> {hs.label}
                  </button>
                ))}
              </div>
            );
          })}
          <div className="border-t border-border my-1" />
          <button
            onClick={() => { onApplyHangingToAll?.('spotlight'); setShowHangingMenu(false); }}
            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${settings.defaultHangingStyle === 'spotlight' ? 'text-primary font-medium' : 'text-foreground'}`}
          >
            <span>💡</span> Spotlight
          </button>
        </PremiumIconButton>

        {/* Lighting presets */}
        <PremiumIconButton
          icon={<Lamp className="w-3.5 h-3.5" />}
          isPremium={isPremium}
          isOpen={showLightingMenu}
          onToggle={() => isPremium ? setShowLightingMenu(!showLightingMenu) : onRequestUpgrade?.()}
          onClose={() => setShowLightingMenu(false)}
          iconClass={iconClass(settings.lightingPreset !== 'none', !isPremium)}
          title="Lighting"
          label="Lighting"
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
        </PremiumIconButton>

        {/* Ambient sound */}
        <PremiumIconButton
          icon={<Volume2 className="w-3.5 h-3.5" />}
          isPremium={isPremium}
          isOpen={showSoundMenu}
          onToggle={() => isPremium ? setShowSoundMenu(!showSoundMenu) : onRequestUpgrade?.()}
          onClose={() => setShowSoundMenu(false)}
          iconClass={iconClass(settings.ambientSound !== 'none', !isPremium)}
          title="Ambient sound"
          label="Sound"
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
        </PremiumIconButton>

        {/* Title cards toggle */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={() => onUpdate({ showTitleCards: !settings.showTitleCards })}
            className={iconClass(settings.showTitleCards, false)}
            title="Museum labels"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Labels</span>
        </div>

        {/* Auto-curate */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={() => handlePremiumClick(() => onAutoCurate?.())}
            className={iconClass(false, !isPremium)}
            title={isPremium ? 'Arrange Nicely' : 'Premium — unlock to use'}
          >
            <Wand2 className="w-3.5 h-3.5" />
            {!isPremium && <Lock className="w-2 h-2 absolute -top-0.5 -right-0.5 text-primary/60" />}
          </button>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Curate</span>
        </div>

        {/* Step back — free for everyone */}
        {onStepBack && (
          <div className="flex flex-col items-center gap-0.5">
            <button onClick={onStepBack} className={iconClass()} title="Step back">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <span className="text-[8px] text-muted-foreground uppercase tracking-wider">View</span>
          </div>
        )}

        {/* Background picker — free for kids, premium for adults */}
        <div className="flex items-center gap-1.5">
          {backgrounds.map(bg => {
            const isFree = kidMode || isPremium;
            return (
              <button
                key={bg.value}
                onClick={() => isFree ? onUpdate({ background: bg.value }) : onRequestUpgrade?.()}
                className={`relative w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 overflow-hidden ${
                  settings.background === bg.value ? 'border-primary scale-110 shadow-md' : 'border-border/40'
                }`}
                title={isFree ? (kidMode && bg.kidLabel ? bg.kidLabel : bg.label) : 'Premium — unlock to use'}
              >
                {bg.preview ? (
                  <img src={bg.preview} alt={bg.label} className="w-full h-full object-cover" />
                ) : (
                  <span className="block w-full h-full" style={{ backgroundColor: bg.previewColor }} />
                )}
                {!isFree && <Lock className="w-2 h-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-background/80 drop-shadow-sm" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Premium icon button with lock badge ─── */
function PremiumIconButton({ icon, isPremium, isOpen, onToggle, onClose, iconClass, title, label, children }: {
  icon: React.ReactNode;
  isPremium: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  iconClass: string;
  title: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center gap-0.5">
      <button onClick={onToggle} className={iconClass} title={isPremium ? title : 'Premium — unlock to use'}>
        {icon}
        {!isPremium && <Lock className="w-2 h-2 absolute -top-0.5 -right-0.5 text-primary/60" />}
      </button>
      {label && <span className="text-[8px] text-muted-foreground uppercase tracking-wider">{label}</span>}
      {isOpen && isPremium && (
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
