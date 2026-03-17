import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FrameSize, FrameColor } from '@/types/studio';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { Shuffle, Sparkles, Trash2, Download, Frame, Palette, ImagePlus, X, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Props {
  frameSize: FrameSize;
  frameColor: FrameColor;
  onFrameSizeChange: (size: FrameSize) => void;
  onFrameColorChange: (color: FrameColor) => void;
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
}

const frameColors: { value: FrameColor; color: string; label: string }[] = [
  { value: 'white', color: 'hsl(0, 0%, 95%)', label: 'White' },
  { value: 'cream', color: 'hsl(40, 30%, 90%)', label: 'Cream' },
  { value: 'black', color: 'hsl(0, 0%, 10%)', label: 'Black' },
  { value: 'walnut', color: 'hsl(20, 35%, 28%)', label: 'Walnut' },
  { value: 'oak', color: 'hsl(35, 40%, 60%)', label: 'Oak' },
  { value: 'mahogany', color: 'hsl(0, 40%, 25%)', label: 'Mahogany' },
];

export function TopToolbar({
  frameColor,
  onFrameColorChange,
  onGenerate, onShuffle, onClear, onSave, onSaveToWall,
  onToggleVibes, vibesActive,
  customTemplate, templateOpacity,
  onUploadTemplate, onClearTemplate, onTemplateOpacityChange,
}: Props) {
  const templateInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) onUploadTemplate(file);
    e.target.value = '';
  };

  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-popover border-b border-border">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Frame className="w-5 h-5 text-primary" />
        <h1 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Shadow Box Studio
        </h1>
      </div>

      {/* Center: Frame color + reference */}
      <div className="flex items-center gap-4">
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

        <div className="w-px h-5 bg-border" />

        {/* Template reference image */}
        <div className="flex items-center gap-1.5">
          {!customTemplate ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => templateInputRef.current?.click()}
                className="gap-1.5 text-xs"
                title="Upload a reference image as canvas background"
              >
                <ImagePlus className="w-3.5 h-3.5" /> Reference
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
        <Button
          size="sm"
          variant={vibesActive ? 'default' : 'ghost'}
          onClick={onToggleVibes}
          className="gap-1.5 text-xs"
        >
          <Palette className="w-3.5 h-3.5" /> Stencils
        </Button>
        <Button size="sm" variant="ghost" onClick={onGenerate} className="gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> Generate
        </Button>
        <Button size="sm" variant="ghost" onClick={onShuffle} className="gap-1.5 text-xs">
          <Shuffle className="w-3.5 h-3.5" /> Shuffle
        </Button>
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
