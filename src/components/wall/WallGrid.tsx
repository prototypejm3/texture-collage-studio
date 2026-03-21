import { SavedDesign, WallLayout, FrameStyle, DesignSize } from '@/types/wall';
import { WallCard } from './WallCard';
import { TitleCard } from './TitleCard';
import { FreeformWall } from './FreeformWall';
import Masonry from 'react-masonry-css';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

interface WallGridProps {
  designs: SavedDesign[];
  layout: WallLayout;
  isPremium: boolean;
  showTitleCards?: boolean;
  isDark?: boolean;
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

export function WallGrid({ designs, layout, isPremium, showTitleCards, isDark, kidMode, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onToggleHide, onUpdate, onFrameStyleChange, onSizeChange, onSubmitToGallery }: WallGridProps) {
  const cardProps = (d: SavedDesign, size: DesignSize = d.displaySize || 'medium') => ({
    key: d.id,
    design: d,
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
    isPremium,
    isDark,
    size,
  });

  // Freeform — drag anywhere on the wall
  if (layout === 'freeform') {
    return (
      <FreeformWall
        designs={designs}
        isPremium={isPremium}
        isDark={isDark}
        showTitleCards={showTitleCards}
        kidMode={kidMode}
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
      />
    );
  }

  // Gallery mode: 2-3 per row, generous spacing
  if (layout === 'single') {
    return (
      <div className="flex flex-col gap-16">
        <AnimatePresence>
          {designs.map(d => {
            const sz = d.displaySize || 'medium';
            const widthClass = sz === 'large' ? 'max-w-xl' : sz === 'small' ? 'max-w-sm' : 'max-w-lg';
            return (
              <div key={d.id} className={`w-full ${widthClass} mx-auto`}>
                <WallCard {...cardProps(d, sz)} />
                {showTitleCards && <TitleCard design={d} isDark={isDark} onUpdateName={(id, name) => onUpdate(id, { name })} />}
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }


  // Default grid — respects per-design displaySize
  const hasMixedSizes = designs.some(d => (d.displaySize || 'medium') !== 'medium');

  if (hasMixedSizes) {
    return (
      <div className="grid grid-cols-6 gap-8 items-start">
        <AnimatePresence>
          {designs.map(d => {
            const sz = d.displaySize || 'medium';
            const spanClass = sz === 'large' ? 'col-span-4' : sz === 'small' ? 'col-span-2' : 'col-span-3';
            return (
              <div key={d.id} className={spanClass}>
                <WallCard {...cardProps(d, sz)} />
                {showTitleCards && <TitleCard design={d} isDark={isDark} onUpdateName={(id, name) => onUpdate(id, { name })} />}
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
      <AnimatePresence>
        {designs.map(d => (
          <div key={d.id}>
            <WallCard {...cardProps(d)} />
            {showTitleCards && <TitleCard design={d} isDark={isDark} onUpdateName={(id, name) => onUpdate(id, { name })} />}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Curated Hanging Mode ─── */

interface LayoutSlot {
  design: SavedDesign;
  row: number;
  col: number;
  colSpan: number;
  size: 'large' | 'normal';
}

function CuratedLayout({ designs, cardProps }: {
  designs: SavedDesign[];
  cardProps: (d: SavedDesign, size?: 'normal' | 'large') => any;
}) {
  const positioned = useMemo((): LayoutSlot[] => {
    if (designs.length === 0) return [];

    // Pick hero: pinned > largest > first
    const hero = designs.find(d => d.pinned)
      || [...designs].sort((a, b) => {
        const order: Record<string, number> = { large: 3, medium: 2, small: 1 };
        return (order[b.displaySize] || 2) - (order[a.displaySize] || 2);
      })[0];
    const others = designs.filter(d => d.id !== hero.id);

    // Gallery row templates based on total count
    // Each template defines rows with column positions for balanced arrangement
    if (designs.length === 1) {
      return [{ design: hero, row: 0, col: 1, colSpan: 1, size: 'large' }];
    }
    if (designs.length === 2) {
      return [
        { design: others[0], row: 0, col: 0, colSpan: 1, size: 'normal' },
        { design: hero, row: 0, col: 1, colSpan: 1, size: 'large' },
      ];
    }
    if (designs.length === 3) {
      return [
        { design: others[0], row: 0, col: 0, colSpan: 1, size: 'normal' },
        { design: hero, row: 0, col: 1, colSpan: 1, size: 'large' },
        { design: others[1], row: 0, col: 2, colSpan: 1, size: 'normal' },
      ];
    }

    // 4+ pieces: arrange in 2-3 rows
    const slots: LayoutSlot[] = [];

    if (designs.length <= 5) {
      // Row 1: supporting pieces (top)
      const topCount = Math.min(others.length, designs.length <= 4 ? 1 : 2);
      const topPieces = others.slice(0, topCount);
      topPieces.forEach((d, i) => {
        const totalCols = topCount;
        const colPos = totalCols === 1 ? 1 : i === 0 ? 0 : 2;
        slots.push({ design: d, row: 0, col: colPos, colSpan: 1, size: 'normal' });
      });

      // Row 2: hero centered
      slots.push({ design: hero, row: 1, col: 1, colSpan: 1, size: 'large' });

      // Row 3: remaining pieces (bottom)
      const bottomPieces = others.slice(topCount);
      bottomPieces.forEach((d, i) => {
        const totalCols = bottomPieces.length;
        const colPos = totalCols === 1 ? 1
          : totalCols === 2 ? (i === 0 ? 0 : 2)
          : i;
        slots.push({ design: d, row: 2, col: Math.min(colPos, 2), colSpan: 1, size: 'normal' });
      });
    } else {
      // 6+ pieces: 3 rows, balanced distribution
      const topCount = Math.ceil((others.length) / 2);
      const bottomCount = others.length - topCount;

      // Top row
      others.slice(0, topCount).forEach((d, i) => {
        slots.push({ design: d, row: 0, col: i % 3, colSpan: 1, size: 'normal' });
      });

      // Middle row: hero
      slots.push({ design: hero, row: 1, col: 1, colSpan: 1, size: 'large' });

      // Bottom row
      others.slice(topCount).forEach((d, i) => {
        slots.push({ design: d, row: 2, col: i % 3, colSpan: 1, size: 'normal' });
      });
    }

    return slots;
  }, [designs]);

  // Group by rows for rendering
  const rows = useMemo(() => {
    const rowMap = new Map<number, LayoutSlot[]>();
    positioned.forEach(slot => {
      if (!rowMap.has(slot.row)) rowMap.set(slot.row, []);
      rowMap.get(slot.row)!.push(slot);
    });
    // Sort each row by col
    rowMap.forEach(slots => slots.sort((a, b) => a.col - b.col));
    return Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  }, [positioned]);

  return (
    <div className="flex flex-col items-center gap-8 py-4 px-8">
      <AnimatePresence>
        {rows.map(([rowIndex, slots]) => (
          <motion.div
            key={`row-${rowIndex}`}
            className="flex items-center justify-center gap-8 lg:gap-12 w-full max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: rowIndex * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {slots.map(({ design, size }) => (
              <div
                key={design.id}
                className={`${size === 'large' ? 'w-[45%] max-w-lg' : 'w-[28%] max-w-xs'} flex-shrink-0`}
              >
                <WallCard {...cardProps(design, size)} />
              </div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
