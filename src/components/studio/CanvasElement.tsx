import { useRef, useState, useCallback } from 'react';
import { X, RotateCw, Shapes } from 'lucide-react';
import { CanvasElement as CanvasElementType, ElementShape, MaterialEffects, TextureSwatch } from '@/types/studio';

const SHAPE_PICKER: { id: ElementShape; label: string; emoji: string }[] = [
  { id: 'soft-square', label: 'Square', emoji: '🟧' },
  { id: 'rectangle', label: 'Long', emoji: '▭' },
  { id: 'circle', label: 'Circle', emoji: '⚫' },
  { id: 'strip', label: 'Thin', emoji: '➖' },
  { id: 'torn-edge', label: 'Ripped', emoji: '🧩' },
  { id: 'blob', label: 'Blob', emoji: '🫧' },
];
import { textures } from '@/data/textures';

/**
 * Stencil clip-paths — organic, imperfect shapes that simulate
 * hand-cut material swatches. All use polygon() or ellipse() so
 * they are pure CSS (no external SVGs needed).
 */
function getClipPath(shape: CanvasElementType['shape']): string | undefined {
  switch (shape) {
    case 'soft-square':
      // Slightly imperfect square with organic wobble
      return 'polygon(3% 1%, 48% 0%, 97% 2%, 99% 48%, 98% 97%, 52% 99%, 2% 98%, 0% 52%)';
    case 'circle':
      // Slightly imperfect circle
      return 'polygon(50% 1%, 68% 3%, 83% 10%, 93% 22%, 98% 38%, 99% 55%, 95% 72%, 86% 85%, 73% 94%, 55% 99%, 38% 98%, 22% 92%, 11% 82%, 4% 68%, 1% 52%, 2% 35%, 7% 20%, 16% 9%, 32% 3%)';
    case 'torn-edge':
      // Irregular torn edges
      return 'polygon(2% 0%, 18% 3%, 35% 0%, 52% 4%, 68% 1%, 85% 3%, 98% 0%, 100% 15%, 97% 32%, 100% 48%, 98% 65%, 100% 82%, 97% 100%, 82% 97%, 65% 100%, 48% 96%, 32% 100%, 15% 98%, 0% 100%, 3% 85%, 0% 68%, 4% 52%, 0% 35%, 3% 18%)';
    case 'blob':
      // Organic curved blob shape
      return 'polygon(35% 2%, 55% 0%, 75% 5%, 90% 15%, 97% 30%, 100% 50%, 96% 70%, 88% 85%, 72% 95%, 55% 100%, 38% 98%, 20% 92%, 8% 80%, 2% 65%, 0% 45%, 3% 28%, 10% 14%, 22% 5%)';
    case 'strip':
      // Long horizontal strip with slightly uneven edges
      return 'polygon(1% 5%, 15% 0%, 35% 3%, 55% 0%, 75% 4%, 92% 1%, 99% 8%, 100% 40%, 99% 70%, 100% 92%, 98% 100%, 82% 96%, 62% 100%, 42% 97%, 22% 100%, 5% 96%, 0% 92%, 1% 60%, 0% 30%)';
    case 'rectangle':
      // Wider rectangle with slightly imperfect edges
      return 'polygon(1% 2%, 25% 0%, 50% 1%, 75% 0%, 99% 2%, 100% 35%, 99% 65%, 100% 98%, 75% 100%, 50% 99%, 25% 100%, 1% 98%, 0% 65%, 1% 35%)';
    default:
      return undefined;
  }
}

function getFilterStyles(effects: MaterialEffects): string | undefined {
  const filters: string[] = [];
  if (effects.bleachFade > 0) {
    filters.push(`saturate(${100 - effects.bleachFade * 0.8}%) brightness(${100 + effects.bleachFade * 0.4}%)`);
  }
  if (effects.grainBoost > 0) {
    filters.push(`contrast(${100 + effects.grainBoost * 0.3}%)`);
  }
  if (effects.wrinkle !== 'none') {
    filters.push(`url(#wrinkle-${effects.wrinkle})`);
  }
  return filters.length > 0 ? filters.join(' ') : undefined;
}

function getShadowStyle(depth: MaterialEffects['shadowDepth']): string {
  if (depth === 'lifted') return '0 4px 12px -2px hsla(220, 20%, 12%, 0.25)';
  if (depth === 'floating') return '0 12px 32px -4px hsla(220, 20%, 12%, 0.35), 0 4px 8px -2px hsla(220, 20%, 12%, 0.15)';
  return 'none';
}

function getEdgeMask(edgeStyle: MaterialEffects['edgeStyle']): { maskImage?: string; borderRadius: string; edgeClipPath?: string } {
  let borderRadius = '4px';
  let maskImage: string | undefined;
  let edgeClipPath: string | undefined;

  if (edgeStyle === 'soft-fray') {
    // Irregular soft frayed edge using clip-path polygon
    edgeClipPath = 'polygon(2% 0%, 12% 1%, 25% 0%, 38% 2%, 50% 0%, 62% 1%, 75% 0%, 88% 2%, 98% 0%, 100% 8%, 99% 20%, 100% 32%, 98% 45%, 100% 58%, 99% 70%, 100% 82%, 98% 92%, 100% 100%, 90% 99%, 78% 100%, 65% 98%, 52% 100%, 40% 99%, 28% 100%, 15% 98%, 5% 100%, 0% 92%, 1% 80%, 0% 68%, 2% 55%, 0% 42%, 1% 30%, 0% 18%, 2% 8%)';
  } else if (edgeStyle === 'rough-torn') {
    // More dramatic torn edges
    edgeClipPath = 'polygon(4% 0%, 15% 4%, 22% 0%, 32% 5%, 42% 1%, 55% 6%, 65% 0%, 78% 4%, 88% 1%, 96% 0%, 100% 6%, 97% 18%, 100% 28%, 96% 40%, 100% 52%, 98% 62%, 100% 74%, 96% 85%, 100% 95%, 95% 100%, 85% 96%, 75% 100%, 65% 95%, 55% 100%, 45% 97%, 35% 100%, 25% 96%, 12% 100%, 4% 98%, 0% 94%, 3% 82%, 0% 72%, 4% 60%, 0% 48%, 3% 38%, 0% 26%, 5% 15%, 0% 6%)';
  } else if (edgeStyle === 'pinking') {
    // Pinking shears — triangular zigzag on all edges
    const size = 8;
    const depth = 6;
    maskImage = `conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top/${size}px ${depth}px repeat-x,
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom/${size}px ${depth}px repeat-x,
      conic-gradient(from 45deg at left, #0000, #000 1deg 89deg, #0000 90deg) left/${depth}px ${size}px repeat-y,
      conic-gradient(from -135deg at right, #0000, #000 1deg 89deg, #0000 90deg) right/${depth}px ${size}px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - ${depth}px) calc(100% - ${depth}px) no-repeat`;
    borderRadius = '0';
  } else if (edgeStyle === 'scallop') {
    const r = 6;
    const d = r * 2;
    maskImage = `radial-gradient(circle ${r}px at top, #000 98%, #0000) top/${d}px ${r}px repeat-x,
      radial-gradient(circle ${r}px at bottom, #000 98%, #0000) bottom/${d}px ${r}px repeat-x,
      radial-gradient(circle ${r}px at left, #000 98%, #0000) left/${r}px ${d}px repeat-y,
      radial-gradient(circle ${r}px at right, #000 98%, #0000) right/${r}px ${d}px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - ${r}px) calc(100% - ${r}px) no-repeat`;
    borderRadius = '0';
  } else if (edgeStyle === 'zigzag') {
    const size = 12;
    const depth = 8;
    maskImage = `conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top/${size}px ${depth}px repeat-x,
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom/${size}px ${depth}px repeat-x,
      conic-gradient(from 45deg at left, #0000, #000 1deg 89deg, #0000 90deg) left/${depth}px ${size}px repeat-y,
      conic-gradient(from -135deg at right, #0000, #000 1deg 89deg, #0000 90deg) right/${depth}px ${size}px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - ${depth}px) calc(100% - ${depth}px) no-repeat`;
    borderRadius = '0';
  } else if (edgeStyle === 'wave') {
    const r = 7;
    const d = r * 2;
    maskImage = `radial-gradient(circle ${r}px at 50% 0, #0000 98%, #000) top/${d}px ${r}px repeat-x,
      radial-gradient(circle ${r}px at 50% 100%, #0000 98%, #000) bottom/${d}px ${r}px repeat-x,
      radial-gradient(circle ${r}px at 0 50%, #0000 98%, #000) left/${r}px ${d}px repeat-y,
      radial-gradient(circle ${r}px at 100% 50%, #0000 98%, #000) right/${r}px ${d}px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - ${r}px) calc(100% - ${r}px) no-repeat`;
    borderRadius = '0';
  }

  return { maskImage, borderRadius, edgeClipPath };
}

interface Props {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElementType>) => void;
  onDelete?: () => void;
  onMoveToTable?: (x: number, y: number) => void;
  canvasRef?: React.RefObject<HTMLDivElement>;
  customTextures?: TextureSwatch[];
}

export function CanvasElementComponent({ element, isSelected, onSelect, onUpdate, onDelete, onMoveToTable, canvasRef, customTextures = [] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const rotateStart = useRef({ angle: 0, startAngle: 0 });

  const [showShapePicker, setShowShapePicker] = useState(false);

  // Unified pointer handler for both mouse and touch
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: element.x, elY: element.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [element.x, element.y, onSelect]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isRotating) return;
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    onUpdate({ x: dragStart.current.elX + dx, y: dragStart.current.elY + dy });
  }, [isDragging, isRotating, onUpdate]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (canvasRef?.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX;
      const cy = e.clientY;
      if (onMoveToTable && (cx < rect.left || cx > rect.right || cy < rect.top)) {
        onMoveToTable(e.clientX, e.clientY);
      }
    }
  }, [isDragging, onMoveToTable, canvasRef]);

  // Rotation handler
  const handleRotatePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      rotateStart.current = { angle: element.rotation, startAngle };
    }
  }, [element.rotation]);

  const handleRotatePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isRotating || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const delta = currentAngle - rotateStart.current.startAngle;
    onUpdate({ rotation: Math.round(rotateStart.current.angle + delta) });
  }, [isRotating, onUpdate]);

  const handleRotatePointerUp = useCallback(() => {
    setIsRotating(false);
  }, []);

  const allTex = [...textures, ...customTextures];
  const texture = element.textureId ? allTex.find(t => t.id === element.textureId) : null;
  const isOutlineOnly = !texture;

  const clipPath = element.clipPathD ? `path('${element.clipPathD}')` : getClipPath(element.shape);
  const filter = getFilterStyles(element.effects);
  const shadow = getShadowStyle(element.effects.shadowDepth);
  const { maskImage, borderRadius, edgeClipPath } = getEdgeMask(element.effects.edgeStyle);
  const hasScissorEdge = !!maskImage;

  // For detached sections with clipPathD, always use the SVG path clip
  const finalClipPath = element.clipPathD 
    ? clipPath 
    : hasScissorEdge ? undefined : (edgeClipPath || clipPath);

  const hasShadowFilter = element.effects.shadowDepth === 'lifted' || element.effects.shadowDepth === 'floating';
  const hasBlendMode = element.blendMode && element.blendMode !== 'normal';
  const shadowFilter = element.effects.shadowDepth === 'lifted'
    ? 'drop-shadow(0 4px 6px hsla(220, 20%, 12%, 0.25))'
    : element.effects.shadowDepth === 'floating'
      ? 'drop-shadow(0 12px 16px hsla(220, 20%, 12%, 0.3)) drop-shadow(0 4px 4px hsla(220, 20%, 12%, 0.15))'
      : undefined;

  return (
    // Outer wrapper: handles position, rotation, shadow (shadow not clipped)
    // When blend mode is active, shadow goes on an extra outer layer to avoid filter isolating blend
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
        if (onDelete) onDelete();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-move pointer-events-auto ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''} active:scale-[0.98] transition-transform`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
        touchAction: 'none',
        opacity: element.opacity != null ? element.opacity / 100 : 1,
        mixBlendMode: (hasBlendMode ? element.blendMode : undefined) as any,
        transition: 'width 0.15s ease, height 0.15s ease, left 0.15s ease, top 0.15s ease',
        // Only apply filter when no blend mode (filter isolates blend)
        filter: !hasBlendMode ? shadowFilter : undefined,
      }}
    >
      {/* Remove button */}
      {isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2.5 -right-2.5 z-50 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform pointer-events-auto"
          title="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Rotate handle */}
      {isSelected && (
        <div
          onPointerDown={handleRotatePointerDown}
          onPointerMove={handleRotatePointerMove}
          onPointerUp={handleRotatePointerUp}
          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-50 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform pointer-events-auto"
          title="Drag to rotate"
        >
          <RotateCw className="w-3 h-3" />
        </div>
      )}

      {/* Inner div: handles texture, clip-path OR mask-image (not both) */}
      {element.type === 'text' ? (
        <div
          className="w-full h-full flex items-center justify-center p-2"
          style={{
            clipPath: finalClipPath,
            borderRadius,
            filter,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: element.fontFamily || 'system-ui',
              fontSize: element.fontSize || 24,
              fontWeight: element.fontWeight || 500,
              color: element.textColor || '#3d3530',
              textAlign: element.textAlign || 'center',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              display: 'block',
              width: '100%',
            }}
          >
            {element.text || ''}
          </span>
        </div>
      ) : element.clipPathD && isOutlineOnly ? (
        /* SVG stroke outline for stencil mode — shows actual shape outlines */
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${element.width} ${element.height}`}
          preserveAspectRatio="none"
          style={{ filter }}
        >
          <path
            d={element.clipPathD}
            fill="none"
            stroke="hsl(var(--foreground) / 0.7)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <div
          className="w-full h-full"
          style={{
            background: isOutlineOnly
              ? 'transparent'
              : texture!.cssBackground,
            backgroundSize: isOutlineOnly
              ? undefined
              : (texture!.cssBackground.startsWith('url(') ? 'cover' : '40px 40px'),
            clipPath: finalClipPath,
            borderRadius,
            filter,
            WebkitMaskImage: maskImage,
            WebkitMaskComposite: maskImage ? 'source-over' as any : undefined,
            maskImage,
            maskComposite: maskImage ? 'add' as any : undefined,
            ...(isOutlineOnly ? {
              border: '2px dashed hsl(var(--muted-foreground) / 0.5)',
              boxShadow: 'inset 0 0 0 1px hsl(var(--border))',
            } : {}),
          }}
        />
      )}
    </div>
  );
}
