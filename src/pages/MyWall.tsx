import { useState, useCallback } from 'react';
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
import { DesignStatus, FrameStyle, WallBackground } from '@/types/wall';
import { Expand, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { toast } from '@/hooks/use-toast';

const bgStyles: Record<WallBackground, string> = {
  'warm-white': 'bg-background',
  'cream': 'bg-[hsl(38,30%,92%)]',
  'soft-gray': 'bg-[hsl(220,10%,92%)]',
  'charcoal': 'bg-[hsl(220,15%,22%)]',
  'paper': 'bg-[hsl(38,20%,88%)]',
  'linen': 'bg-[hsl(35,15%,85%)]',
};

const MyWall = () => {
  const navigate = useNavigate();
  const wall = useWall();
  const { isPremium, upgradeToPremium } = useUserTier();
  const [activeTab, setActiveTab] = useState<'all' | DesignStatus>('all');
  const [viewMode, setViewMode] = useState(false);
  const [viewStartIndex, setViewStartIndex] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  const filtered = activeTab === 'all'
    ? wall.designs
    : wall.designs.filter(d => d.status === activeTab);

  const handleOpen = useCallback((id: string) => {
    // For now, navigate to create (future: load design state)
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

  const isCharcoal = wall.settings.background === 'charcoal';

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className={`flex-1 overflow-y-auto ${bgStyles[wall.settings.background]} transition-colors`}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Customizer bar */}
          <WallCustomizer settings={wall.settings} onUpdate={wall.updateSettings} isPremium={isPremium} />

          {/* Tabs */}
          <div className="flex items-center gap-4 mt-5 mb-4">
            <div className="flex items-center gap-1 bg-secondary/60 rounded-lg p-0.5">
              {([['all', 'All'], ['in-progress', 'In Progress'], ['finished', 'Finished']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setActiveTab(val)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === val
                      ? 'bg-background text-foreground shadow-sm'
                      : `${isCharcoal ? 'text-background/60 hover:text-background' : 'text-muted-foreground hover:text-foreground'}`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {filtered.length > 0 && (
                <button
                  onClick={() => handleViewMode()}
                  className={`p-2 rounded-lg transition-colors ${isCharcoal ? 'hover:bg-background/10 text-background/60' : 'hover:bg-secondary text-muted-foreground'}`}
                  title="View mode"
                >
                  <Expand className="w-4 h-4" />
                </button>
              )}
              {isPremium && filtered.length > 0 && (
                <button
                  onClick={handleExportWall}
                  className={`p-2 rounded-lg transition-colors ${isCharcoal ? 'hover:bg-background/10 text-background/60' : 'hover:bg-secondary text-muted-foreground'}`}
                  title="Export wall as image"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Wall content */}
          {wall.designs.length === 0 ? (
            <EmptyWall />
          ) : (
            <div ref={wallRef}>
              <WallGrid
                designs={filtered}
                layout={wall.settings.layout}
                isPremium={isPremium}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onTogglePin={wall.togglePin}
                onToggleIRL={handleToggleIRL}
                onFrameStyleChange={handleFrameStyle}
              />
            </div>
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
      </div>

      {/* Modals */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onReplace={() => {
          // Will be called from save flow in editor
          setShowPaywall(false);
        }}
        onUnlock={() => {
          // TODO: Stripe payment
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
