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
import { ArtistNoteModal } from '@/components/wall/ArtistNoteModal';
import { NavBar } from '@/components/NavBar';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { DesignStatus, DesignSize, FrameStyle, HangingStyle, WallBackground } from '@/types/wall';
import { Expand, Download, MoreHorizontal, Plus, Trash2, ChevronDown, Pencil, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const bgStyles: Record<WallBackground, string> = {
  'brick': 'wall-bg-brick',
  'concrete': 'wall-bg-concrete',
  'limewash': 'wall-bg-limewash',
  'white-brick': 'wall-bg-white-brick',
  'clean-white': 'wall-bg-clean-white',
  'speckled-white': 'wall-bg-speckled-white',
  'wood-birch-wall': 'wall-bg-wood-birch-wall',
  'wood-oak-wall': 'wall-bg-wood-oak-wall',
  'wood-walnut-wall': 'wall-bg-wood-walnut-wall',
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
  const [gallerySubmitId, setGallerySubmitId] = useState<string | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  const wallDesigns = wall.designs.filter(d => (d.wallId || 'wall-default') === multiWall.activeWallId);

  const filtered = activeTab === 'all'
    ? wallDesigns
    : wallDesigns.filter(d => d.status === activeTab);

  const currentSettings = multiWall.activeWall.settings;
  const isDark = false;
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
    setActiveTab('all');
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

    // ── 2. Enforce uniform hanging style & 0° rotation ──
    const wallHanging = currentSettings.defaultHangingStyle || 'floating';

    // ── 3. Layout constants (percentage-based) ──
    const SPACING = 6;       // % gap between frames
    const MARGIN_X = 12;     // % padding from left/right edges
    const MARGIN_Y = 15;     // % padding from top/bottom edges

    // Size widths/heights in % for collision detection
    const tierWidth: Record<DesignSize, number> = { small: 14, medium: 18, large: 24 };
    const tierHeight: Record<DesignSize, number> = { small: 16, medium: 20, large: 26 };

    // ── 4. Gallery row templates — structured, balanced, no overlap ──
    interface Slot { x: number; y: number; size: DesignSize }

    function buildLayout(heroSlot: Slot, otherSlots: Slot[]): void {
      // Place hero
      wall.updateDesign(hero.id, {
        wallX: heroSlot.x,
        wallY: heroSlot.y,
        displaySize: heroSlot.size,
        rotation: 0,
        hangingStyle: wallHanging,
      });

      // Place others
      others.forEach((d, i) => {
        if (i < otherSlots.length) {
          wall.updateDesign(d.id, {
            wallX: otherSlots[i].x,
            wallY: otherSlots[i].y,
            displaySize: otherSlots[i].size,
            rotation: 0,
            hangingStyle: wallHanging,
          });
        }
      });
    }

    if (count === 1) {
      // Single piece centered
      buildLayout({ x: 50, y: 45, size: 'large' }, []);
    } else if (count === 2) {
      // Hero center-left, supporting center-right, aligned on same baseline
      buildLayout(
        { x: 38, y: 45, size: 'large' },
        [{ x: 65, y: 47, size: 'medium' }]
      );
    } else if (count === 3) {
      // Hero centered, flanked by two supporting pieces
      buildLayout(
        { x: 50, y: 45, size: 'large' },
        [
          { x: 22, y: 47, size: 'medium' },
          { x: 78, y: 47, size: 'medium' },
        ]
      );
    } else if (count === 4) {
      // Top row: 2 small pieces, Middle: hero, Bottom: 1 piece
      buildLayout(
        { x: 50, y: 42, size: 'large' },
        [
          { x: 25, y: 25, size: 'small' },
          { x: 75, y: 25, size: 'small' },
          { x: 50, y: 72, size: 'medium' },
        ]
      );
    } else if (count === 5) {
      // Top row: 2 pieces, Middle: hero, Bottom: 2 pieces
      buildLayout(
        { x: 50, y: 45, size: 'large' },
        [
          { x: 25, y: 22, size: 'small' },
          { x: 75, y: 22, size: 'small' },
          { x: 28, y: 72, size: 'medium' },
          { x: 72, y: 72, size: 'medium' },
        ]
      );
    } else if (count === 6) {
      // Top: 2, Middle: hero + 1, Bottom: 2
      buildLayout(
        { x: 38, y: 45, size: 'large' },
        [
          { x: 30, y: 20, size: 'small' },
          { x: 70, y: 20, size: 'small' },
          { x: 72, y: 47, size: 'medium' },
          { x: 28, y: 74, size: 'small' },
          { x: 68, y: 74, size: 'small' },
        ]
      );
    } else {
      // 7+ pieces: 3-row grid distribution
      const topCount = Math.ceil((count - 1) / 2);
      const bottomCount = others.length - topCount;

      const heroSlot: Slot = { x: 50, y: 45, size: 'large' };
      const otherSlots: Slot[] = [];

      // Top row — evenly distributed
      for (let i = 0; i < topCount; i++) {
        const cols = Math.min(topCount, 4);
        const segW = (100 - MARGIN_X * 2) / (cols + 1);
        const x = MARGIN_X + segW * ((i % cols) + 1);
        const row = Math.floor(i / cols);
        otherSlots.push({ x, y: MARGIN_Y + row * (tierHeight.small + SPACING), size: 'small' });
      }

      // Bottom row — evenly distributed
      for (let i = 0; i < bottomCount; i++) {
        const cols = Math.min(bottomCount, 4);
        const segW = (100 - MARGIN_X * 2) / (cols + 1);
        const x = MARGIN_X + segW * ((i % cols) + 1);
        const row = Math.floor(i / cols);
        otherSlots.push({ x, y: 70 + row * (tierHeight.small + SPACING), size: 'small' });
      }

      buildLayout(heroSlot, otherSlots);
    }

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

  const handleSubmitToGallery = useCallback((designId: string) => {
    setGallerySubmitId(designId);
  }, []);

  const handleConfirmGallerySubmit = useCallback(async (artistNote: string) => {
    if (!gallerySubmitId) return;
    const design = wall.designs.find(d => d.id === gallerySubmitId);
    if (!design) return;
    const submissionId = await gallery.submitToGallery({
      name: design.name,
      description: artistNote || design.description,
      artist_name: design.artist || 'Anonymous',
      preview_image: design.previewImage,
      frame_style: design.frameStyle,
      display_size: design.displaySize || 'medium',
    });
    if (submissionId) {
      wall.updateDesign(gallerySubmitId, { gallerySubmissionId: submissionId });
    }
    setGallerySubmitId(null);
  }, [gallerySubmitId, wall, gallery]);

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
        className={`flex-1 overflow-y-auto ${wallBgClass} transition-colors duration-500 relative pb-16 md:pb-0`}
        style={wallBgStyle}
      >
        {/* Lighting overlay */}
        <LightingOverlay preset={currentSettings.lightingPreset || 'none'} />

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 relative z-[6]">
          {/* Wall picker + customizer */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <button
                onClick={() => setShowWallPicker(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-popover text-popover-foreground shadow-sm transition-colors text-xs hover:bg-secondary"
              >
                {multiWall.activeWall.settings.title}
                <ChevronDown className="w-3 h-3" />
                {multiWall.walls.length > 1 && (
                  <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full border border-border bg-secondary text-secondary-foreground">
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
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-6 md:mt-8 mb-6 md:mb-8">
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              {([['all', 'All'], ['display', 'Display'], ['hidden', 'Hidden'], ['draft', 'Draft']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setActiveTab(val)}
                  className={`px-3 md:px-4 py-1.5 text-[11px] md:text-xs font-semibold rounded-full border shadow-sm transition-all ${
                    activeTab === val
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-popover text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
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
                    className="p-2 rounded-full border border-border bg-popover text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
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

      <ArtistNoteModal
        isOpen={!!gallerySubmitId}
        designName={wall.designs.find(d => d.id === gallerySubmitId)?.name || ''}
        onSubmit={handleConfirmGallerySubmit}
        onClose={() => setGallerySubmitId(null)}
      />
      <OnboardingTutorial page="wall" />
    </div>
  );
};

export default MyWall;
