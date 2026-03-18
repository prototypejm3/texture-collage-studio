import { useState } from 'react';
import { vibes } from '@/data/vibes';
import { Vibe, CanvasElement, MaterialEffects } from '@/types/studio';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Lock, Check, Shuffle, Palette, Scissors, Heart, EyeOff, Eye, Globe, Save } from 'lucide-react';
import { useGenerateStencil } from '@/hooks/useGenerateStencil';
import { useStencilSocial } from '@/hooks/useStencilSocial';
import { useAuth } from '@/hooks/useAuth';
import { FloatingToolbar } from './FloatingToolbar';
import { toast } from '@/hooks/use-toast';

type Tab = 'stencils' | 'community' | 'element';

interface RightSidebarProps {
  activeVibeId: string | null;
  isPremium: boolean;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onRequestUpgrade: () => void;
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
  const { user } = useAuth();
  const social = useStencilSocial();

  // Save dialog state
  const [saveDialogVibe, setSaveDialogVibe] = useState<Vibe | null>(null);
  const [saveName, setSaveName] = useState('');
  const [savePublic, setSavePublic] = useState(false);

  const handleGenerate = async () => {
    const vibe = await generateStencil(aiPrompt);
    if (vibe) {
      setAiGeneratedVibes(prev => [...prev, vibe]);
      onSelectVibe(vibe);
      // Open save dialog
      if (user) {
        setSaveDialogVibe(vibe);
        setSaveName(aiPrompt);
        setSavePublic(false);
      }
      setAiPrompt('');
    }
  };

  const handleSaveStencil = async () => {
    if (!saveDialogVibe || !saveName.trim()) return;
    await social.saveStencil(saveDialogVibe, saveName, savePublic);
    toast({ title: savePublic ? 'Published!' : 'Saved!', description: savePublic ? 'Your stencil is now visible to everyone.' : 'Stencil saved to your collection.' });
    setSaveDialogVibe(null);
  };

  // Filter out hidden stencils from built-in vibes
  const filteredVibes = vibes.filter(v => !social.hiddenIds.has(v.id));
  const allVibes = [...filteredVibes, ...aiGeneratedVibes];

  // Community stencils (public from DB)
  const communityVibes = social.publicStencils.map(social.recordToVibe);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'stencils', label: 'Stencils', icon: Palette },
    { id: 'community', label: 'Community', icon: Globe },
    { id: 'element', label: 'Element', icon: Scissors },
  ];

  return (
    <div className="w-[280px] flex-shrink-0 border-l border-border bg-popover flex flex-col h-full">
      {/* Tab switcher */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Save dialog overlay */}
      {saveDialogVibe && (
        <div className="absolute inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4">
          <div className="bg-popover border border-border rounded-xl p-4 w-64 shadow-xl">
            <h3 className="text-sm font-semibold mb-3">Save Stencil</h3>
            <input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Name your stencil"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground mb-3"
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-4 cursor-pointer">
              <input type="checkbox" checked={savePublic} onChange={e => setSavePublic(e.target.checked)} className="rounded" />
              <Globe className="w-3 h-3" />
              Make public (others can see & favorite)
            </label>
            <div className="flex gap-2">
              <button onClick={() => setSaveDialogVibe(null)} className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors">
                Skip
              </button>
              <button onClick={handleSaveStencil} disabled={!saveName.trim()} className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
                {allVibes.map(vibe => (
                  <StencilCard
                    key={vibe.id}
                    vibe={vibe}
                    isActive={activeVibeId === vibe.id}
                    isHidden={social.hiddenIds.has(vibe.id)}
                    isLoggedIn={!!user}
                    onSelect={() => onSelectVibe(vibe)}
                    onToggleHidden={() => social.toggleHidden(vibe.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'community' ? (
          <div className="flex flex-col h-full">
            <div className="px-3 py-3 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Community Stencils
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Public stencils from other creators
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {communityVibes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Globe className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">No community stencils yet</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Generate one with AI and make it public!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {communityVibes.map(vibe => {
                    const record = social.publicStencils.find(s => s.id === vibe.id);
                    return (
                      <CommunityStencilCard
                        key={vibe.id}
                        vibe={vibe}
                        isActive={activeVibeId === vibe.id}
                        favCount={record?.fav_count ?? 0}
                        isFavorited={social.favoritedIds.has(vibe.id)}
                        isLoggedIn={!!user}
                        onSelect={() => onSelectVibe(vibe)}
                        onToggleFav={() => social.toggleFavorite(vibe.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
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

function StencilCard({ vibe, isActive, isHidden, isLoggedIn, onSelect, onToggleHidden }: {
  vibe: Vibe;
  isActive: boolean;
  isHidden: boolean;
  isLoggedIn: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
}) {
  const isAiGenerated = vibe.id.startsWith('ai-');

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col items-center text-center rounded-xl p-2 transition-all border ${
        isActive
          ? 'bg-primary/8 border-primary ring-1 ring-primary/30'
          : 'border-border/50 hover:border-border hover:bg-secondary/50'
      }`}
    >
      <button onClick={onSelect} className="w-full">
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
        <span className="text-[10px] font-medium leading-tight truncate w-full block">
          {vibe.emoji} {vibe.name}
        </span>
      </button>

      {/* Hide button */}
      {isLoggedIn && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
          title={isHidden ? 'Show stencil' : 'Hide stencil'}
        >
          {isHidden ? <Eye className="w-3 h-3 text-muted-foreground" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
        </button>
      )}
    </motion.div>
  );
}

function CommunityStencilCard({ vibe, isActive, favCount, isFavorited, isLoggedIn, onSelect, onToggleFav }: {
  vibe: Vibe;
  isActive: boolean;
  favCount: number;
  isFavorited: boolean;
  isLoggedIn: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col items-center text-center rounded-xl p-2 transition-all border ${
        isActive
          ? 'bg-primary/8 border-primary ring-1 ring-primary/30'
          : 'border-border/50 hover:border-border hover:bg-secondary/50'
      }`}
    >
      <button onClick={onSelect} className="w-full">
        <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 relative">
          <VibePreviewSVG vibe={vibe} />
          {isActive && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </div>
        <span className="text-[10px] font-medium leading-tight truncate w-full block">
          {vibe.emoji} {vibe.name}
        </span>
      </button>

      {/* Fav count + toggle */}
      <div className="flex items-center gap-1 mt-1">
        <button
          onClick={(e) => { e.stopPropagation(); if (isLoggedIn) onToggleFav(); }}
          className={`flex items-center gap-0.5 text-[10px] transition-colors ${
            isFavorited ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
          } ${!isLoggedIn ? 'cursor-default' : ''}`}
          title={isLoggedIn ? (isFavorited ? 'Unfavorite' : 'Favorite') : 'Sign in to favorite'}
        >
          <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
          {favCount}
        </button>
      </div>
    </motion.div>
  );
}
