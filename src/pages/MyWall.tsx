import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWall } from '@/hooks/useWall';
import { useUserTier } from '@/hooks/useUserTier';
import { WallGrid } from '@/components/wall/WallGrid';
import { WallCustomizer } from '@/components/wall/WallCustomizer';
import { EmptyWall } from '@/components/wall/EmptyWall';
import { PaywallModal } from '@/components/wall/PaywallModal';
import { ViewMode } from '@/components/wall/ViewMode';
import { PreviewWall } from '@/components/wall/PreviewWall';
import { NavBar } from '@/components/NavBar';
import { DesignStatus, DesignSize, FrameStyle, FrameTexture, WallBackground } from '@/types/wall';
import { Expand, Download, MoreHorizontal } from 'lucide-react';
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
};

const MyWall = () => {
  const navigate = useNavigate();
  const wall = useWall();
  const { isPremium, upgradeToPremium } = useUserTier();
  const [activeTab, setActiveTab] = useState<'all' | DesignStatus>('all');
  const [viewMode, setViewMode] = useState(false);
  const [viewStartIndex, setViewStartIndex] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  const filtered = activeTab === 'all'
    ? wall.designs
    : wall.designs.filter(d => d.status === activeTab);

  const isDark = ['black-brick', 'black-concrete', 'red-velvet', 'dark-brick', 'black-stone', 'navy-fabric'].includes(wall.settings.background);

  const handleOpen = useCallback((id: string) => {
    navigate('/');
  }, [navigate]);

  const handleDuplicate = useCallback((id: string) => {
    if (!isPremium && wall.designs.length >= 1) {
      setShowPaywall(true);
      return;
    }
    wall.duplicateDesign(id);
  }, [isPremium, wall]);

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

  const handleFrameTexture = useCallback((id: string, texture: FrameTexture) => {
    wall.updateDesign(id, { frameTexture: texture });
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`flex-1 overflow-y-auto ${bgStyles[wall.settings.background]} transition-colors duration-500`}
      >
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Customizer — minimal top bar */}
          <WallCustomizer settings={wall.settings} onUpdate={wall.updateSettings} onApplyFrameToAll={wall.applyFrameToAll} isPremium={isPremium} />

          {/* Tabs + controls — clean */}
          <div className="flex items-center gap-4 mt-8 mb-8">
            <div className={`flex items-center gap-0.5 rounded-lg p-0.5 ${isDark ? 'bg-background/10' : 'bg-secondary/40'}`}>
              {([['all', 'All'], ['in-progress', 'In Progress'], ['finished', 'Finished']] as const).map(([val, label]) => (
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

            {/* Grouped controls — single ••• toggle */}
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
          {wall.designs.length === 0 ? (
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
                layout={wall.settings.layout}
                isPremium={isPremium}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onTogglePin={wall.togglePin}
                onToggleIRL={handleToggleIRL}
                onToggleHide={wall.toggleHide}
                onUpdate={wall.updateDesign}
                onFrameStyleChange={handleFrameStyle}
                onFrameTextureChange={handleFrameTexture}
                onSizeChange={handleSizeChange}
              />
            </motion.div>
          )}

          {/* Preview wall for free users */}
          {!isPremium && wall.designs.length > 0 && (
            <PreviewWall
              designs={wall.designs}
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
