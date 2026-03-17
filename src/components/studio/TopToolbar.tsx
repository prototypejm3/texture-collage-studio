import { Button } from '@/components/ui/button';
import { FrameSize, FrameColor } from '@/types/studio';
import { Shuffle, Sparkles, Trash2, Download, Frame } from 'lucide-react';

interface Props {
  frameSize: FrameSize;
  frameColor: FrameColor;
  onFrameSizeChange: (size: FrameSize) => void;
  onFrameColorChange: (color: FrameColor) => void;
  onGenerate: () => void;
  onShuffle: () => void;
  onClear: () => void;
  onSave: () => void;
}

const frameSizes: FrameSize[] = ['8x8', '12x12', '16x16', 'gallery'];
const frameColors: { value: FrameColor; color: string; label: string }[] = [
  { value: 'white', color: 'hsl(0, 0%, 95%)', label: 'White' },
  { value: 'cream', color: 'hsl(40, 30%, 90%)', label: 'Cream' },
  { value: 'black', color: 'hsl(0, 0%, 10%)', label: 'Black' },
  { value: 'walnut', color: 'hsl(20, 35%, 28%)', label: 'Walnut' },
  { value: 'oak', color: 'hsl(35, 40%, 60%)', label: 'Oak' },
  { value: 'mahogany', color: 'hsl(0, 40%, 25%)', label: 'Mahogany' },
];

export function TopToolbar({
  frameSize, frameColor,
  onFrameSizeChange, onFrameColorChange,
  onGenerate, onShuffle, onClear, onSave,
}: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-popover border-b border-border">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Frame className="w-5 h-5 text-primary" />
        <h1 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Shadow Box Studio
        </h1>
      </div>

      {/* Center: Frame controls */}
      <div className="flex items-center gap-4">
        {/* Frame size */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">Size</span>
          {frameSizes.map(s => (
            <button
              key={s}
              onClick={() => onFrameSizeChange(s)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
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

        {/* Frame color */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">Frame</span>
          {frameColors.map(c => (
            <button
              key={c.value}
              onClick={() => onFrameColorChange(c.value)}
              title={c.label}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                frameColor === c.value ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'
              }`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <Button size="sm" variant="ghost" onClick={onGenerate} className="gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> Generate
        </Button>
        <Button size="sm" variant="ghost" onClick={onShuffle} className="gap-1.5 text-xs">
          <Shuffle className="w-3.5 h-3.5" /> Shuffle
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear} className="gap-1.5 text-xs text-destructive hover:text-destructive">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </Button>
        <Button size="sm" onClick={onSave} className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" /> Save PNG
        </Button>
      </div>
    </div>
  );
}
