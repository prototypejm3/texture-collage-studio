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
import { NavBar } from '@/components/NavBar';
import { DesignStatus, DesignSize, FrameStyle, WallBackground } from '@/types/wall';
import { Expand, Download, MoreHorizontal, Plus, Trash2, ChevronDown } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'all' | DesignStatus>('all');
  const [viewMode, setViewMode] = useState(false);
  const [viewStartIndex, setViewStartIndex] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showWallPicker, setShowWallPicker] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  // Filter designs by active wall
  const wallDesigns = wall.designs.filter(d => (d.wallId || 'wall-default') === multiWall.activeWallId);

  const filtered = activeTab === 'all'
    ? wallDesigns
    : wallDesigns.filter(d => d.status === activeTab);

  const currentSettings = multiWall.activeWall.settings;
  const isDark = ['black-brick', 'black-concrete', 'dark-brick', 'black-stone'].includes(currentSettings.background);

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
    // Only apply to designs on this wall
    wallDesigns.forEach(d => wall.updateDesign(d.id, { frameStyle: style }));
  }, [wallDesigns, wall]);

  const handleAddWall = useCallback(() => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    multiWall.addWall();
    toast({ title: 'New wall created!' });
  }, [isPremium, multiWall]);

  const handleDeleteWall = useCallback((wallId: string) => {
    if (multiWall.walls.length <= 1) return;
    // Delete all designs on this wall
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
        className={`flex-1 overflow-y-auto ${currentSettings.background !== 'custom' ? bgStyles[currentSettings.background] : ''} transition-colors duration-500`}
        style={currentSettings.background === 'custom' && currentSettings.customWallImage ? {
          backgroundImage: `url(${currentSettings.customWallImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Wall picker + customizer */}
          <div className="flex items-center gap-3 mb-2">
            {/* Wall switcher */}
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
                  <div className="fixed inset-0 z-40" onClick={() => setShowWallPicker(false)} />
                  <div className="absolute left-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                    {multiWall.walls.map(w => (
                      <div key={w.id} className="flex items-center">
                        <button
                          onClick={() => { multiWall.setActiveWallId(w.id); setShowWallPicker(false); }}
                          className={`flex-1 text-left px-3 py-1.5 text-xs hover:bg-secondary ${
                            w.id === multiWall.activeWallId ? 'text-primary font-medium' : 'text-foreground'
                          }`}
                        >
                          {w.settings.title}
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

            {/* Grouped controls */}
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
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onTogglePin={wall.togglePin}
                onToggleIRL={handleToggleIRL}
                onToggleHide={wall.toggleHide}
                onUpdate={wall.updateDesign}
                onFrameStyleChange={handleFrameStyle}
                onSizeChange={handleSizeChange}
              />
            </motion.div>
          )}

          {/* Preview wall for free users */}
          {!isPremium && wallDesigns.length > 0 && (
            <PreviewWall
              designs={wallDesigns}
              isPremium={isPremium}
              onUnlock={() => setShowPaywall(true)}
            />
          )}
        </div>
      </motion.div>

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
