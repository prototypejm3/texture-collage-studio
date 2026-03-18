import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWall } from '@/hooks/useWall';
import { useMultiWall } from '@/hooks/useMultiWall';
import { useUserTier } from '@/hooks/useUserTier';
import { useGallery } from '@/hooks/useGallery';
import { WallGrid } from '@/components/wall/WallGrid';
import { WallCustomizer } from '@/components/wall/WallCustomizer';
import { EmptyWall } from '@/components/wall/EmptyWall';
import { PaywallModal } from '@/components/wall/PaywallModal';
import { ViewMode } from '@/components/wall/ViewMode';
import { PreviewWall } from '@/components/wall/PreviewWall';
import { StepBackMode } from '@/components/wall/StepBackMode';
import { LightingOverlay } from '@/components/wall/LightingOverlay';
import { AmbientSoundPlayer } from '@/components/wall/AmbientSound';
import { NavBar } from '@/components/NavBar';
import { DesignStatus, DesignSize, FrameStyle, HangingStyle, WallBackground } from '@/types/wall';
import { Expand, Download, MoreHorizontal, Plus, Trash2, ChevronDown, Pencil, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const bgStyles: Record<WallBackground, string> = {
  'brick': 'wall-bg-brick',
  'concrete': 'wall-bg-concrete',
  'limewash': 'wall-bg-limewash',
  'black-brick': 'wall-bg-black-brick',
  'black-concrete': 'wall-bg-black-concrete',
  'white-brick': 'wall-bg-white-brick',
  'clean-white': 'wall-bg-clean-white',
  'dark-brick': 'wall-bg-dark-brick',
  'gray-brick': 'wall-bg-gray-brick',
  'black-stone': 'wall-bg-black-stone',
  'speckled-white': 'wall-bg-speckled-white',
  'custom': '',
};

const MyWall = () => {
  const navigate = useNavigate();
  const wall = useWall();
  const multiWall = useMultiWall();
  const { isPremium, upgradeToPremium } = useUserTier();
  const gallery = useGallery();
  const [activeTab, setActiveTab] = useState<'all' | DesignStatus>('all');
  const [viewMode, setViewMode] = useState(false);
  const [viewStartIndex, setViewStartIndex] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showWallPicker, setShowWallPicker] = useState(false);
  const [editingWallId, setEditingWallId] = useState<string | null>(null);
  const [wallTitleDraft, setWallTitleDraft] = useState('');
  const [stepBackMode, setStepBackMode] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  const wallDesigns = wall.designs.filter(d => (d.wallId || 'wall-default') === multiWall.activeWallId);

  const filtered = activeTab === 'all'
    ? wallDesigns
    : wallDesigns.filter(d => d.status === activeTab);

  const currentSettings = multiWall.activeWall.settings;
  const isDark = ['black-brick', 'black-concrete', 'dark-brick', 'black-stone'].includes(currentSettings.background);
  const wallBgClass = currentSettings.background !== 'custom' ? bgStyles[currentSettings.background] : '';
  const wallBgStyle = currentSettings.background === 'custom' && currentSettings.customWallImage ? {
    backgroundImage: `url(${currentSettings.customWallImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : undefined;

  const handleOpen = useCallback((id: string) => {
    navigate(`/create?edit=${id}`);
  }, [navigate]);

  const handleDuplicate = useCallback((id: string) => {
    if (!isPremium && wallDesigns.length >= 1) {
      setShowPaywall(true);
      return;
    }
    wall.duplicateDesign(id);
  }, [isPremium, wallDesigns.length, wall]);

  const handleDelete = useCallback((id: string) => {
    wall.deleteDesign(id);
  }, [wall]);

  const handleToggleIRL = useCallback((id: string) => {
    const d = wall.designs.find(x => x.id === id);
    if (d) wall.updateDesign(id, { builtIRL: !d.builtIRL });
  }, [wall]);

  const handleFrameStyle = useCallback((id: string, style: FrameStyle) => {
    wall.updateDesign(id, { frameStyle: style });
  }, [wall]);

  const handleSizeChange = useCallback((id: string, size: DesignSize) => {
    wall.updateDesign(id, { displaySize: size });
  }, [wall]);

  const handleViewMode = useCallback((index?: number) => {
    setViewStartIndex(index ?? 0);
    setViewMode(true);
  }, []);

  const handleExportWall = useCallback(async () => {
    if (!wallRef.current) return;
    try {
      const dataUrl = await toPng(wallRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'my-wall.png';
      link.href = dataUrl;
      link.click();
      toast({ title: 'Exported!', description: 'Your wall has been saved as an image.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to export wall.', variant: 'destructive' });
    }
  }, []);

  const handleUpdateSettings = useCallback((updates: Partial<typeof currentSettings>) => {
    multiWall.updateWallSettings(multiWall.activeWallId, updates);
  }, [multiWall]);

  const handleApplyFrameToAll = useCallback((style: FrameStyle) => {
    wallDesigns.forEach(d => wall.updateDesign(d.id, { frameStyle: style }));
  }, [wallDesigns, wall]);

  const handleApplyHangingToAll = useCallback((style: HangingStyle) => {
    wallDesigns.forEach(d => wall.updateDesign(d.id, { hangingStyle: style }));
    handleUpdateSettings({ defaultHangingStyle: style });
  }, [wallDesigns, wall, handleUpdateSettings]);

  // ── Auto-Curate: gallery-like curated arrangement ──
  const handleAutoCurate = useCallback(() => {
    if (filtered.length === 0) return;

    const count = filtered.length;

    // ── 1. Identify Hero piece ──
    const hero = filtered.find(d => d.isHero)
      || filtered.find(d => d.pinned)
      || [...filtered].sort((a, b) => {
        const sizeOrder: Record<string, number> = { large: 3, medium: 2, small: 1 };
        return (sizeOrder[b.displaySize] || 2) - (sizeOrder[a.displaySize] || 2);
      })[0];
    const others = filtered.filter(d => d.id !== hero.id);

    // ── 2. Size tiers: hero=large, assign small/medium to others ──
    const sizedOthers = others.map((d, i) => ({
      ...d,
      _tier: (count <= 3 ? 'medium' : (i % 3 === 0 ? 'small' : 'medium')) as DesignSize,
    }));

    // ── 3. Enforce single hanging style ──
    const wallHanging = currentSettings.defaultHangingStyle || 'floating';

    // ── 4. Depth layers — hero=front, alternate mid/back ──
    type DepthLayer = 'front' | 'mid' | 'back';
    const depthShadow: Record<DepthLayer, number> = { back: 0, mid: 1, front: 2 };
    const heroDepth: DepthLayer = 'front';
    const otherDepths: DepthLayer[] = sizedOthers.map((_, i) => i % 2 === 0 ? 'mid' : 'back');

    // ── 5. Gallery layout constants ──
    const MIN_SPACING = 4;   // % units (≈24px at 600px wide)
    const MAX_SPACING = 10;  // % units (≈64px)

    // ── 6. Place Hero — slight offset from center ──
    const heroOffsetX = count <= 2 ? 0 : (Math.random() > 0.5 ? 4 : -4);
    const heroX = 50 + heroOffsetX;
    const heroY = count <= 3 ? 42 : 32;

    wall.updateDesign(hero.id, {
      wallX: heroX,
      wallY: heroY,
      displaySize: 'large',
      rotation: 0,
      hangingStyle: wallHanging,
    });

    if (others.length === 0) {
      toast({ title: '✨ Arranged!', description: 'Your gallery is curated.' });
      return;
    }

    // ── 7. Generate non-overlapping positions ──
    // Define alignment lines (invisible grid for organic-but-ordered feel)
    const vLines = [18, 30, 42, 50, 58, 70, 82]; // vertical snap lines
    const hLines = [22, 38, 52, 65, 78];          // horizontal baselines

    // Size widths in % for collision detection
    const tierWidth: Record<DesignSize, number> = { small: 14, medium: 20, large: 26 };
    const tierHeight: Record<DesignSize, number> = { small: 16, medium: 22, large: 28 };

    interface Placed { x: number; y: number; w: number; h: number }
    const placed: Placed[] = [{
      x: heroX, y: heroY,
      w: tierWidth.large, h: tierHeight.large,
    }];

    const overlaps = (x: number, y: number, w: number, h: number): boolean => {
      return placed.some(p => {
        const dx = Math.abs(x - p.x);
        const dy = Math.abs(y - p.y);
        const minDx = (w + p.w) / 2 + MIN_SPACING;
        const minDy = (h + p.h) / 2 + MIN_SPACING;
        return dx < minDx && dy < minDy;
      });
    };

    // Curated layout templates for common counts
    const templatePositions: Record<number, { x: number; y: number }[]> = {
      1: [{ x: 50, y: 72 }],
      2: [{ x: 28, y: 65 }, { x: 72, y: 65 }],
      3: [{ x: 24, y: 58 }, { x: 76, y: 58 }, { x: 50, y: 78 }],
      4: [{ x: 22, y: 52 }, { x: 78, y: 52 }, { x: 32, y: 76 }, { x: 68, y: 76 }],
      5: [{ x: 20, y: 48 }, { x: 80, y: 48 }, { x: 28, y: 72 }, { x: 50, y: 80 }, { x: 72, y: 72 }],
    };

    // Snap to nearest alignment line for organic-but-ordered feel
    const snapToLine = (val: number, lines: number[]): number => {
      let best = lines[0];
      let bestDist = Math.abs(val - lines[0]);
      for (const l of lines) {
        const dist = Math.abs(val - l);
        if (dist < bestDist) { best = l; bestDist = dist; }
      }
      return best;
    };

    sizedOthers.forEach((d, i) => {
      const tier = d._tier;
      const w = tierWidth[tier];
      const h = tierHeight[tier];
      let x: number, y: number;

      if (templatePositions[others.length] && i < templatePositions[others.length].length) {
        // Use curated template
        const tp = templatePositions[others.length][i];
        x = snapToLine(tp.x, vLines);
        y = snapToLine(tp.y, hLines);
      } else {
        // For 6+ items, distribute in rows
        const cols = Math.min(others.length, 4);
        const row = Math.floor(i / cols);
        const col = i % cols;
        const spacing = 80 / (cols + 1);
        x = snapToLine(10 + spacing * (col + 1), vLines);
        y = snapToLine(55 + row * 22, hLines);
      }

      // Nudge to avoid overlaps
      let attempts = 0;
      while (overlaps(x, y, w, h) && attempts < 20) {
        x += (attempts % 2 === 0 ? 1 : -1) * (MIN_SPACING + attempts);
        if (x < 10 || x > 90) { x = 50; y += MAX_SPACING; }
        attempts++;
      }

      // Clamp
      x = Math.max(10, Math.min(90, x));
      y = Math.max(15, Math.min(85, y));

      // ── 8. Slight tilt (max ±2°), most items straight ──
      const rotation = Math.random() > 0.6 ? Math.round((Math.random() - 0.5) * 4) : 0;

      placed.push({ x, y, w, h });

      wall.updateDesign(d.id, {
        wallX: x,
        wallY: y,
        displaySize: tier,
        rotation,
        hangingStyle: wallHanging,
      });
    });

    // Switch to freeform if not already
    if (currentSettings.layout !== 'freeform') {
      handleUpdateSettings({ layout: 'freeform' });
    }

    toast({ title: '✨ Arranged!', description: 'Gallery curated with balanced spacing and hierarchy.' });
  }, [filtered, wall, currentSettings.layout, currentSettings.defaultHangingStyle, handleUpdateSettings]);

  const handleAddWall = useCallback(() => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    multiWall.addWall();
    toast({ title: 'New wall created!' });
  }, [isPremium, multiWall]);

  const handleSubmitToGallery = useCallback(async (designId: string) => {
    const design = wall.designs.find(d => d.id === designId);
    if (!design) return;
    const submissionId = await gallery.submitToGallery({
      name: design.name,
      description: design.description,
      artist_name: design.artist || 'Anonymous',
      preview_image: design.previewImage,
      frame_style: design.frameStyle,
      display_size: design.displaySize || 'medium',
    });
    if (submissionId) {
      wall.updateDesign(designId, { gallerySubmissionId: submissionId });
    }
  }, [wall, gallery]);

  const handleDeleteWall = useCallback((wallId: string) => {
    if (multiWall.walls.length <= 1) return;
    wallDesigns.forEach(d => wall.deleteDesign(d.id));
    multiWall.deleteWall(wallId);
    toast({ title: 'Wall deleted' });
  }, [multiWall, wall, wallDesigns]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`flex-1 overflow-y-auto ${wallBgClass} transition-colors duration-500 relative`}
        style={wallBgStyle}
      >
        {/* Lighting overlay */}
        <LightingOverlay preset={currentSettings.lightingPreset || 'none'} />

        <div className="max-w-5xl mx-auto px-8 py-10 relative z-[6]">
          {/* Wall picker + customizer */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <button
                onClick={() => setShowWallPicker(v => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors text-xs ${
                  isDark ? 'text-background/70 hover:bg-background/10' : 'text-muted-foreground hover:bg-secondary/60'
                }`}
              >
                {multiWall.activeWall.settings.title}
                <ChevronDown className="w-3 h-3" />
                {multiWall.walls.length > 1 && (
                  <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-background/15 text-background/50' : 'bg-secondary text-muted-foreground'}`}>
                    {multiWall.walls.length}
                  </span>
                )}
              </button>
              {showWallPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setShowWallPicker(false); setEditingWallId(null); }} />
                  <div className="absolute left-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[200px]">
                    {multiWall.walls.map(w => (
                      <div key={w.id} className="flex items-center">
                        {editingWallId === w.id ? (
                          <div className="flex items-center gap-1 flex-1 px-2 py-1">
                            <input
                              autoFocus
                              value={wallTitleDraft}
                              onChange={e => setWallTitleDraft(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  multiWall.updateWallSettings(w.id, { title: wallTitleDraft });
                                  setEditingWallId(null);
                                }
                                if (e.key === 'Escape') setEditingWallId(null);
                              }}
                              className="flex-1 text-xs bg-transparent border-b border-primary/40 outline-none text-foreground"
                            />
                            <button
                              onClick={() => { multiWall.updateWallSettings(w.id, { title: wallTitleDraft }); setEditingWallId(null); }}
                              className="p-0.5 text-primary/60 hover:text-primary"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => { multiWall.setActiveWallId(w.id); setShowWallPicker(false); }}
                              className={`flex-1 text-left px-3 py-1.5 text-xs hover:bg-secondary ${
                                w.id === multiWall.activeWallId ? 'text-primary font-medium' : 'text-foreground'
                              }`}
                            >
                              {w.settings.title}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setWallTitleDraft(w.settings.title);
                                setEditingWallId(w.id);
                              }}
                              className="p-1 mr-0.5 text-muted-foreground/40 hover:text-muted-foreground rounded"
                              title="Rename"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                            </button>
                            {multiWall.walls.length > 1 && isPremium && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWall(w.id);
                                  setShowWallPicker(false);
                                }}
                                className="p-1 mr-1 text-muted-foreground hover:text-destructive rounded"
                                title="Delete wall"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={() => { handleAddWall(); setShowWallPicker(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-1.5 text-foreground"
                    >
                      <Plus className="w-3 h-3" /> New Wall {!isPremium && '🔒'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <WallCustomizer
            settings={currentSettings}
            onUpdate={handleUpdateSettings}
            onApplyFrameToAll={handleApplyFrameToAll}
            onApplyHangingToAll={handleApplyHangingToAll}
            onAutoCurate={handleAutoCurate}
            onStepBack={() => setStepBackMode(true)}
            onRequestUpgrade={() => setShowPaywall(true)}
            isPremium={isPremium}
          />

          {/* Tabs + controls */}
          <div className="flex items-center gap-4 mt-8 mb-8">
            <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${isDark ? 'bg-background/10' : 'bg-secondary/40'}`}>
              {([['all', 'All'], ['display', 'Display'], ['hidden', 'Hidden'], ['draft', 'Draft']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setActiveTab(val)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors tracking-wide ${
                    activeTab === val
                      ? isDark ? 'bg-background/20 text-background' : 'bg-background text-foreground shadow-sm'
                      : isDark ? 'text-background/40 hover:text-background/60' : 'text-muted-foreground/60 hover:text-foreground/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="ml-auto relative">
              {filtered.length > 0 && (
                <>
                  <button
                    onClick={() => setShowControls(!showControls)}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-background/10 text-background/40' : 'hover:bg-secondary/60 text-muted-foreground/50'}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showControls && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowControls(false)} />
                      <div className="absolute right-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                        <button
                          onClick={() => { handleViewMode(); setShowControls(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground"
                        >
                          <Expand className="w-3 h-3" /> View Mode
                        </button>
                        {isPremium && (
                          <button
                            onClick={() => { handleExportWall(); setShowControls(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground"
                          >
                            <Download className="w-3 h-3" /> Export Wall
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Wall content */}
          {wallDesigns.length === 0 ? (
            <EmptyWall />
          ) : (
            <motion.div
              ref={wallRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WallGrid
                designs={filtered}
                layout={currentSettings.layout}
                isPremium={isPremium}
                showTitleCards={currentSettings.showTitleCards}
                isDark={isDark}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onTogglePin={wall.togglePin}
                onToggleIRL={handleToggleIRL}
                onToggleHide={wall.toggleHide}
                onUpdate={wall.updateDesign}
                onFrameStyleChange={handleFrameStyle}
                onSizeChange={handleSizeChange}
                onSubmitToGallery={handleSubmitToGallery}
              />
            </motion.div>
          )}

          {!isPremium && wallDesigns.length > 0 && (
            <PreviewWall
              designs={wallDesigns}
              isPremium={isPremium}
              onUnlock={() => setShowPaywall(true)}
            />
          )}
        </div>
      </motion.div>

      {/* Ambient sound */}
      <AmbientSoundPlayer sound={currentSettings.ambientSound || 'none'} showControl={currentSettings.ambientSound !== 'none'} />

      {/* Step Back Mode */}
      <StepBackMode
        isOpen={stepBackMode}
        onClose={() => setStepBackMode(false)}
        wallClassName={wallBgClass}
        wallStyle={wallBgStyle}
      >
        <LightingOverlay preset={currentSettings.lightingPreset || 'none'} />
        <WallGrid
          designs={filtered}
          layout={currentSettings.layout}
          isPremium={isPremium}
          showTitleCards={currentSettings.showTitleCards}
          isDark={isDark}
          onOpen={() => {}}
          onDuplicate={() => {}}
          onDelete={() => {}}
          onTogglePin={() => {}}
          onToggleIRL={() => {}}
          onToggleHide={() => {}}
          onUpdate={() => {}}
          onFrameStyleChange={() => {}}
          onSizeChange={() => {}}
        />
      </StepBackMode>

      {/* Modals */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onReplace={() => setShowPaywall(false)}
        onUnlock={() => {
          upgradeToPremium();
          setShowPaywall(false);
          toast({ title: 'Welcome to Premium!', description: 'Your wall is now fully unlocked.' });
        }}
      />

      <ViewMode
        designs={filtered}
        isOpen={viewMode}
        startIndex={viewStartIndex}
        onClose={() => setViewMode(false)}
      />
    </div>
  );
};

export default MyWall;
