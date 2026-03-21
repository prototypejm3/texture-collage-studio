import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStudio } from '@/hooks/useStudio';
import { useCustomTextures } from '@/hooks/useCustomTextures';
import { useCustomTemplate } from '@/hooks/useCustomTemplate';
import { useWall } from '@/hooks/useWall';
import { useUserTier } from '@/hooks/useUserTier';
import { Canvas, TableSurface, TableElement } from '@/components/studio/Canvas';
import { TopToolbar } from '@/components/studio/TopToolbar';
import { BottomBar } from '@/components/studio/BottomBar';
import { BuildPanel } from '@/components/studio/BuildPanel';
import { TextureLibrary } from '@/components/studio/TextureLibrary';
import { PaywallModal } from '@/components/wall/PaywallModal';
import { FloatingToolbar } from '@/components/studio/FloatingToolbar';
import { GenerateVibeModal } from '@/components/studio/GenerateVibeModal';
import { AmbientSoundPlayer } from '@/components/wall/AmbientSound';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { vibes } from '@/data/vibes';
import { letterStencils, numberSymbolStencils } from '@/data/letterStencils';

const allStencilVibesForDesk = [...vibes, ...letterStencils, ...numberSymbolStencils];
import { useGenerateVibe } from '@/hooks/useGenerateVibe';
import { Vibe } from '@/types/studio';
import { Monitor, X } from 'lucide-react';
import { AmbientSound as AmbientSoundType } from '@/types/wall';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useKidSounds } from '@/hooks/useKidSounds';
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
  const sounds = useKidSounds();
  const [showMobileBanner, setShowMobileBanner] = useState(true);
  const [stencilsPoppedOut, setStencilsPoppedOut] = useState(false);
  const [stencilsCollapsed, setStencilsCollapsed] = useState(() => {
    try { return localStorage.getItem('stencils-collapsed') === 'true'; } catch { return false; }
  });
  const [textureApplyMode, setTextureApplyMode] = useState<'swatch' | 'background'>('swatch');
  const [tableSurface, setTableSurface] = useState<TableSurface>('birch');
  const [easelMode, setEaselMode] = useState(true);
  const [workstationName, setWorkstationName] = useState(() => {
    return localStorage.getItem('workstationName') || '';
  });
  const handleWorkstationNameChange = useCallback((name: string) => {
    setWorkstationName(name);
    localStorage.setItem('workstationName', name);
  }, []);

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
    sounds.playPop();
    sounds.trackAction();
  }, [studio, sounds]);

  // ── Table elements (swatches on the wood table outside the frame) ──
  const [tableElements, setTableElements] = useState<TableElement[]>([]);
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

  const handleStencilTableDrop = useCallback((vibeId: string, x: number, y: number) => {
    setTableElements(prev => [...prev, {
      id: `table-${tableIdRef.current++}`,
      textureId: '',
      vibeId,
      x, y,
      width: 100,
      height: 100,
      rotation: Math.floor(Math.random() * 10) - 5,
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
    // Add to table, preserving clip path, shape, and effects
    setTableElements(prev => [...prev, {
      id: `table-${tableIdRef.current++}`,
      textureId: el.textureId,
      x, y,
      width: el.width,
      height: el.height,
      rotation: el.rotation,
      clipPathD: el.clipPathD,
      shape: el.shape,
      effects: { ...el.effects },
    }]);
    // Remove from canvas
    studio.deleteElement(elementId);
  }, [studio]);

  // ── Stencil section operations on desk ──
  const handleDuplicateStencilSection = useCallback((vibeId: string, sectionId: string, parentElement: TableElement) => {
    // Find the vibe to get section path
    const vibe = allStencilVibesForDesk.find((v: any) => v.id === vibeId);
    if (!vibe) return;
    const section = vibe.sections.find((s: any) => s.id === sectionId);
    if (!section) return;

    // Parse viewBox and section path to compute relative position
    const vb = vibe.viewBox.split(' ').map(Number);
    const nums = section.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      minX = Math.min(minX, nums[i]);
      maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]);
      maxY = Math.max(maxY, nums[i + 1]);
    }
    const scaleX = parentElement.width / vb[2];
    const scaleY = parentElement.height / vb[3];
    const w = (maxX - minX) * scaleX;
    const h = (maxY - minY) * scaleY;

    setTableElements(prev => [...prev, {
      id: `table-${tableIdRef.current++}`,
      textureId: '',
      vibeId,
      x: parentElement.x + 20 + (minX - vb[0]) * scaleX,
      y: parentElement.y + 20 + (minY - vb[1]) * scaleY,
      width: Math.max(w, 30),
      height: Math.max(h, 30),
      rotation: 0,
      clipPathD: section.path,
    }]);
  }, []);

  const handleDetachStencilSection = useCallback((vibeId: string, sectionId: string, parentElement: TableElement) => {
    const vibe = allStencilVibesForDesk.find((v: any) => v.id === vibeId);
    if (!vibe) return;
    const section = vibe.sections.find((s: any) => s.id === sectionId);
    if (!section) return;

    const vb = vibe.viewBox.split(' ').map(Number);
    const nums = section.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      minX = Math.min(minX, nums[i]);
      maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]);
      maxY = Math.max(maxY, nums[i + 1]);
    }
    const scaleX = parentElement.width / vb[2];
    const scaleY = parentElement.height / vb[3];
    const w = (maxX - minX) * scaleX;
    const h = (maxY - minY) * scaleY;

    // Create detached piece on desk
    setTableElements(prev => [...prev, {
      id: `table-${tableIdRef.current++}`,
      textureId: '',
      vibeId,
      x: parentElement.x + (minX - vb[0]) * scaleX,
      y: parentElement.y + (minY - vb[1]) * scaleY,
      width: Math.max(w, 30),
      height: Math.max(h, 30),
      rotation: parentElement.rotation,
      clipPathD: section.path,
    }]);
  }, []);

  // Selected table element for editing
  const [selectedTableElId, setSelectedTableElId] = useState<string | null>(null);
  const selectedTableElement = useMemo(() => 
    tableElements.find(el => el.id === selectedTableElId) || null
  , [tableElements, selectedTableElId]);

  const handleSelectVibe = useCallback((vibe: Vibe) => {
    studio.selectVibe(vibe);
  }, [studio]);

  const handleClearAll = useCallback(() => {
    studio.clearCanvas();
    clearTemplate();
  }, [studio, clearTemplate]);

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
    if (studio.crayonMode) {
      // In crayon mode, clicking a texture picks the crayon color and enters draw mode
      studio.setCrayonTextureId(textureId);
      studio.setDrawMode(true);
      return;
    }
    if (textureApplyMode === 'background') {
      studio.setBackgroundTextureId(studio.backgroundTextureId === textureId ? null : textureId);
    } else if (studio.selectedSectionId) {
      studio.fillSection(studio.selectedSectionId, textureId);
    }
    // In 'swatch' mode with no section selected, clicking does nothing (drag to add)
  }, [studio.selectedSectionId, studio.fillSection, textureApplyMode, studio.setBackgroundTextureId, studio.backgroundTextureId, studio.crayonMode, studio.setCrayonTextureId, studio.setDrawMode]);

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
      {/* Mobile welcome — no discouraging banner */}

      {/* Top bar with nav + focus toggle */}
      <TopToolbar
        wallFrameStyle={studio.wallFrameStyle}
        onWallFrameStyleChange={studio.setWallFrameStyle}
        onClear={handleClearAll}
        onSave={handleExport}
        onSaveToWall={handleSaveToWall}
        ambientSound={ambientSound}
        onAmbientSoundChange={setAmbientSound}
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode(prev => !prev)}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ── Canvas area ── */}
        <div className="flex-1 relative overflow-hidden min-h-0 flex">
          {/* ── Left panel: Edit Element (desktop only) ── */}
          {!isMobile && studio.selectedId && studio.elements.find(e => e.id === studio.selectedId) && (
            <div className="w-56 shrink-0 border-r border-border bg-popover flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1 border-b border-border bg-secondary/30 shrink-0">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Play w/ Elements</span>
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
          )}

          {/* ── Left panel: Edit Table Element (desktop only) ── */}
          {!isMobile && !studio.selectedId && selectedTableElement && (
            <div className="w-56 shrink-0 border-r border-border bg-popover flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1 border-b border-border bg-secondary/30 shrink-0">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Play w/ Elements</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FloatingToolbar
                  element={{
                    id: selectedTableElement.id,
                    textureId: selectedTableElement.textureId,
                    x: selectedTableElement.x,
                    y: selectedTableElement.y,
                    width: selectedTableElement.width,
                    height: selectedTableElement.height,
                    rotation: selectedTableElement.rotation,
                    shape: selectedTableElement.shape || 'soft-square',
                    zIndex: 5,
                    effects: selectedTableElement.effects || { bleachFade: 0, edgeStyle: 'clean', wrinkle: 'none', grainBoost: 0, shadowDepth: 'flat' },
                    clipPathD: selectedTableElement.clipPathD,
                  }}
                  onUpdate={(updates) => handleTableElementUpdate(selectedTableElId!, updates)}
                  onUpdateEffects={(effects) => {
                    const el = tableElements.find(e => e.id === selectedTableElId);
                    if (el) handleTableElementUpdate(selectedTableElId!, { effects: { ...(el.effects || { bleachFade: 0, edgeStyle: 'clean', wrinkle: 'none', grainBoost: 0, shadowDepth: 'flat' }), ...effects } });
                  }}
                  onDuplicate={() => {
                    if (!selectedTableElement) return;
                    setTableElements(prev => [...prev, {
                      ...selectedTableElement,
                      id: `table-${tableIdRef.current++}`,
                      x: selectedTableElement.x + 20,
                      y: selectedTableElement.y + 20,
                    }]);
                  }}
                  onDelete={() => { handleTableElementDelete(selectedTableElId!); setSelectedTableElId(null); }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 relative overflow-hidden min-h-0">
            <Canvas
              easelMode={easelMode}
              onToggleEasel={() => setEaselMode(prev => !prev)}
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
              tableSurface={tableSurface}
              workstationName={workstationName}
              onWorkstationNameChange={handleWorkstationNameChange}
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
              onMoveToTable={handleMoveToTable}
              onTableDrop={handleTableDrop}
              onTableElementUpdate={handleTableElementUpdate}
              onTableElementDelete={handleTableElementDelete}
              onStencilTableDrop={handleStencilTableDrop}
              onSelectTableElement={setSelectedTableElId}
              selectedTableElementId={selectedTableElId}
              onDuplicateStencilSection={handleDuplicateStencilSection}
              onDetachStencilSection={handleDetachStencilSection}
              canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
              onWallFrameStyleChange={studio.setWallFrameStyle}
              isPremium={isPremium}
              onRequestUpgrade={() => setShowPaywall(true)}
              drawMode={studio.drawMode}
              crayonMode={studio.crayonMode}
              onFinishDraw={studio.addCustomSection}
              onCancelDraw={() => { studio.setDrawMode(false); if (!studio.crayonMode) { studio.setCrayonTextureId(null); } }}
              onFillBackground={(textureId) => studio.setBackgroundTextureId(textureId)}
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
                onPlaceStencil={studio.placeStencil}
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
        </div>
        {/* ── Canvas/Frame bar ── */}
        {!isMobile && (
          <BottomBar
            wallFrameStyle={studio.wallFrameStyle}
            onWallFrameStyleChange={studio.setWallFrameStyle}
            onClear={handleClearAll}
            onSave={handleExport}
            onSaveToWall={handleSaveToWall}
            isPremium={isPremium}
            onRequestUpgrade={() => setShowPaywall(true)}
            tableSurface={tableSurface}
            onTableSurfaceChange={setTableSurface}
            easelMode={easelMode}
            onToggleEasel={() => setEaselMode(prev => !prev)}
          />
        )}
        {/* ── Bottom panel: Textures (left) + Stencils (right) ── */}
        {!isMobile && (
          <div className="flex border-t border-border shrink-0" style={{ height: '30%', minHeight: 180 }}>
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
                onToggleDrawMode={() => { studio.setCrayonMode(false); studio.setDrawMode(!studio.drawMode); }}
                nextShape={studio.nextShape}
                onSetNextShape={studio.setNextShape}
                crayonMode={studio.crayonMode}
                crayonTextureId={studio.crayonTextureId}
                onToggleCrayonMode={() => {
                  const next = !studio.crayonMode;
                  studio.setCrayonMode(next);
                  if (next) {
                    studio.setDrawMode(false); // will be set when they pick a color
                  } else {
                    studio.setDrawMode(false);
                    studio.setCrayonTextureId(null);
                  }
                }}
                onSetCrayonTexture={(id) => { studio.setCrayonTextureId(id); studio.setDrawMode(true); }}
              />
            </div>
            {/* Right half: Stencils (collapsible) */}
            <div
              className="overflow-hidden transition-all duration-300 relative"
              style={{
                flex: stencilsCollapsed ? '0 0 32px' : '1 1 0%',
                minWidth: stencilsCollapsed ? 32 : undefined,
              }}
            >
              {/* Collapse/expand tab */}
              <button
                onClick={() => {
                  const next = !stencilsCollapsed;
                  setStencilsCollapsed(next);
                  try { localStorage.setItem('stencils-collapsed', String(next)); } catch {}
                }}
                className="absolute top-1 left-1 z-20 p-1 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title={stencilsCollapsed ? 'Show Stencils' : 'Hide Stencils'}
              >
                {stencilsCollapsed ? (
                  <span className="text-[10px] font-bold writing-mode-vertical" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>🧩 Shapes</span>
                ) : (
                  <span className="text-[10px]">◀ Hide</span>
                )}
              </button>
              {!stencilsCollapsed && (
                <BuildPanel
                  isPremium={isPremium}
                  onRequestUpgrade={() => setShowPaywall(true)}
                  activeVibeId={studio.activeVibe?.id ?? null}
                  onSelectVibe={handleSelectVibe}
                  onShuffleVibeFills={studio.shuffleVibeFills}
                  onPlaceStencil={studio.placeStencil}
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

      {/* Mobile bottom bar — thumb-reachable */}
      {isMobile && (
        <div className="flex items-center justify-between px-2 py-2 bg-popover border-t border-border" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="flex items-center justify-center px-3 py-2.5 min-w-[44px] min-h-[44px] text-xs text-destructive active:bg-destructive/10 rounded-xl transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSaveToWall}
              className="flex items-center justify-center px-3 py-2.5 min-w-[44px] min-h-[44px] text-xs text-foreground active:bg-secondary rounded-xl transition-colors"
            >
              Save
            </button>
          </div>
          <button
            onClick={() => isPremium ? handleExport() : setShowPaywall(true)}
            className="flex items-center justify-center px-4 py-2.5 min-w-[44px] min-h-[44px] text-xs font-semibold bg-primary text-primary-foreground rounded-xl active:scale-95 transition-transform"
          >
            Export
          </button>
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
      <OnboardingTutorial page="studio" />
    </div>
  );
};

export default Index;
