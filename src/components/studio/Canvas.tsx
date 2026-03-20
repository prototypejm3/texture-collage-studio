import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { CanvasElement, FrameSize, FrameColor, Vibe, VibeFills, TextureSwatch, SectionTransform, SectionTransforms } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { CanvasElementComponent } from './CanvasElement';
import { VibeOutline } from './VibeOutline';
import { DrawOverlay } from './DrawOverlay';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { textures } from '@/data/textures';
import concreteFloor from '@/assets/concrete-floor.jpg';

export type TableSurface = 'birch' | 'oak' | 'walnut';

const surfaceImages: Record<TableSurface, string> = {
  'birch': '/walls/wood-birch-wall.png',
  'oak': '/walls/wood-oak-wall.png',
  'walnut': '/walls/wood-walnut-wall.png',
};

interface TableElement {
  id: string;
  textureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

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
  sectionTransforms: SectionTransforms;
  tableElements: TableElement[];
  tableSurface: TableSurface;
  workstationName: string;
  onWorkstationNameChange: (name: string) => void;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDrop: (textureId: string, x: number, y: number) => void;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
  onDropAsSwatch: (textureId: string, x: number, y: number) => void;
  onDetachSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onUpdateSectionTransform: (sectionId: string, updates: Partial<SectionTransform>) => void;
  onDeleteElement: (id: string) => void;
  onMoveToTable: (id: string, x: number, y: number) => void;
  onTableDrop: (textureId: string, x: number, y: number) => void;
  onTableElementUpdate: (id: string, updates: Partial<TableElement>) => void;
  onTableElementDelete: (id: string) => void;
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
  black: { bg: 'linear-gradient(135deg, hsl(0, 0%, 15%), hsl(0, 0%, 8%), hsl(0, 0%, 18%))', border: '3px solid hsl(0, 0%, 5%)', shadow: 'hsla(0, 0%, 0%, 0.3)', innerBg: 'hsl(0, 0%, 99%)', padding: 14, borderRadius: 2 },
  none: { bg: 'transparent', border: 'none', shadow: 'hsla(0, 0%, 0%, 0)', innerBg: 'hsl(40, 20%, 97%)', padding: 0, borderRadius: 0 },
};

export function Canvas({
  elements, selectedId, frameSize, frameColor, wallFrameStyle,
  activeVibe, vibeFills, selectedSectionId,
  customTemplate, templateOpacity,
  backgroundTextureId, sectionTransforms,
  tableElements, tableSurface,
  workstationName, onWorkstationNameChange,
  onSelect, onUpdate, onDrop,
  onSelectSection, onDropInSection, onDropAsSwatch, onDetachSection,
  onDeleteSection, onDuplicateSection, onUpdateSectionTransform,
  onDeleteElement, onMoveToTable, onTableDrop, onTableElementUpdate, onTableElementDelete,
  canvasRef,
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
    return tex?.cssBackground || null;
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

  const handleTableDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleTableDrop = useCallback((e: React.DragEvent) => {
    // Only handle drops on the table itself, not the canvas
    const textureId = e.dataTransfer.getData('textureId');
    if (!textureId || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 40;
    const y = e.clientY - rect.top - 40;
    onTableDrop(textureId, x, y);
  }, [onTableDrop]);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [easelMode, setEaselMode] = useState(false);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-0 relative overflow-hidden"
      style={{
        background: '#8B8B8B',
        ...(easelMode ? { perspective: '1200px' } : {}),
      }}
      onDragOver={handleTableDragOver}
      onDrop={handleTableDrop}
      onClick={() => { onSelect(null); setSelectedTableId(null); }}
    >
      {/* Concrete floor background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${concreteFloor})`,
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }} />

      {/* Wood desk surface — fades into concrete floor */}
      {!easelMode && (
        <>
          {/* Desk shadow on floor */}
          <div className="absolute pointer-events-none" style={{
            left: '8%',
            right: '8%',
            top: '5%',
            bottom: '5%',
            borderRadius: 8,
            boxShadow: '0 12px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
          }} />
          {/* Desk wood surface */}
          <div className="absolute pointer-events-none" style={{
            left: '8%',
            right: '8%',
            top: '5%',
            bottom: '5%',
            borderRadius: 6,
            overflow: 'hidden',
          }}>
            {/* Wood grain texture */}
            <div style={{
              position: 'absolute',
              backgroundImage: `url(${surfaceImages[tableSurface]})`,
              backgroundSize: '400px auto',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
              transform: 'rotate(90deg)',
              transformOrigin: 'center',
              width: '300%',
              height: '300%',
              left: '-100%',
              top: '-100%',
            }} />
            {/* Fade edges — wood blends into concrete */}
            <div style={{
              position: 'absolute',
              inset: 0,
              boxShadow: `
                inset 40px 0 60px -20px rgba(139,139,139,0.7),
                inset -40px 0 60px -20px rgba(139,139,139,0.7),
                inset 0 40px 60px -20px rgba(139,139,139,0.6),
                inset 0 -40px 60px -20px rgba(139,139,139,0.6)
              `,
              pointerEvents: 'none',
            }} />
            {/* Desk edge highlight */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 5,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.08)',
              pointerEvents: 'none',
            }} />
          </div>
        </>
      )}

      {/* Easel mode — full wood background */}
      {easelMode && (
        <div className="absolute pointer-events-none" style={{
          backgroundImage: `url(${surfaceImages[tableSurface]})`,
          backgroundSize: '400px auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          width: '300%',
          height: '300%',
          left: '-100%',
          top: '-100%',
        }} />
      )}
      {/* Table elements (swatches on the wood table) */}
      {tableElements.map(tel => {
        const tex = allTextures.find(t => t.id === tel.textureId);
        if (!tex) return null;
        return (
          <TableSwatch
            key={tel.id}
            element={tel}
            texture={tex}
            isSelected={selectedTableId === tel.id}
            onSelect={() => { setSelectedTableId(tel.id); onSelect(null); }}
            onUpdate={(updates) => onTableElementUpdate(tel.id, updates)}
            onDelete={() => onTableElementDelete(tel.id)}
          />
        );
      })}

      {/* Easel + Frame group */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...(easelMode ? {
          transform: 'rotateX(8deg)',
          transformStyle: 'preserve-3d' as const,
          marginBottom: 20,
        } : {
          marginBottom: 20,
        }),
      }}>

      {/* Legs poking above frame */}
      {easelMode && (
        <div className="pointer-events-none" style={{
          position: 'relative',
          width: w + 100,
          height: 90,
          marginBottom: -6,
          zIndex: 6,
        }}>
          {/* Left front leg */}
          <div style={{ position: 'absolute', width: 8, height: 140, background: '#D8B48A', borderRadius: '3px 3px 0 0', bottom: 0, left: '28%', transform: 'rotate(-5deg)', transformOrigin: 'bottom center' }} />
          {/* Right front leg */}
          <div style={{ position: 'absolute', width: 8, height: 140, background: '#D8B48A', borderRadius: '3px 3px 0 0', bottom: 0, right: '28%', transform: 'rotate(5deg)', transformOrigin: 'bottom center' }} />
          {/* Back support (center, tallest) */}
          <div style={{ position: 'absolute', width: 6, height: 150, background: '#C69C6D', borderRadius: '2px 2px 0 0', bottom: 0, left: '50%', marginLeft: -3 }} />
          {/* Top junction block */}
          <div style={{ position: 'absolute', width: 22, height: 8, background: '#B8885A', borderRadius: 3, top: 0, left: '50%', marginLeft: -11 }} />
        </div>
      )}

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
          zIndex: 10,
          position: 'relative' as const,
        }}
      >
        {/* Inner canvas */}
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={(e) => { e.stopPropagation(); handleDrop(e); }}
          className="relative overflow-hidden"
          style={{
            width: w,
            height: h,
            background: bgTextureUrl || frameStyle.innerBg,
            backgroundSize: bgTextureUrl ? 'cover' : undefined,
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
                onDelete={() => onDeleteElement(el.id)}
                onMoveToTable={(mouseX, mouseY) => {
                  // Convert mouse position to table-relative coords
                  if (containerRef.current) {
                    const tableRect = containerRef.current.getBoundingClientRect();
                    onMoveToTable(el.id, mouseX - tableRect.left - 40, mouseY - tableRect.top - 40);
                  }
                }}
                canvasRef={canvasRef}
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
              sectionTransforms={sectionTransforms}
              onSelectSection={onSelectSection}
              onDropInSection={onDropInSection}
              onDropAsSwatch={onDropAsSwatch}
              onDetachSection={onDetachSection}
              onDeleteSection={onDeleteSection}
              onDuplicateSection={onDuplicateSection}
              onUpdateSectionTransform={onUpdateSectionTransform}
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

      {/* Contact shadow where canvas meets shelf */}
      {easelMode && (
        <div style={{ width: w + 20, height: 3, background: 'rgba(0,0,0,0.12)', borderRadius: '0 0 2px 2px', marginTop: -1, zIndex: 11 }} />
      )}

      {/* Shelf / horizontal ledge — canvas rests on this */}
      {easelMode && (
        <div className="pointer-events-none" style={{
          width: w + 60,
          zIndex: 11,
          marginTop: 0,
        }}>
          <div style={{ width: '100%', height: 10, background: '#D8B48A', borderRadius: 2, boxShadow: '0 3px 8px rgba(0,0,0,0.12)' }} />
          <div style={{ width: '100%', height: 5, background: '#C69C6D', borderRadius: '0 0 3px 3px' }} />
        </div>
      )}
      </div>

      {/* Easel toggle — bottom-right */}
      <div
        className="absolute bottom-4 right-4 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setEaselMode(prev => !prev)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-lg transition-colors ${
            easelMode ? 'bg-primary text-primary-foreground' : 'bg-black/90 text-white/60 hover:text-white'
          }`}
          title={easelMode ? 'Flat view' : 'Easel view'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
            <rect x="4" y="3" width="16" height="13" rx="1" />
            <rect x="11" y="1" width="2" height="3" rx="0.5" />
            <line x1="3" y1="16" x2="21" y2="16" />
            <line x1="6" y1="16" x2="3" y2="23" />
            <line x1="18" y1="16" x2="21" y2="23" />
            <line x1="12" y1="16" x2="12" y2="23" />
          </svg>
        </button>
      </div>

      {/* Desk Nameplate — only in desk (non-easel) mode */}
      {!easelMode && (
        <div
          className="absolute z-20"
          style={{
            top: 'calc(3% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nameplate container with perspective */}
          <div style={{
            width: 200,
            perspective: '600px',
          }}>
            {/* Shadow under the whole nameplate */}
            <div style={{
              position: 'absolute',
              bottom: -4,
              left: 8,
              right: 8,
              height: 12,
              background: 'rgba(0,0,0,0.12)',
              borderRadius: '50%',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }} />

            {/* Front face — tilted backward */}
            <div style={{
              background: '#1F1F1F',
              padding: '8px 14px 6px',
              transformOrigin: 'bottom center',
              transform: 'rotateX(11deg)',
              borderRadius: '2px 2px 0 0',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.3)',
              position: 'relative',
            }}>
              {/* Subtle top edge highlight */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '2px 2px 0 0',
              }} />
              {/* Editable name + "'s Desk" on one line */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: 0,
              }}>
                <input
                  type="text"
                  value={workstationName}
                  onChange={(e) => onWorkstationNameChange(e.target.value)}
                  className="bg-transparent outline-none border-none text-center"
                  style={{
                    color: '#EAEAEA',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    fontFamily: "'Inter', 'system-ui', sans-serif",
                    width: workstationName.length > 0 ? `${Math.max(workstationName.length * 7, 40)}px` : '60px',
                    maxWidth: 120,
                    padding: 0,
                    margin: 0,
                  }}
                  placeholder="Your Name"
                />
                <span style={{
                  color: 'rgba(234,234,234,0.5)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  fontFamily: "'Inter', 'system-ui', sans-serif",
                }}>'s Desk</span>
              </div>
            </div>

            {/* Base — flat on table */}
            <div style={{
              background: '#2A2A2A',
              height: 4,
              borderRadius: '0 0 2px 2px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }} />

            {/* Thickness edge */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: '#252525',
              borderRadius: '0 0 2px 2px',
              transform: 'translateY(100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Table Swatch Component ──
import { X } from 'lucide-react';

interface TableSwatchProps {
  element: TableElement;
  texture: TextureSwatch;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TableElement>) => void;
  onDelete: () => void;
}

function TableSwatch({ element, texture, isSelected, onSelect, onUpdate, onDelete }: TableSwatchProps) {
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: element.x, elY: element.y };
  }, [element.x, element.y, onSelect]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onUpdate({ x: dragStart.current.elX + dx, y: dragStart.current.elY + dy });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, onUpdate]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: 5,
        filter: 'drop-shadow(0 4px 8px hsla(220, 20%, 12%, 0.3))',
        clipPath: 'polygon(3% 1%, 48% 0%, 97% 2%, 99% 48%, 98% 97%, 52% 99%, 2% 98%, 0% 52%)',
      }}
    >
      {isSelected && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute -top-2.5 -right-2.5 z-50 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          style={{ clipPath: 'none' }}
          title="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      <div
        className="w-full h-full"
        style={{
          background: texture.cssBackground,
          backgroundSize: texture.cssBackground.startsWith('url(') ? 'cover' : '40px 40px',
        }}
      />
    </div>
  );
}
