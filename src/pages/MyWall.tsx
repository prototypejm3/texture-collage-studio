import { useState, useCallback, useRef, useEffect } from 'react';
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
import { FloatingMusicButton } from '@/components/studio/FloatingMusicButton';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { DesignStatus, DesignSize, FrameStyle, HangingStyle, WallBackground, SavedDesign } from '@/types/wall';
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
  'sky-blue': 'wall-bg-sky-blue',
  'mint': 'wall-bg-mint',
  'blush': 'wall-bg-blush',
  'red': 'wall-bg-red',
  'green': 'wall-bg-green',
  'floral': 'wall-bg-floral',
  'custom': '',
};

function KidWallIcon({ type }: { type: string }) {
  switch (type) {
    case 'cloud':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><ellipse cx="15" cy="22" rx="7" ry="5" fill="white"/><ellipse cx="22" cy="19" rx="8" ry="6" fill="white"/><ellipse cx="28" cy="22" rx="6" ry="4.5" fill="white"/><line x1="8" y1="30" x2="32" y2="30" stroke="#e2ddd6" strokeWidth="1"/></svg>);
    case 'sunset':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><circle cx="20" cy="20" r="7" fill="#fbbf24"/><line x1="20" y1="7" x2="20" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="29" x2="20" y2="33" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="14" x2="12" y2="17" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/><line x1="28" y1="23" x2="31" y2="26" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/><line x1="28" y1="14" x2="31" y2="11" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/></svg>);
    case 'sage':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><rect x="15" y="26" width="10" height="8" rx="2" fill="#c4956a"/><line x1="20" y1="12" x2="20" y2="26" stroke="#6b8a5e" strokeWidth="1.5"/><ellipse cx="16" cy="18" rx="4" ry="3" fill="#22c55e" transform="rotate(-20 16 18)"/><ellipse cx="24" cy="16" rx="4" ry="3" fill="#4ade80" transform="rotate(20 24 16)"/><ellipse cx="20" cy="13" rx="3.5" ry="2.5" fill="#22c55e"/></svg>);
    case 'blush':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 30 C20 30, 8 20, 8 15 C8 10, 13 8, 20 14 C27 8, 32 10, 32 15 C32 20, 20 30, 20 30Z" fill="#f9a8d4"/><path d="M14 10 C14 10, 10 7, 10 5.5 C10 4, 12 3, 14 5 C16 3, 18 4, 18 5.5 C18 7, 14 10, 14 10Z" fill="#f472b6"/><path d="M27 9 C27 9, 24.5 7, 24.5 6 C24.5 5, 25.5 4.5, 27 5.5 C28.5 4.5, 29.5 5, 29.5 6 C29.5 7, 27 9, 27 9Z" fill="#f472b6"/></svg>);
    case 'apple':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><path d="M20 10 C14 10, 10 15, 10 22 C10 29, 15 33, 20 33 C25 33, 30 29, 30 22 C30 15, 26 10, 20 10Z" fill="#e05c5c"/><ellipse cx="16" cy="18" rx="3" ry="4" fill="white" opacity="0.3"/><line x1="20" y1="10" x2="20" y2="7" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="23" cy="8" rx="3" ry="2" fill="#22c55e" transform="rotate(30 23 8)"/></svg>);
    case 'forest':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><ellipse cx="20" cy="14" rx="8" ry="7" fill="#22c55e"/><ellipse cx="15" cy="18" rx="5" ry="4" fill="#4ade80"/><ellipse cx="25" cy="18" rx="5" ry="4" fill="#4ade80"/><ellipse cx="20" cy="11" rx="5" ry="4" fill="#16a34a"/><rect x="18" y="24" width="4" height="8" rx="1" fill="#c4956a"/></svg>);
    case 'linen':
      return (<svg viewBox="0 0 40 40" className="w-full h-full"><ellipse cx="20" cy="24" rx="10" ry="11" fill="#c4956a"/><ellipse cx="20" cy="27" rx="6" ry="7" fill="#d9a97c"/><circle cx="14" cy="14" r="4" fill="#c4956a"/><circle cx="26" cy="14" r="4" fill="#c4956a"/><circle cx="14" cy="14" r="2" fill="#d9a97c"/><circle cx="26" cy="14" r="2" fill="#d9a97c"/></svg>);
    default: return null;
  }
}

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

  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);
  const wallDesigns = wall.designs.filter(d => (d.wallId || 'wall-default') === multiWall.activeWallId);

  const filtered = activeTab === 'all'
    ? wallDesigns
    : wallDesigns.filter(d => d.status === activeTab);

  const currentSettings = multiWall.activeWall.settings;
  const isDark = false;
  const wallBgClass = currentSettings.background !== 'custom' ? bgStyles[currentSettings.background] : '';
  const wallBgStyle = currentSettings.background === 'custom' && currentSettings.customWallImage
    ? currentSettings.customWallImage.startsWith('#') || currentSettings.customWallImage.startsWith('rgb')
      ? { backgroundColor: currentSettings.customWallImage } as React.CSSProperties
      : { backgroundImage: `url(${currentSettings.customWallImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties
    : undefined;

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
    const MARGIN_X = 10;
    const MARGIN_Y = 12;

    // Size dimensions in % of wall
    const tierW: Record<DesignSize, number> = { small: 15, medium: 20, large: 26 };
    const tierH: Record<DesignSize, number> = { small: 17, medium: 22, large: 28 };
    const GAP = 3; // minimum gap between pieces in %

    interface Rect { x: number; y: number; w: number; h: number }
    interface Slot { x: number; y: number; size: DesignSize }

    function rectsOverlap(a: Rect, b: Rect): boolean {
      return !(a.x + a.w + GAP <= b.x || b.x + b.w + GAP <= a.x ||
               a.y + a.h + GAP <= b.y || b.y + b.h + GAP <= a.y);
    }

    function slotToRect(s: Slot): Rect {
      const w = tierW[s.size];
      const h = tierH[s.size];
      return { x: s.x - w / 2, y: s.y - h / 2, w, h };
    }

    function slotsOverlap(slots: Slot[]): boolean {
      const rects = slots.map(slotToRect);
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          if (rectsOverlap(rects[i], rects[j])) return true;
        }
      }
      return false;
    }

    // Grid-based placement: arrange pieces in rows with guaranteed no overlap
    function gridLayout(pieces: SavedDesign[], heroIdx: number): Slot[] {
      const slots: Slot[] = [];
      const placed: Rect[] = [];

      // Determine sizes: hero gets 'large', others alternate medium/small
      const sizes: DesignSize[] = pieces.map((_, i) =>
        i === heroIdx ? 'large' : (pieces.length <= 4 ? 'medium' : 'small')
      );

      // Sort by size descending for better packing (hero first)
      const indices = pieces.map((_, i) => i);
      indices.sort((a, b) => {
        if (a === heroIdx) return -1;
        if (b === heroIdx) return 1;
        return tierW[sizes[b]] - tierW[sizes[a]];
      });

      // Place each piece, scanning for first non-overlapping position
      for (const idx of indices) {
        const size = sizes[idx];
        const w = tierW[size];
        const h = tierH[size];
        let bestSlot: Slot | null = null;

        // Scan rows then columns for first fit
        for (let cy = MARGIN_Y + h / 2; cy + h / 2 <= 100 - MARGIN_Y; cy += 5) {
          for (let cx = MARGIN_X + w / 2; cx + w / 2 <= 100 - MARGIN_X; cx += 4) {
            const candidate: Rect = { x: cx - w / 2, y: cy - h / 2, w, h };
            const overlaps = placed.some(r => rectsOverlap(candidate, r));
            if (!overlaps) {
              bestSlot = { x: cx, y: cy, size };
              break;
            }
          }
          if (bestSlot) break;
        }

        if (!bestSlot) {
          // Fallback: stack at bottom
          const cy = placed.length > 0
            ? Math.max(...placed.map(r => r.y + r.h)) + GAP + h / 2
            : 50;
          bestSlot = { x: 50, y: Math.min(cy, 90), size };
        }

        slots[idx] = bestSlot;
        placed.push(slotToRect(bestSlot));
      }

      return slots;
    }

    // Use predefined templates for small counts, grid for larger
    let allSlots: Slot[];

    if (count === 1) {
      allSlots = [{ x: 50, y: 45, size: 'large' }];
    } else if (count === 2) {
      allSlots = gridLayout([hero, ...others], 0);
    } else if (count === 3) {
      allSlots = gridLayout([hero, ...others], 0);
    } else {
      allSlots = gridLayout([hero, ...others], 0);
    }

    // Apply positions
    const allPieces = [hero, ...others];
    allPieces.forEach((d, i) => {
      if (i < allSlots.length) {
        wall.updateDesign(d.id, {
          wallX: allSlots[i].x,
          wallY: allSlots[i].y,
          displaySize: allSlots[i].size,
          rotation: 0,
          hangingStyle: wallHanging,
        });
      }
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
                      <Plus className="w-3 h-3" /> {kidMode ? 'New Room' : 'New Wall'} {!isPremium && '🔒'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Kid mode: simplified controls. Adult mode: full customizer */}
          {kidMode ? (
            <div className="flex flex-wrap items-center gap-3 px-1">
              <div className="mr-auto" />
              {/* Wall background circles — illustrated icons */}
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-semibold" style={{ color: 'hsl(var(--toybox-text))' }}>🎨 Wall:</span>
                {([
                  { value: 'white-brick' as WallBackground, label: '☁️ Cloud', fill: '#f5f5f0', borderColor: '#e2ddd6', icon: 'cloud' },
                  { value: 'wood-birch-wall' as WallBackground, label: '☀️ Sunset', fill: '#fef3e8', borderColor: '#e2ddd6', icon: 'sunset' },
                  { value: 'mint' as WallBackground, label: '🌿 Sage', fill: '#edf4ed', borderColor: '#e2ddd6', icon: 'sage' },
                  { value: 'blush' as WallBackground, label: '💕 Blush', fill: '#fdf0f0', borderColor: '#e2ddd6', icon: 'blush' },
                  { value: 'red' as WallBackground, label: '🍎 Apple', fill: '#fdf0f0', borderColor: '#e2ddd6', icon: 'apple' },
                  { value: 'green' as WallBackground, label: '🌲 Forest', fill: '#e8f4e8', borderColor: '#e2ddd6', icon: 'forest' },
                  { value: 'wood-oak-wall' as WallBackground, label: '🧸 Linen', fill: '#f5ede0', borderColor: '#e2ddd6', icon: 'linen' },
                ] as const).map(bg => {
                  const isSelected = currentSettings.background === bg.value;
                  return (
                    <button
                      key={bg.value}
                      onClick={() => handleUpdateSettings({ background: bg.value })}
                      className="relative rounded-full transition-transform hover:scale-110 overflow-hidden flex-shrink-0"
                      style={{
                        width: 56, height: 56,
                        backgroundColor: bg.fill,
                        border: `2.5px solid ${isSelected ? '#f97316' : bg.borderColor}`,
                      }}
                      title={bg.label}
                    >
                      <KidWallIcon type={bg.icon} />
                    </button>
                  );
                })}
              </div>
              {/* Magic arrange */}
              <button
                onClick={handleAutoCurate}
                className="px-3 py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                ✨ Magic!
              </button>
              {/* Step back / view */}
              <button
                onClick={() => setStepBackMode(true)}
                className="px-3 py-2 rounded-full bg-popover text-foreground font-semibold text-xs border border-border shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                👀 Look!
              </button>
            </div>
          ) : (
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
          )}

          {/* Tabs + controls */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-6 md:mt-8 mb-6 md:mb-8">
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              {kidMode ? (
                // Kid-simplified tabs
                <>
                  {([
                    ['all', '🎨 My Art'],
                    ['display', '⭐ On Wall'],
                    ['hidden', '📦 In Box'],
                  ] as const).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setActiveTab(val)}
                      className={`px-4 py-2 text-sm font-bold rounded-full border-2 shadow-sm transition-all hover:scale-105 ${
                        activeTab === val
                          ? 'bg-primary text-primary-foreground border-primary scale-105'
                          : 'bg-popover text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </>
              ) : (
                // Adult tabs
                <>
                  {([
                    ['all', 'All'],
                    ['display', 'Display'],
                    ['hidden', 'Hidden'],
                    ['draft', 'Draft'],
                  ] as const).map(([val, label]) => (
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
                </>
              )}
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
                          <Expand className="w-3 h-3" /> {kidMode ? '👀 Look!' : 'View Mode'}
                        </button>
                        {isPremium && (
                          <button
                            onClick={() => { handleExportWall(); setShowControls(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground"
                          >
                            <Download className="w-3 h-3" /> {kidMode ? '📸 Save Picture' : 'Export Wall'}
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
                kidMode={kidMode}
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
      <FloatingMusicButton
        kidMode={kidMode}
        ambientSound={currentSettings.ambientSound || 'none'}
        onAmbientSoundChange={(sound) => handleUpdateSettings({ ambientSound: sound })}
      />
    </div>
  );
};

export default MyWall;
