import { SavedDesign, WallLayout, FrameStyle } from '@/types/wall';
import { WallCard } from './WallCard';
import Masonry from 'react-masonry-css';
import { AnimatePresence } from 'framer-motion';

interface WallGridProps {
  designs: SavedDesign[];
  layout: WallLayout;
  isPremium: boolean;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleIRL: (id: string) => void;
  onFrameStyleChange: (id: string, style: FrameStyle) => void;
}

export function WallGrid({ designs, layout, isPremium, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onFrameStyleChange }: WallGridProps) {
  const cardProps = (d: SavedDesign) => ({
    key: d.id,
    design: d,
    onOpen,
    onDuplicate,
    onDelete,
    onTogglePin,
    onToggleIRL,
    onFrameStyleChange,
    isPremium,
  });

  if (layout === 'single') {
    return (
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <AnimatePresence>
          {designs.map(d => <WallCard {...cardProps(d)} />)}
        </AnimatePresence>
      </div>
    );
  }

  if (layout === 'featured' && designs.length > 0) {
    const [featured, ...rest] = designs;
    return (
      <div className="flex flex-col gap-6">
        <AnimatePresence>
          <div className="max-w-lg mx-auto w-full">
            <WallCard {...cardProps(featured)} />
          </div>
          {rest.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        breakpointCols={{ default: 4, 1024: 3, 768: 2 }}
        className="flex gap-4 -ml-4"
        columnClassName="pl-4 flex flex-col gap-4"
      >
        {designs.map(d => <WallCard {...cardProps(d)} />)}
      </Masonry>
    );
  }

  // Default grid
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {designs.map(d => <WallCard {...cardProps(d)} />)}
      </AnimatePresence>
    </div>
  );
}
