import { useRef, useCallback } from 'react';
import { CanvasElement, FrameSize, FrameColor, Vibe, VibeFills, TextureSwatch } from '@/types/studio';
import { CanvasElementComponent } from './CanvasElement';
import { VibeOutline } from './VibeOutline';
import { CustomTemplate } from '@/hooks/useCustomTemplate';

interface Props {
  elements: CanvasElement[];
  selectedId: string | null;
  frameSize: FrameSize;
  frameColor: FrameColor;
  activeVibe: Vibe | null;
  vibeFills: VibeFills;
  selectedSectionId: string | null;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  customTextures?: TextureSwatch[];
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDrop: (textureId: string, x: number, y: number) => void;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const frameSizeMap: Record<FrameSize, { w: number; h: number }> = {
  '8x8': { w: 380, h: 380 },
  '12x12': { w: 480, h: 480 },
  '16x16': { w: 560, h: 560 },
  'gallery': { w: 600, h: 420 },
};

const frameColorMap: Record<FrameColor, { bg: string; border: string; shadow: string }> = {
  white: { bg: 'hsl(0, 0%, 98%)', border: 'hsl(0, 0%, 88%)', shadow: 'hsla(0, 0%, 0%, 0.1)' },
  cream: { bg: 'hsl(40, 30%, 95%)', border: 'hsl(38, 25%, 85%)', shadow: 'hsla(30, 20%, 20%, 0.1)' },
  black: { bg: 'hsl(0, 0%, 8%)', border: 'hsl(0, 0%, 4%)', shadow: 'hsla(0, 0%, 0%, 0.3)' },
  walnut: { bg: 'hsl(20, 35%, 28%)', border: 'hsl(18, 30%, 22%)', shadow: 'hsla(20, 30%, 10%, 0.2)' },
  oak: { bg: 'hsl(35, 40%, 60%)', border: 'hsl(33, 35%, 50%)', shadow: 'hsla(35, 30%, 20%, 0.15)' },
  mahogany: { bg: 'hsl(0, 40%, 25%)', border: 'hsl(0, 35%, 18%)', shadow: 'hsla(0, 30%, 10%, 0.25)' },
};

export function Canvas({
  elements, selectedId, frameSize, frameColor,
  activeVibe, vibeFills, selectedSectionId,
  customTemplate, templateOpacity,
  onSelect, onUpdate, onDrop,
  onSelectSection, onDropInSection, canvasRef,
  customTextures = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { w, h } = frameSizeMap[frameSize];
  const fc = frameColorMap[frameColor];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const textureId = e.dataTransfer.getData('textureId');
    if (!textureId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    onDrop(textureId, x, y);
  }, [onDrop, canvasRef]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-8"
      style={{ background: 'hsl(var(--canvas-bg))' }}
      onClick={() => onSelect(null)}
    >
      {/* Frame */}
      <div
        style={{
          padding: '16px',
          background: fc.bg,
          borderRadius: '4px',
          border: `3px solid ${fc.border}`,
          boxShadow: `
            inset 0 2px 8px ${fc.shadow},
            0 8px 32px -8px ${fc.shadow},
            0 2px 8px ${fc.shadow}
          `,
        }}
      >
        {/* Inner canvas */}
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative overflow-hidden"
          style={{
            width: w,
            height: h,
            background: frameColor === 'black' ? 'hsl(0, 0%, 12%)' : 'hsl(40, 20%, 97%)',
            boxShadow: `inset 0 1px 4px ${fc.shadow}`,
          }}
        >
          {/* Custom template background reference */}
          {customTemplate && (
            <div
              className="absolute inset-0 pointer-events-none bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: `url(${customTemplate.dataUrl})`,
                opacity: templateOpacity,
                zIndex: 1,
              }}
            />
          )}

          {/* Free-placed elements (always rendered, even in vibe mode) */}
          {elements.map(el => (
            <CanvasElementComponent
              key={el.id}
              element={el}
              isSelected={el.id === selectedId}
              onSelect={() => onSelect(el.id)}
              onUpdate={(updates) => onUpdate(el.id, updates)}
              customTextures={customTextures}
            />
          ))}

          {/* Vibe outline overlay */}
          {activeVibe && (
            <VibeOutline
              vibe={activeVibe}
              fills={vibeFills}
              selectedSectionId={selectedSectionId}
              canvasWidth={w}
              canvasHeight={h}
              onSelectSection={onSelectSection}
              onDropInSection={onDropInSection}
              customTextures={customTextures}
            />
          )}
        </div>
      </div>
    </div>
  );
}
