import { useRef, useCallback, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStudio } from '@/hooks/useStudio';
import { useCustomTextures } from '@/hooks/useCustomTextures';
import { useCustomTemplate } from '@/hooks/useCustomTemplate';
import { useWall } from '@/hooks/useWall';
import { useUserTier } from '@/hooks/useUserTier';
import { Canvas } from '@/components/studio/Canvas';
import { TopToolbar } from '@/components/studio/TopToolbar';
import { BottomBar } from '@/components/studio/BottomBar';
import { BuildPanel } from '@/components/studio/BuildPanel';
import { TextureLibrary } from '@/components/studio/TextureLibrary';
import { PaywallModal } from '@/components/wall/PaywallModal';
import { FloatingToolbar } from '@/components/studio/FloatingToolbar';
import { GenerateVibeModal } from '@/components/studio/GenerateVibeModal';
import { AmbientSoundPlayer } from '@/components/wall/AmbientSound';
import { useGenerateVibe } from '@/hooks/useGenerateVibe';
import { Vibe } from '@/types/studio';
import { Monitor, X } from 'lucide-react';
import { AmbientSound as AmbientSoundType } from '@/types/wall';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextureTray } from '@/components/studio/MobileTextureTray';
import { StencilTray } from '@/components/studio/MobileStencilTray';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studio = useStudio();
  const { customTextures, addCustomTexture, removeCustomTexture } = useCustomTextures();
  const { customTemplate, templateOpacity, setTemplateOpacity, uploadTemplate, clearTemplate } = useCustomTemplate();
  const wall = useWall();
  const { isPremium, canSave, upgradeToPremium } = useUserTier();
  const vibeGen = useGenerateVibe();
  const canvasRef = useRef<HTMLDivElement>(null!);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [pendingSave, setPendingSave] = useState<{ preview: string; name: string; vibeName?: string; stencilCreator?: string } | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const draftKeyRef = useRef<string>(`draft-${Date.now()}`);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const isMobile = useIsMobile();
  const [showMobileBanner, setShowMobileBanner] = useState(true);
  const [stencilsPoppedOut, setStencilsPoppedOut] = useState(false);
  const [textureApplyMode, setTextureApplyMode] = useState<'swatch' | 'background'>('swatch');

  // Keyboard shortcut for focus mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setFocusMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Load design state when editing from wall
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const design = wall.designs.find(d => d.id === editId);
      if (design?.studioState) {
        studio.loadState(design.studioState);
        setEditingDesignId(editId);
        draftKeyRef.current = editId;
      }
    }
  }, []);

  // Auto-save as draft every 15 seconds when canvas has content
  useEffect(() => {
    const hasContent = studio.elements.length > 0 || Object.keys(studio.vibeFills).length > 0;
    if (!hasContent) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!canvasRef.current) return;
      try {
        const dataUrl = await toPng(canvasRef.current, { pixelRatio: 1 });
        const name = studio.activeVibe?.name || 'Untitled Draft';
        const vibeName = studio.activeVibe?.name;
        const stencilCreator = studio.activeVibe?.creator;
        const studioState = studio.getState();
        if (editingDesignId) {
          wall.updateDesign(editingDesignId, { previewImage: dataUrl, studioState, stencilCreator, updatedAt: new Date().toISOString() } as any);
        } else {
          wall.saveDraft(draftKeyRef.current, dataUrl, name, vibeName, studioState, stencilCreator);
        }
      } catch { /* silent fail */ }
    }, 15000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [studio.elements, studio.vibeFills, studio.activeVibe, studio.frameSize, studio.frameColor]);

  const handleDragStartLib = useCallback((textureId: string) => {}, []);

  const handleDrop = useCallback((textureId: string, x: number, y: number) => {
    studio.addElement(textureId, x, y);
  }, [studio]);

  // ── Table elements (swatches on the wood table outside the frame) ──
  const [tableElements, setTableElements] = useState<Array<{
    id: string; textureId: string; x: number; y: number;
    width: number; height: number; rotation: number;
  }>>([]);
  const tableIdRef = useRef(1);

  const handleTableDrop = useCallback((textureId: string, x: number, y: number) => {
    setTableElements(prev => [...prev, {
      id: `table-${tableIdRef.current++}`,
      textureId,
      x, y,
      width: 80,
      height: 80,
      rotation: Math.floor(Math.random() * 20) - 10,
    }]);
  }, []);

  const handleTableElementUpdate = useCallback((id: string, updates: any) => {
    setTableElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  }, []);

  const handleTableElementDelete = useCallback((id: string) => {
    setTableElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const handleMoveToTable = useCallback((elementId: string, x: number, y: number) => {
    const el = studio.elements.find(e => e.id === elementId);
    if (!el) return;
    // Add to table
    setTableElements(prev => [...prev, {
      id: `table-${tableIdRef.current++}`,
      textureId: el.textureId,
      x, y,
      width: el.width,
      height: el.height,
      rotation: el.rotation,
    }]);
    // Remove from canvas
    studio.deleteElement(elementId);
  }, [studio]);

  const handleSelectVibe = useCallback((vibe: Vibe) => {
    studio.selectVibe(vibe);
  }, [studio]);

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'shadow-box.png';
      link.href = dataUrl;
      link.click();
      toast({ title: 'Exported!', description: 'Your shadow box has been exported as PNG.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to export image.', variant: 'destructive' });
    }
  }, []);

  const handleSaveToWall = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 });
      const name = studio.activeVibe?.name || 'Untitled Design';
      const vibeName = studio.activeVibe?.name;
      const stencilCreator = studio.activeVibe?.creator;
      const studioState = studio.getState();

      if (editingDesignId) {
        wall.updateDesign(editingDesignId, { previewImage: dataUrl, name, vibeName, stencilCreator, studioState });
        toast({ title: 'Updated!', description: 'Your design has been updated on My Wall.' });
        return;
      }

      if (!canSave(wall.designs.length)) {
        setPendingSave({ preview: dataUrl, name, vibeName, stencilCreator });
        setShowPaywall(true);
        return;
      }

      const draftExists = wall.designs.find(d => d.id === draftKeyRef.current);
      if (draftExists) {
        wall.updateDesign(draftKeyRef.current, { previewImage: dataUrl, name, vibeName, stencilCreator, studioState, status: 'display' as any });
      } else {
        wall.addDesign(dataUrl, name, vibeName, studioState, stencilCreator);
      }
      toast({ title: 'Saved to Wall!', description: 'Your design has been added to My Wall.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save design.', variant: 'destructive' });
    }
  }, [studio, wall, canSave, editingDesignId]);

  const handleReplace = useCallback(() => {
    if (pendingSave) {
      wall.replaceDesign(pendingSave.preview, pendingSave.name, pendingSave.vibeName, undefined, pendingSave.stencilCreator);
      toast({ title: 'Design replaced!', description: 'Your old design was replaced with the new one.' });
    }
    setPendingSave(null);
    setShowPaywall(false);
  }, [pendingSave, wall]);

  const handleUnlock = useCallback(() => {
    upgradeToPremium();
    if (pendingSave) {
      wall.addDesign(pendingSave.preview, pendingSave.name, pendingSave.vibeName, undefined, pendingSave.stencilCreator);
    }
    setPendingSave(null);
    setShowPaywall(false);
    toast({ title: 'Welcome to Premium!', description: 'Your wall is now fully unlocked.' });
  }, [pendingSave, wall, upgradeToPremium]);

  const handleTextureClick = useCallback((textureId: string) => {
    if (textureApplyMode === 'background') {
      studio.setBackgroundTextureId(studio.backgroundTextureId === textureId ? null : textureId);
    } else if (studio.selectedSectionId) {
      studio.fillSection(studio.selectedSectionId, textureId);
    }
    // In 'swatch' mode with no section selected, clicking does nothing (drag to add)
  }, [studio.selectedSectionId, studio.fillSection, textureApplyMode, studio.setBackgroundTextureId, studio.backgroundTextureId]);

  const handleUploadTexture = useCallback(async (file: File) => {
    await addCustomTexture(file);
    toast({ title: 'Texture added!', description: `"${file.name}" is now available in your library.` });
  }, [addCustomTexture]);

  const handleUploadTemplate = useCallback(async (file: File) => {
    await uploadTemplate(file);
    toast({ title: 'Reference set!', description: 'Image is shown as a canvas background guide.' });
  }, [uploadTemplate]);

  const handleGenerateMood = useCallback(async (prompt: string) => {
    const result = await vibeGen.generateVibe(prompt);
    if (result) {
      if (studio.activeVibe) {
        studio.activeVibe.sections.forEach(section => {
          const toneTextures = section.tone === 'light' ? result.lightTextures
            : section.tone === 'medium' ? result.mediumTextures
            : section.tone === 'dark' ? result.darkTextures
            : result.accentTextures;
          if (toneTextures.length > 0) {
            const randomTex = toneTextures[Math.floor(Math.random() * toneTextures.length)];
            studio.fillSection(section.id, randomTex);
          }
        });
      }
      if (result.frameChoice) {
        const validFrameStyles = ['gold', 'chrome', 'copper', 'silver', 'minimal', 'shadow-box', 'wood', 'floating', 'polaroid', 'none'];
        if (validFrameStyles.includes(result.frameChoice)) {
          studio.setWallFrameStyle(result.frameChoice as any);
        }
      }
      toast({ title: `${result.emoji} ${result.name}`, description: 'Mood applied — textures auto-filled!' });
    }
  }, [vibeGen, studio]);

  // Panel opacity based on focus mode

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile banner */}
      {isMobile && showMobileBanner && (
        <div className="flex items-center justify-between px-3 py-2 bg-primary/10 border-b border-primary/20 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-primary">
            <Monitor className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Best experience on desktop — mobile app coming soon!</span>
          </div>
          <button onClick={() => setShowMobileBanner(false)} className="p-0.5 text-primary/60 hover:text-primary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top bar with nav + focus toggle */}
      <TopToolbar
        frameSize={studio.frameSize}
        frameColor={studio.frameColor}
        onFrameSizeChange={studio.setFrameSize}
        onFrameColorChange={studio.setFrameColor}
        wallFrameStyle={studio.wallFrameStyle}
        onWallFrameStyleChange={studio.setWallFrameStyle}
        onClear={studio.clearCanvas}
        onSave={handleExport}
        onSaveToWall={handleSaveToWall}
        ambientSound={ambientSound}
        onAmbientSoundChange={setAmbientSound}
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode(prev => !prev)}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ── Canvas area ── */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <Canvas
            elements={studio.elements}
            selectedId={studio.selectedId}
            frameSize={studio.frameSize}
            frameColor={studio.frameColor}
            wallFrameStyle={studio.wallFrameStyle}
            activeVibe={studio.activeVibe}
            vibeFills={studio.vibeFills}
            selectedSectionId={studio.selectedSectionId}
            customTemplate={customTemplate}
            templateOpacity={templateOpacity}
            customTextures={customTextures}
            backgroundTextureId={studio.backgroundTextureId}
            sectionTransforms={studio.sectionTransforms}
            tableElements={tableElements}
            onSelect={studio.setSelectedId}
            onUpdate={studio.updateElement}
            onDrop={handleDrop}
            onSelectSection={studio.selectSection}
            onDropInSection={studio.fillSection}
            onDropAsSwatch={handleDrop}
            onDetachSection={studio.detachSection}
            onDeleteSection={studio.deleteSection}
            onDuplicateSection={studio.duplicateSection}
            onUpdateSectionTransform={studio.updateSectionTransform}
            onDeleteElement={studio.deleteElement}
            onTableDrop={handleTableDrop}
            onTableElementUpdate={handleTableElementUpdate}
            onTableElementDelete={handleTableElementDelete}
            canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
            drawMode={studio.drawMode}
            onFinishDraw={studio.addCustomSection}
            onCancelDraw={() => studio.setDrawMode(false)}
          />

          {/* ── Mobile: Texture Tray (top overlay) ── */}
          {isMobile && (
            <TextureTray
              onDragStart={handleDragStartLib}
              onTextureClick={handleTextureClick}
              activeSectionId={studio.selectedSectionId}
              customTextures={customTextures}
              onUploadTexture={handleUploadTexture}
              onRemoveCustomTexture={removeCustomTexture}
              isPremium={isPremium}
              onRequestUpgrade={() => setShowPaywall(true)}
              focusMode={focusMode}
            />
          )}

          {/* ── Stencil Tray (floating, when popped out on desktop or always on mobile) ── */}
          {(isMobile || stencilsPoppedOut) && (
            <StencilTray
              activeVibeId={studio.activeVibe?.id ?? null}
              isPremium={isPremium}
              onSelectVibe={handleSelectVibe}
              onShuffleVibeFills={studio.shuffleVibeFills}
              onRequestUpgrade={() => setShowPaywall(true)}
              onGenerateMood={handleGenerateMood}
              isGeneratingMood={vibeGen.isGenerating}
              customTemplate={customTemplate}
              templateOpacity={templateOpacity}
              onUploadTemplate={handleUploadTemplate}
              onClearTemplate={clearTemplate}
              onTemplateOpacityChange={setTemplateOpacity}
              focusMode={focusMode}
              onDockBack={!isMobile ? () => setStencilsPoppedOut(false) : undefined}
            />
          )}
        </div>

        {/* ── Canvas/Frame bar ── */}
        {!isMobile && (
          <BottomBar
            frameSize={studio.frameSize}
            onFrameSizeChange={studio.setFrameSize}
            wallFrameStyle={studio.wallFrameStyle}
            onWallFrameStyleChange={studio.setWallFrameStyle}
            onClear={studio.clearCanvas}
            onSave={handleExport}
            onSaveToWall={handleSaveToWall}
            isPremium={isPremium}
            onRequestUpgrade={() => setShowPaywall(true)}
          />
        )}

        {/* ── Bottom panel: Textures (left) + Stencils (right) ── */}
        {!isMobile && (
          <div className="flex border-t border-border" style={{ height: '35%' }}>
            {/* Left half: Textures */}
            <div className="flex-1 overflow-hidden border-r border-border">
              <TextureLibrary
                onDragStart={handleDragStartLib}
                onTextureClick={handleTextureClick}
                activeSectionId={studio.selectedSectionId}
                customTextures={customTextures}
                onUploadTexture={handleUploadTexture}
                onRemoveCustomTexture={removeCustomTexture}
                isPremium={isPremium}
                onRequestUpgrade={() => setShowPaywall(true)}
                applyMode={textureApplyMode}
                onApplyModeChange={setTextureApplyMode}
                backgroundTextureId={studio.backgroundTextureId}
                drawMode={studio.drawMode}
                onToggleDrawMode={() => studio.setDrawMode(!studio.drawMode)}
                nextShape={studio.nextShape}
                onSetNextShape={studio.setNextShape}
              />
            </div>
            {/* Right half: Stencils or Element Editor */}
            <div className="flex-1 overflow-hidden">
              {studio.selectedId && studio.elements.find(e => e.id === studio.selectedId) ? (
                <div className="flex flex-col h-full bg-popover">
                  <div className="flex items-center gap-1.5 px-3 py-1 border-b border-border bg-secondary/30 shrink-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Edit Element</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <FloatingToolbar
                      element={studio.elements.find(e => e.id === studio.selectedId)!}
                      onUpdate={(updates) => studio.updateElement(studio.selectedId!, updates)}
                      onUpdateEffects={(effects) => studio.updateEffects(studio.selectedId!, effects)}
                      onDuplicate={() => studio.duplicateElement(studio.selectedId!)}
                      onDelete={() => studio.deleteElement(studio.selectedId!)}
                    />
                  </div>
                </div>
              ) : (
                <BuildPanel
                  isPremium={isPremium}
                  onRequestUpgrade={() => setShowPaywall(true)}
                  activeVibeId={studio.activeVibe?.id ?? null}
                  onSelectVibe={handleSelectVibe}
                  onShuffleVibeFills={studio.shuffleVibeFills}
                  onGenerateMood={handleGenerateMood}
                  isGeneratingMood={vibeGen.isGenerating}
                  customTemplate={customTemplate}
                  templateOpacity={templateOpacity}
                  onUploadTemplate={handleUploadTemplate}
                  onClearTemplate={clearTemplate}
                  onTemplateOpacityChange={setTemplateOpacity}
                  stencilsPoppedOut={stencilsPoppedOut}
                  onPopOutStencils={() => setStencilsPoppedOut(true)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom bar with compact controls + nav */}
      {isMobile && (
        <div className="flex items-center justify-between px-1.5 py-1 bg-popover border-t border-border safe-area-bottom">
          <div className="flex items-center gap-0.5">
            {(['8x8', '12x12', '16x16', 'gallery'] as const).map(s => (
              <button
                key={s}
                onClick={() => studio.setFrameSize(s)}
                className={`px-1.5 py-0.5 text-[8px] rounded-md transition-colors ${
                  studio.frameSize === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={studio.clearCanvas} className="px-1.5 py-0.5 text-[8px] text-destructive hover:bg-destructive/10 rounded-md">
              Clear
            </button>
            <button onClick={handleSaveToWall} className="px-1.5 py-0.5 text-[8px] text-foreground hover:bg-secondary rounded-md">
              Save
            </button>
            <button
              onClick={() => isPremium ? handleExport() : setShowPaywall(true)}
              className="px-2 py-0.5 text-[8px] font-medium bg-primary text-primary-foreground rounded-md"
            >
              Export
            </button>
          </div>
        </div>
      )}

      <AmbientSoundPlayer sound={ambientSound} showControl={ambientSound !== 'none'} />

      <GenerateVibeModal
        isOpen={showVibeModal}
        isGenerating={vibeGen.isGenerating}
        generatedVibe={vibeGen.generatedVibe}
        onClose={() => { setShowVibeModal(false); vibeGen.setGeneratedVibe(null); }}
        onGenerate={(prompt) => vibeGen.generateVibe(prompt)}
        onApply={() => {
          if (vibeGen.generatedVibe) {
            const vibe = vibeGen.toVibe(vibeGen.generatedVibe);
            studio.selectVibe(vibe);
            if (vibeGen.generatedVibe.frameChoice) {
              const fc = vibeGen.generatedVibe.frameChoice as any;
              const validFrameStyles = ['gold', 'chrome', 'copper', 'silver', 'minimal', 'shadow-box', 'wood', 'floating', 'polaroid', 'none'];
              if (validFrameStyles.includes(fc)) {
                studio.setWallFrameStyle(fc);
              }
            }
          }
          setShowVibeModal(false);
          vibeGen.setGeneratedVibe(null);
        }}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => { setShowPaywall(false); setPendingSave(null); }}
        onReplace={handleReplace}
        onUnlock={handleUnlock}
      />

      <svg className="svg-filters" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="wrinkle-light">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" />
          </filter>
          <filter id="wrinkle-medium">
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="6" />
          </filter>
          <filter id="wrinkle-heavy">
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Index;
