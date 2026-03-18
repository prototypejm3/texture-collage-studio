import { useState } from 'react';
import { vibes } from '@/data/vibes';
import { Vibe, CanvasElement, MaterialEffects } from '@/types/studio';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Lock, Check, Shuffle, Palette, Scissors } from 'lucide-react';
import { useGenerateStencil } from '@/hooks/useGenerateStencil';
import { FloatingToolbar } from './FloatingToolbar';

type Tab = 'stencils' | 'element';

interface RightSidebarProps {
  // Stencil props
  activeVibeId: string | null;
  isPremium: boolean;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onRequestUpgrade: () => void;
  // Element props
  selectedElement: CanvasElement | null;
  onUpdateElement: (updates: Partial<CanvasElement>) => void;
  onUpdateEffects: (effects: Partial<MaterialEffects>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
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
    <svg viewBox={vibe.viewBox} className="w-full h-full">
      <rect width="100%" height="100%" fill="hsl(40, 15%, 96%)" rx="8" />
      {vibe.sections.map(section => (
        <path
          key={section.id}
          d={section.path}
          fill={colors[section.tone]}
          stroke="hsl(220, 10%, 75%)"
          strokeWidth={1.5}
          opacity={0.9}
        />
      ))}
    </svg>
  );
}

export function RightSidebar({
  activeVibeId, isPremium, onSelectVibe, onShuffleVibeFills, onRequestUpgrade,
  selectedElement, onUpdateElement, onUpdateEffects, onDuplicate, onDelete,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stencils');
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

  const allVibes = [...vibes, ...aiGeneratedVibes];

  return (
    <div className="w-[280px] flex-shrink-0 border-l border-border bg-popover flex flex-col h-full">
      {/* Tab switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('stencils')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'stencils'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Stencils
        </button>
        <button
          onClick={() => setActiveTab('element')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'element'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          Element
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'stencils' ? (
          <div className="flex flex-col h-full">
            {/* AI Generate */}
            <div className="px-3 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                AI Generate
              </div>
              {isPremium ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isGenerating && handleGenerate()}
                    placeholder="flower, castle, dinosaur…"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                    ) : (
                      <><Sparkles className="w-3 h-3" /> Create</>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={onRequestUpgrade}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors w-full justify-center"
                >
                  <Lock className="w-3 h-3" /> Unlock with Premium
                </button>
              )}
            </div>

            {/* Shuffle button */}
            {activeVibeId && (
              <div className="px-3 py-2 border-b border-border">
                <button
                  onClick={onShuffleVibeFills}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors w-full justify-center"
                >
                  <Shuffle className="w-3 h-3" /> Shuffle Fills
                </button>
              </div>
            )}

            {/* Stencil Grid */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-2">
                {allVibes.map(vibe => {
                  const isActive = activeVibeId === vibe.id;
                  const isAiGenerated = vibe.id.startsWith('ai-');

                  return (
                    <motion.button
                      key={vibe.id}
                      onClick={() => onSelectVibe(vibe)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative flex flex-col items-center text-center rounded-xl p-2 transition-all border ${
                        isActive
                          ? 'bg-primary/8 border-primary ring-1 ring-primary/30'
                          : 'border-border/50 hover:border-border hover:bg-secondary/50'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 relative">
                        <VibePreviewSVG vibe={vibe} />
                        {isActive && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                        {isAiGenerated && (
                          <div className="absolute top-1 left-1 px-1 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[7px] font-bold uppercase tracking-wider">
                            AI
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium leading-tight truncate w-full">
                        {vibe.emoji} {vibe.name}
                      </span>
                      <span className="text-[8px] text-muted-foreground">
                        {vibe.sections.length} sections
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Element tab */
          selectedElement ? (
            <FloatingToolbar
              element={selectedElement}
              onUpdate={onUpdateElement}
              onUpdateEffects={onUpdateEffects}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-xs text-muted-foreground text-center">
                Click an element to edit its shape, size, and effects
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
