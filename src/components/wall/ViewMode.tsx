import { SavedDesign } from '@/types/wall';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ViewModeProps {
  designs: SavedDesign[];
  isOpen: boolean;
  startIndex?: number;
  onClose: () => void;
}

export function ViewMode({ designs, isOpen, startIndex = 0, onClose }: ViewModeProps) {
  const [index, setIndex] = useState(startIndex);

  if (!isOpen || designs.length === 0) return null;

  const design = designs[Math.min(index, designs.length - 1)];
  const hasPrev = index > 0;
  const hasNext = index < designs.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 text-background">
          <X className="w-5 h-5" />
        </button>

        {hasPrev && (
          <button
            onClick={e => { e.stopPropagation(); setIndex(i => i - 1); }}
            className="absolute left-4 p-2 rounded-full bg-background/20 hover:bg-background/40 text-background"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <motion.div
          key={design.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl max-h-[85vh] mx-4"
          onClick={e => e.stopPropagation()}
        >
          <img src={design.previewImage} alt={design.name} className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
          <div className="text-center mt-4">
            <p className="text-background text-sm font-medium">{design.name}</p>
            {design.vibeName && <p className="text-background/60 text-xs">{design.vibeName}</p>}
          </div>
        </motion.div>

        {hasNext && (
          <button
            onClick={e => { e.stopPropagation(); setIndex(i => i + 1); }}
            className="absolute right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 text-background"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div className="absolute bottom-4 text-background/60 text-xs">
          {index + 1} / {designs.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
