import { FrameSize } from '@/types/studio';
import { DesignSize, FrameStyle } from '@/types/wall';
import { Maximize2, Square, Minimize2 } from 'lucide-react';

interface Props {
  frameSize: FrameSize;
  onFrameSizeChange: (size: FrameSize) => void;
  displaySize: DesignSize;
  onDisplaySizeChange: (size: DesignSize) => void;
  wallFrameStyle: FrameStyle;
  onWallFrameStyleChange: (style: FrameStyle) => void;
}

const frameSizes: FrameSize[] = ['8x8', '12x12', '16x16', 'gallery'];

const displaySizes: { id: DesignSize; label: string; icon: typeof Square }[] = [
  { id: 'small', label: 'Small', icon: Minimize2 },
  { id: 'medium', label: 'Medium', icon: Square },
  { id: 'large', label: 'Large', icon: Maximize2 },
];

const frameStyles: { id: FrameStyle; label: string }[] = [
  { id: 'gold', label: 'Gold' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'copper', label: 'Copper' },
  { id: 'silver', label: 'Silver' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'shadow-box', label: 'Shadow Box' },
  { id: 'wood', label: 'Wood' },
  { id: 'floating', label: 'Floating' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'none', label: 'None' },
];

export function BottomBar({
  frameSize, onFrameSizeChange,
  displaySize, onDisplaySizeChange,
  wallFrameStyle, onWallFrameStyleChange,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-6 px-5 py-2 bg-popover border-t border-border">
      {/* Canvas size */}
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

      <div className="w-px h-5 bg-border" />

      {/* Display size */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Size</span>
        {displaySizes.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onDisplaySizeChange(s.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] rounded-md transition-colors ${
                displaySize === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-3 h-3" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Frame style */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Frame</span>
        <div className="flex gap-0.5 flex-wrap max-w-[400px]">
          {frameStyles.map(f => (
            <button
              key={f.id}
              onClick={() => onWallFrameStyleChange(f.id)}
              className={`px-2 py-1.5 text-[11px] rounded-md transition-colors ${
                wallFrameStyle === f.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
