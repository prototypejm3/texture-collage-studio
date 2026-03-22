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
import { useKidOnboarding, KidOnboardingOverlay } from '@/components/studio/KidOnboarding';
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
import { useKidCelebration } from '@/hooks/useKidCelebration';
import { CelebrationOverlay } from '@/components/studio/CelebrationToast';
import { useKidTutorial } from '@/hooks/useKidTutorial';
import { useVoiceEncouragement } from '@/hooks/useVoiceEncouragement';
import { GhostHand, TutorialReplayButton } from '@/components/studio/GhostHand';
import { TextureTray } from '@/components/studio/MobileTextureTray';
import { StencilTray } from '@/components/studio/MobileStencilTray';
import { useActiveBox } from '@/hooks/useActiveBox';
import { BoxButton } from '@/components/studio/BoxButton';
import { ExpandableDrawer } from '@/components/studio/ExpandableDrawer';
import { TextPanel } from '@/components/studio/TextPanel';

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
  const celebration = useKidCelebration();
  const kidTutorial = useKidTutorial();
  const voiceEncouragement = useVoiceEncouragement();
  const [showMobileBanner, setShowMobileBanner] = useState(true);
  const kidOnboarding = useKidOnboarding(sounds.kidMode);
  const [stencilsPoppedOut, setStencilsPoppedOut] = useState(false);
  const [stencilsCollapsed, setStencilsCollapsed] = useState(() => {
    try { return localStorage.getItem('stencils-collapsed') === 'true'; } catch { return false; }
  });
  const [textureApplyMode, setTextureApplyMode] = useState<'swatch' | 'background'>('swatch');
  const { activeBox, toggleBox, closeBox, openBox } = useActiveBox();
  const [tableSurface, setTableSurface] = useState<TableSurface>('birch');
  const [easelMode, setEaselMode] = useState(true);
  const [workstationName, setWorkstationName] = useState(() => {
    return localStorage.getItem('workstationName') || '';
  });
  const handleWorkstationNameChange = useCallback((name: string) => {
    setWorkstationName(name);
    localStorage.setItem('workstationName', name);
  }, []);

  // Handle Stripe payment success redirect
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 100);
      localStorage.setItem('premium-expiry', expiry.toISOString());
      localStorage.setItem('user-tier', 'premium');
      upgradeToPremium();
      toast({ title: '🎉 Payment successful!', description: 'You now have lifetime premium access!' });
      // Clean up URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      navigate(`/${newParams.toString() ? `?${newParams}` : ''}`, { replace: true });
    }
  }, [searchParams, upgradeToPremium, navigate]);

  // Trigger intro tutorial for kids on first visit
  useEffect(() => {
    if (sounds.kidMode) {
      const timer = setTimeout(() => kidTutorial.triggerIntro(), 800);
      return () => clearTimeout(timer);
    }
  }, [sounds.kidMode]);

  // Auto-open tools box when an element is selected in adult mode
  useEffect(() => {
    if (studio.selectedId && !sounds.kidMode) {
      openBox('tools');
    }
  }, [studio.selectedId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey) {
        setFocusMode(prev => !prev);
      }
      // Undo: Ctrl+Z / Cmd+Z
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        studio.undo();
      }
      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y
      if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        studio.redo();
      }
      // Delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && studio.selectedId) {
        studio.deleteElement(studio.selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [studio.undo, studio.redo, studio.selectedId, studio.deleteElement]);

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
    kidOnboarding.notifyPick();
    if (sounds.kidMode) {
      kidTutorial.triggerDrag();
      voiceEncouragement.maybeSayEncouragement();
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        celebration.celebrateDrop(rect.left + x + 50, rect.top + y);
      }
    }
  }, [studio, sounds, kidOnboarding, celebration, kidTutorial, voiceEncouragement]);

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
    sounds.playPop();
    sounds.trackAction();
  }, [sounds]);

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
    sounds.playDelete();
    sounds.trackAction();
  }, [sounds]);

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
      sounds.playSave();
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
      sounds.playDrop();
      sounds.trackAction();
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
        const validFrameStyles = ['gold', 'chrome', 'copper', 'silver', 'minimal', 'shadow-box', 'wood', 'floating', 'polaroid', 'none', 'rainbow'];
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
        kidSoundsEnabled={sounds.enabled}
        kidSoundsVolume={sounds.volume}
        onKidSoundsToggle={sounds.setEnabled}
        onKidSoundsVolume={sounds.setVolume}
        onUndo={studio.undo}
        onRedo={studio.redo}
        canUndo={studio.canUndo}
        canRedo={studio.canRedo}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ── Canvas area ── */}
        <div className="flex-1 relative overflow-hidden min-h-0 flex">
          <div className="flex-1 relative overflow-hidden min-h-0" onClick={(e) => { if ((e.target as HTMLElement).closest('[data-box-btn], [data-box-drawer]')) return; closeBox(); }}>
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
              onUpdate={(id, updates) => { studio.updateElement(id, updates); kidOnboarding.notifyMove(); }}
              onDrop={handleDrop}
              onSelectSection={studio.selectSection}
              onDropInSection={(sectionId, textureId) => {
                studio.fillSection(sectionId, textureId);
                if (sounds.kidMode && canvasRef.current) {
                  const rect = canvasRef.current.getBoundingClientRect();
                  celebration.celebrateDrop(rect.left + rect.width / 2, rect.top + rect.height / 2, 'stencil');
                  // Check milestone
                  const filled = Object.keys(studio.vibeFills).length + 1;
                  const total = studio.activeVibe?.sections.length || 0;
                  celebration.checkMilestone(filled, total, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 3 });
                }
              }}
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
              onBoxSave={kidOnboarding.notifySave}
              onToolSound={(tool) => {
                if (tool === 'cut') sounds.playToolCut();
                else if (tool === 'crumple') sounds.playToolCrumple();
                else if (tool === 'grow') sounds.playToolGrow();
                else if (tool === 'shrink') sounds.playToolShrink();
              }}
              onUpdateElement={(id, updates) => { studio.updateElement(id, updates); kidOnboarding.notifyMove(); }}
              onUpdateEffects={(id, effects) => { studio.updateEffects(id, effects); kidOnboarding.notifyToolUse(); }}
              onDuplicateElement={(id) => studio.duplicateElement(id)}
            />

            {/* ── DRAWER opens on the wood surface inside the canvas area ── */}
            {activeBox && activeBox !== 'mybox' && (
              <div
                data-box-drawer
                className="absolute z-40 bottom-8 right-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    width: isMobile ? 300 : (activeBox === 'tools' ? 480 : activeBox === 'text' ? 360 : 340),
                    maxHeight: isMobile ? '45vh' : 320,
                    background: 'linear-gradient(180deg, #a0724a 0%, #8B5E3C 50%, #7a5018 100%)',
                    borderRadius: 10,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.12)',
                    border: '2px solid rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-amber-900/30">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'hsla(35, 80%, 85%, 0.9)' }}>
                      {activeBox === 'textures' && (sounds.kidMode ? '🎨 Colors' : '🎨 Colors')}
                      {activeBox === 'stencils' && (sounds.kidMode ? '🧸 Shapes' : '🧸 Elements')}
                      {activeBox === 'tools' && (sounds.kidMode ? '🖼️ Frame' : '🖼️ Frame')}
                      {activeBox === 'text' && '✏️ Text'}
                    </span>
                    <button
                      onClick={closeBox}
                      className="p-1 rounded-md hover:bg-amber-700/40 transition-colors"
                      style={{ color: 'hsla(35, 80%, 85%, 0.8)' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Content */}
                  <div className="overflow-y-auto bg-popover" style={{ maxHeight: isMobile ? 'calc(45vh - 36px)' : 284 }}>
                    {activeBox === 'textures' && (
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
                        onSetNextShape={(shape) => { studio.setNextShape(shape); sounds.playShapeSelect(shape); }}
                        crayonMode={studio.crayonMode}
                        crayonTextureId={studio.crayonTextureId}
                        onToggleCrayonMode={() => {
                          const next = !studio.crayonMode;
                          studio.setCrayonMode(next);
                          if (next) {
                            studio.setDrawMode(false);
                          } else {
                            studio.setDrawMode(false);
                            studio.setCrayonTextureId(null);
                          }
                        }}
                        onSetCrayonTexture={(id) => { studio.setCrayonTextureId(id); studio.setDrawMode(true); }}
                      />
                    )}

                    {activeBox === 'stencils' && (
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
                        stencilsPoppedOut={false}
                        onPopOutStencils={() => {}}
                      />
                    )}

                    {activeBox === 'tools' && (
                      <div className="p-3">
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
                          backgroundTextureId={studio.backgroundTextureId}
                          onBackgroundChange={(id) => studio.setBackgroundTextureId(id)}
                        />
                        {studio.selectedId && studio.elements.find(e => e.id === studio.selectedId) && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Edit Element</p>
                            <FloatingToolbar
                              element={studio.elements.find(e => e.id === studio.selectedId)!}
                              onUpdate={(updates) => { studio.updateElement(studio.selectedId!, updates); kidOnboarding.notifyMove(); }}
                              onUpdateEffects={(effects) => { studio.updateEffects(studio.selectedId!, effects); kidOnboarding.notifyToolUse(); }}
                              onDuplicate={() => studio.duplicateElement(studio.selectedId!)}
                              onDelete={() => { studio.deleteElement(studio.selectedId!); sounds.playDelete(); sounds.trackAction(); }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {activeBox === 'text' && (
                      <TextPanel
                        onAddText={(text, opts) => {
                          studio.addTextElement(text, 150, 150, opts);
                          closeBox();
                        }}
                        selectedElement={studio.selectedId ? studio.elements.find(e => e.id === studio.selectedId) : null}
                        onUpdateElement={(id, updates) => studio.updateElement(id, updates)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── BOX BUTTONS in a wooden tray on the table ── */}
        <div className="relative shrink-0 flex justify-center py-3 overflow-visible" data-box-btn>
          <div
            className="relative flex items-center justify-center gap-3 px-5 py-3"
            style={{
              background: 'linear-gradient(180deg, #a0724a 0%, #8B5E3C 40%, #7a5018 100%)',
              borderRadius: '0 0 10px 10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -4px 8px rgba(0,0,0,0.2)',
              border: '2px solid rgba(0,0,0,0.15)',
              borderTop: 'none',
            }}
          >
            {/* Wood grain overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.08) 12px, rgba(255,255,255,0.08) 13px)',
              borderRadius: '0 0 10px 10px',
            }} />
            {/* Lid / flap */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -14,
                left: -2,
                width: 'calc(100% + 4px)',
                height: 18,
                background: 'linear-gradient(180deg, #c07830 0%, #a86828 100%)',
                borderRadius: '6px 6px 0 0',
                border: '2px solid rgba(0,0,0,0.12)',
                borderBottom: 'none',
                transform: 'rotateX(-20deg)',
                transformOrigin: 'bottom center',
                boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
              }}
            />
            {sounds.kidMode && (
              <BoxButton
                id="mybox"
                icon="📦"
                label="Keep It!"
                isActive={activeBox === 'mybox'}
                onClick={() => { toggleBox('mybox'); if (sounds.kidMode) kidTutorial.triggerBox(); }}
                kidMode={true}
              />
            )}
            <BoxButton
              id="textures"
              icon="🎨"
              label={sounds.kidMode ? "Colors" : "Swatches"}
              isActive={activeBox === 'textures'}
              onClick={() => { toggleBox('textures'); if (sounds.kidMode) kidTutorial.triggerColor(); }}
              kidMode={sounds.kidMode}
            />
            <BoxButton
              id="tools"
              icon="🖼️"
              label={sounds.kidMode ? "Frame" : "Display"}
              isActive={activeBox === 'tools'}
              onClick={() => { toggleBox('tools'); if (sounds.kidMode) kidTutorial.triggerFrame(); }}
              kidMode={sounds.kidMode}
            />
            <BoxButton
              id="stencils"
              icon="🧸"
              label={sounds.kidMode ? 'Shapes' : 'Elements'}
              isActive={activeBox === 'stencils'}
              onClick={() => toggleBox('stencils')}
              kidMode={sounds.kidMode}
            />
            {!sounds.kidMode && (
              <BoxButton
                id="text"
                icon="✏️"
                label="Text"
                isActive={activeBox === 'text'}
                onClick={() => toggleBox('text')}
                kidMode={false}
              />
            )}
          </div>
        </div>
      </div>

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
              const validFrameStyles = ['gold', 'chrome', 'copper', 'silver', 'minimal', 'shadow-box', 'wood', 'floating', 'polaroid', 'none', 'rainbow'];
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
      {sounds.kidMode && <CelebrationOverlay toasts={celebration.toasts} />}
      {sounds.kidMode && <GhostHand hint={kidTutorial.activeHint} />}
      {sounds.kidMode && <TutorialReplayButton onReplay={kidTutorial.resetAll} />}
      <KidOnboardingOverlay
        step={kidOnboarding.step}
        active={kidOnboarding.active}
        onSkip={kidOnboarding.skip}
        onAdvance={kidOnboarding.advanceTo}
      />
    </div>
  );
};

export default Index;
