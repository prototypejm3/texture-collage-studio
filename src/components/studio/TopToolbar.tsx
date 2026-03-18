import { useRef, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { FrameSize, FrameColor, TextureSwatch } from '@/types/studio';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { Shuffle, Sparkles, Trash2, Download, Frame, Palette, ImagePlus, X, Save, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { textures } from '@/data/textures';

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

const solidOptions: { id: string; label: string; bg: string }[] = [
  { id: 'white', label: 'White', bg: 'hsl(0, 0%, 95%)' },
  { id: 'black', label: 'Black', bg: 'hsl(0, 0%, 10%)' },
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
  const [framePanelOpen, setFramePanelOpen] = useState(false);

  const handleTemplateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) onUploadTemplate(file);
    e.target.value = '';
  };

  // Get current frame display
  const currentFrameDisplay = useMemo(() => {
    const solid = solidOptions.find(s => s.id === frameColor);
    if (solid) return { label: solid.label, bg: solid.bg, isImage: false };
    const tex = textures.find(t => t.id === frameColor);
    if (tex) return { label: tex.name, bg: tex.cssBackground, isImage: true };
    return { label: 'White', bg: 'hsl(0, 0%, 95%)', isImage: false };
  }, [frameColor]);

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
        {/* Frame material picker */}
        <div className="relative">
          <button
            onClick={() => setFramePanelOpen(v => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border hover:border-muted-foreground transition-colors"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Frame</span>
            <div
              className="w-5 h-5 rounded border border-border/50"
              style={{
                background: currentFrameDisplay.bg,
                backgroundSize: currentFrameDisplay.isImage ? 'cover' : undefined,
              }}
            />
            <span className="text-xs text-foreground">{currentFrameDisplay.label}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {/* Dropdown panel */}
          {framePanelOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFramePanelOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 w-[320px] max-h-[400px] overflow-y-auto rounded-xl border border-border bg-popover shadow-xl p-3">
                {/* Solid colors */}
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Solid</p>
                <div className="flex gap-2 mb-3">
                  {solidOptions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { onFrameColorChange(s.id); setFramePanelOpen(false); }}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        frameColor === s.id ? 'border-primary scale-105' : 'border-border hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: s.bg }}
                      title={s.label}
                    />
                  ))}
                </div>

                {/* All textures as frame options */}
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Textures</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {textures.map(tex => (
                    <button
                      key={tex.id}
                      onClick={() => { onFrameColorChange(tex.id); setFramePanelOpen(false); }}
                      title={tex.name}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        frameColor === tex.id ? 'border-primary scale-105' : 'border-border/30 hover:border-muted-foreground'
                      }`}
                      style={{
                        background: tex.cssBackground,
                        backgroundSize: 'cover',
                      }}
                    />
                  ))}
                </div>
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
