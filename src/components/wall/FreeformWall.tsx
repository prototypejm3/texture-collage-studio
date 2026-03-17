import { useState, useCallback, useRef } from 'react';
import { SavedDesign, FrameStyle, DesignSize } from '@/types/wall';
import { WallCard } from './WallCard';
import { AnimatePresence } from 'framer-motion';

const sizeWidths: Record<DesignSize, number> = {
  small: 140,
  medium: 210,
  large: 280,
};

interface FreeformWallProps {
  designs: SavedDesign[];
  isPremium: boolean;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleIRL: (id: string) => void;
  onToggleHide: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SavedDesign>) => void;
  onFrameStyleChange: (id: string, style: FrameStyle) => void;
  onSizeChange: (id: string, size: DesignSize) => void;
}

export function FreeformWall({
  designs, isPremium, onOpen, onDuplicate, onDelete,
  onTogglePin, onToggleIRL, onToggleHide, onUpdate,
  onFrameStyleChange, onSizeChange,
}: FreeformWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, design: SavedDesign) => {
    // Don't start drag on buttons/inputs
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('[data-no-drag]')) return;

    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingId(design.id);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startX: design.wallX ?? 50,
      startY: design.wallY ?? 50,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragStart.current || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const dx = ((ev.clientX - dragStart.current.x) / r.width) * 100;
      const dy = ((ev.clientY - dragStart.current.y) / r.height) * 100;
      const newX = Math.max(5, Math.min(95, dragStart.current.startX + dx));
      const newY = Math.max(5, Math.min(95, dragStart.current.startY + dy));
      onUpdate(design.id, { wallX: newX, wallY: newY });
    };

    const handleMouseUp = () => {
      setDraggingId(null);
      dragStart.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [onUpdate]);

  // Auto-position designs that don't have wallX/wallY
  const positionedDesigns = designs.map((d, i) => {
    if (d.wallX != null && d.wallY != null) return d;
    // Spread them in a natural gallery arrangement
    const cols = Math.min(designs.length, 3);
    const row = Math.floor(i / cols);
    const col = i % cols;
    const spacing = 100 / (cols + 1);
    return {
      ...d,
      wallX: spacing * (col + 1),
      wallY: 20 + row * 35,
    };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: '70vh' }}
    >
      <AnimatePresence>
        {positionedDesigns.map(d => {
          const w = sizeWidths[d.displaySize || 'medium'];
          return (
            <div
              key={d.id}
              className={`absolute transition-shadow ${draggingId === d.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}`}
              style={{
                left: `${d.wallX ?? 50}%`,
                top: `${d.wallY ?? 50}%`,
                transform: 'translate(-50%, -50%)',
                width: w,
                transition: draggingId === d.id ? 'none' : 'left 0.3s ease, top 0.3s ease',
              }}
              onMouseDown={(e) => handleMouseDown(e, d)}
            >
              <WallCard
                design={d}
                onOpen={onOpen}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onToggleIRL={onToggleIRL}
                onToggleHide={onToggleHide}
                onUpdate={onUpdate}
                onFrameStyleChange={onFrameStyleChange}
                
                onSizeChange={onSizeChange}
                isPremium={isPremium}
                size={d.displaySize === 'large' ? 'large' : 'normal'}
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
