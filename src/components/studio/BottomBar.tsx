import { useState } from 'react';
import { FrameStyle } from '@/types/wall';
import { TableSurface } from './Canvas';
import { Trash2, Save, Download, Lock, Scissors, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

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
const specialFrames: { id: FrameStyle; label: string }[] = [
  { id: 'shadow-box', label: 'Shadow' },
  { id: 'floating', label: 'Float' },
  { id: 'polaroid', label: 'Polaroid' },
];

export function BottomBar({
  wallFrameStyle, onWallFrameStyleChange,
  onClear, onSave, onSaveToWall,
  isPremium = false, onRequestUpgrade,
  onOpenToolKit, toolKitOpen = false,
  onOpenStencils, stencilsOpen = false,
  tableSurface = 'birch', onTableSurfaceChange,
}: Props) {
  const [showColorMenu, setShowColorMenu] = useState<string | null>(null);

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
    <div className="flex items-center px-2 md:px-4 py-1 bg-popover relative gap-1.5">
      {/* Frame picker */}
      <div className="flex items-center gap-0.5">
        <span className="text-[8px] uppercase tracking-wider text-muted-foreground hidden sm:inline mr-0.5">Frame</span>
        {specialFrames.map(f => {
          const isActive = f.id === 'shadow-box' ? isShadowColor : wallFrameStyle === f.id;
          return (
            <div key={f.id} className="relative">
              <button
                onClick={() => handleSpecialSelect(f.id)}
                className={`px-1.5 py-0.5 text-[9px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {f.label}
              </button>
              {f.id === 'shadow-box' && showColorMenu === 'shadow' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowColorMenu(null)} />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-50 mb-1.5 bg-popover border border-border rounded-lg shadow-xl p-2">
                    <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1.5 text-center">Color</p>
                    <div className="flex items-center gap-1.5">
                      {colorFrames.map(cf => {
                        const locked = !cf.free && !isPremium;
                        return (
                          <button
                            key={cf.id}
                            onClick={() => locked ? onRequestUpgrade?.() : handleColorSelect(cf.id)}
                            className={`relative w-5 h-5 rounded-full transition-all flex-shrink-0 ${
                              wallFrameStyle === cf.id
                                ? 'ring-1.5 ring-primary ring-offset-1 ring-offset-popover scale-110'
                                : 'hover:scale-110'
                            } ${cf.id === 'none' ? 'border border-border border-dashed' : 'border border-border/40'} ${
                              locked ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                            style={{ background: cf.color }}
                            title={locked ? 'Premium' : cf.label}
                          >
                            {locked && <Lock className="w-1.5 h-1.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/60" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-px h-4 bg-border mx-0.5 md:mx-2" />
      {/* Surface selector */}
      {onTableSurfaceChange && (
        <div className="flex items-center gap-0.5">
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground hidden sm:inline mr-0.5">Table</span>
          {([
            { id: 'birch' as TableSurface, bg: 'linear-gradient(145deg, hsl(40,30%,75%), hsl(38,25%,65%))', label: 'Birch' },
            { id: 'oak' as TableSurface, bg: 'linear-gradient(145deg, hsl(30,40%,55%), hsl(28,35%,42%))', label: 'Oak' },
            { id: 'walnut' as TableSurface, bg: 'linear-gradient(145deg, hsl(20,35%,35%), hsl(18,30%,25%))', label: 'Walnut' },
          ]).map(s => (
            <button
              key={s.id}
              onClick={() => onTableSurfaceChange(s.id)}
              className={`w-5 h-5 rounded-full transition-all flex-shrink-0 border ${
                tableSurface === s.id
                  ? 'ring-1.5 ring-primary ring-offset-1 ring-offset-popover scale-110 border-primary/40'
                  : 'border-border/40 hover:scale-110'
              }`}
              style={{ background: s.bg }}
              title={s.label}
            />
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button onClick={onClear} className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
          <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">Clear</span>
        </button>
        {onSaveToWall && (
          <button onClick={onSaveToWall} className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-foreground hover:bg-secondary rounded-md transition-colors">
            <Save className="w-3 h-3" /> <span className="hidden sm:inline">Save</span>
          </button>
        )}
        <button
          onClick={() => isPremium ? onSave() : onRequestUpgrade?.()}
          className={`relative flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-medium rounded-md transition-colors ${
            isPremium
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          title={isPremium ? 'Export as PNG' : 'Premium'}
        >
          <Download className="w-3 h-3" /> <span className="hidden sm:inline">Export</span>
          {!isPremium && <Lock className="w-2 h-2 ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
