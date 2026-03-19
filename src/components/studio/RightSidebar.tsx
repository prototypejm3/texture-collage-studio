import { useState, useRef } from 'react';
import { vibes } from '@/data/vibes';
import { Vibe } from '@/types/studio';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Lock, Check, Shuffle, Palette, EyeOff, Eye, Globe, Save, ImagePlus, X, Trash2, Flag } from 'lucide-react';
import { useGenerateStencil } from '@/hooks/useGenerateStencil';
import { useStencilSocial } from '@/hooks/useStencilSocial';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

type Tab = 'stencils' | 'community' | 'hidden';

interface RightSidebarProps {
  activeVibeId: string | null;
  isPremium: boolean;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onRequestUpgrade: () => void;
  // Mood generator
  onGenerateMood: (prompt: string) => void;
  isGeneratingMood: boolean;
  // Reference image
  customTemplate: { name: string; dataUrl: string } | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
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
  onGenerateMood, isGeneratingMood,
  customTemplate, templateOpacity, onUploadTemplate, onClearTemplate, onTemplateOpacityChange,
}: RightSidebarProps) {
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('stencils');
  const [aiPrompt, setAiPrompt] = useState('');
  const [moodPrompt, setMoodPrompt] = useState('');
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
    if (moodPrompt.trim()) {
      onGenerateMood(moodPrompt.trim());
      setMoodPrompt('');
    }
  };

  // Include all non-hidden vibes (including categorized ones like Music)
  const filteredVibes = vibes.filter(v => !social.hiddenIds.has(v.id) && v.category !== 'Community');
  const allVibes = [...filteredVibes, ...aiGeneratedVibes];
  const builtInCategoryVibes = vibes.filter(v => v.category === 'Community');

  // Theme groupings for organized display
  const themeGroups: { label: string; emoji: string; ids: Set<string> }[] = [
    { label: 'Nature & Scenery', emoji: '🌿', ids: new Set(['sunset', 'ocean', 'rainbow', 'mushroom', 'flower', 'sun']) },
    { label: 'Animals', emoji: '🐾', ids: new Set(['cozy-soft', 'rugged-warm', 'bear', 'owl', 'turtle', 'lion', 'rabbit', 'dinosaur', 'giraffe', 'cow', 'parrot', 'pig', 'frog', 'lizard']) },
    { label: 'Insects & Bugs', emoji: '🦋', ids: new Set(['butterfly', 'butterfly-alt', 'butterfly-bold', 'beehive', 'bee', 'bee-simple', 'dragonfly', 'snail', 'worm', 'caterpillar', 'ladybug', 'hummingbird']) },
    { label: 'Sea Life', emoji: '🐠', ids: new Set(['fish', 'octopus', 'crab', 'seahorse', 'lobster', 'school-fish']) },
    { label: 'Food & Fruit', emoji: '🍎', ids: new Set(['fruit-bowl', 'strawberry-fruit', 'grapes', 'eggplant', 'tomato', 'broccoli', 'orange-slice', 'banana', 'apple', 'pear', 'corn', 'carrot']) },
    { label: 'Space', emoji: '🚀', ids: new Set(['solar-system', 'astronaut', 'alien', 'saturn']) },
    { label: 'Art & Pattern', emoji: '🎨', ids: new Set(['mandala', 'mandala-flower']) },
    { label: 'Music', emoji: '🎵', ids: new Set([]) },
  ];

  const themedIds = new Set<string>();
  const themeSections: { label: string; emoji: string; vibes: typeof allVibes }[] = [];
  for (const group of themeGroups) {
    const items = allVibes.filter(v => group.ids.has(v.id) || v.category === group.label);
    if (items.length > 0) themeSections.push({ label: group.label, emoji: group.emoji, vibes: items });
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
    { id: 'stencils', label: 'Stencils', icon: Palette },
    { id: 'community', label: 'Community', icon: Globe },
    { id: 'hidden', label: 'Hidden', icon: EyeOff, count: hiddenVibes.length },
  ];

  return (
    <div className="flex flex-col h-full bg-popover">
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
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-0.5 px-1 py-0 text-[9px] rounded-full bg-muted text-muted-foreground">{tab.count}</span>
            )}
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
          <div className="flex flex-col">
            {/* Reference image — on top */}
            <div className="px-3 py-3 border-b border-border">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <ImagePlus className="w-3.5 h-3.5" />
                Reference Image
              </div>
              {!customTemplate ? (
                <>
                  <button
                    onClick={() => isPremium ? templateInputRef.current?.click() : onRequestUpgrade()}
                    className={`flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      isPremium
                        ? 'bg-secondary text-secondary-foreground hover:bg-accent'
                        : 'bg-secondary/50 text-muted-foreground/60'
                    }`}
                  >
                    {isPremium ? <ImagePlus className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {isPremium ? 'Upload Reference' : 'Premium Feature'}
                  </button>
                  <input
                    ref={templateInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type.startsWith('image/')) onUploadTemplate(file);
                      e.target.value = '';
                    }}
                  />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground truncate flex-1" title={customTemplate.name}>
                    📷 {customTemplate.name}
                  </span>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={5}
                    value={templateOpacity * 100}
                    onChange={(e) => onTemplateOpacityChange(Number(e.target.value) / 100)}
                    className="w-16 h-1 accent-primary"
                  />
                  <button
                    onClick={onClearTemplate}
                    className="p-0.5 rounded hover:bg-secondary transition-colors"
                    title="Remove reference"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* AI Generate Stencil */}
            <div className="px-3 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                AI Generate Stencil <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-primary/15 text-primary">Beta</span>
              </div>
              {isPremium ? (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value.slice(0, 12))}
                      onKeyDown={e => e.key === 'Enter' && !isGenerating && handleGenerate()}
                      placeholder="flower, castle…"
                      maxLength={12}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                      disabled={isGenerating}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/50">{aiPrompt.length}/12</span>
                  </div>
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

            {/* Mood generator — shown after a stencil is selected */}
            {activeVibeId && (
              <div className="px-3 py-3 border-b border-border bg-accent/10">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
                  AI Mood — auto-fill textures <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-primary/15 text-primary">Beta</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={moodPrompt}
                      onChange={e => setMoodPrompt(e.target.value.slice(0, 12))}
                      onKeyDown={e => e.key === 'Enter' && !isGeneratingMood && handleGenerateMood()}
                      placeholder="cozy cabin, tropical…"
                      maxLength={12}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                      disabled={isGeneratingMood}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/50">{moodPrompt.length}/12</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateMood}
                      disabled={isGeneratingMood || !moodPrompt.trim()}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGeneratingMood ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                      ) : (
                        <><Sparkles className="w-3 h-3" /> Generate Mood</>
                      )}
                    </button>
                    <button
                      onClick={onShuffleVibeFills}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                      title="Shuffle fills"
                    >
                      <Shuffle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stencil Grid — grouped by theme */}
            <div className="p-3">
              {/* Uncategorized stencils first */}
              {uncategorizedVibes.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                  {uncategorizedVibes.map(vibe => (
                    <StencilCard
                      key={vibe.id}
                      vibe={vibe}
                      isActive={activeVibeId === vibe.id}
                      isHidden={social.hiddenIds.has(vibe.id)}
                      isLoggedIn={!!user}
                      onSelect={() => onSelectVibe(vibe)}
                      onToggleHidden={() => social.toggleHidden(vibe.id)}
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
                  ))}
                </div>
              )}

              {/* Theme sections */}
              {themeSections.map(section => (
                <div key={section.label}>
                  <div className="flex items-center gap-2 mt-4 mb-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      {section.emoji} {section.label}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {section.vibes.map(vibe => (
                      <StencilCard
                        key={vibe.id}
                        vibe={vibe}
                        isActive={activeVibeId === vibe.id}
                        isHidden={social.hiddenIds.has(vibe.id)}
                        isLoggedIn={!!user}
                        onSelect={() => onSelectVibe(vibe)}
                        onToggleHidden={() => social.toggleHidden(vibe.id)}
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'community' ? (
          <div className="flex flex-col">
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
                <div className="grid grid-cols-3 gap-1.5">
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
                        onSelect={() => onSelectVibe(vibe)}
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
            <div className="px-3 py-3 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hidden Stencils
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Stencils you've hidden — unhide to bring them back
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {hiddenVibes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <EyeOff className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">No hidden stencils</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Hide stencils from the Stencils tab to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {hiddenVibes.map(vibe => (
                    <motion.div
                      key={vibe.id}
                      whileHover={{ y: -2 }}
                      className="group relative flex flex-col items-center text-center rounded-xl p-2 transition-all border border-border/50 hover:border-border hover:bg-secondary/50 opacity-60 hover:opacity-100"
                    >
                      <button onClick={() => onSelectVibe(vibe)} className="w-full">
                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5">
                          <VibePreviewSVG vibe={vibe} />
                        </div>
                        <span className="text-[10px] font-medium leading-tight truncate w-full block">
                          {vibe.emoji} {vibe.name}
                        </span>
                      </button>
                      <button
                        onClick={() => social.toggleHidden(vibe.id)}
                        className="mt-1 flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Unhide
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StencilCard({ vibe, isActive, isHidden, isLoggedIn, onSelect, onToggleHidden, onDelete, onReport }: {
  vibe: Vibe;
  isActive: boolean;
  isHidden: boolean;
  isLoggedIn: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  onReport: () => void;
}) {
  const isAiGenerated = vibe.id.startsWith('ai-');

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={`group relative flex flex-col items-center text-center rounded-lg p-1.5 transition-all border ${
        isActive
          ? 'bg-primary/8 border-primary ring-1 ring-primary/30'
          : 'border-border/50 hover:border-border hover:bg-secondary/50'
      }`}
    >
      <button onClick={onSelect} className="w-full">
        <div className="w-full aspect-square rounded overflow-hidden mb-1 relative">
          <VibePreviewSVG vibe={vibe} />
          {isActive && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
          {isAiGenerated && (
            <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-primary/90 text-primary-foreground text-[7px] font-bold uppercase tracking-wider">
              AI
            </div>
          )}
        </div>
        <span className="text-[9px] font-medium leading-tight truncate w-full block">
          {vibe.emoji} {vibe.name}
        </span>
      </button>

      {/* Action buttons on hover */}
      <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Hide toggle */}
        {(isLoggedIn || isAiGenerated) && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
            className="p-1 rounded-full bg-background/80 hover:bg-secondary transition-colors"
            title={isHidden ? 'Show stencil' : 'Hide stencil'}
          >
            {isHidden ? <Eye className="w-3 h-3 text-muted-foreground" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
          </button>
        )}
        {/* Report as bad */}
        {isAiGenerated && (
          <button
            onClick={(e) => { e.stopPropagation(); onReport(); }}
            className="p-1 rounded-full bg-background/80 hover:bg-destructive/20 transition-colors"
            title="Report as bad"
          >
            <Flag className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
        {/* Delete */}
        {isAiGenerated && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded-full bg-background/80 hover:bg-destructive/20 transition-colors"
            title="Delete stencil"
          >
            <Trash2 className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
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
  const shadowIcons = Math.floor(favCount / 25);
  const remainder = favCount % 25;

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={`group relative flex flex-col items-center text-center rounded-lg p-1.5 transition-all border ${
        isActive
          ? 'bg-primary/8 border-primary ring-1 ring-primary/30'
          : 'border-border/50 hover:border-border hover:bg-secondary/50'
      }`}
    >
      <button onClick={onSelect} className="w-full">
        <div className="w-full aspect-square rounded overflow-hidden mb-1 relative">
          <VibePreviewSVG vibe={vibe} />
          {isActive && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </div>
        <span className="text-[9px] font-medium leading-tight truncate w-full block">
          {vibe.emoji} {vibe.name}
        </span>
        {creator && (
          <span className="text-[9px] text-muted-foreground mt-0.5 block">
            by {creator}
          </span>
        )}
      </button>

      {/* Shadow count + toggle */}
      <div className="flex items-center gap-1 mt-1">
        <button
          onClick={(e) => { e.stopPropagation(); if (isLoggedIn) onToggleFav(); }}
          className={`flex items-center gap-0.5 text-[10px] transition-colors ${
            isFavorited ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          } ${!isLoggedIn ? 'cursor-default' : ''}`}
          title={isLoggedIn ? (isFavorited ? 'Remove shadow' : 'Cast a shadow') : 'Sign in to cast shadows'}
        >
          {shadowIcons > 0 ? (
            <span className="flex items-center gap-px">
              {Array.from({ length: Math.min(shadowIcons, 5) }).map((_, i) => (
                <span key={i} className="text-[10px]">👤</span>
              ))}
              {shadowIcons > 5 && <span className="text-[9px] text-muted-foreground ml-0.5">+{shadowIcons - 5}</span>}
            </span>
          ) : (
            <span className="text-[10px]">👤</span>
          )}
          <span className="ml-0.5">{favCount}</span>
        </button>
      </div>
    </motion.div>
  );
}
