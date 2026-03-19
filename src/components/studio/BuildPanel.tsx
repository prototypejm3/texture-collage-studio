import { TextureLibrary } from './TextureLibrary';
import { TextureSwatch, ElementShape } from '@/types/studio';
import { PenTool, Scissors } from 'lucide-react';

interface BuildPanelProps {
  // Draw mode
  drawMode: boolean;
  onToggleDrawMode: () => void;
  // Shape pre-selector
  nextShape: ElementShape;
  onSetNextShape: (shape: ElementShape) => void;
  // Texture library
  onDragStart: (textureId: string) => void;
  onTextureClick: (textureId: string) => void;
  activeSectionId: string | null;
  customTextures: TextureSwatch[];
  onUploadTexture: (file: File) => void;
  onRemoveCustomTexture: (id: string) => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
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
  onDragStart, onTextureClick, activeSectionId,
  customTextures, onUploadTexture, onRemoveCustomTexture,
  isPremium, onRequestUpgrade,
}: BuildPanelProps) {
  return (
    <div className="flex flex-col h-full bg-popover">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-secondary/30 shrink-0">
        <Scissors className="w-3.5 h-3.5 text-destructive" />
        <span className="text-xs font-semibold text-foreground">Build</span>
      </div>

      <div className="flex-1 overflow-y-auto">
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

        {/* Texture library */}
        <TextureLibrary
          onDragStart={onDragStart}
          onTextureClick={onTextureClick}
          activeSectionId={activeSectionId}
          customTextures={customTextures}
          onUploadTexture={onUploadTexture}
          onRemoveCustomTexture={onRemoveCustomTexture}
          isPremium={isPremium}
          onRequestUpgrade={onRequestUpgrade}
        />
      </div>
    </div>
  );
}
