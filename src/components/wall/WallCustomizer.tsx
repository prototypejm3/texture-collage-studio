import { WallSettings, WallLayout, WallBackground, FrameStyle, HangingStyle, LightingPreset, AmbientSound } from '@/types/wall';
import { LayoutGrid, AlignJustify, Check, Frame, Move, Lamp, Volume2, Tag, Wand2, Eye, Lock, LampDesk, GalleryVerticalEnd, Palette, Upload, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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

// Kid mode backgrounds (cute icons)
const kidBackgrounds: { value: WallBackground; label: string; kidLabel: string; fill: string; borderColor: string }[] = [
  { value: 'white-brick', label: 'Cloud', kidLabel: '☁️ Cloud', fill: '#f5f5f0', borderColor: '#e2ddd6' },
  { value: 'wood-birch-wall', label: 'Sunset', kidLabel: '☀️ Sunset', fill: '#fef3e8', borderColor: '#e2ddd6' },
  { value: 'mint', label: 'Sage', kidLabel: '🌿 Sage', fill: '#edf4ed', borderColor: '#e2ddd6' },
  { value: 'blush', label: 'Blush', kidLabel: '💕 Blush', fill: '#fdf0f0', borderColor: '#e2ddd6' },
  { value: 'red', label: 'Apple', kidLabel: '🍎 Apple', fill: '#fdf0f0', borderColor: '#e2ddd6' },
  { value: 'green', label: 'Forest', kidLabel: '🌲 Forest', fill: '#e8f4e8', borderColor: '#e2ddd6' },
  { value: 'wood-oak-wall', label: 'Linen', kidLabel: '🧸 Linen', fill: '#f5ede0', borderColor: '#e2ddd6' },
];

// Adult mode backgrounds (grouped)
const adultBgGroups: { label: string; items: { value: WallBackground; label: string; fill: string; gradient?: string }[] }[] = [
  {
    label: 'Wood',
    items: [
      { value: 'wood-birch-wall', label: 'Birch', fill: '#e8d5b8', gradient: 'linear-gradient(145deg, hsl(35, 40%, 78%), hsl(30, 35%, 68%))' },
      { value: 'wood-oak-wall', label: 'Oak', fill: '#c4956a', gradient: 'linear-gradient(145deg, hsl(28, 45%, 58%), hsl(25, 40%, 48%))' },
      { value: 'wood-walnut-wall', label: 'Walnut', fill: '#6b4226', gradient: 'linear-gradient(145deg, hsl(20, 45%, 30%), hsl(18, 40%, 22%))' },
    ],
  },
  {
    label: 'Brick',
    items: [
      { value: 'white-brick', label: 'White Brick', fill: '#f5f5f0' },
      { value: 'brick', label: 'Red Brick', fill: '#b8725a', gradient: 'linear-gradient(145deg, hsl(15, 40%, 52%), hsl(12, 35%, 42%))' },
    ],
  },
  {
    label: 'Wallpaper',
    items: [
      { value: 'floral', label: 'Floral', fill: '#f5ede5', gradient: 'radial-gradient(circle at 30% 40%, hsl(340,50%,80%) 3px, transparent 3px), radial-gradient(circle at 70% 60%, hsl(280,40%,75%) 3px, transparent 3px), linear-gradient(hsl(40,30%,95%), hsl(40,30%,95%))' },
      { value: 'blush', label: 'Blush', fill: '#fdf0f0' },
      { value: 'mint', label: 'Mint', fill: '#edf4ed' },
    ],
  },
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
      <ellipse cx="20" cy="14" rx="8" ry="7" fill="#22c55e"/>
      <ellipse cx="15" cy="18" rx="5" ry="4" fill="#4ade80"/>
      <ellipse cx="25" cy="18" rx="5" ry="4" fill="#4ade80"/>
      <ellipse cx="20" cy="11" rx="5" ry="4" fill="#16a34a"/>
      <rect x="18" y="24" width="4" height="8" rx="1" fill="#c4956a"/>
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

        {/* Background picker */}
        {kidMode ? (
          /* Kid mode: cute circle icons */
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-semibold" style={{ color: '#5a7a8a' }}>🎨 Wall:</span>
            {kidBackgrounds.map(bg => {
              const isSelected = settings.background === bg.value;
              const IconComp = wallIcons[bg.value];
              return (
                <button
                  key={bg.value}
                  onClick={() => onUpdate({ background: bg.value })}
                  className="relative rounded-lg transition-transform hover:scale-110 overflow-hidden flex-shrink-0"
                  style={{
                    width: 56, height: 56,
                    backgroundColor: bg.fill,
                    border: `${isSelected ? '3px' : '2px'} solid ${isSelected ? '#f97316' : bg.borderColor}`,
                    boxShadow: isSelected ? '0 0 0 2px #f9731640' : 'inset 0 0 0 2px rgba(255,255,255,0.5)',
                  }}
                  title={bg.kidLabel}
                >
                  {IconComp && <IconComp />}
                </button>
              );
            })}
          </div>
        ) : (
          /* Adult mode: grouped background picker with color picker + upload */
          <AdultBackgroundPicker
            settings={settings}
            onUpdate={onUpdate}
            isPremium={isPremium}
            onRequestUpgrade={onRequestUpgrade}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Adult Background Picker ─── */
function AdultBackgroundPicker({ settings, onUpdate, isPremium, onRequestUpgrade }: {
  settings: WallSettings;
  onUpdate: (updates: Partial<WallSettings>) => void;
  isPremium: boolean;
  onRequestUpgrade?: () => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#f5f0e8');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    // Store color in customWallImage as a color value
    onUpdate({ background: 'custom', customWallImage: color });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onUpdate({ background: 'custom', customWallImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pickerContent = (
    <div className={`flex items-center gap-1.5 flex-wrap ${isMobile ? 'flex-col items-start gap-2 p-3' : ''}`}>
      {adultBgGroups.map(group => (
        <div key={group.label} className={`flex items-center gap-1 ${isMobile ? 'w-full' : ''}`}>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider mr-0.5">{group.label}</span>
          <div className="flex items-center gap-1 flex-wrap">
            {group.items.map(bg => {
              const isSelected = settings.background === bg.value;
              return (
                <button
                  key={bg.value}
                  onClick={() => { onUpdate({ background: bg.value }); if (isMobile) setMobileOpen(false); }}
                  className={`rounded-full flex-shrink-0 transition-all hover:scale-110 ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  style={{
                    width: isMobile ? 36 : 28, height: isMobile ? 36 : 28,
                    background: bg.gradient || bg.fill,
                    border: `1px solid hsl(var(--border))`,
                  }}
                  title={bg.label}
                />
              );
            })}
          </div>
          {!isMobile && <div className="w-px h-5 bg-border mx-1" />}
        </div>
      ))}

      {/* Color picker */}
      <div className="relative flex items-center">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`rounded-full flex-shrink-0 transition-all hover:scale-110 flex items-center justify-center ${settings.background === 'custom' && settings.customWallImage?.startsWith('#') ? 'ring-2 ring-primary ring-offset-1' : ''}`}
          style={{
            width: isMobile ? 36 : 28, height: isMobile ? 36 : 28,
            background: 'conic-gradient(hsl(0,70%,60%), hsl(60,70%,60%), hsl(120,70%,60%), hsl(180,70%,60%), hsl(240,70%,60%), hsl(300,70%,60%), hsl(360,70%,60%))',
            border: '1px solid hsl(var(--border))',
          }}
          title="Color Picker"
        >
          <Palette className="w-3 h-3 text-white drop-shadow-sm" />
        </button>
        {showPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
            <div className="absolute bottom-full left-0 z-50 mb-2 p-3 bg-popover border border-border rounded-lg shadow-lg">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-32 h-32 cursor-pointer border-none rounded-md"
                style={{ padding: 0 }}
              />
              <p className="text-[9px] text-muted-foreground mt-1 text-center">{customColor}</p>
            </div>
          </>
        )}
      </div>

      {/* Upload custom */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-full flex-shrink-0 transition-all hover:scale-110 flex items-center justify-center bg-secondary ${settings.background === 'custom' && settings.customWallImage?.startsWith('data:') ? 'ring-2 ring-primary ring-offset-1' : ''}`}
        style={{ width: isMobile ? 36 : 28, height: isMobile ? 36 : 28, border: '1px solid hsl(var(--border))' }}
        title="Upload Background"
      >
        <Upload className="w-3 h-3 text-muted-foreground" />
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );

  if (isMobile) {
    return (
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-popover text-muted-foreground hover:bg-secondary transition-colors"
        >
          <span className="text-[11px] font-medium uppercase tracking-wider">Wall</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 bottom-full z-50 mb-2 bg-popover border border-border rounded-xl shadow-lg min-w-[240px]">
              <p className="px-3 pt-2 pb-1 text-[9px] text-muted-foreground uppercase tracking-widest">Wall Background</p>
              {pickerContent}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">Wall</span>
      {pickerContent}
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
