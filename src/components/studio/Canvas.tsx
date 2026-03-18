import { useRef, useCallback, useMemo } from 'react';
import { CanvasElement, FrameSize, FrameColor, Vibe, VibeFills, TextureSwatch } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { CanvasElementComponent } from './CanvasElement';
import { VibeOutline } from './VibeOutline';
import { DrawOverlay } from './DrawOverlay';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { textures } from '@/data/textures';

interface Props {
  elements: CanvasElement[];
  selectedId: string | null;
  frameSize: FrameSize;
  frameColor: FrameColor;
  wallFrameStyle: FrameStyle;
  activeVibe: Vibe | null;
  vibeFills: VibeFills;
  selectedSectionId: string | null;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  customTextures?: TextureSwatch[];
  backgroundTextureId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDrop: (textureId: string, x: number, y: number) => void;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
  onDropAsSwatch: (textureId: string, x: number, y: number) => void;
  onDetachSection: (sectionId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  drawMode?: boolean;
  onFinishDraw?: (pathD: string) => void;
  onCancelDraw?: () => void;
}

const frameSizeMap: Record<FrameSize, { w: number; h: number }> = {
  '8x8': { w: 380, h: 380 },
  '12x12': { w: 480, h: 480 },
  '16x16': { w: 560, h: 560 },
  'gallery': { w: 600, h: 420 },
};

// Solid color fallbacks for basic frame options
const wallFrameStyles: Record<FrameStyle, { bg: string; border: string; shadow: string; innerBg: string; padding: number; borderRadius: number }> = {
  gold: { bg: 'linear-gradient(135deg, hsl(43, 74%, 60%), hsl(43, 74%, 45%), hsl(43, 74%, 65%))', border: '3px solid hsl(43, 60%, 40%)', shadow: 'hsla(43, 50%, 30%, 0.3)', innerBg: 'hsl(40, 20%, 97%)', padding: 16, borderRadius: 2 },
  chrome: { bg: 'linear-gradient(135deg, hsl(0, 0%, 85%), hsl(0, 0%, 70%), hsl(0, 0%, 90%))', border: '3px solid hsl(0, 0%, 60%)', shadow: 'hsla(0, 0%, 0%, 0.2)', innerBg: 'hsl(0, 0%, 97%)', padding: 12, borderRadius: 1 },
  copper: { bg: 'linear-gradient(135deg, hsl(20, 60%, 55%), hsl(20, 50%, 40%), hsl(20, 60%, 60%))', border: '3px solid hsl(20, 50%, 35%)', shadow: 'hsla(20, 40%, 25%, 0.3)', innerBg: 'hsl(30, 15%, 96%)', padding: 14, borderRadius: 2 },
  silver: { bg: 'linear-gradient(135deg, hsl(0, 0%, 80%), hsl(0, 0%, 65%), hsl(0, 0%, 82%))', border: '3px solid hsl(0, 0%, 55%)', shadow: 'hsla(0, 0%, 0%, 0.15)', innerBg: 'hsl(0, 0%, 97%)', padding: 14, borderRadius: 2 },
  minimal: { bg: 'hsl(0, 0%, 98%)', border: '2px solid hsl(0, 0%, 88%)', shadow: 'hsla(0, 0%, 0%, 0.08)', innerBg: 'hsl(0, 0%, 99%)', padding: 8, borderRadius: 0 },
  'shadow-box': { bg: 'hsl(0, 0%, 96%)', border: '2px solid hsl(0, 0%, 85%)', shadow: 'hsla(0, 0%, 0%, 0.25)', innerBg: 'hsl(0, 0%, 99%)', padding: 24, borderRadius: 2 },
  wood: { bg: 'linear-gradient(180deg, hsl(30, 40%, 45%), hsl(25, 35%, 35%), hsl(30, 40%, 42%))', border: '4px solid hsl(25, 35%, 30%)', shadow: 'hsla(25, 30%, 20%, 0.3)', innerBg: 'hsl(40, 20%, 97%)', padding: 16, borderRadius: 1 },
  floating: { bg: 'transparent', border: 'none', shadow: 'hsla(0, 0%, 0%, 0.2)', innerBg: 'hsl(0, 0%, 100%)', padding: 0, borderRadius: 0 },
  polaroid: { bg: 'hsl(0, 0%, 98%)', border: '2px solid hsl(0, 0%, 90%)', shadow: 'hsla(0, 0%, 0%, 0.12)', innerBg: 'hsl(0, 0%, 99%)', padding: 12, borderRadius: 2 },
  none: { bg: 'transparent', border: 'none', shadow: 'hsla(0, 0%, 0%, 0)', innerBg: 'hsl(40, 20%, 97%)', padding: 0, borderRadius: 0 },
};

export function Canvas({
  elements, selectedId, frameSize, frameColor, wallFrameStyle,
  activeVibe, vibeFills, selectedSectionId,
  customTemplate, templateOpacity,
  backgroundTextureId,
  onSelect, onUpdate, onDrop,
  onSelectSection, onDropInSection, onDropAsSwatch, onDetachSection, canvasRef,
  customTextures = [],
  drawMode = false, onFinishDraw, onCancelDraw,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { w, h } = frameSizeMap[frameSize];

  const allTextures = useMemo(() => [...textures, ...customTextures], [customTextures]);

  // Resolve background texture image
  const bgTextureUrl = useMemo(() => {
    if (!backgroundTextureId) return null;
    const tex = allTextures.find(t => t.id === backgroundTextureId);
    return tex?.image || null;
  }, [backgroundTextureId, allTextures]);

  // Resolve frame styling from wallFrameStyle
  const frameStyle = useMemo(() => {
    const style = wallFrameStyles[wallFrameStyle] || wallFrameStyles.gold;
    return style;
  }, [wallFrameStyle]);

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
          padding: `${frameStyle.padding}px`,
          ...(wallFrameStyle === 'polaroid' ? { paddingBottom: '48px' } : {}),
          background: frameStyle.bg,
          borderRadius: `${frameStyle.borderRadius}px`,
          border: frameStyle.border,
          boxShadow: wallFrameStyle === 'floating'
            ? `0 12px 40px -8px ${frameStyle.shadow}`
            : `inset 0 2px 8px ${frameStyle.shadow}, 0 8px 32px -8px ${frameStyle.shadow}, 0 2px 8px ${frameStyle.shadow}`,
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
              onDetachSection={onDetachSection}
              customTextures={customTextures}
            />
          )}

          {/* Freehand draw overlay */}
          {drawMode && onFinishDraw && onCancelDraw && (
            <DrawOverlay
              canvasWidth={w}
              canvasHeight={h}
              onFinishDraw={onFinishDraw}
              onCancel={onCancelDraw}
            />
          )}
        </div>
      </div>
    </div>
  );
}
