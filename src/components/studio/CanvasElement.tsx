import { useRef, useState, useCallback, useEffect } from 'react';
import { CanvasElement as CanvasElementType, MaterialEffects, TextureSwatch } from '@/types/studio';
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
      return undefined; // strips just use dimensions
    case 'rectangle':
      return undefined;
    default:
      return undefined;
  }
}

function getEffectStyles(effects: MaterialEffects): React.CSSProperties {
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

  let boxShadow = 'none';
  if (effects.shadowDepth === 'lifted') boxShadow = '0 4px 12px -2px hsla(220, 20%, 12%, 0.25)';
  else if (effects.shadowDepth === 'floating') boxShadow = '0 12px 32px -4px hsla(220, 20%, 12%, 0.35), 0 4px 8px -2px hsla(220, 20%, 12%, 0.15)';

  let borderRadius = '4px';
  let maskImage: string | undefined;
  if (effects.edgeStyle === 'soft-fray') borderRadius = '8px 2px 12px 4px';
  else if (effects.edgeStyle === 'rough-torn') borderRadius = '12px 2px 16px 6px / 4px 14px 6px 10px';
  else if (effects.edgeStyle === 'pinking') {
    // Pinking shears zigzag — tight triangular cuts
    maskImage = `conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top/8px 6px repeat-x,
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom/8px 6px repeat-x,
      conic-gradient(from 45deg at left, #0000, #000 1deg 89deg, #0000 90deg) left/6px 8px repeat-y,
      conic-gradient(from -135deg at right, #0000, #000 1deg 89deg, #0000 90deg) right/6px 8px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - 6px) calc(100% - 6px) no-repeat`;
    borderRadius = '0';
  } else if (effects.edgeStyle === 'scallop') {
    // Scalloped edges — rounded bumps
    maskImage = `radial-gradient(circle 5px at top, #000 98%, #0000) top/10px 6px repeat-x,
      radial-gradient(circle 5px at bottom, #000 98%, #0000) bottom/10px 6px repeat-x,
      radial-gradient(circle 5px at left, #000 98%, #0000) left/6px 10px repeat-y,
      radial-gradient(circle 5px at right, #000 98%, #0000) right/6px 10px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - 6px) calc(100% - 6px) no-repeat`;
    borderRadius = '0';
  } else if (effects.edgeStyle === 'zigzag') {
    // Zigzag edges
    maskImage = `conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top/12px 8px repeat-x,
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom/12px 8px repeat-x,
      conic-gradient(from 45deg at left, #0000, #000 1deg 89deg, #0000 90deg) left/8px 12px repeat-y,
      conic-gradient(from -135deg at right, #0000, #000 1deg 89deg, #0000 90deg) right/8px 12px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - 8px) calc(100% - 8px) no-repeat`;
    borderRadius = '0';
  } else if (effects.edgeStyle === 'wave') {
    // Wavy edges
    maskImage = `radial-gradient(circle 6px at 50% 0, #0000 98%, #000) top/14px 7px repeat-x,
      radial-gradient(circle 6px at 50% 100%, #0000 98%, #000) bottom/14px 7px repeat-x,
      radial-gradient(circle 6px at 0 50%, #0000 98%, #000) left/7px 14px repeat-y,
      radial-gradient(circle 6px at 100% 50%, #0000 98%, #000) right/7px 14px repeat-y,
      linear-gradient(#000 0 0) center/calc(100% - 7px) calc(100% - 7px) no-repeat`;
    borderRadius = '0';
  }

  return {
    filter: filters.length > 0 ? filters.join(' ') : undefined,
    boxShadow,
    borderRadius,
    WebkitMaskImage: maskImage,
    WebkitMaskComposite: maskImage ? 'destination-in' as any : undefined,
    maskImage,
    maskComposite: maskImage ? 'intersect' as any : undefined,
  };
}

interface Props {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElementType>) => void;
  customTextures?: TextureSwatch[];
}

export function CanvasElementComponent({ element, isSelected, onSelect, onUpdate, customTextures = [] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });

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

  const allTex = [...textures, ...customTextures];
  const texture = allTex.find(t => t.id === element.textureId);
  if (!texture) return null;

  const effectStyles = getEffectStyles(element.effects);
  const clipPath = getClipPath(element.shape);

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-move transition-shadow pointer-events-auto ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
        background: texture.cssBackground,
        backgroundSize: '40px 40px',
        clipPath,
        ...effectStyles,
      }}
    />
  );
}
