import { useState } from 'react';
import { FrameSize } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { Trash2, Save, Download, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  frameSize: FrameSize;
  onFrameSizeChange: (size: FrameSize) => void;
  wallFrameStyle: FrameStyle;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
}

const frameSizes: FrameSize[] = ['8x8', '12x12', '16x16', 'gallery'];

// Color frames shown as circles (excluding shadow-box, which is now a pill)
const colorFrames: { id: FrameStyle; color: string; label: string }[] = [
  { id: 'gold', color: 'linear-gradient(145deg, hsl(43,74%,60%), hsl(43,74%,45%))', label: 'Gold' },
  { id: 'chrome', color: 'linear-gradient(145deg, hsl(0,0%,85%), hsl(0,0%,70%))', label: 'Chrome' },
  { id: 'copper', color: 'linear-gradient(145deg, hsl(20,60%,55%), hsl(20,50%,40%))', label: 'Copper' },
  { id: 'silver', color: 'linear-gradient(145deg, hsl(220,8%,72%), hsl(220,10%,58%))', label: 'Silver' },
  { id: 'black', color: 'linear-gradient(145deg, hsl(0,0%,18%), hsl(0,0%,8%))', label: 'Black' },
  { id: 'minimal', color: 'linear-gradient(145deg, hsl(0,0%,98%), hsl(0,0%,92%))', label: 'Minimal' },
  { id: 'wood', color: 'linear-gradient(145deg, hsl(30,40%,55%), hsl(25,35%,38%))', label: 'Wood' },
  { id: 'none', color: 'transparent', label: 'None' },
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
}: Props) {
  // Whether color circles are expanded
  const isColorFrame = colorFrames.some(f => f.id === wallFrameStyle);
  const [circlesExpanded, setCirclesExpanded] = useState(isColorFrame);

  const handleColorSelect = (id: FrameStyle) => {
    onWallFrameStyleChange(id);
  };

  const handleSpecialSelect = (id: FrameStyle) => {
    onWallFrameStyleChange(id);
    setCirclesExpanded(false);
  };

  const handleExpandCircles = () => {
    setCirclesExpanded(prev => !prev);
  };

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

        {/* Pill buttons for special styles */}
        <div className="flex items-center gap-1">
          {specialFrames.map(f => (
            <button
              key={f.id}
              onClick={() => handleSpecialSelect(f.id)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                wallFrameStyle === f.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-border" />

        {/* Color circle trigger + expanded circles */}
        <div className="flex items-center gap-1.5">
          {/* Current color swatch / expand toggle */}
          {!circlesExpanded && (
            <button
              onClick={handleExpandCircles}
              className={`w-5 h-5 rounded-full transition-all border border-border/40 hover:scale-110 ${
                isColorFrame ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110' : ''
              }`}
              style={{
                background: isColorFrame
                  ? colorFrames.find(f => f.id === wallFrameStyle)?.color
                  : colorFrames[0].color,
              }}
              title="Color frames"
            />
          )}

          {/* Expanded color circles */}
          <AnimatePresence>
            {circlesExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex items-center gap-1.5 overflow-hidden"
              >
                {colorFrames.map((f, i) => (
                  <motion.button
                    key={f.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.15 }}
                    onClick={() => handleColorSelect(f.id)}
                    className={`w-5 h-5 rounded-full transition-all flex-shrink-0 ${
                      wallFrameStyle === f.id
                        ? 'ring-2 ring-primary ring-offset-1 ring-offset-popover scale-110'
                        : 'hover:scale-110'
                    } ${f.id === 'none' ? 'border border-border border-dashed' : 'border border-border/40'}`}
                    style={{ background: f.color }}
                    title={f.label}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
        <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export PNG
        </button>
      </div>
    </div>
  );
}
