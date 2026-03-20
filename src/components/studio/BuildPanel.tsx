import { ElementShape, Vibe } from '@/types/studio';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { RightSidebar } from './RightSidebar';
import { PenTool, Scissors, Sparkles, ExternalLink } from 'lucide-react';

interface BuildPanelProps {
  drawMode: boolean;
  onToggleDrawMode: () => void;
  nextShape: ElementShape;
  onSetNextShape: (shape: ElementShape) => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
  // Stencil props
  activeVibeId: string | null;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onGenerateMood: (prompt: string) => void;
  isGeneratingMood: boolean;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
  stencilsPoppedOut: boolean;
  onPopOutStencils: () => void;
}

const shapes: { value: ElementShape; label: string }[] = [
  { value: 'soft-square', label: 'Soft Square' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'strip', label: 'Strip' },
  { value: 'torn-edge', label: 'Torn Edge' },
  { value: 'blob', label: 'Blob' },
];

export function BuildPanel({
  drawMode, onToggleDrawMode,
  nextShape, onSetNextShape,
  isPremium, onRequestUpgrade,
  activeVibeId, onSelectVibe, onShuffleVibeFills,
  onGenerateMood, isGeneratingMood,
  customTemplate, templateOpacity, onUploadTemplate, onClearTemplate, onTemplateOpacityChange,
  stencilsPoppedOut, onPopOutStencils,
}: BuildPanelProps) {
  return (
    <div className="flex flex-col h-full bg-popover">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-secondary/30 shrink-0">
        <Scissors className="w-3.5 h-3.5 text-destructive" />
        <span className="text-xs font-semibold text-foreground">Build</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Inline Stencils (on top) ── */}
        {!stencilsPoppedOut && (
          <div>
            <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/30">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Stencils</span>
              </div>
              <button
                onClick={onPopOutStencils}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                title="Pop out to floating panel"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="max-h-[40vh] overflow-y-auto stencils-compact">
              <RightSidebar
                activeVibeId={activeVibeId}
                isPremium={isPremium}
                onSelectVibe={onSelectVibe}
                onShuffleVibeFills={onShuffleVibeFills}
                onRequestUpgrade={onRequestUpgrade}
                onGenerateMood={onGenerateMood}
                isGeneratingMood={isGeneratingMood}
                customTemplate={customTemplate}
                templateOpacity={templateOpacity}
                onUploadTemplate={onUploadTemplate}
                onClearTemplate={onClearTemplate}
                onTemplateOpacityChange={onTemplateOpacityChange}
                compact
              />
            </div>
          </div>
        )}

        {/* Draw freehand */}
        <div className="px-3 py-2 border-b border-border">
          <button
            onClick={onToggleDrawMode}
            className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              drawMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Draw Freehand
          </button>
        </div>

        {/* Shape selector */}
        <div className="px-3 py-2 border-b border-border">
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">Shape</p>
          <div className="flex flex-wrap gap-1">
            {shapes.map(shape => (
              <button
                key={shape.value}
                onClick={() => onSetNextShape(shape.value)}
                className={`px-2 py-1 text-[10px] rounded-md transition-colors capitalize ${
                  nextShape === shape.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
