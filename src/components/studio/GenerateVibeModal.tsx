import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X, Palette, Check, ArrowRight } from 'lucide-react';
import { GeneratedVibe } from '@/hooks/useGenerateVibe';
import { textures } from '@/data/textures';

interface GenerateVibeModalProps {
  isOpen: boolean;
  isGenerating: boolean;
  generatedVibe: GeneratedVibe | null;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  onApply: () => void;
}

function TexturePreview({ textureId }: { textureId: string }) {
  const tex = textures.find(t => t.id === textureId);
  if (!tex) return null;
  return (
    <div
      className="w-10 h-10 rounded-lg border border-border/50 shadow-sm"
      style={{ background: tex.cssBackground, backgroundSize: 'cover' }}
      title={tex.name}
    />
  );
}

export function GenerateVibeModal({ isOpen, isGenerating, generatedVibe, onClose, onGenerate, onApply }: GenerateVibeModalProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) onGenerate(prompt);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-popover border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ width: 520, maxHeight: 'min(620px, 85vh)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    What's the Mood?
                  </h2>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Prompt input */}
              <form onSubmit={handleSubmit} className="px-6 py-4 border-b border-border bg-muted/30">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Describe the mood — cozy, moody, tropical, minimal, luxe…
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g. cozy cabin vibes, beach sunset, dark academia…"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    disabled={isGenerating}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate</>
                    )}
                  </button>
                </div>
              </form>

              {/* Results */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {isGenerating && !generatedVibe && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">AI is crafting your vibe…</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Picking colors, textures, and frame style</p>
                  </div>
                )}

                {generatedVibe && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    {/* Vibe name */}
                    <div className="text-center">
                      <span className="text-2xl">{generatedVibe.emoji}</span>
                      <h3 className="text-lg font-bold mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {generatedVibe.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{generatedVibe.description}</p>
                    </div>

                    {/* Color palette */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                        <Palette className="w-3 h-3" /> Color Palette
                      </h4>
                      <div className="flex gap-2">
                        {generatedVibe.palette.map((c, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full aspect-square rounded-xl border border-border/50 shadow-sm"
                              style={{ backgroundColor: c.color }}
                            />
                            <span className="text-[9px] text-muted-foreground text-center leading-tight">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Texture selections */}
                    <div className="space-y-3">
                      {[
                        { label: 'Light Tones', ids: generatedVibe.lightTextures },
                        { label: 'Medium Tones', ids: generatedVibe.mediumTextures },
                        { label: 'Dark Tones', ids: generatedVibe.darkTextures },
                        { label: 'Accents', ids: generatedVibe.accentTextures },
                      ].map(group => (
                        <div key={group.label}>
                          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                            {group.label}
                          </h4>
                          <div className="flex gap-1.5 flex-wrap">
                            {group.ids.map(id => (
                              <TexturePreview key={id} textureId={id} />
                            ))}
                            {group.ids.length === 0 && (
                              <span className="text-[10px] text-muted-foreground/50 italic">None selected</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stencil preview */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                        Layout Stencil
                      </h4>
                      <div className="w-32 h-32 mx-auto">
                        <svg viewBox={generatedVibe.viewBox} className="w-full h-full">
                          <rect width="100%" height="100%" fill="hsl(40, 15%, 96%)" rx="8" />
                          {generatedVibe.sections.map(section => {
                            const toneColors: Record<string, string> = {
                              light: generatedVibe.palette[0]?.color || 'hsl(40, 20%, 88%)',
                              medium: generatedVibe.palette[1]?.color || 'hsl(25, 25%, 60%)',
                              dark: generatedVibe.palette[2]?.color || 'hsl(20, 20%, 30%)',
                              accent: generatedVibe.palette[3]?.color || 'hsl(24, 60%, 50%)',
                            };
                            return (
                              <path
                                key={section.id}
                                d={section.path}
                                fill={toneColors[section.tone]}
                                stroke="hsl(220, 10%, 75%)"
                                strokeWidth={1.5}
                                opacity={0.85}
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isGenerating && !generatedVibe && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Enter a vibe to get started</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      AI will generate colors, pick matching textures, and create a layout
                    </p>
                  </div>
                )}
              </div>

              {/* Apply button */}
              {generatedVibe && (
                <div className="px-6 py-3 border-t border-border bg-muted/20">
                  <button
                    onClick={onApply}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Apply Vibe
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
