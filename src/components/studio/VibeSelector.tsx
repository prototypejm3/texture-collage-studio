import { vibes } from '@/data/vibes';
import { Vibe } from '@/types/studio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle } from 'lucide-react';

interface VibeSelectorProps {
  isOpen: boolean;
  activeVibeId: string | null;
  onClose: () => void;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffle: () => void;
}

function VibePreviewSVG({ vibe }: { vibe: Vibe }) {
  const toneColors: Record<string, string> = {
    light: 'hsl(40, 20%, 88%)',
    medium: 'hsl(25, 25%, 60%)',
    dark: 'hsl(20, 20%, 30%)',
    accent: 'hsl(24, 60%, 50%)',
  };

  const vibeAccents: Record<string, Record<string, string>> = {
    sunset: { light: 'hsl(40, 35%, 90%)', medium: 'hsl(28, 50%, 60%)', dark: 'hsl(14, 45%, 35%)', accent: 'hsl(8, 40%, 70%)' },
    'solar-system': { light: 'hsl(220, 10%, 75%)', medium: 'hsl(220, 15%, 40%)', dark: 'hsl(220, 25%, 14%)', accent: 'hsl(35, 50%, 50%)' },
    ocean: { light: 'hsl(42, 25%, 88%)', medium: 'hsl(170, 20%, 55%)', dark: 'hsl(220, 45%, 25%)', accent: 'hsl(38, 40%, 65%)' },
    'cozy-soft': { light: 'hsl(40, 30%, 92%)', medium: 'hsl(30, 20%, 68%)', dark: 'hsl(220, 8%, 38%)', accent: 'hsl(8, 30%, 78%)' },
    'rugged-warm': { light: 'hsl(38, 20%, 82%)', medium: 'hsl(28, 40%, 52%)', dark: 'hsl(20, 30%, 22%)', accent: 'hsl(10, 38%, 38%)' },
  };

  const colors = vibeAccents[vibe.id] || toneColors;

  return (
    <svg viewBox={vibe.viewBox} className="w-full aspect-square rounded-lg overflow-hidden border border-border/30">
      <rect width="100%" height="100%" fill="hsl(40, 15%, 96%)" />
      {vibe.sections.map(section => (
        <path
          key={section.id}
          d={section.path}
          fill={colors[section.tone]}
          stroke="hsl(220, 10%, 70%)"
          strokeWidth="1.5"
          opacity={0.85}
        />
      ))}
    </svg>
  );
}

export function VibeSelector({ isOpen, activeVibeId, onClose, onSelectVibe, onShuffle }: VibeSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-popover border border-border rounded-2xl shadow-2xl p-5"
          style={{ width: 780 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Choose a Vibe
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Pick an outline → fill with textures → distort & customize
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeVibeId && (
                <button
                  onClick={onShuffle}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  <Shuffle className="w-3 h-3" /> Shuffle Fills
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {vibes.map(vibe => (
              <button
                key={vibe.id}
                onClick={() => onSelectVibe(vibe)}
                className={`group flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                  activeVibeId === vibe.id
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'hover:bg-secondary'
                }`}
              >
                <VibePreviewSVG vibe={vibe} />
                <span className="text-lg mt-2">{vibe.emoji}</span>
                <span className="text-[11px] font-medium mt-1">{vibe.name}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                  {vibe.description}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
