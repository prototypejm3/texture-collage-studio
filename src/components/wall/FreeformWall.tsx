import { useState, useCallback, useRef, useEffect } from 'react';
import { SavedDesign, FrameStyle, DesignSize } from '@/types/wall';
import { WallCard } from './WallCard';
import { TitleCard } from './TitleCard';
import { AnimatePresence, motion } from 'framer-motion';

const BASE_WIDTH = 900;
const sizeWidths: Record<DesignSize, number> = {
  small: 140,
  medium: 210,
  large: 280,
};

interface FreeformWallProps {
  designs: SavedDesign[];
  isPremium: boolean;
  isDark?: boolean;
  showTitleCards?: boolean;
  kidMode?: boolean;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleIRL: (id: string) => void;
  onToggleHide: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SavedDesign>) => void;
  onFrameStyleChange: (id: string, style: FrameStyle) => void;
  onSizeChange: (id: string, size: DesignSize) => void;
  onSubmitToGallery?: (id: string) => void;
}

// Play a short Web Audio pop/sparkle sound
function playPlaceSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

export function FreeformWall({
  designs,
  isPremium,
  isDark,
  showTitleCards,
  kidMode,
  onOpen,
  onDuplicate,
  onDelete,
  onTogglePin,
  onToggleIRL,
  onToggleHide,
  onUpdate,
  onFrameStyleChange,
  onSizeChange,
  onSubmitToGallery,
}: FreeformWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [justPlacedId, setJustPlacedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? BASE_WIDTH;
      setScale(Math.max(0.35, Math.min(1, w / BASE_WIDTH)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, design: SavedDesign) => {
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

      // Kid mode: bounce + sound on place
      if (kidMode) {
        setJustPlacedId(design.id);
        playPlaceSound();
        setTimeout(() => setJustPlacedId(null), 400);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [onUpdate, kidMode]);

  const positionedDesigns = designs.map((d, i) => {
    if (d.wallX != null && d.wallY != null) return d;
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
      {/* Kid mode: floating sparkles */}
      {kidMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              initial={{ opacity: 0, y: '100%', x: `${15 + i * 14}%` }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [100, -40],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 1.2,
                ease: 'easeOut',
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {positionedDesigns.map((d, idx) => {
          const w = sizeWidths[d.displaySize || 'medium'] * scale;
          const depthShadow = d.displaySize === 'large'
            ? '4px 8px 32px rgba(0,0,0,0.22), 2px 4px 12px rgba(0,0,0,0.10)'
            : d.displaySize === 'small'
              ? '2px 4px 12px rgba(0,0,0,0.12)'
              : '3px 6px 24px rgba(0,0,0,0.16), 1px 3px 8px rgba(0,0,0,0.08)';
          const rotation = d.rotation || 0;
          const isDragging = draggingId === d.id;
          const justPlaced = justPlacedId === d.id;

          return (
            <motion.div
              key={d.id}
              className={`absolute ${isDragging ? 'z-50' : 'z-10'}`}
              style={{
                left: `${d.wallX ?? 50}%`,
                top: `${d.wallY ?? 50}%`,
                width: w,
              }}
              animate={{
                x: '-50%',
                y: '-50%',
                rotate: rotation,
                scale: isDragging && kidMode ? 1.08 : justPlaced ? [1.12, 1] : 1,
              }}
              transition={
                isDragging
                  ? { duration: 0 }
                  : justPlaced
                    ? { type: 'spring', stiffness: 400, damping: 12 }
                    : { duration: 0.3, ease: 'easeOut' }
              }
            >
              {/* Kid idle wiggle */}
              <motion.div
                className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                style={{
                  boxShadow: isDragging && kidMode
                    ? '0 12px 40px rgba(0,0,0,0.25)'
                    : depthShadow,
                }}
                animate={
                  kidMode && !isDragging && !justPlaced
                    ? { rotate: [0, 0.5, -0.5, 0] }
                    : {}
                }
                transition={
                  kidMode && !isDragging
                    ? { duration: 3, repeat: Infinity, delay: idx * 0.8 }
                    : {}
                }
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
                  onSubmitToGallery={onSubmitToGallery}
                  isPremium={isPremium}
                  isDark={isDark}
                  size={d.displaySize || 'medium'}
                />
              </motion.div>

              {showTitleCards && (
                <div className="mt-2" data-no-drag>
                  <TitleCard design={d} isDark={isDark} onUpdateName={(id, name) => onUpdate(id, { name })} />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
