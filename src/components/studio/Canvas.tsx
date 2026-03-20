import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { CanvasElement, FrameSize, FrameColor, Vibe, VibeFills, TextureSwatch, SectionTransform, SectionTransforms, ElementShape, MaterialEffects, defaultEffects } from '@/types/studio';
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

export interface TableElement {
  id: string;
  textureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  clipPathD?: string;
  vibeId?: string;
  shape?: ElementShape;
  effects?: MaterialEffects;
}

interface Props {
  easelMode: boolean;
  onToggleEasel: () => void;
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
  onWallFrameStyleChange?: (style: FrameStyle) => void;
  isPremium?: boolean;
  onRequestUpgrade?: () => void;
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
  easelMode, onToggleEasel,
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
  onWallFrameStyleChange, isPremium = false, onRequestUpgrade,
  customTextures = [],
  drawMode = false, onFinishDraw, onCancelDraw,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string; isTable: boolean } | null>(null);

  // Keyboard delete for selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (selectedId) {
          e.preventDefault();
          onDeleteElement(selectedId);
          onSelect(null);
        } else if (selectedTableId) {
          e.preventDefault();
          onTableElementDelete(selectedTableId);
          setSelectedTableId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedTableId, onDeleteElement, onTableElementDelete, onSelect]);
  const baseSize = frameSizeMap[frameSize];

  // Dynamically size canvas to fit container, capped at base size
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const canvasSize = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return baseSize;
    const aspect = baseSize.w / baseSize.h;
    // Max 70% of container, capped at base pixel size
    const maxW = Math.min(containerSize.width * 0.55, baseSize.w);
    const maxH = Math.min(containerSize.height * 0.7, baseSize.h);
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    return { w: Math.round(Math.max(w, 200)), h: Math.round(Math.max(h, 200)) };
  }, [containerSize, baseSize]);

  const { w, h } = canvasSize;

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

  // selectedTableId moved above
  // easelMode is now a prop
  const [showFramePicker, setShowFramePicker] = useState(false);

  const framePickerOptions: { id: FrameStyle; label: string }[] = [
    { id: 'shadow-box', label: 'Shadow' },
    { id: 'floating', label: 'Float' },
    { id: 'polaroid', label: 'Polaroid' },
  ];

  const frameColorOptions: { id: FrameStyle; color: string; label: string; free?: boolean }[] = [
    { id: 'gold', color: 'linear-gradient(145deg, hsl(43,74%,60%), hsl(43,74%,45%))', label: 'Gold' },
    { id: 'chrome', color: 'linear-gradient(145deg, hsl(0,0%,85%), hsl(0,0%,70%))', label: 'Chrome' },
    { id: 'copper', color: 'linear-gradient(145deg, hsl(20,60%,55%), hsl(20,50%,40%))', label: 'Copper' },
    { id: 'silver', color: 'linear-gradient(145deg, hsl(220,8%,72%), hsl(220,10%,58%))', label: 'Silver' },
    { id: 'black', color: 'linear-gradient(145deg, hsl(0,0%,18%), hsl(0,0%,8%))', label: 'Black', free: true },
    { id: 'minimal', color: 'linear-gradient(145deg, hsl(0,0%,98%), hsl(0,0%,92%))', label: 'White', free: true },
    { id: 'wood', color: 'linear-gradient(145deg, hsl(30,40%,55%), hsl(25,35%,38%))', label: 'Wood' },
    { id: 'none', color: 'transparent', label: 'None', free: true },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-0 relative overflow-hidden"
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

      {/* Wood desk surface — rectangular desk with rounded corners and concrete border */}
      {!easelMode && (
        <>
          {/* Desk shadow on floor */}
          <div className="absolute pointer-events-none" style={{
            left: 28,
            right: 28,
            top: 28,
            bottom: 28,
            borderRadius: 16,
            boxShadow: '0 12px 60px rgba(0,0,0,0.45), 0 4px 20px rgba(0,0,0,0.25)',
          }} />
          {/* Desk wood surface */}
          <div className="absolute pointer-events-none" style={{
            left: 28,
            right: 28,
            top: 28,
            bottom: 28,
            borderRadius: 16,
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
            {/* Subtle inner shadow for depth/beveled edge */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.15), inset 0 -2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }} />
            {/* Desk edge bevel */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              border: '2px solid rgba(0,0,0,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
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
        onClick={(e) => {
          if (e.target === e.currentTarget && onWallFrameStyleChange) {
            e.stopPropagation();
            setShowFramePicker(prev => !prev);
          }
        }}
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
          cursor: onWallFrameStyleChange ? 'pointer' : undefined,
        }}
      >
        {/* Frame style picker popover */}
        {showFramePicker && onWallFrameStyleChange && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowFramePicker(false); }} />
            <div
              className="absolute z-50 bg-popover border border-border rounded-lg shadow-xl p-2.5"
              style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Style pills */}
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground mr-1">Frame</span>
                {framePickerOptions.map(f => {
                  const isShadowColor = frameColorOptions.some(c => c.id === wallFrameStyle);
                  const isActive = f.id === 'shadow-box' ? isShadowColor : wallFrameStyle === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        onWallFrameStyleChange(f.id);
                        if (f.id !== 'shadow-box') setShowFramePicker(false);
                      }}
                      className={`px-1.5 py-0.5 text-[9px] rounded-md transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
              {/* Color circles */}
              <div className="flex items-center gap-1.5">
                {frameColorOptions.map(cf => {
                  const locked = !cf.free && !isPremium;
                  return (
                    <button
                      key={cf.id}
                      onClick={() => {
                        if (locked) { onRequestUpgrade?.(); return; }
                        onWallFrameStyleChange(cf.id);
                        setShowFramePicker(false);
                      }}
                      className={`relative w-5 h-5 rounded-full transition-all flex-shrink-0 ${
                        wallFrameStyle === cf.id ? 'ring-1.5 ring-primary ring-offset-1 ring-offset-popover scale-110' : 'hover:scale-110'
                      } ${cf.id === 'none' ? 'border border-border border-dashed' : 'border border-border/40'} ${
                        locked ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      style={{ background: cf.color }}
                      title={locked ? 'Premium' : cf.label}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
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

      {/* Easel toggle removed — now in BottomBar */}

      {/* Desk Nameplate — on the wood, angled outward toward user */}
      {!easelMode && (
        <div
          className="absolute z-20"
          style={{
            top: 38,
            left: 40,
            perspective: '400px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ width: 200 }}>
            {/* Shadow cast on desk */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: 4,
              right: 4,
              height: 14,
              background: 'rgba(0,0,0,0.18)',
              borderRadius: '50%',
              filter: 'blur(10px)',
              pointerEvents: 'none',
            }} />

            {/* Nameplate body — tilted outward toward the viewer */}
            <div style={{
              transform: 'rotateX(-15deg)',
              transformOrigin: 'bottom center',
            }}>
              {/* Front face */}
              <div style={{
                background: 'linear-gradient(180deg, #2A2A2A 0%, #1F1F1F 100%)',
                padding: '9px 16px 7px',
                borderRadius: '2px 2px 0 0',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.4), 0 -2px 8px rgba(0,0,0,0.15)',
                position: 'relative',
              }}>
                {/* Top edge shine */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px 2px 0 0',
                }} />
                {/* Editable name + "'s Desk" */}
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
                    color: 'rgba(234,234,234,0.45)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    fontFamily: "'Inter', 'system-ui', sans-serif",
                  }}>'s Workspace</span>
                </div>
              </div>

              {/* Base strip */}
              <div style={{
                background: '#2A2A2A',
                height: 5,
                borderRadius: '0 0 2px 2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }} />
            </div>

            {/* Thickness edge visible from the tilt */}
            <div style={{
              height: 3,
              background: '#181818',
              borderRadius: '0 0 2px 2px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              marginTop: -1,
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

  const clipStyle = element.clipPathD
    ? `path('${element.clipPathD}')`
    : 'polygon(3% 1%, 48% 0%, 97% 2%, 99% 48%, 98% 97%, 52% 99%, 2% 98%, 0% 52%)';

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
        clipPath: clipStyle,
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
