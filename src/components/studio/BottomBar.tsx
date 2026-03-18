import { useState } from 'react';
import { FrameSize } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { ChevronDown } from 'lucide-react';

interface Props {
  frameSize: FrameSize;
  onFrameSizeChange: (size: FrameSize) => void;
  wallFrameStyle: FrameStyle;
  onWallFrameStyleChange: (style: FrameStyle) => void;
}

const frameSizes: FrameSize[] = ['8x8', '12x12', '16x16', 'gallery'];

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
  wallFrameStyle, onWallFrameStyleChange,
}: Props) {
  const [frameDropdownOpen, setFrameDropdownOpen] = useState(false);
  const currentFrame = frameStyles.find(f => f.id === wallFrameStyle);

  return (
    <div className="flex items-center justify-center gap-6 px-5 py-2 bg-popover border-t border-border relative">
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

      {/* Frame style dropdown */}
      <div className="relative">
        <button
          onClick={() => setFrameDropdownOpen(v => !v)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border hover:border-muted-foreground transition-colors"
        >
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Frame</span>
          <span className="text-xs text-foreground">{currentFrame?.label || 'Gold'}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        {frameDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setFrameDropdownOpen(false)} />
            <div className="absolute bottom-full left-0 mb-1 z-50 w-44 rounded-xl border border-border bg-popover shadow-xl py-1.5 overflow-hidden">
              <p className="px-4 pt-2 pb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Frame</p>
              {frameStyles.map(f => (
                <button
                  key={f.id}
                  onClick={() => { onWallFrameStyleChange(f.id); setFrameDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    wallFrameStyle === f.id
                      ? 'text-primary font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
