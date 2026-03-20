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

export function WallGrid({ designs, layout, isPremium, showTitleCards, isDark, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onToggleHide, onUpdate, onFrameStyleChange, onSizeChange, onSubmitToGallery }: WallGridProps) {
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
                {showTitleCards && <TitleCard design={d} isDark={isDark} />}
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
            {showTitleCards && <TitleCard design={d} isDark={isDark} />}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Curated Hanging Mode ─── */

function CuratedLayout({ designs, cardProps }: {
  designs: SavedDesign[];
  cardProps: (d: SavedDesign, size?: 'normal' | 'large') => any;
}) {
  const positioned = useMemo(() => {
    if (designs.length === 0) return [];
    if (designs.length === 1) return [{ design: designs[0], size: 'large' as const, col: 'span 2', offsetY: 0 }];

    return designs.map((d, i) => {
      const isAnchor = i === 0;
      const offsets = [0, 24, -16, 12, -8, 20, -12, 8];
      return {
        design: d,
        size: (isAnchor ? 'large' : 'normal') as 'large' | 'normal',
        col: isAnchor ? 'span 2' : 'span 1',
        offsetY: isAnchor ? 0 : offsets[i % offsets.length],
      };
    });
  }, [designs]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 items-start">
      <AnimatePresence>
        {positioned.map(({ design, size, col, offsetY }) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={col === 'span 2' ? 'col-span-2 max-w-2xl mx-auto w-full' : ''}
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            <WallCard {...cardProps(design, size)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
