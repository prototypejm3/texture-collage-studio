import { useRef, useState, useCallback, useEffect } from 'react';
import { CanvasElement as CanvasElementType, MaterialEffects } from '@/types/studio';
import { textures } from '@/data/textures';

function getClipPath(shape: CanvasElementType['shape']): string | undefined {
  switch (shape) {
    case 'circle': return 'ellipse(50% 50% at 50% 50%)';
    default: return undefined;
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
  if (effects.edgeStyle === 'soft-fray') borderRadius = '8px 2px 12px 4px';
  else if (effects.edgeStyle === 'rough-torn') borderRadius = '12px 2px 16px 6px / 4px 14px 6px 10px';

  return {
    filter: filters.length > 0 ? filters.join(' ') : undefined,
    boxShadow,
    borderRadius,
  };
}

interface Props {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElementType>) => void;
}

export function CanvasElementComponent({ element, isSelected, onSelect, onUpdate }: Props) {
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

  const texture = textures.find(t => t.id === element.textureId);
  if (!texture) return null;

  const effectStyles = getEffectStyles(element.effects);
  const clipPath = getClipPath(element.shape);

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move transition-shadow ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
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
