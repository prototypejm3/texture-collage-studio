import { WallSettings, WallLayout, WallBackground, FrameStyle, HangingStyle, LightingPreset, AmbientSound } from '@/types/wall';
import { Lock, GripHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
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

// ── Kid mode backgrounds ──
const kidBackgrounds: { value: WallBackground; label: string; kidLabel: string; fill: string; borderColor: string }[] = [
  { value: 'white-brick', label: 'Cloud', kidLabel: '☁️ Cloud', fill: '#f5f5f0', borderColor: '#e2ddd6' },
  { value: 'wood-birch-wall', label: 'Sunset', kidLabel: '☀️ Sunset', fill: '#fef3e8', borderColor: '#e2ddd6' },
  { value: 'mint', label: 'Sage', kidLabel: '🌿 Sage', fill: '#edf4ed', borderColor: '#e2ddd6' },
  { value: 'blush', label: 'Blush', kidLabel: '💕 Blush', fill: '#fdf0f0', borderColor: '#e2ddd6' },
  { value: 'red', label: 'Apple', kidLabel: '🍎 Apple', fill: '#fdf0f0', borderColor: '#e2ddd6' },
  { value: 'green', label: 'Forest', kidLabel: '🌲 Forest', fill: '#e8f4e8', borderColor: '#e2ddd6' },
  { value: 'wood-oak-wall', label: 'Linen', kidLabel: '🧸 Linen', fill: '#f5ede0', borderColor: '#e2ddd6' },
];

// ── Adult mode backgrounds (grouped) ──
const adultBgGroups: { label: string; items: { value: WallBackground; label: string; fill: string; gradient?: string }[] }[] = [
  {
    label: 'Wood',
    items: [
      { value: 'wood-birch-wall', label: 'Birch', fill: '#d9a97c' },
      { value: 'wood-oak-wall', label: 'Oak', fill: '#c4956a' },
      { value: 'wood-walnut-wall', label: 'Walnut', fill: '#7c3f1e' },
    ],
  },
  {
    label: 'Brick',
    items: [
      { value: 'white-brick', label: 'White Brick', fill: '#f5f0ec' },
      { value: 'brick', label: 'Red Brick', fill: '#c4a090' },
    ],
  },
  {
    label: 'Wallpaper',
    items: [
      { value: 'blush', label: 'Blush', fill: '#fdf0f0', gradient: '#f9a8d4' },
      { value: 'floral', label: 'Floral', fill: '#f0f4ff', gradient: '#a78bfa' },
      { value: 'mint', label: 'Mint', fill: '#f0fdf4', gradient: '#4ade80' },
    ],
  },
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

const hangingStyles: { value: HangingStyle; label: string; group?: string }[] = [
  { value: 'floating', label: 'Floating', group: 'Style' },
  { value: 'string', label: 'String', group: 'String' },
  { value: 'lighted-string', label: 'Lighted', group: 'String' },
  { value: 'metal-wire', label: 'Metal', group: 'String' },
  { value: 'hemp', label: 'Hemp', group: 'String' },
  { value: 'white-string', label: 'White', group: 'String' },
  { value: 'braided', label: 'Braided', group: 'String' },
  { value: 'pink-yarn', label: 'Pink Yarn', group: 'String' },
  { value: 'beaded', label: 'Beaded', group: 'String' },
  { value: 'hook', label: 'Hook', group: 'Style' },
  { value: 'shelf', label: 'Shelf', group: 'Style' },
  { value: 'silver-screw', label: 'Silver Screw', group: 'Nail' },
  { value: 'red-tack', label: 'Red Tack', group: 'Nail' },
  { value: 'cork-tack', label: 'Cork Tack', group: 'Nail' },
];

const lightingPresets: { value: LightingPreset; label: string }[] = [
  { value: 'none', label: 'Off' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'golden-hour', label: 'Golden Hour' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'soft-diffused', label: 'Soft' },
];

const ambientSounds: { value: AmbientSound; label: string }[] = [
  { value: 'none', label: 'Off' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'loft', label: 'Loft' },
  { value: 'home', label: 'Home' },
];

// ── Kid mode wall icons ──
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

// ── SVG Icons for new toolbar ──
function MoveIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line x1="9" y1="2" x2="9" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="2" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <polygon points="9,1 7,4 11,4" fill={color}/>
      <polygon points="9,17 7,14 11,14" fill={color}/>
      <polygon points="1,9 4,7 4,11" fill={color}/>
      <polygon points="17,9 14,7 14,11" fill={color}/>
    </svg>
  );
}
function GridIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={color}/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill={color}/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill={color}/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill={color}/>
    </svg>
  );
}
function ListIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="8" x2="14" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="14" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function FramesIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1" stroke={color} strokeWidth="1.5" fill="none"/>
      <rect x="2" y="2" width="3" height="3" rx="0.5" fill={color}/>
      <rect x="11" y="2" width="3" height="3" rx="0.5" fill={color}/>
      <rect x="2" y="11" width="3" height="3" rx="0.5" fill={color}/>
      <rect x="11" y="11" width="3" height="3" rx="0.5" fill={color}/>
    </svg>
  );
}
function HangingIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2 Q8 6 12 2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="6" y1="4" x2="6" y2="9" stroke={color} strokeWidth="1.2"/>
      <line x1="10" y1="4" x2="10" y2="9" stroke={color} strokeWidth="1.2"/>
      <rect x="4" y="9" width="8" height="5" rx="1" fill={color} opacity="0.4"/>
    </svg>
  );
}
function LabelsIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="2.5" rx="1.25" fill={color}/>
      <rect x="3" y="7" width="10" height="2.5" rx="1.25" fill={color}/>
      <rect x="4" y="11" width="8" height="2.5" rx="1.25" fill={color}/>
    </svg>
  );
}
function ViewIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="7" ry="4" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="8" cy="8" r="2.5" fill={color}/>
    </svg>
  );
}
function LightingIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="7" rx="3.5" ry="4" stroke={color} strokeWidth="1.4" fill="none"/>
      <line x1="6.5" y1="11" x2="9.5" y2="11" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="0.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="3" y1="4" x2="2" y2="3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="13" y1="4" x2="14" y2="3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="2" y1="7" x2="0.5" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="14" y1="7" x2="15.5" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function SoundIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="12" r="2.5" fill={color}/>
      <rect x="7" y="3" width="1.5" height="9.5" rx="0.5" fill={color}/>
      <path d="M7.5 3C7.5 3 10 2 13 3.5V7C10 5.5 7.5 6.5 7.5 6.5" fill={color} opacity="0.7"/>
    </svg>
  );
}
function CurateIcon({ color = '#94a3b8' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline points="3,9 6.5,12.5 13,4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// ── Toolbar button component ──
function ToolbarButton({ active, onClick, icon, label, locked, onRequestUpgrade }: {
  active?: boolean;
  onClick: () => void;
  icon: (color: string) => React.ReactNode;
  label?: string;
  locked?: boolean;
  onRequestUpgrade?: () => void;
}) {
  const handleClick = () => {
    if (locked && onRequestUpgrade) {
      onRequestUpgrade();
      return;
    }
    onClick();
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center transition-all active:scale-[0.94]"
        style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: active ? '#5a8a6a' : '#f0ebe3',
          border: active ? 'none' : '1.2px solid #e2ddd6',
        }}
      >
        {icon(active ? 'white' : '#94a3b8')}
        {locked && <Lock className="w-2 h-2 absolute -top-0.5 -right-0.5" style={{ color: '#5a8a6a' }} />}
      </button>
      {label && (
        <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'system-ui, sans-serif' }}>{label}</span>
      )}
    </div>
  );
}

// ── Section label ──
function SectionLabel({ text }: { text: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, color: '#94a3b8',
      letterSpacing: 1, textTransform: 'uppercase' as const,
      fontFamily: 'system-ui, sans-serif',
    }}>{text}</span>
  );
}

// ── Divider ──
function ToolbarDivider() {
  return <div style={{ width: 1, height: 64, backgroundColor: '#e2ddd6', flexShrink: 0 }} />;
}

// ── Wall swatch circle ──
function WallSwatch({ fill, pattern, selected, onClick }: {
  fill: string;
  pattern?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full flex-shrink-0 transition-all hover:scale-110 relative overflow-hidden"
      style={{
        width: 26, height: 26,
        backgroundColor: fill,
        border: selected ? '2.5px solid #5a8a6a' : '1px solid #e2ddd6',
      }}
    >
      {pattern && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 26 26">
          <circle cx="7" cy="7" r="1.5" fill={pattern} opacity="0.7"/>
          <circle cx="17" cy="9" r="1.5" fill={pattern} opacity="0.7"/>
          <circle cx="9" cy="18" r="1.5" fill={pattern} opacity="0.7"/>
          <circle cx="19" cy="17" r="1.5" fill={pattern} opacity="0.7"/>
        </svg>
      )}
    </button>
  );
}

// ── Color wheel ──
function ColorWheelButton({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full flex-shrink-0 transition-all hover:scale-110"
      style={{
        width: 26, height: 26,
        background: 'conic-gradient(#f87171, #fbbf24, #4ade80, #38bdf8, #a78bfa, #f87171)',
        border: selected ? '2.5px solid #5a8a6a' : '1px solid #e2ddd6',
      }}
    >
      <div className="w-3 h-3 rounded-full bg-white mx-auto mt-[5px]" />
    </button>
  );
}

// ── Dropdown wrapper ──
function DropdownMenu({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[150px]" style={{ fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </div>
    </>
  );
}

export function WallCustomizer({ settings, onUpdate, onApplyFrameToAll, onApplyHangingToAll, onAutoCurate, onStepBack, onRequestUpgrade, isPremium }: WallCustomizerProps) {
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showHangingMenu, setShowHangingMenu] = useState(false);
  const [showLightingMenu, setShowLightingMenu] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#f5f0e8');
  const isMobile = useIsMobile();

  // Kid mode — unchanged
  if (kidMode) {
    return (
      <div className="flex flex-wrap items-center gap-4 px-1">
        <div className="mr-auto" />
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-semibold" style={{ color: '#5a7a8a' }}>Wall:</span>
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
      </div>
    );
  }

  // Adult mode — new grouped toolbar
  const isCustomColor = settings.background === 'custom' && settings.customWallImage?.startsWith('#');

  // Hideable state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Draggable state
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('wall-toolbar-pos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { x: 0, y: 0 };
  });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      localStorage.setItem('wall-toolbar-pos', JSON.stringify(position));
    } catch {}
  }, [position]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({ x: posStart.current.x + dx, y: posStart.current.y + dy });
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Collapsed: show a small pill to re-open
  if (isCollapsed) {
    return (
      <div
        className="flex items-center gap-1.5 cursor-pointer select-none transition-all hover:scale-105"
        style={{
          position: 'relative',
          left: position.x,
          top: position.y,
          background: '#f5f3f0',
          border: '1px solid #e2ddd6',
          borderRadius: 20,
          padding: '6px 14px',
          width: 'fit-content',
          fontFamily: 'system-ui, sans-serif',
        }}
        onClick={() => setIsCollapsed(false)}
      >
        <ChevronDown className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Show Toolbar
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center overflow-x-auto scrollbar-none"
      style={{
        position: 'relative',
        left: position.x,
        top: position.y,
        height: 80,
        background: '#f5f3f0',
        borderBottom: '1px solid #e2ddd6',
        borderRadius: 12,
        padding: '0 16px',
        gap: 16,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Drag handle + hide button */}
      <div className="flex flex-col items-center gap-1 shrink-0 mr-1">
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-0.5 rounded hover:bg-secondary/60 transition-colors"
          title="Hide toolbar"
        >
          <ChevronUp className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
        </button>
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary/60 transition-colors touch-none"
          title="Drag to move"
        >
          <GripHorizontal className="w-4 h-4" style={{ color: '#94a3b8' }} />
        </div>
      </div>

      <div style={{ width: 1, height: 48, backgroundColor: '#e2ddd6', flexShrink: 0 }} />

      {/* ── GROUP 1: ARRANGE ── */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <SectionLabel text="ARRANGE" />
        <div className="flex items-center gap-2">
          <ToolbarButton
            active={settings.layout === 'freeform'}
            onClick={() => onUpdate({ layout: 'freeform' })}
            icon={(c) => <MoveIcon color={c} />}
          />
          <ToolbarButton
            active={settings.layout === 'grid'}
            onClick={() => onUpdate({ layout: 'grid' })}
            icon={(c) => <GridIcon color={c} />}
            locked={!isPremium && settings.layout !== 'grid'}
            onRequestUpgrade={onRequestUpgrade}
          />
          <ToolbarButton
            active={settings.layout === 'single'}
            onClick={() => onUpdate({ layout: 'single' })}
            icon={(c) => <ListIcon color={c} />}
            locked={!isPremium}
            onRequestUpgrade={onRequestUpgrade}
          />
        </div>
      </div>

      <ToolbarDivider />

      {/* ── GROUP 2: DISPLAY ── */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <SectionLabel text="DISPLAY" />
        <div className="flex items-center gap-2">
          <div className="relative">
            <ToolbarButton
              active={showFrameMenu}
              onClick={() => setShowFrameMenu(!showFrameMenu)}
              icon={(c) => <FramesIcon color={c} />}
              label="Frames"
            />
            <DropdownMenu isOpen={showFrameMenu} onClose={() => setShowFrameMenu(false)}>
              <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Apply to all</p>
              {allFrameStyles.map(fs => (
                <button key={fs.value}
                  onClick={() => { onApplyFrameToAll?.(fs.value); setShowFrameMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${settings.defaultFrameStyle === fs.value ? 'font-medium' : ''}`}
                  style={{ color: settings.defaultFrameStyle === fs.value ? '#5a8a6a' : '#3d3530' }}
                >{fs.label}</button>
              ))}
            </DropdownMenu>
          </div>

          <div className="relative">
            <ToolbarButton
              active={showHangingMenu || (settings.defaultHangingStyle !== 'floating')}
              onClick={() => setShowHangingMenu(!showHangingMenu)}
              icon={(c) => <HangingIcon color={c} />}
              label="Hanging"
            />
            <DropdownMenu isOpen={showHangingMenu} onClose={() => setShowHangingMenu(false)}>
              {['Style', 'String', 'Nail'].map(group => {
                const items = hangingStyles.filter(h => h.group === group);
                if (!items.length) return null;
                return (
                  <div key={group}>
                    <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">{group}</p>
                    {items.map(hs => (
                      <button key={hs.value}
                        onClick={() => { onApplyHangingToAll?.(hs.value); setShowHangingMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${settings.defaultHangingStyle === hs.value ? 'font-medium' : ''}`}
                        style={{ color: settings.defaultHangingStyle === hs.value ? '#5a8a6a' : '#3d3530' }}
                      >{hs.label}</button>
                    ))}
                  </div>
                );
              })}
            </DropdownMenu>
          </div>

          <ToolbarButton
            active={settings.showTitleCards}
            onClick={() => onUpdate({ showTitleCards: !settings.showTitleCards })}
            icon={(c) => <LabelsIcon color={c} />}
            label="Labels"
          />

          <ToolbarButton
            active={false}
            onClick={() => onStepBack?.()}
            icon={(c) => <ViewIcon color={c} />}
            label="View"
          />
        </div>
      </div>

      <ToolbarDivider />

      {/* ── GROUP 3: AMBIENCE ── */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <SectionLabel text="AMBIENCE" />
        <div className="flex items-center gap-2">
          <div className="relative">
            <ToolbarButton
              active={showLightingMenu || settings.lightingPreset !== 'none'}
              onClick={() => setShowLightingMenu(!showLightingMenu)}
              icon={(c) => <LightingIcon color={c} />}
              label="Lighting"
            />
            <DropdownMenu isOpen={showLightingMenu} onClose={() => setShowLightingMenu(false)}>
              <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Lighting</p>
              {lightingPresets.map(lp => (
                <button key={lp.value}
                  onClick={() => { onUpdate({ lightingPreset: lp.value }); setShowLightingMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${settings.lightingPreset === lp.value ? 'font-medium' : ''}`}
                  style={{ color: settings.lightingPreset === lp.value ? '#5a8a6a' : '#3d3530' }}
                >{lp.label}</button>
              ))}
            </DropdownMenu>
          </div>

          <div className="relative">
            <ToolbarButton
              active={showSoundMenu || settings.ambientSound !== 'none'}
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              icon={(c) => <SoundIcon color={c} />}
              label="Sound"
            />
            <DropdownMenu isOpen={showSoundMenu} onClose={() => setShowSoundMenu(false)}>
              <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Ambiance</p>
              {ambientSounds.map(as => (
                <button key={as.value}
                  onClick={() => { onUpdate({ ambientSound: as.value }); setShowSoundMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${settings.ambientSound === as.value ? 'font-medium' : ''}`}
                  style={{ color: settings.ambientSound === as.value ? '#5a8a6a' : '#3d3530' }}
                >{as.label}</button>
              ))}
            </DropdownMenu>
          </div>

          <ToolbarButton
            active={false}
            onClick={() => isPremium ? onAutoCurate?.() : onRequestUpgrade?.()}
            icon={(c) => <CurateIcon color={c} />}
            label="Curate"
            locked={!isPremium}
            onRequestUpgrade={onRequestUpgrade}
          />
        </div>
      </div>

      <ToolbarDivider />

      {/* ── GROUP 4: WALL ── */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <SectionLabel text="WALL" />
        <div className="flex items-center gap-3">
          {adultBgGroups.map((group, gi) => (
            <div key={group.label} className="flex items-center gap-1.5">
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ fontSize: 9, fontWeight: 500, color: '#94a3b8', fontFamily: 'system-ui, sans-serif' }}>{group.label}</span>
                <div className="flex items-center gap-1">
                  {group.items.map(bg => {
                    const isWallpaper = group.label === 'Wallpaper';
                    return (
                      <WallSwatch
                        key={bg.value}
                        fill={bg.fill}
                        pattern={isWallpaper ? bg.gradient : undefined}
                        selected={settings.background === bg.value}
                        onClick={() => onUpdate({ background: bg.value })}
                      />
                    );
                  })}
                </div>
              </div>
              {gi < adultBgGroups.length - 1 && (
                <div style={{ width: 1, height: 40, backgroundColor: '#e2ddd6', flexShrink: 0 }} />
              )}
            </div>
          ))}

          {/* Color wheel */}
          <div className="relative">
            <ColorWheelButton
              selected={!!isCustomColor}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 mb-2 p-3 bg-popover border border-border rounded-lg shadow-lg">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      onUpdate({ background: 'custom', customWallImage: e.target.value });
                    }}
                    className="w-32 h-32 cursor-pointer border-none rounded-md"
                    style={{ padding: 0 }}
                  />
                  <p className="text-[9px] text-muted-foreground mt-1 text-center">{customColor}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
