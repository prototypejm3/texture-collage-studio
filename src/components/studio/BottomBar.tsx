import { useState } from 'react';
import { FrameSize } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { Trash2, Save, Download, Lock, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  frameSize: FrameSize;
  onFrameSizeChange: (size: FrameSize) => void;
  wallFrameStyle: FrameStyle;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
  isPremium?: boolean;
  onRequestUpgrade?: () => void;
  onOpenToolKit?: () => void;
  toolKitOpen?: boolean;
}

const frameSizes: FrameSize[] = ['8x8', '12x12', '16x16', 'gallery'];

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
  { id: 'floating', label: 'Floating' },
  { id: 'polaroid', label: 'Polaroid' },
];

export function BottomBar({
  frameSize, onFrameSizeChange,
  wallFrameStyle, onWallFrameStyleChange,
  onClear, onSave, onSaveToWall,
  isPremium = false, onRequestUpgrade,
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
    // Shadow-box applies the color variant; we keep wallFrameStyle as the color id
    onWallFrameStyleChange(id);
    setShowColorMenu(null);
  };

  // Check if current frame is a shadow-box color
  const isShadowColor = colorFrames.some(f => f.id === wallFrameStyle) || wallFrameStyle === 'shadow-box';

  return (
    <div className="flex items-center px-5 py-2 bg-popover border-t border-border relative">
      {/* Left: Canvas size */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Canvas</span>
        {frameSizes.map(s => (
          <button
            key={s}
            onClick={() => onFrameSizeChange(s)}
            className={`px-3 py-1.5 text-[11px] rounded-md transition-colors ${
              frameSize === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-border mx-4" />

      {/* Center: Frame picker */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Frame</span>

        {/* Pill buttons */}
        <div className="flex items-center gap-1">
          {specialFrames.map(f => {
            const isActive = f.id === 'shadow-box'
              ? isShadowColor
              : wallFrameStyle === f.id;

            return (
              <div key={f.id} className="relative">
                <button
                  onClick={() => handleSpecialSelect(f.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  {f.label}
                </button>

                {/* Shadow color picker popover */}
                {f.id === 'shadow-box' && showColorMenu === 'shadow' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowColorMenu(null)} />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-50 mb-2 bg-popover border border-border rounded-xl shadow-xl p-3">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 text-center">Shadow Box Color</p>
                      <div className="flex items-center gap-2">
                        {colorFrames.map(cf => {
                          const locked = !cf.free && !isPremium;
                          return (
                            <button
                              key={cf.id}
                              onClick={() => locked ? onRequestUpgrade?.() : handleColorSelect(cf.id)}
                              className={`relative w-7 h-7 rounded-full transition-all flex-shrink-0 ${
                                wallFrameStyle === cf.id
                                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-popover scale-110'
                                  : 'hover:scale-110'
                              } ${cf.id === 'none' ? 'border-2 border-border border-dashed' : 'border border-border/40'} ${
                                locked ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                              style={{ background: cf.color }}
                              title={locked ? 'Premium — unlock to use' : cf.label}
                            >
                              {locked && <Lock className="w-2 h-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/60" />}
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
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
        {onSaveToWall && (
          <button onClick={onSaveToWall} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground hover:bg-secondary rounded-lg transition-colors">
            <Save className="w-3.5 h-3.5" /> Save to Wall
          </button>
        )}
        <button
          onClick={() => isPremium ? onSave() : onRequestUpgrade?.()}
          className={`relative flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            isPremium
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          title={isPremium ? 'Export as PNG' : 'Premium — unlock to use'}
        >
          <Download className="w-3.5 h-3.5" /> Export PNG
          {!isPremium && <Lock className="w-2.5 h-2.5 ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
