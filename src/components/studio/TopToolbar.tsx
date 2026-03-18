import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FrameSize, FrameColor } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { Shuffle, Sparkles, Trash2, Download, Frame, ImagePlus, X, Save, ChevronDown, Lock, PenTool } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Props {
  frameSize: FrameSize;
  frameColor: FrameColor;
  wallFrameStyle: FrameStyle;
  onFrameSizeChange: (size: FrameSize) => void;
  onFrameColorChange: (color: FrameColor) => void;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onGenerate: () => void;
  onShuffle: () => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
  onToggleVibes: () => void;
  vibesActive: boolean;
  // Template
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
  // Premium
  isPremium: boolean;
  onRequestUpgrade: () => void;
  drawMode?: boolean;
  onToggleDraw?: () => void;
}

const frameStyleList: { id: FrameStyle; label: string }[] = [
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

export function TopToolbar({
  frameColor,
  onFrameColorChange,
  wallFrameStyle,
  onWallFrameStyleChange,
  onGenerate, onShuffle, onClear, onSave, onSaveToWall,
  onToggleVibes, vibesActive,
  customTemplate, templateOpacity,
  onUploadTemplate, onClearTemplate, onTemplateOpacityChange,
  isPremium, onRequestUpgrade,
  drawMode, onToggleDraw,
}: Props) {
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [framePanelOpen, setFramePanelOpen] = useState(false);

  const handleTemplateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) onUploadTemplate(file);
    e.target.value = '';
  };

  const currentFrameLabel = frameStyleList.find(f => f.id === wallFrameStyle)?.label || 'Gold';

  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-popover border-b border-border relative">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Frame className="w-5 h-5 text-primary" />
        <h1 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Shadow Box Studio
        </h1>
      </div>

      {/* Center: Frame picker + reference */}
      <div className="flex items-center gap-4">
        {/* Frame style picker */}
        <div className="relative">
          <button
            onClick={() => setFramePanelOpen(v => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border hover:border-muted-foreground transition-colors"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Frame</span>
            <span className="text-xs text-foreground">{currentFrameLabel}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {framePanelOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFramePanelOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 w-44 rounded-xl border border-border bg-popover shadow-xl py-1.5 overflow-hidden">
                <p className="px-4 pt-2 pb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Frame</p>
                {frameStyleList.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { onWallFrameStyleChange(f.id); setFramePanelOpen(false); }}
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

        <div className="w-px h-5 bg-border" />

        {/* Template reference image */}
        <div className="flex items-center gap-1.5">
          {!customTemplate ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => isPremium ? templateInputRef.current?.click() : onRequestUpgrade()}
                className={`gap-1.5 text-xs ${!isPremium ? 'opacity-60' : ''}`}
                title={isPremium ? 'Upload a reference image as canvas background' : 'Premium feature'}
              >
                {isPremium ? <ImagePlus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} Reference
              </Button>
              <input
                ref={templateInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleTemplateFile}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground truncate max-w-[80px]" title={customTemplate.name}>
                📷 {customTemplate.name}
              </span>
              <div className="w-16">
                <Slider
                  value={[templateOpacity * 100]}
                  min={5}
                  max={80}
                  step={5}
                  onValueChange={([v]) => onTemplateOpacityChange(v / 100)}
                />
              </div>
              <button
                onClick={onClearTemplate}
                className="p-0.5 rounded hover:bg-secondary transition-colors"
                title="Remove reference image"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <Button size="sm" variant="ghost" onClick={onClear} className="gap-1.5 text-xs text-destructive hover:text-destructive">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </Button>
        {onSaveToWall && (
          <Button size="sm" variant="ghost" onClick={onSaveToWall} className="gap-1.5 text-xs">
            <Save className="w-3.5 h-3.5" /> Save to Wall
          </Button>
        )}
        <Button size="sm" onClick={onSave} className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" /> Export PNG
        </Button>
      </div>
    </div>
  );
}
