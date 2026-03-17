import { FrameSize } from '@/types/studio';

interface Props {
  frameSize: FrameSize;
  onFrameSizeChange: (size: FrameSize) => void;
}

const frameSizes: FrameSize[] = ['8x8', '12x12', '16x16', 'gallery'];

export function BottomBar({ frameSize, onFrameSizeChange }: Props) {
  return (
    <div className="flex items-center justify-center px-5 py-2 bg-popover border-t border-border">
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">Size</span>
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
    </div>
  );
}
