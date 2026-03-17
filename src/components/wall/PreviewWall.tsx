import { SavedDesign, WallBackground } from '@/types/wall';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

interface PreviewWallProps {
  designs: SavedDesign[];
  isPremium: boolean;
  onUnlock: () => void;
}

export function PreviewWall({ designs, isPremium, onUnlock }: PreviewWallProps) {
  if (isPremium || designs.length === 0) return null;

  // Show a blurred preview of what a full wall could look like
  const fakeDesigns = [...designs, ...designs, ...designs, ...designs].slice(0, 8);

  return (
    <div className="relative mt-8 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-4 gap-3 p-4 opacity-30 blur-[2px]">
        {fakeDesigns.map((d, i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-secondary">
            <img src={d.previewImage} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm">
        <Lock className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Unlock your full Wall</p>
        <p className="text-xs text-muted-foreground mb-4 max-w-xs text-center">
          Save unlimited designs, customize your gallery, and build your collection.
        </p>
        <button
          onClick={onUnlock}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Unlock — $4.99
        </button>
      </div>
    </div>
  );
}
