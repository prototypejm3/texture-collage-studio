import { useState, useEffect, useRef } from 'react';
import { FrameStyle } from '@/types/wall';
import { TableSurface } from './Canvas';
import { Trash2, Save, Download, Lock, Scissors, Sparkles } from 'lucide-react';
import { TrashCanIcon, SaveBoxIcon, DownloadTrayIcon } from './ToyboxIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomThemePicker, useRoomTheme } from './RoomThemePicker';

const FREE_EXPORT_LIMIT = 1;
const EXPORT_COUNT_KEY = 'free-export-count';

function getFreeExportCount(): number {
  try { return parseInt(localStorage.getItem(EXPORT_COUNT_KEY) || '0', 10); } catch { return 0; }
}

function incrementFreeExportCount(): void {
  try { localStorage.setItem(EXPORT_COUNT_KEY, String(getFreeExportCount() + 1)); } catch {}
}

interface Props {
  wallFrameStyle: FrameStyle;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
  isPremium?: boolean;
  onRequestUpgrade?: () => void;
  onOpenToolKit?: () => void;
  toolKitOpen?: boolean;
  onOpenStencils?: () => void;
  stencilsOpen?: boolean;
  tableSurface?: TableSurface;
  onTableSurfaceChange?: (surface: TableSurface) => void;
  easelMode?: boolean;
  onToggleEasel?: () => void;
  backgroundTextureId?: string | null;
  onBackgroundChange?: (id: string | null) => void;
}

const canvasBgPresets = [
  { id: null, label: 'White', kidLabel: 'White', color: 'hsl(0,0%,98%)', emoji: '⬜' },
  { id: 'rainbow-bg', label: 'Rainbow', kidLabel: 'Rainbow', color: 'linear-gradient(135deg, hsl(0,80%,70%), hsl(40,90%,65%), hsl(60,90%,65%), hsl(120,60%,55%), hsl(200,80%,60%), hsl(270,70%,65%))', emoji: '🌈' },
];

// Color frames for Shadow menu
const colorFrames: { id: FrameStyle; color: string; label: string; free?: boolean }[] = [
  { id: 'gold', color: 'linear-gradient(145deg, hsl(43,74%,60%), hsl(43,74%,45%))', label: 'Gold' },
  { id: 'chrome', color: 'linear-gradient(145deg, hsl(0,0%,85%), hsl(0,0%,70%))', label: 'Chrome' },
  { id: 'copper', color: 'linear-gradient(145deg, hsl(20,60%,55%), hsl(20,50%,40%))', label: 'Copper' },
  { id: 'silver', color: 'linear-gradient(145deg, hsl(220,8%,72%), hsl(220,10%,58%))', label: 'Silver' },
  { id: 'black', color: 'linear-gradient(145deg, hsl(0,0%,18%), hsl(0,0%,8%))', label: 'Black', free: true },
  { id: 'minimal', color: 'linear-gradient(145deg, hsl(0,0%,98%), hsl(0,0%,92%))', label: 'White', free: true },
  { id: 'wood', color: 'linear-gradient(145deg, hsl(30,40%,55%), hsl(25,35%,38%))', label: 'Wood' },
  { id: 'none', color: 'transparent', label: 'None', free: true },
];

// Special styles as pill buttons
const specialFrames: { id: FrameStyle; label: string; kidLabel: string; premium?: boolean }[] = [
  { id: 'shadow-box', label: 'Shadow', kidLabel: '🎨 Color' },
  { id: 'floating', label: 'Float', kidLabel: '☁️ Float', premium: true },
  { id: 'polaroid', label: 'Polaroid', kidLabel: '📸 Photo', premium: true },
];

export function BottomBar({
  wallFrameStyle, onWallFrameStyleChange,
  onClear, onSave, onSaveToWall,
  isPremium = false, onRequestUpgrade,
  onOpenToolKit, toolKitOpen = false,
  onOpenStencils, stencilsOpen = false,
  tableSurface = 'birch', onTableSurfaceChange,
  easelMode = true, onToggleEasel,
  backgroundTextureId, onBackgroundChange,
}: Props) {
  const [showColorMenu, setShowColorMenu] = useState<string | null>(null);
  const [showRoomTheme, setShowRoomTheme] = useState(false);
  const roomThemeRef = useRef<HTMLDivElement>(null);
  const [roomTheme, setRoomTheme] = useRoomTheme();
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  const handleSpecialSelect = (id: FrameStyle) => {
    if (id === 'shadow-box') {
      setShowColorMenu(prev => prev === 'shadow' ? null : 'shadow');
    } else {
      onWallFrameStyleChange(id);
      setShowColorMenu(null);
    }
  };

  const handleColorSelect = (id: FrameStyle) => {
    onWallFrameStyleChange(id);
    setShowColorMenu(null);
  };

  const isShadowColor = colorFrames.some(f => f.id === wallFrameStyle) || wallFrameStyle === 'shadow-box';

  return (
    <div className="flex flex-wrap items-center px-2 md:px-4 py-2 bg-popover relative gap-2">
      {/* Frame picker */}
      <div className="flex items-center gap-1">
        <span className={`uppercase tracking-wider text-muted-foreground hidden sm:inline mr-1 ${kidMode ? 'text-[10px] font-semibold' : 'text-[9px] font-semibold'}`}>{kidMode ? '🖼️' : 'DISPLAY'}</span>

        {/* Kid mode: simple circles for Black, White, None + locked premium circle */}
        {kidMode ? (
          <div className="flex items-center gap-1.5">
            {/* Black */}
            <button
              onClick={() => onWallFrameStyleChange('black')}
              className={`relative w-6 h-6 rounded-full transition-all flex-shrink-0 border ${
                wallFrameStyle === 'black'
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                  : 'border-border/40 hover:scale-110'
              }`}
              style={{ background: 'linear-gradient(145deg, hsl(0,0%,18%), hsl(0,0%,8%))' }}
              title="Black"
            />
            {/* White */}
            <button
              onClick={() => onWallFrameStyleChange('minimal')}
              className={`relative w-6 h-6 rounded-full transition-all flex-shrink-0 border ${
                wallFrameStyle === 'minimal'
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                  : 'border-border/40 hover:scale-110'
              }`}
              style={{ background: 'linear-gradient(145deg, hsl(0,0%,98%), hsl(0,0%,92%))' }}
              title="White"
            />
            {/* None */}
            <button
              onClick={() => onWallFrameStyleChange('none')}
              className={`relative w-6 h-6 rounded-full transition-all flex-shrink-0 border border-dashed ${
                wallFrameStyle === 'none'
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                  : 'border-border/40 hover:scale-110'
              }`}
              style={{ background: 'transparent' }}
              title="None"
            />
            {/* Rainbow */}
            <button
              onClick={() => onWallFrameStyleChange('rainbow')}
              className={`relative w-6 h-6 rounded-full transition-all flex-shrink-0 border ${
                wallFrameStyle === 'rainbow'
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                  : 'border-border/40 hover:scale-110'
              }`}
              style={{ background: 'conic-gradient(hsl(0,80%,65%), hsl(40,90%,60%), hsl(60,90%,60%), hsl(120,60%,50%), hsl(200,80%,55%), hsl(270,70%,60%), hsl(0,80%,65%))' }}
              title="Rainbow"
            />
            {/* Shadow Box */}
            <button
              onClick={() => onWallFrameStyleChange('shadow-box')}
              className={`relative w-6 h-6 rounded-full transition-all flex-shrink-0 border ${
                wallFrameStyle === 'shadow-box'
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                  : 'border-border/40 hover:scale-110'
              }`}
              style={{ background: 'linear-gradient(145deg, hsl(0,0%,45%), hsl(0,0%,30%))' }}
              title="Shadow Box"
            />
          </div>
        ) : (
          /* Adult mode: everything visible inline, no popovers */
          <div className="flex flex-col gap-3">
            {/* Display type pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">DISPLAY</span>
              {specialFrames.map(f => {
                const isActive = f.id === 'shadow-box' ? isShadowColor : wallFrameStyle === f.id;
                const locked = f.premium && !isPremium;
                return (
                  <button
                    key={f.id}
                    onClick={() => locked ? onRequestUpgrade?.() : onWallFrameStyleChange(f.id)}
                    className={`px-3 py-1.5 rounded-full transition-colors text-[11px] font-medium ${
                      isActive
                        ? 'bg-[#f97316] text-white shadow-sm'
                        : 'bg-secondary text-foreground border border-border hover:bg-accent'
                    } ${locked ? 'opacity-50' : ''}`}
                  >
                    {f.label}
                    {locked && <Lock className="w-2.5 h-2.5 inline-block ml-1 -mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Shadow color circles — always visible */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Shadow</span>
              {colorFrames.map(cf => {
                const cfLocked = !cf.free && !isPremium;
                return (
                  <button
                    key={cf.id}
                    onClick={() => cfLocked ? onRequestUpgrade?.() : handleColorSelect(cf.id)}
                    className={`relative w-7 h-7 rounded-full transition-all flex-shrink-0 ${
                      wallFrameStyle === cf.id
                        ? 'ring-2 ring-[#f97316] ring-offset-2 ring-offset-popover scale-110'
                        : 'hover:scale-110'
                    } ${cf.id === 'none' ? 'border-2 border-dashed border-border' : 'border border-border/40'} ${
                      cfLocked ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                    style={{ background: cf.color }}
                    title={cfLocked ? 'Premium' : cf.label}
                  >
                    {cfLocked && <Lock className="w-2 h-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/60" />}
                  </button>
                );
              })}
            </div>

            {/* Wood Finish circles — always visible */}
            {onTableSurfaceChange && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">Wood Finish</span>
                {([
                  { id: 'birch' as TableSurface, img: '/walls/wood-birch-wall.png', label: 'Birch' },
                  { id: 'oak' as TableSurface, img: '/walls/wood-oak-wall.png', label: 'Oak' },
                  { id: 'walnut' as TableSurface, img: '/walls/wood-walnut-wall.png', label: 'Walnut' },
                ]).map(s => (
                  <button
                    key={s.id}
                    onClick={() => onTableSurfaceChange(s.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      tableSurface === s.id ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full border overflow-hidden ${
                      tableSurface === s.id
                        ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover border-primary/40'
                        : 'border-border/40'
                    }`}>
                      <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] text-muted-foreground">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {kidMode && onTableSurfaceChange && (
        <>
          <div className="w-px h-4 bg-border mx-0.5 md:mx-2" />
          <div className="flex items-center gap-0.5">
            <span className="text-xs">🪵</span>
            {([
              { id: 'birch' as TableSurface, img: '/walls/wood-birch-wall.png', label: 'Birch' },
              { id: 'oak' as TableSurface, img: '/walls/wood-oak-wall.png', label: 'Oak' },
              { id: 'walnut' as TableSurface, img: '/walls/wood-walnut-wall.png', label: 'Walnut' },
            ]).map(s => (
              <button
                key={s.id}
                onClick={() => onTableSurfaceChange(s.id)}
                className={`w-6 h-6 rounded-full transition-all flex-shrink-0 border overflow-hidden ${
                  tableSurface === s.id
                    ? 'ring-1.5 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                    : 'border-border/40 hover:scale-110'
                }`}
                title={s.label}
              >
                <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Easel / Desk toggle */}
      {onToggleEasel && (
        <>
          <div className="w-px h-5 bg-border mx-1" />
          <button
            onClick={onToggleEasel}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full transition-colors border ${
              easelMode
                ? 'bg-[#f97316] text-white border-[#f97316]'
                : 'bg-secondary text-foreground border-border hover:bg-accent'
            }`}
            title={easelMode ? 'Switch to flat desk' : 'Switch to easel'}
          >
            {easelMode ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="13" rx="1" />
                <line x1="3" y1="16" x2="21" y2="16" />
                <line x1="6" y1="16" x2="3" y2="23" />
                <line x1="18" y1="16" x2="21" y2="23" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="1" />
                <line x1="6" y1="18" x2="6" y2="22" />
                <line x1="18" y1="18" x2="18" y2="22" />
                <line x1="4" y1="22" x2="8" y2="22" />
                <line x1="16" y1="22" x2="20" y2="22" />
              </svg>
            )}
            <span className="hidden sm:inline">{kidMode ? (easelMode ? 'Stand Up' : 'Flat') : (easelMode ? 'Easel' : 'Desk')}</span>
          </button>
        </>
      )}

      {/* Canvas background presets — kid mode only (adults use left panel) */}
      {onBackgroundChange && kidMode && (
        <>
          <div className="w-px h-4 bg-border mx-0.5" />
          <div className="flex items-center gap-0.5">
            {canvasBgPresets.map(preset => {
              const isActive = preset.id === null ? !backgroundTextureId : backgroundTextureId === preset.id;
              return (
                <button
                  key={preset.label}
                  onClick={() => onBackgroundChange(preset.id)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors text-[11px] font-semibold"
                  style={{
                    background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    color: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))',
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-border/40 flex-shrink-0"
                    style={{ background: preset.color }}
                  />
                  {preset.kidLabel}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

       {/* Actions — kid mode: vertical pill next to box */}
       {kidMode && (
         <div className="flex flex-col items-center rounded-2xl overflow-hidden" style={{ backgroundColor: 'hsl(var(--toybox-card))', border: '1.5px solid hsl(var(--toybox-border))' }}>
           <button onClick={onClear} className="flex items-center gap-1.5 px-2.5 py-1.5 w-full transition-all hover:bg-black/5 active:scale-95" title="Start Over">
             <TrashCanIcon />
             <span className="text-xs font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>Start Over</span>
           </button>
           <div className="h-px w-4/5 mx-auto" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
           {onSaveToWall && (
             <>
               <button onClick={onSaveToWall} className="flex items-center gap-1.5 px-2.5 py-1.5 w-full transition-all hover:bg-black/5 active:scale-95" title="Save">
                 <SaveBoxIcon />
                 <span className="text-xs font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>Save</span>
               </button>
               <div className="h-px w-4/5 mx-auto" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
             </>
           )}
           <button
             onClick={() => {
               if (isPremium) {
                 onSave();
               } else if (getFreeExportCount() < FREE_EXPORT_LIMIT) {
                 incrementFreeExportCount();
                 onSave();
               } else {
                 onRequestUpgrade?.();
               }
             }}
             className="flex items-center gap-1.5 px-2.5 py-1.5 w-full transition-all hover:bg-black/5 active:scale-95"
             title="Download"
           >
             <DownloadTrayIcon />
             <span className="text-xs font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>Download</span>
           </button>
         </div>
       )}
    </div>
  );
}
