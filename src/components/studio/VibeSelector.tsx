import { useState } from 'react';
import { vibes } from '@/data/vibes';
import { Vibe } from '@/types/studio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Sparkles, Loader2, Lock, Check, Trash2, Flag } from 'lucide-react';
import { useGenerateStencil } from '@/hooks/useGenerateStencil';
import { toast } from '@/hooks/use-toast';

interface VibeSelectorProps {
  isOpen: boolean;
  activeVibeId: string | null;
  isPremium: boolean;
  onClose: () => void;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffle: () => void;
  onRequestUpgrade: () => void;
  onDeleteStencil?: (stencilId: string) => Promise<void>;
  onReportStencil?: (stencilId: string, reason?: string) => Promise<void>;
}

function VibePreviewSVG({ vibe, size = 'md' }: { vibe: Vibe; size?: 'sm' | 'md' }) {
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
    <svg viewBox={vibe.viewBox} className="w-full h-full">
      <rect width="100%" height="100%" fill="hsl(40, 15%, 96%)" rx="8" />
      {vibe.sections.map(section => (
        <path
          key={section.id}
          d={section.path}
          fill={colors[section.tone]}
          stroke="hsl(220, 10%, 75%)"
          strokeWidth={size === 'sm' ? 1.5 : 2}
          opacity={0.9}
        />
      ))}
    </svg>
  );
}

export function VibeSelector({ isOpen, activeVibeId, isPremium, onClose, onSelectVibe, onShuffle, onRequestUpgrade, onDeleteStencil, onReportStencil }: VibeSelectorProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedVibes, setAiGeneratedVibes] = useState<Vibe[]>([]);
  const { generateStencil, isGenerating } = useGenerateStencil();

  const handleGenerate = async () => {
    const vibe = await generateStencil(aiPrompt);
    if (vibe) {
      setAiGeneratedVibes(prev => [...prev, vibe]);
      onSelectVibe(vibe);
      setAiPrompt('');
    }
  };

  const handleDelete = async (e: React.MouseEvent, vibe: Vibe) => {
    e.stopPropagation();
    // Remove from local state
    setAiGeneratedVibes(prev => prev.filter(v => v.id !== vibe.id));
    // Remove from DB if it's a saved stencil
    if (onDeleteStencil && !vibe.id.startsWith('ai-')) {
      await onDeleteStencil(vibe.id);
    }
    toast({ title: 'Deleted', description: `"${vibe.name}" removed.` });
  };

  const handleReport = async (e: React.MouseEvent, vibe: Vibe) => {
    e.stopPropagation();
    if (onReportStencil) {
      await onReportStencil(vibe.id, 'bad_quality');
    }
    // Also remove from local view
    setAiGeneratedVibes(prev => prev.filter(v => v.id !== vibe.id));
    toast({ title: '🚩 Reported', description: `Thanks! We'll review "${vibe.name}".` });
  };

  const allVibes = [...vibes, ...aiGeneratedVibes];
  const mainVibes = allVibes.filter(v => !v.category);
  const communityVibes = allVibes.filter(v => v.category === 'Community');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-popover border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ width: 680, maxHeight: 'min(580px, 80vh)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Stencil Gallery
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose a shape to fill with textures
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeVibeId && (
                    <button
                      onClick={onShuffle}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
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

              {/* AI Generate Section */}
              <div className="px-6 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    AI Generate
                  </div>
                  {isPremium ? (
                    <>
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !isGenerating && handleGenerate()}
                        placeholder="Describe a shape… flower, castle, dinosaur, guitar"
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        disabled={isGenerating}
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !aiPrompt.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        {isGenerating ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                        ) : (
                          <><Sparkles className="w-3 h-3" /> Create</>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onRequestUpgrade}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                    >
                      <Lock className="w-3 h-3" /> Unlock with Premium
                    </button>
                  )}
                </div>
              </div>

              {/* Stencil Grid */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="grid grid-cols-4 gap-3">
                  {mainVibes.map(vibe => renderVibeCard(vibe))}
                </div>

                {communityVibes.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 mt-6 mb-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Community</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {communityVibes.map(vibe => renderVibeCard(vibe))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
