import { SavedDesign, WallLayout, FrameStyle, DesignSize } from '@/types/wall';
import { WallCard } from './WallCard';
import Masonry from 'react-masonry-css';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

interface WallGridProps {
  designs: SavedDesign[];
  layout: WallLayout;
  isPremium: boolean;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleIRL: (id: string) => void;
  onToggleHide: (id: string) => void;
  onFrameStyleChange: (id: string, style: FrameStyle) => void;
  onSizeChange: (id: string, size: DesignSize) => void;
}

export function WallGrid({ designs, layout, isPremium, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onToggleHide, onFrameStyleChange, onSizeChange }: WallGridProps) {
  const cardProps = (d: SavedDesign, size?: 'normal' | 'large') => ({
    key: d.id,
    design: d,
    onOpen,
    onDuplicate,
    onDelete,
    onTogglePin,
    onToggleIRL,
    onToggleHide,
    onFrameStyleChange,
    onSizeChange,
    isPremium,
    size,
  });

  // Gallery mode: 2-3 per row, generous spacing
  if (layout === 'single') {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-16">
        <AnimatePresence>
          {designs.map(d => <WallCard {...cardProps(d, 'large')} />)}
        </AnimatePresence>
      </div>
    );
  }

  if (layout === 'featured' && designs.length > 0) {
    const [featured, ...rest] = designs;
    return (
      <div className="flex flex-col gap-12">
        <AnimatePresence>
          <div className="max-w-2xl mx-auto w-full">
            <WallCard {...cardProps(featured, 'large')} />
          </div>
          {rest.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              {rest.map(d => <WallCard {...cardProps(d)} />)}
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (layout === 'masonry') {
    return (
      <Masonry
        breakpointCols={{ default: 3, 1024: 2, 768: 1 }}
        className="flex gap-10 -ml-10"
        columnClassName="pl-10 flex flex-col gap-10"
      >
        {designs.map(d => <WallCard {...cardProps(d)} />)}
      </Masonry>
    );
  }

  if (layout === 'curated') {
    return <CuratedLayout designs={designs} cardProps={cardProps} />;
  }

  // Default grid — gallery feel: 2-3 columns, generous gaps
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
      <AnimatePresence>
        {designs.map(d => <WallCard {...cardProps(d)} />)}
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
