import { useState } from 'react';
import { vibes } from '@/data/vibes';
import { Vibe } from '@/types/studio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Sparkles, Loader2, Lock } from 'lucide-react';
import { useGenerateStencil } from '@/hooks/useGenerateStencil';

interface VibeSelectorProps {
  isOpen: boolean;
  activeVibeId: string | null;
  isPremium: boolean;
  onClose: () => void;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffle: () => void;
  onRequestUpgrade: () => void;
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
    'fruit-bowl': { light: 'hsl(40, 30%, 90%)', medium: 'hsl(30, 40%, 62%)', dark: 'hsl(15, 35%, 30%)', accent: 'hsl(15, 55%, 58%)' },
    mushroom: { light: 'hsl(40, 25%, 88%)', medium: 'hsl(30, 18%, 65%)', dark: 'hsl(20, 15%, 28%)', accent: 'hsl(12, 50%, 48%)' },
    beehive: { light: 'hsl(45, 50%, 78%)', medium: 'hsl(35, 45%, 58%)', dark: 'hsl(25, 30%, 25%)', accent: 'hsl(42, 60%, 55%)' },
    cactus: { light: 'hsl(90, 15%, 85%)', medium: 'hsl(140, 25%, 45%)', dark: 'hsl(25, 20%, 25%)', accent: 'hsl(120, 20%, 55%)' },
    'ny-buildings': { light: 'hsl(220, 10%, 80%)', medium: 'hsl(220, 12%, 50%)', dark: 'hsl(220, 20%, 15%)', accent: 'hsl(30, 35%, 50%)' },
    rainbow: { light: 'hsl(40, 25%, 90%)', medium: 'hsl(42, 45%, 60%)', dark: 'hsl(12, 50%, 45%)', accent: 'hsl(320, 30%, 65%)' },
  };

  const colors = vibeAccents[vibe.id] || toneColors;

  return (
    <svg viewBox={vibe.viewBox} className="w-full aspect-square rounded-md overflow-hidden border border-border/30">
      <rect width="100%" height="100%" fill="hsl(40, 15%, 96%)" />
      {vibe.sections.map(section => (
        <path
          key={section.id}
          d={section.path}
          fill={colors[section.tone]}
          stroke="hsl(220, 10%, 70%)"
          strokeWidth="2"
          opacity={0.85}
        />
      ))}
    </svg>
  );
}

export function VibeSelector({ isOpen, activeVibeId, onClose, onSelectVibe, onShuffle }: VibeSelectorProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiGeneratedVibes, setAiGeneratedVibes] = useState<Vibe[]>([]);
  const { generateStencil, isGenerating } = useGenerateStencil();

  const handleGenerate = async () => {
    const vibe = await generateStencil(aiPrompt);
    if (vibe) {
      setAiGeneratedVibes(prev => [...prev, vibe]);
      onSelectVibe(vibe);
      setAiPrompt('');
      setShowAiInput(false);
    }
  };

  const allVibes = [...vibes, ...aiGeneratedVibes];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.18 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-popover border border-border rounded-xl shadow-2xl px-4 py-3"
          style={{ maxWidth: 'calc(100vw - 300px)', width: 'auto' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Choose a Stencil
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowAiInput(v => !v)}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md transition-colors ${
                  showAiInput
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" /> AI Generate
              </button>
              {activeVibeId && (
                <button
                  onClick={onShuffle}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  <Shuffle className="w-2.5 h-2.5" /> Shuffle
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* AI Generate input */}
          <AnimatePresence>
            {showAiInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isGenerating && handleGenerate()}
                    placeholder="Describe a stencil… e.g. flower, castle, dinosaur"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    disabled={isGenerating}
                    autoFocus
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" /> Generate
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal scrollable strip */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
            {allVibes.map(vibe => (
              <button
                key={vibe.id}
                onClick={() => onSelectVibe(vibe)}
                className={`flex-shrink-0 flex flex-col items-center text-center p-1.5 rounded-lg transition-all ${
                  activeVibeId === vibe.id
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'hover:bg-secondary'
                }`}
                style={{ width: 72 }}
              >
                <div style={{ width: 56, height: 56 }}>
                  <VibePreviewSVG vibe={vibe} />
                </div>
                <span className="text-[10px] font-medium mt-1 leading-tight truncate w-full">
                  {vibe.emoji} {vibe.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
