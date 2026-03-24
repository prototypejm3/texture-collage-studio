import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Vibe, VibeFills, TextureSwatch, SectionTransform, SectionTransforms, defaultSectionTransform } from '@/types/studio';
import { textures } from '@/data/textures';
import { Paintbrush, Scissors, Trash2, RotateCw, Copy, PaintBucket } from 'lucide-react';

interface Props {
  vibe: Vibe;
  fills: VibeFills;
  selectedSectionId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  sectionTransforms: SectionTransforms;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
  onFillBackground?: (textureId: string) => void;
  onDropAsSwatch: (textureId: string, x: number, y: number) => void;
  onDetachSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onUpdateSectionTransform: (sectionId: string, updates: Partial<SectionTransform>) => void;
  customTextures?: TextureSwatch[];
}

interface DropChoice {
  sectionId: string;
  textureId: string;
  screenX: number;
  screenY: number;
}

function getTextureBackgroundSize(texture: TextureSwatch) {
  return texture.id.startsWith('custom-') || texture.cssBackground.startsWith('url(')
    ? 'cover'
    : '40px 40px';
}

/** Compute bounding box center of an SVG path */
function getPathCenter(pathD: string): { cx: number; cy: number } {
  const nums = pathD.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < nums.length - 1; i += 2) {
    sumX += nums[i];
    sumY += nums[i + 1];
    count++;
  }
  return count > 0 ? { cx: sumX / count, cy: sumY / count } : { cx: 240, cy: 240 };
}

export function VibeOutline({
  vibe, fills, selectedSectionId,
  canvasWidth, canvasHeight,
  sectionTransforms,
  onSelectSection, onDropInSection, onFillBackground, onDropAsSwatch, onDetachSection,
  onDeleteSection, onDuplicateSection, onUpdateSectionTransform,
  customTextures = [],
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dropChoice, setDropChoice] = useState<DropChoice | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStart = useRef<{ mx: number; my: number; tx: number; ty: number }>({ mx: 0, my: 0, tx: 0, ty: 0 });
  const resizeStart = useRef<{ mx: number; my: number; scale: number }>({ mx: 0, my: 0, scale: 1 });
  const rotateStart = useRef<{ startAngle: number; rotation: number }>({ startAngle: 0, rotation: 0 });
  const allTextures = useMemo(() => [...textures, ...customTextures], [customTextures]);

  const handleDrop = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredId(null);
    const textureId = e.dataTransfer.getData('textureId');
    if (!textureId) return;
    setDropChoice({ sectionId, textureId, screenX: e.clientX, screenY: e.clientY });
  }, []);

  const handleChooseFill = useCallback(() => {
    if (!dropChoice) return;
    onDropInSection(dropChoice.sectionId, dropChoice.textureId);
    setDropChoice(null);
  }, [dropChoice, onDropInSection]);

  const handleChooseSwatch = useCallback(() => {
    if (!dropChoice) return;
    const svgEl = document.querySelector('[data-vibe-svg]') as SVGSVGElement | null;
    if (svgEl) {
      const rect = svgEl.getBoundingClientRect();
      const x = dropChoice.screenX - rect.left - 50;
      const y = dropChoice.screenY - rect.top - 50;
      onDropAsSwatch(dropChoice.textureId, x, y);
    }
    setDropChoice(null);
  }, [dropChoice, onDropAsSwatch]);

  const [vbX, vbY, vbW, vbH] = useMemo(() => {
    const parts = vibe.viewBox.split(/\s+/).map(Number);
    return parts.length === 4 ? parts : [0, 0, 480, 480];
  }, [vibe.viewBox]);

  // Convert screen pixels to SVG units
  const screenToSvg = useCallback((dx: number, dy: number) => {
    if (!svgRef.current) return { dx: 0, dy: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      dx: (dx / rect.width) * vbW,
      dy: (dy / rect.height) * vbH,
    };
  }, [vbW, vbH]);

  // ── Drag handler ──
  const handleSectionMouseDown = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    onSelectSection(sectionId);
    setDraggingId(sectionId);
    const t = sectionTransforms[sectionId] || defaultSectionTransform;
    dragStart.current = { mx: e.clientX, my: e.clientY, tx: t.x, ty: t.y };
  }, [sectionTransforms, onSelectSection]);

  useEffect(() => {
    if (!draggingId) return;
    const handleMove = (e: MouseEvent) => {
      const { dx, dy } = screenToSvg(
        e.clientX - dragStart.current.mx,
        e.clientY - dragStart.current.my,
      );
      onUpdateSectionTransform(draggingId, {
        x: dragStart.current.tx + dx,
        y: dragStart.current.ty + dy,
      });
    };
    const handleUp = () => setDraggingId(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [draggingId, screenToSvg, onUpdateSectionTransform]);

  // ── Resize handler ──
  const handleResizeStart = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingId(sectionId);
    const t = sectionTransforms[sectionId] || defaultSectionTransform;
    resizeStart.current = { mx: e.clientX, my: e.clientY, scale: t.scale };
  }, [sectionTransforms]);

  useEffect(() => {
    if (!resizingId) return;
    const handleMove = (e: MouseEvent) => {
      const dy = e.clientY - resizeStart.current.my;
      const scaleDelta = 1 - dy * 0.005;
      const newScale = Math.max(0.3, Math.min(3, resizeStart.current.scale * scaleDelta));
      onUpdateSectionTransform(resizingId, { scale: newScale });
    };
    const handleUp = () => setResizingId(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [resizingId, onUpdateSectionTransform]);

  const handleRotate = useCallback((sectionId: string, delta: number) => {
    const t = sectionTransforms[sectionId] || defaultSectionTransform;
    onUpdateSectionTransform(sectionId, { rotation: t.rotation + delta });
  }, [sectionTransforms, onUpdateSectionTransform]);

  // ── Drag-to-rotate handler ──
  const handleRotateStart = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setRotatingId(sectionId);
    const section = vibe.sections.find(s => s.id === sectionId);
    if (!section || !svgRef.current) return;
    const t = sectionTransforms[sectionId] || defaultSectionTransform;
    const { cx, cy } = getPathCenter(section.path);
    const rect = svgRef.current.getBoundingClientRect();
    const screenCx = rect.left + ((cx + t.x) / vbW) * rect.width;
    const screenCy = rect.top + ((cy + t.y) / vbH) * rect.height;
    const startAngle = Math.atan2(e.clientY - screenCy, e.clientX - screenCx) * (180 / Math.PI);
    rotateStart.current = { startAngle, rotation: t.rotation };
  }, [sectionTransforms, vibe.sections, vbW, vbH]);

  useEffect(() => {
    if (!rotatingId) return;
    const section = vibe.sections.find(s => s.id === rotatingId);
    if (!section || !svgRef.current) return;
    const t = sectionTransforms[rotatingId] || defaultSectionTransform;
    const { cx, cy } = getPathCenter(section.path);
    const rect = svgRef.current.getBoundingClientRect();
    const screenCx = rect.left + ((cx + t.x) / vbW) * rect.width;
    const screenCy = rect.top + ((cy + t.y) / vbH) * rect.height;

    const handleMove = (e: MouseEvent) => {
      const currentAngle = Math.atan2(e.clientY - screenCy, e.clientX - screenCx) * (180 / Math.PI);
      const delta = currentAngle - rotateStart.current.startAngle;
      onUpdateSectionTransform(rotatingId, { rotation: Math.round(rotateStart.current.rotation + delta) });
    };
    const handleUp = () => setRotatingId(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [rotatingId, sectionTransforms, vibe.sections, vbW, vbH, onUpdateSectionTransform]);

  return (
    <>
      <svg
        ref={svgRef}
        data-vibe-svg
        viewBox={vibe.viewBox}
        width={canvasWidth}
        height={canvasHeight}
        className="absolute inset-0"
        style={{ zIndex: 10 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {vibe.sections.map(section => {
            const t = sectionTransforms[section.id] || defaultSectionTransform;
            const { cx, cy } = getPathCenter(section.path);
            return (
              <clipPath key={`clip-${section.id}`} id={`clip-${section.id}`}>
                <path
                  d={section.path}
                  transform={`translate(${t.x}, ${t.y}) rotate(${t.rotation}, ${cx}, ${cy}) scale(${t.scale})`}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
              </clipPath>
            );
          })}
        </defs>

        {/* Texture fills */}
        {vibe.sections.map(section => {
          const textureId = fills[section.id];
          if (!textureId) return null;
          const texture = allTextures.find(t => t.id === textureId);
          if (!texture) return null;

          return (
            <foreignObject
              key={`fill-${section.id}-${textureId}`}
              x={vbX}
              y={vbY}
              width={vbW}
              height={vbH}
              clipPath={`url(#clip-${section.id})`}
              className="pointer-events-none"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: texture.cssBackground,
                  backgroundSize: getTextureBackgroundSize(texture),
                  backgroundPosition: 'center',
                }}
              />
            </foreignObject>
          );
        })}

        {/* Interactive paths */}
        {vibe.sections.map(section => {
          const isFilled = !!fills[section.id];
          const isHovered = hoveredId === section.id;
          const isSelected = selectedSectionId === section.id;
          const t = sectionTransforms[section.id] || defaultSectionTransform;
          const { cx, cy } = getPathCenter(section.path);
          const transform = `translate(${t.x}, ${t.y}) rotate(${t.rotation}, ${cx}, ${cy}) scale(${t.scale})`;

          // Compute bounding box for resize handles
          const nums = section.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          for (let i = 0; i < nums.length - 1; i += 2) {
            minX = Math.min(minX, nums[i]);
            maxX = Math.max(maxX, nums[i]);
            minY = Math.min(minY, nums[i + 1]);
            maxY = Math.max(maxY, nums[i + 1]);
          }

          return (
            <g key={section.id} style={{ transformOrigin: `${cx}px ${cy}px` }}>
              {/* Hit area — draggable */}
              <path
                d={section.path}
                fill="transparent"
                transform={transform}
                className={`pointer-events-auto ${draggingId === section.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSection(section.id);
                }}
                onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setHoveredId(section.id);
                }}
                onDragLeave={() => setHoveredId(null)}
                onDrop={(e) => handleDrop(e, section.id)}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
              />

              {/* Selected highlight */}
              {isSelected && (
                <path
                  d={section.path}
                  transform={transform}
                  fill="hsl(24, 80%, 50%)"
                  opacity={0.12}
                  className="pointer-events-none animate-pulse"
                />
              )}

              {/* Hover highlight */}
              {isHovered && !isSelected && !isFilled && (
                <path
                  d={section.path}
                  transform={transform}
                  fill="hsl(24, 80%, 50%)"
                  opacity={0.06}
                  className="pointer-events-none"
                />
              )}

              {/* Stroke */}
              <path
                d={section.path}
                transform={transform}
                fill="none"
                stroke={isSelected ? 'hsl(24, 80%, 50%)' : isHovered ? 'hsl(24, 60%, 60%)' : 'hsl(220, 15%, 25%)'}
                strokeWidth={isSelected ? 4.5 : 3.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="pointer-events-none transition-colors"
                style={{ opacity: isFilled && !isSelected ? 0.5 : 0.9 }}
              />

              {/* Resize handle — single bottom-right corner, small and unobtrusive */}
              {isSelected && minX !== Infinity && (() => {
                const handleSize = 7;
                const corner = { x: maxX, y: maxY };
                return (
                  <rect
                    x={corner.x * t.scale + t.x - handleSize / 2}
                    y={corner.y * t.scale + t.y - handleSize / 2}
                    width={handleSize}
                    height={handleSize}
                    rx={1.5}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth={1}
                    opacity={0.7}
                    className="pointer-events-auto cursor-nwse-resize hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, section.id)}
                  />
                );
              })()}

              {/* Rotate handle — bottom center of bounding box */}
              {isSelected && minX !== Infinity && (() => {
                const midX = (minX + maxX) / 2;
                const handleY = maxY + 12;
                return (
                  <g
                    className="pointer-events-auto cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => handleRotateStart(e, section.id)}
                  >
                    {/* Line from bottom edge to handle */}
                    <line
                      x1={midX * t.scale + t.x}
                      y1={maxY * t.scale + t.y}
                      x2={midX * t.scale + t.x}
                      y2={handleY * t.scale + t.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth={1.5}
                      opacity={0.5}
                    />
                    <circle
                      cx={midX * t.scale + t.x}
                      cy={handleY * t.scale + t.y}
                      r={6}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--primary-foreground))"
                      strokeWidth={1}
                      opacity={0.85}
                      className="hover:opacity-100 transition-opacity"
                    />
                    {/* Rotate icon — small arrow */}
                    <text
                      x={midX * t.scale + t.x}
                      y={handleY * t.scale + t.y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="7"
                      fill="hsl(var(--primary-foreground))"
                      className="pointer-events-none select-none"
                    >↻</text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </svg>

      {/* Section toolbar — appears when a section is selected */}
      {selectedSectionId && (() => {
        const section = vibe.sections.find(s => s.id === selectedSectionId);
        if (!section) return null;
        const t = sectionTransforms[selectedSectionId] || defaultSectionTransform;
        const { cx, cy } = getPathCenter(section.path);
        const isFilled = !!fills[selectedSectionId];

        // Convert SVG coordinates to screen position for the toolbar
        const toolbarX = ((cx + t.x) / vbW) * canvasWidth;
        const toolbarY = ((cy + t.y) / vbH) * canvasHeight - 45;

        // Kid mode check
        const isKidMode = (() => { try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; } })();

        // Kid mode: simplified toolbar with only +1, duplicate, delete
        if (isKidMode) {
          return (
            <div
              className="absolute z-[30] flex items-center gap-1.5 bg-popover border border-border rounded-full shadow-lg px-2 py-1.5"
              style={{
                left: toolbarX,
                top: Math.max(4, toolbarY),
                transform: 'translateX(-50%)',
              }}
            >
              {/* Duplicate */}
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicateSection(selectedSectionId); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-accent text-foreground transition-colors"
                title="Copy"
              >
                <span className="text-sm">📄</span>
              </button>

              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSection(selectedSectionId); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-destructive/15 hover:bg-destructive/30 text-destructive transition-colors"
                title="Delete"
              >
                <span className="text-sm">🗑️</span>
              </button>
            </div>
          );
        }

        // Adult mode: full toolbar
        return (
          <div
            className="absolute z-[30] flex items-center gap-1 bg-popover border border-border rounded-lg shadow-lg px-1.5 py-1"
            style={{
              left: toolbarX,
              top: Math.max(4, toolbarY),
              transform: 'translateX(-50%)',
            }}
          >
            {/* Rotate */}
            <button
              onClick={(e) => { e.stopPropagation(); handleRotate(selectedSectionId, -15); }}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Rotate left"
            >
              <RotateCw className="w-3 h-3 scale-x-[-1]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRotate(selectedSectionId, 15); }}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Rotate right"
            >
              <RotateCw className="w-3 h-3" />
            </button>

            {/* Scale display + buttons */}
            <div className="flex items-center gap-0.5 mx-1">
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateSectionTransform(selectedSectionId, { scale: Math.max(0.3, t.scale - 0.1) }); }}
                className="px-1 py-0.5 rounded text-[10px] hover:bg-secondary text-muted-foreground"
              >
                −
              </button>
              <span className="text-[9px] text-muted-foreground min-w-[28px] text-center">
                {Math.round(t.scale * 100)}%
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateSectionTransform(selectedSectionId, { scale: Math.min(3, t.scale + 0.1) }); }}
                className="px-1 py-0.5 rounded text-[10px] hover:bg-secondary text-muted-foreground"
              >
                +
              </button>
            </div>

            {/* Duplicate */}
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicateSection(selectedSectionId); }}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Duplicate section"
            >
              <Copy className="w-3 h-3" />
            </button>

            {/* Detach if filled */}
            {isFilled && (
              <button
                onClick={(e) => { e.stopPropagation(); onDetachSection(selectedSectionId); }}
                className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title="Detach as free element"
              >
                <Scissors className="w-3 h-3" />
              </button>
            )}

            {/* Delete */}
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteSection(selectedSectionId); }}
              className="p-1 rounded hover:bg-secondary text-destructive/60 hover:text-destructive transition-colors"
              title="Delete section"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        );
      })()}

      {dropChoice && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setDropChoice(null)} />
          <div
            className="fixed z-[101] bg-popover border border-border rounded-xl shadow-xl py-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: dropChoice.screenX,
              top: dropChoice.screenY,
              transform: 'translate(-50%, -100%) translateY(-8px)',
            }}
          >
            <button
              onClick={handleChooseFill}
              className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary flex items-center gap-2.5 text-foreground transition-colors"
            >
              <Paintbrush className="w-3.5 h-3.5 text-primary" />
              Fill this shape
            </button>
            <div className="border-t border-border mx-2 my-0.5" />
            <button
              onClick={() => {
                if (dropChoice && onFillBackground) onFillBackground(dropChoice.textureId);
                setDropChoice(null);
              }}
              className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary flex items-center gap-2.5 text-foreground transition-colors"
            >
              <PaintBucket className="w-3.5 h-3.5 text-accent-foreground" />
              Fill whole background
            </button>
            <div className="border-t border-border mx-2 my-0.5" />
            <button
              onClick={handleChooseSwatch}
              className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary flex items-center gap-2.5 text-foreground transition-colors"
            >
              <Scissors className="w-3.5 h-3.5 text-muted-foreground" />
              Drop single swatch
            </button>
          </div>
        </>
      )}
    </>
  );
}
