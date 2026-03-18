import { useRef, useCallback, useMemo } from 'react';
import { CanvasElement, FrameSize, FrameColor, Vibe, VibeFills, TextureSwatch } from '@/types/studio';
import { CanvasElementComponent } from './CanvasElement';
import { VibeOutline } from './VibeOutline';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { textures } from '@/data/textures';

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
  onDropAsSwatch: (textureId: string, x: number, y: number) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const frameSizeMap: Record<FrameSize, { w: number; h: number }> = {
  '8x8': { w: 380, h: 380 },
  '12x12': { w: 480, h: 480 },
  '16x16': { w: 560, h: 560 },
  'gallery': { w: 600, h: 420 },
};

// Solid color fallbacks for basic frame options
const solidFrames: Record<string, { bg: string; border: string; shadow: string; innerBg: string }> = {
  white: { bg: 'hsl(0, 0%, 98%)', border: 'hsl(0, 0%, 88%)', shadow: 'hsla(0, 0%, 0%, 0.1)', innerBg: 'hsl(40, 20%, 97%)' },
  black: { bg: 'hsl(0, 0%, 8%)', border: 'hsl(0, 0%, 4%)', shadow: 'hsla(0, 0%, 0%, 0.3)', innerBg: 'hsl(0, 0%, 12%)' },
};

export function Canvas({
  elements, selectedId, frameSize, frameColor,
  activeVibe, vibeFills, selectedSectionId,
  customTemplate, templateOpacity,
  onSelect, onUpdate, onDrop,
  onSelectSection, onDropInSection, onDropAsSwatch, canvasRef,
  customTextures = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { w, h } = frameSizeMap[frameSize];

  const allTextures = useMemo(() => [...textures, ...customTextures], [customTextures]);

  // Resolve frame styling
  const frameStyle = useMemo(() => {
    const solid = solidFrames[frameColor];
    if (solid) {
      return {
        bg: solid.bg,
        bgSize: undefined as string | undefined,
        border: `3px solid ${solid.border}`,
        shadow: solid.shadow,
        innerBg: solid.innerBg,
      };
    }
    // Texture-based frame
    const tex = allTextures.find(t => t.id === frameColor);
    if (tex) {
      return {
        bg: tex.cssBackground,
        bgSize: 'cover' as string | undefined,
        border: '3px solid hsla(0, 0%, 50%, 0.2)',
        shadow: 'hsla(0, 0%, 0%, 0.15)',
        innerBg: 'hsl(40, 20%, 97%)',
      };
    }
    // Fallback
    const fb = solidFrames.white;
    return { bg: fb.bg, bgSize: undefined as string | undefined, border: `3px solid ${fb.border}`, shadow: fb.shadow, innerBg: fb.innerBg };
  }, [frameColor, allTextures]);

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
          background: frameStyle.bg,
          backgroundSize: frameStyle.bgSize,
          borderRadius: '4px',
          border: frameStyle.border,
          boxShadow: `
            inset 0 2px 8px ${frameStyle.shadow},
            0 8px 32px -8px ${frameStyle.shadow},
            0 2px 8px ${frameStyle.shadow}
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
            background: frameStyle.innerBg,
            boxShadow: `inset 0 1px 4px ${frameStyle.shadow}`,
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
          <div className="absolute inset-0" style={{ zIndex: 20, pointerEvents: 'none' }}>
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
          </div>

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
              onDropAsSwatch={onDropAsSwatch}
              customTextures={customTextures}
            />
          )}
        </div>
      </div>
    </div>
  );
}
