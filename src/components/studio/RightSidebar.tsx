import { useState, useRef, useCallback, useEffect } from 'react';
import { vibes } from '@/data/vibes';
import { letterStencils, numberSymbolStencils } from '@/data/letterStencils';
import { funStencils } from '@/data/funStencils';
import { Vibe } from '@/types/studio';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Lock, Check, Palette, EyeOff, Eye, Globe, Save, ImagePlus, X, Trash2, Flag, Heart, Stamp } from 'lucide-react';
import { useGenerateStencil } from '@/hooks/useGenerateStencil';
import { useStencilSocial } from '@/hooks/useStencilSocial';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useAiCredits } from '@/hooks/useAiCredits';
import { AiLowCreditsModal } from '@/components/studio/AiLowCreditsModal';
import { AiPremiumUpsellModal } from '@/components/studio/AiPremiumUpsellModal';
import { AiCreditsBanner } from '@/components/studio/AiCreditsBanner';

type Tab = 'stencils' | 'community' | 'hidden';

interface RightSidebarProps {
  activeVibeId: string | null;
  isPremium: boolean;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onPlaceStencil: () => void;
  onReplaceStencil?: (vibe: Vibe) => void;
  onRequestUpgrade: () => void;
  onGenerateMood: (prompt: string) => void;
  isGeneratingMood: boolean;
  customTemplate: { name: string; dataUrl: string } | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
  compact?: boolean;
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
  activeVibeId, isPremium, onSelectVibe, onShuffleVibeFills, onPlaceStencil, onRequestUpgrade,
  onGenerateMood, isGeneratingMood,
  customTemplate, templateOpacity, onUploadTemplate, onClearTemplate, onTemplateOpacityChange,
  compact = false,
}: RightSidebarProps) {
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('stencils');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [aiPrompt, setAiPrompt] = useState('');
  const [moodPrompt, setMoodPrompt] = useState('');
  const [aiGeneratedVibes, setAiGeneratedVibes] = useState<Vibe[]>([]);
  const aiCredits = useAiCredits();
  const { generateStencil, isGenerating } = useGenerateStencil({
    onCreditsError: (msg, status) => aiCredits.recordFailure(msg, status),
    onSuccess: () => aiCredits.recordSuccess(),
  });
  const { user } = useAuth();
  const social = useStencilSocial();

  // Save dialog state
  const [saveDialogVibe, setSaveDialogVibe] = useState<Vibe | null>(null);
  const [saveName, setSaveName] = useState('');
  const [savePublic, setSavePublic] = useState(false);
  // Replace vs Layer dialog
  const [pendingVibe, setPendingVibe] = useState<Vibe | null>(null);

  // Kid mode — synced via custom event
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  // AI stencil toggle — synced via custom event
  const [aiEnabled, setAiEnabled] = useState(() => {
    try { return localStorage.getItem('ai-stencil-enabled') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setAiEnabled((e as CustomEvent).detail);
    window.addEventListener('ai-enabled-change', handler);
    return () => window.removeEventListener('ai-enabled-change', handler);
  }, []);

  const handleStencilSelect = (vibe: Vibe) => {
    if (activeVibeId && activeVibeId !== vibe.id) {
      // Already have an active stencil — ask replace vs layer
      setPendingVibe(vibe);
    } else {
      onSelectVibe(vibe);
    }
  };

  const handleReplaceConfirm = () => {
    if (!pendingVibe) return;
    onSelectVibe(pendingVibe);
    setPendingVibe(null);
  };


  // Hide stencil and switch to hidden tab
  const handleHideStencil = useCallback((vibeId: string) => {
    const wasHidden = social.hiddenIds.has(vibeId);
    social.toggleHidden(vibeId);
    if (!wasHidden) {
      // Just hidden — switch to hidden tab so user sees it moved there
      setActiveTab('hidden');
      // If this was the active stencil, deselect it
      if (activeVibeId === vibeId) {
        onSelectVibe({ id: '', name: '', emoji: '', description: '', viewBox: '', sections: [], lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [] } as any);
      }
    }
  }, [social, activeVibeId, onSelectVibe]);

  const handleLayerConfirm = () => {
    if (!pendingVibe) return;
    onPlaceStencil(); // stamps current as elements
    // Small delay so state settles before selecting new vibe
    setTimeout(() => onSelectVibe(pendingVibe), 50);
    setPendingVibe(null);
  };

  const handleGenerate = async () => {
    if (!isPremium) { aiCredits.guardFreeUser(); return; }
    if (aiCredits.guardAiAction()) return;
    const vibe = await generateStencil(aiPrompt);
    if (vibe) {
      setAiGeneratedVibes(prev => [...prev, vibe]);
      onSelectVibe(vibe);
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

  const handleGenerateMood = () => {
    if (aiCredits.guardAiAction()) return;
    if (moodPrompt.trim()) {
      onGenerateMood(moodPrompt.trim());
      setMoodPrompt('');
    }
  };

  // Include all non-hidden vibes (including categorized ones like Music)
  const filteredVibes = vibes.filter(v => !social.hiddenIds.has(v.id) && v.category !== 'Community');
  const allVibes = [...filteredVibes, ...letterStencils, ...numberSymbolStencils, ...(kidMode ? [] : funStencils), ...aiGeneratedVibes];
  const builtInCategoryVibes = vibes.filter(v => v.category === 'Community');

  // Theme groupings for organized display
  const letterIds = new Set(letterStencils.map(l => l.id));
  const numberSymbolIds = new Set(numberSymbolStencils.map(n => n.id));
  const funIds = new Set(funStencils.map(f => f.id));
  const themeGroups: { label: string; kidLabel: string; emoji: string; ids: Set<string>; adultOnly?: boolean }[] = [
    { label: 'Nature & Scenery', kidLabel: '🌳 Outside', emoji: '🌿', ids: new Set(['sunset', 'ocean', 'rainbow', 'mushroom', 'flower', 'sun', 'tree']) },
    { label: 'Animals', kidLabel: '🐶 Animals', emoji: '🐾', ids: new Set(['cozy-soft', 'rugged-warm', 'bear', 'owl', 'turtle', 'lion', 'rabbit', 'dinosaur', 'giraffe', 'cow', 'parrot', 'pig', 'frog', 'lizard', 'monkey-face']) },
    { label: 'Insects & Bugs', kidLabel: '🐛 Bugs', emoji: '🦋', ids: new Set(['butterfly', 'butterfly-alt', 'butterfly-bold', 'beehive', 'bee', 'bee-simple', 'dragonfly', 'snail', 'worm', 'caterpillar', 'ladybug', 'hummingbird']) },
    { label: 'Sea Life', kidLabel: '🐟 Ocean', emoji: '🐠', ids: new Set(['fish', 'octopus', 'crab', 'seahorse', 'lobster', 'school-fish', 'shark']) },
    { label: 'Food & Fruit', kidLabel: '🍕 Food', emoji: '🍎', ids: new Set(['fruit-bowl', 'strawberry-fruit', 'grapes', 'eggplant', 'tomato', 'broccoli', 'orange-slice', 'banana', 'apple', 'pear', 'corn', 'carrot']) },
    { label: 'Space', kidLabel: '🚀 Space', emoji: '🚀', ids: new Set(['solar-system', 'astronaut', 'alien', 'saturn']) },
    { label: 'Art & Pattern', kidLabel: '🎨 Art', emoji: '🎨', ids: new Set(['mandala', 'mandala-flower']) },
    { label: 'Music', kidLabel: '🎵 Music', emoji: '🎵', ids: new Set([]) },
    { label: 'Numbers & Symbols', kidLabel: '🔢 Numbers', emoji: '#️⃣', ids: numberSymbolIds },
    { label: 'Letters', kidLabel: '🔤 ABCs', emoji: '🔤', ids: letterIds },
    { label: 'For Fun', kidLabel: 'For Fun', emoji: '✨', ids: funIds, adultOnly: true },
  ];

  const themedIds = new Set<string>();
  const themeSections: { label: string; kidLabel: string; emoji: string; vibes: typeof allVibes }[] = [];
  for (const group of themeGroups) {
    if (group.adultOnly && kidMode) continue;
    const items = allVibes.filter(v => group.ids.has(v.id) || v.category === group.label);
    if (items.length > 0) themeSections.push({ label: group.label, kidLabel: group.kidLabel, emoji: group.emoji, vibes: items });
    items.forEach(v => themedIds.add(v.id));
  }
  const uncategorizedVibes = allVibes.filter(v => !themedIds.has(v.id));

  // Community stencils: built-in featured + public from DB
  const builtInCommunityVibes: (Vibe & { creator: string })[] = [
    {
      id: 'ny-buildings',
      name: 'New York',
      emoji: '🏙️',
      description: 'Iconic skyline — towers, spires & skyscrapers',
      viewBox: '0 0 480 480',
      sections: [
        { id: 'ny-1wtc', label: 'One World Trade', tone: 'dark' as const, path: 'M52,380 L52,105 L58,60 L62,38 L64,25 L66,38 L70,60 L76,105 L76,380 Z' },
        { id: 'ny-brownstone-1', label: 'Brownstone Left', tone: 'medium' as const, path: 'M82,380 L82,305 Q82,298 89,298 L115,298 Q122,298 122,305 L122,380 Z' },
        { id: 'ny-empire', label: 'Empire State', tone: 'dark' as const, path: 'M128,380 L128,175 L135,175 L135,145 L142,145 L142,120 L148,120 L148,100 L153,100 L153,70 L156,55 L158,42 L160,55 L163,70 L163,100 L168,100 L168,120 L174,120 L174,145 L181,145 L181,175 L188,175 L188,380 Z' },
        { id: 'ny-glass-tower', label: 'Glass Tower', tone: 'light' as const, path: 'M194,380 L194,140 Q194,132 202,132 L228,132 Q236,132 236,140 L236,380 Z' },
        { id: 'ny-chrysler', label: 'Chrysler Building', tone: 'accent' as const, path: 'M242,380 L242,155 L248,155 L248,130 L252,130 L252,115 L255,115 L255,100 L258,100 L258,88 L260,78 L262,68 L264,55 L266,42 L268,55 L270,68 L272,78 L274,88 L274,100 L277,100 L277,115 L280,115 L280,130 L284,130 L284,155 L290,155 L290,380 Z' },
        { id: 'ny-midrise', label: 'Midrise', tone: 'medium' as const, path: 'M296,380 L296,230 Q296,222 304,222 L330,222 Q338,222 338,230 L338,380 Z' },
        { id: 'ny-steinway', label: 'Steinway Tower', tone: 'light' as const, path: 'M346,380 L346,72 Q346,65 352,65 L360,65 Q366,65 366,72 L366,380 Z' },
        { id: 'ny-hudson-yards', label: 'Hudson Yards', tone: 'medium' as const, path: 'M372,380 L375,150 Q375,142 382,140 L404,135 Q412,134 412,142 L412,380 Z' },
        { id: 'ny-brownstone-2', label: 'Brownstone Right', tone: 'accent' as const, path: 'M418,380 L418,280 Q418,272 425,272 L448,272 Q455,272 455,280 L455,380 Z' },
        { id: 'ny-base', label: 'Ground', tone: 'dark' as const, path: 'M30,380 L460,380 Q472,392 474,415 Q472,438 460,445 L30,445 Q18,438 16,415 Q18,392 30,380 Z' },
      ],
      lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
      creator: 'JK',
    },
    {
      id: 'cactus',
      name: 'Cactus',
      emoji: '🌵',
      description: 'Desert silhouette — bold & playful',
      viewBox: '0 0 480 480',
      sections: [
        { id: 'cactus-body', label: 'Body', tone: 'medium' as const, path: 'M200,120 Q195,90 215,75 Q235,65 255,68 Q275,72 282,90 L285,340 Q288,370 270,380 L210,380 Q192,370 195,340 Z' },
        { id: 'cactus-arm-left', label: 'Left Arm', tone: 'accent' as const, path: 'M200,220 Q170,225 148,215 Q125,200 120,175 Q118,150 130,138 Q145,128 158,135 Q170,145 172,168 Q175,190 178,200 L200,195 Z' },
        { id: 'cactus-arm-right', label: 'Right Arm', tone: 'accent' as const, path: 'M282,180 Q310,175 330,165 Q352,150 358,128 Q362,108 350,98 Q335,90 322,100 Q312,112 310,135 Q308,158 305,170 L282,168 Z' },
        { id: 'cactus-base', label: 'Base', tone: 'dark' as const, path: 'M130,380 L350,380 Q370,392 375,412 Q372,435 348,442 L132,442 Q108,435 105,412 Q110,392 130,380 Z' },
      ],
      lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
      creator: 'JK',
    },
  ];

  const dbCommunityVibes = social.publicStencils.map(social.recordToVibe);
  const communityVibes = [...builtInCommunityVibes, ...builtInCategoryVibes, ...dbCommunityVibes];

  // Hidden stencils: built-in vibes that are hidden
  const hiddenVibes = vibes.filter(v => social.hiddenIds.has(v.id));

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'stencils', label: kidMode ? 'Shapes' : 'Templates', icon: Palette },
    { id: 'community', label: kidMode ? 'By Friends' : 'Community', icon: Globe },
    ...(!kidMode ? [{ id: 'hidden' as Tab, label: 'Hidden', icon: EyeOff, count: hiddenVibes.length }] : []),
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Tab switcher */}
      {/* Filter pills — matches texture category pills */}
      <div className="px-2 py-1 border-b border-border bg-secondary/30">
        <div className="flex flex-wrap gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <tab.icon className="w-2.5 h-2.5" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[8px] ml-0.5 opacity-70">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Replace vs Layer dialog */}
      {pendingVibe && (
        <div className="absolute inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4">
          <div className="bg-popover border border-border rounded-xl p-4 w-64 shadow-xl">
            <h3 className="text-sm font-semibold mb-1">{kidMode ? 'Switch Shape' : 'Switch Stencil'}</h3>
            <p className="text-[10px] text-muted-foreground mb-3">
              {kidMode ? 'You already have a shape! What do you want to do?' : 'You already have a stencil on the canvas. What would you like to do?'}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleReplaceConfirm}
                className="w-full px-3 py-2 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors text-left"
              >
                <span className="font-semibold">{kidMode ? 'Swap It' : 'Replace'}</span>
                <span className="block text-[9px] text-muted-foreground mt-0.5">{kidMode ? 'Take away the old one, use the new one' : 'Remove current stencil and use the new one'}</span>
              </button>
              <button
                onClick={handleLayerConfirm}
                className="w-full px-3 py-2 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-left"
              >
                <span className="font-semibold">{kidMode ? 'Stack It' : 'Layer'}</span>
                <span className="block text-[9px] text-primary-foreground/70 mt-0.5">{kidMode ? 'Keep the old one and put the new one on top' : 'Stamp current stencil down and add the new one on top'}</span>
              </button>
              <button
                onClick={() => setPendingVibe(null)}
                className="w-full px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save dialog overlay */}
      {saveDialogVibe && (
        <div className="absolute inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4">
          <div className="bg-popover border border-border rounded-xl p-4 w-64 shadow-xl">
            <h3 className="text-sm font-semibold mb-3">{kidMode ? 'Save Shape' : 'Save Stencil'}</h3>
            <input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder={kidMode ? 'Name your shape' : 'Name your stencil'}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground mb-3"
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-4 cursor-pointer">
              <input type="checkbox" checked={savePublic} onChange={e => setSavePublic(e.target.checked)} className="rounded" />
              <Globe className="w-3 h-3" />
              {kidMode ? 'Share with friends' : 'Make public (others can see & favorite)'}
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
      <div className="flex-1 overflow-y-auto texture-panel">
        {activeTab === 'stencils' ? (
          <div className="flex flex-col">
            {/* AI Stencil + AI Mood — shown when AI enabled (parents control via top bar toggle) */}
            {(!kidMode || aiEnabled) && (
            <div className="px-2 py-1.5 border-b border-border bg-muted/30">
              <div className="flex gap-1.5">
                {/* AI Stencil */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground mb-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {kidMode ? '✨ Magic Shape' : 'AI Stencil'} <span className="px-1 py-0 text-[7px] font-bold uppercase tracking-wider rounded bg-primary/15 text-primary">Beta</span>
                    {kidMode && (
                      <button
                        onClick={() => {
                          const next = false;
                          localStorage.setItem('ai-stencil-enabled', String(next));
                          setAiEnabled(next);
                          window.dispatchEvent(new CustomEvent('ai-enabled-change', { detail: next }));
                        }}
                        className="ml-auto p-0.5 rounded text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Hide Magic Shape (parents)"
                      >
                        <EyeOff className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {(isPremium || kidMode) ? (
                    <div className="flex gap-1">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={e => setAiPrompt(e.target.value.slice(0, 12))}
                          onKeyDown={e => e.key === 'Enter' && !isGenerating && handleGenerate()}
                          placeholder={kidMode ? 'dragon, cat…' : 'flower, castle…'}
                          maxLength={12}
                          className={`w-full px-2 py-1 text-[10px] rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8 ${kidMode ? 'text-xs py-1.5' : ''}`}
                          disabled={isGenerating || aiCredits.limitReached}
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground/50">{aiPrompt.length}/12</span>
                      </div>
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !aiPrompt.trim() || aiCredits.limitReached}
                        className={`flex items-center justify-center px-2 py-1 text-[10px] font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${kidMode ? 'px-3 py-1.5' : ''}`}
                      >
                        {isGenerating ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={onRequestUpgrade}
                      className="flex items-center justify-center gap-1 w-full px-2 py-1 text-[10px] rounded bg-secondary/50 text-muted-foreground/60"
                    >
                      <Lock className="w-2.5 h-2.5" /> Premium
                    </button>
                  )}
                </div>

                {/* AI Mood — shown when stencil selected */}
                {activeVibeId && !kidMode && (
                  <>
                    <div className="w-px bg-border self-stretch" />
                    <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground mb-1">
                        <Sparkles className="w-3 h-3 text-accent-foreground" />
                        AI Mood <span className="px-1 py-0 text-[7px] font-bold uppercase tracking-wider rounded bg-primary/15 text-primary">Beta</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={moodPrompt}
                            onChange={e => setMoodPrompt(e.target.value.slice(0, 12))}
                            onKeyDown={e => e.key === 'Enter' && !isGeneratingMood && handleGenerateMood()}
                            placeholder="cozy, tropical…"
                            maxLength={12}
                            className="w-full px-2 py-1 text-[10px] rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8"
                            disabled={isGeneratingMood || aiCredits.limitReached}
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground/50">{moodPrompt.length}/12</span>
                        </div>
                        <button
                          onClick={handleGenerateMood}
                          disabled={isGeneratingMood || !moodPrompt.trim() || aiCredits.limitReached}
                          className="flex items-center justify-center px-2 py-1 text-[10px] font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isGeneratingMood ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            )}

            {/* Category filter pills */}
            <div className="px-2 py-1 border-b border-border bg-secondary/20">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                    activeCategory === 'All'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  All
                </button>
                {themeSections.map(section => (
                  <button
                    key={section.label}
                    onClick={() => setActiveCategory(section.label)}
                    className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                      activeCategory === section.label
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {kidMode ? section.kidLabel : `${section.emoji} ${section.label}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stencil Grid — flat, filtered by category */}
            <div className="p-1.5">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
                {(() => {
                  const displayVibes = activeCategory === 'All'
                    ? [...uncategorizedVibes, ...themeSections.flatMap(s => s.vibes)]
                    : themeSections.find(s => s.label === activeCategory)?.vibes || [];
                  return displayVibes.map(vibe => (
                    <StencilCard
                      key={vibe.id}
                      vibe={vibe}
                      isActive={activeVibeId === vibe.id}
                      isHidden={social.hiddenIds.has(vibe.id)}
                      isFavorited={social.favoritedIds.has(vibe.id)}
                      isLoggedIn={!!user}
                      onSelect={() => handleStencilSelect(vibe)}
                      onToggleHidden={() => handleHideStencil(vibe.id)}
                      onToggleFav={() => social.toggleFavorite(vibe.id)}
                      onDelete={async () => {
                        setAiGeneratedVibes(prev => prev.filter(v => v.id !== vibe.id));
                        await social.deleteStencil(vibe.id);
                        toast({ title: 'Deleted', description: `"${vibe.name}" removed.` });
                      }}
                      onReport={async () => {
                        await social.reportStencil(vibe.id);
                        setAiGeneratedVibes(prev => prev.filter(v => v.id !== vibe.id));
                        toast({ title: '🚩 Reported', description: `Thanks! We'll review "${vibe.name}".` });
                      }}
                    />
                  ));
                })()}
              </div>
            </div>
          </div>
        ) : activeTab === 'community' ? (
          <div className="flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              {communityVibes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Globe className="w-6 h-6 text-muted-foreground/40 mb-1.5" />
                  <p className="text-[10px] text-muted-foreground">{kidMode ? 'No shapes from friends yet' : 'No community stencils yet'}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{kidMode ? 'Make a shape and share it!' : 'Generate one with AI and make it public!'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
                  {communityVibes.map(vibe => {
                    const record = social.publicStencils.find(s => s.id === vibe.id);
                    const creator = 'creator' in vibe ? (vibe as any).creator : undefined;
                    return (
                      <CommunityStencilCard
                        key={vibe.id}
                        vibe={vibe}
                        isActive={activeVibeId === vibe.id}
                        favCount={record?.fav_count ?? 0}
                        isFavorited={social.favoritedIds.has(vibe.id)}
                        isLoggedIn={!!user}
                        onSelect={() => handleStencilSelect(vibe)}
                        onToggleFav={() => social.toggleFavorite(vibe.id)}
                        creator={creator}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Hidden tab */
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-2">
              {hiddenVibes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <EyeOff className="w-6 h-6 text-muted-foreground/40 mb-1.5" />
                  <p className="text-[10px] text-muted-foreground">{kidMode ? 'Nothing put away' : 'No hidden stencils'}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{kidMode ? 'Put away shapes you don\'t want to see' : 'Hide stencils from the Stencils tab'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
                  {hiddenVibes.map(vibe => (
                    <motion.div
                      key={vibe.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative cursor-pointer opacity-60 hover:opacity-100"
                    >
                      <button onClick={() => handleStencilSelect(vibe)} className="w-full">
                        <div className={`aspect-square rounded overflow-hidden border shadow-sm border-border/50`}>
                          <VibePreviewSVG vibe={vibe} />
                        </div>
                        <p className="text-[8px] text-muted-foreground mt-0.5 truncate text-center">
                          {vibe.emoji} {vibe.name}
                        </p>
                      </button>
                      <button
                        onClick={() => social.toggleHidden(vibe.id)}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-accent"
                        title="Unhide"
                      >
                        <Eye className="w-2.5 h-2.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Credits Banner */}
      <AiCreditsBanner
        type={aiCredits.limitReached ? 'limit' : 'warning'}
        visible={aiCredits.limitReached || aiCredits.lowWarning}
        onDismiss={aiCredits.limitReached ? aiCredits.dismissModal : aiCredits.dismissWarning}
      />

      {/* AI Low Credits Modal */}
      <AiLowCreditsModal isOpen={aiCredits.showModal} onClose={aiCredits.dismissModal} />
    </div>
  );
}

function StencilCard({ vibe, isActive, isHidden, isFavorited, isLoggedIn, onSelect, onToggleHidden, onToggleFav, onDelete, onReport }: {
  vibe: Vibe;
  isActive: boolean;
  isHidden: boolean;
  isFavorited: boolean;
  isLoggedIn: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onToggleFav: () => void;
  onDelete: () => void;
  onReport: () => void;
}) {
  const isAiGenerated = vibe.id.startsWith('ai-');

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      draggable
      onDragStart={(e: any) => {
        e.dataTransfer?.setData('vibeId', vibe.id);
      }}
      className="cursor-grab active:cursor-grabbing group relative"
    >
      <div
        className={`aspect-square rounded overflow-hidden border shadow-sm ${
          isActive ? 'border-primary ring-1 ring-primary/40' : 'border-border/50'
        }`}
      >
        <VibePreviewSVG vibe={vibe} />
        {isActive && (
          <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-1.5 h-1.5 text-primary-foreground" />
          </div>
        )}
        {isAiGenerated && (
          <div className="absolute top-0.5 left-0.5 px-0.5 py-0 rounded bg-primary/90 text-primary-foreground text-[5px] font-bold uppercase tracking-wider">
            AI
          </div>
        )}
      </div>
      <p className="text-[8px] text-muted-foreground mt-0.5 truncate text-center">
        {vibe.emoji} {vibe.name}
      </p>

      {/* Fav heart button — bottom-right on hover */}
      {isLoggedIn && !isAiGenerated && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className={`absolute bottom-5 right-0.5 p-0.5 rounded-full transition-all ${
            isFavorited
              ? 'text-rose-500 opacity-100'
              : 'text-muted-foreground opacity-0 group-hover:opacity-100 bg-background/80'
          }`}
          title={isFavorited ? 'Unfavorite' : 'Favorite'}
        >
          <Heart className={`w-2.5 h-2.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Hide button — top-left on hover */}
      {(isLoggedIn || isAiGenerated) && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
          className={`absolute top-0.5 left-0.5 p-0.5 rounded-full transition-all bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100`}
          title={isHidden ? 'Show stencil' : 'Hide stencil'}
        >
          {isHidden ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
        </button>
      )}
      {isAiGenerated && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete"
        >
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      )}
    </motion.div>
  );
}

function CommunityStencilCard({ vibe, isActive, favCount, isFavorited, isLoggedIn, onSelect, onToggleFav, creator }: {
  vibe: Vibe;
  isActive: boolean;
  favCount: number;
  isFavorited: boolean;
  isLoggedIn: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
  creator?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="cursor-grab active:cursor-grabbing group relative"
    >
      <div
        className={`aspect-square rounded overflow-hidden border shadow-sm ${
          isActive ? 'border-primary ring-1 ring-primary/40' : 'border-border/50'
        }`}
      >
        <VibePreviewSVG vibe={vibe} />
        {isActive && (
          <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-1.5 h-1.5 text-primary-foreground" />
          </div>
        )}
      </div>
      <p className="text-[8px] text-muted-foreground mt-0.5 truncate text-center">
        {vibe.emoji} {vibe.name}
      </p>

      {/* Fav button — matches texture star positioning */}
      <button
        onClick={(e) => { e.stopPropagation(); if (isLoggedIn) onToggleFav(); }}
        className={`absolute top-0.5 left-0.5 p-0.5 rounded-full transition-all ${
          isFavorited
            ? 'bg-primary/90 text-primary-foreground opacity-100'
            : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100'
        }`}
        title={isLoggedIn ? (isFavorited ? 'Remove shadow' : 'Cast a shadow') : 'Sign in to cast shadows'}
      >
        <Save className={`w-2.5 h-2.5 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {/* Shadow count badge */}
      {favCount > 0 && (
        <span className="absolute bottom-5 right-0.5 px-1 py-0 text-[7px] rounded-full bg-foreground/60 text-background font-medium">
          {favCount}
        </span>
      )}
    </motion.div>
  );
}
