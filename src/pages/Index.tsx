import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { Monitor, X, Save, Download, Trash2 } from 'lucide-react';
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
import { MobileStudioBottomNav } from '@/components/studio/MobileStudioNav';
import { FloatingMusicButton } from '@/components/studio/FloatingMusicButton';
import { MobileCanvasActions } from '@/components/studio/MobileCanvasActions';
import { RoomThemePicker, useRoomTheme } from '@/components/studio/RoomThemePicker';


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
  const [showStencilSizePicker, setShowStencilSizePicker] = useState(false);
  const { activeBox, toggleBox, closeBox, openBox } = useActiveBox();
  const [roomTheme, setRoomTheme] = useRoomTheme();
  const [tableSurface, setTableSurface] = useState<TableSurface>('birch');
  const [easelMode, setEaselMode] = useState(true);
  const [drawerPos, setDrawerPos] = useState<{ x: number; y: number } | null>(null);
  const drawerDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
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

  // Auto-open Tool Box when elements exist on canvas
  useEffect(() => {
    if (studio.elements.length > 0 && activeBox !== 'toolbox') {
      openBox('toolbox');
    }
  }, [studio.elements.length]);

  // When user taps/selects an element, open Tool Box
  useEffect(() => {
    if (studio.selectedId && !sounds.kidMode) {
      openBox('toolbox');
    }
  }, [studio.selectedId]);

  // When user taps/selects a stencil section, open Swatches so they can pick a color
  useEffect(() => {
    if (studio.selectedSectionId && !sounds.kidMode) {
      openBox('textures');
    }
  }, [studio.selectedSectionId]);

  // Reset drawer drag position when switching panels
  useEffect(() => {
    setDrawerPos(null);
  }, [activeBox]);

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
    setShowStencilSizePicker(true);
  }, [studio]);

  const handlePlaceStencilSize = useCallback((size: string) => {
    studio.placeStencil(size);
    setShowStencilSizePicker(false);
    const isKid = (() => { try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; } })();
    toast({
      title: isKid ? '✓ Added!' : 'Added to canvas',
      duration: 1500,
    });
  }, [studio]);

  // Auto-save to Room Box before clearing (kids never lose work)
  const handleClearAll = useCallback(async () => {
    if (sounds.kidMode && canvasRef.current && studio.elements.length > 0) {
      try {
        const dataUrl = await toPng(canvasRef.current, { pixelRatio: 1 });
        const name = studio.activeVibe?.name || 'My Creation';
        const studioState = studio.getState();
        // Save as hidden "box" item — lives in Room but not on wall
        wall.addDesign(dataUrl, name, studio.activeVibe?.name, studioState, studio.activeVibe?.creator);
        // Mark it as box-only (hidden, not displayed on wall)
        const designs = wall.designs;
        const newest = designs[0];
        if (newest) {
          wall.updateDesign(newest.id, { status: 'draft' as any, hidden: true });
        }
        toast({ title: '📦 Saved to your Room Box!', description: "Don't worry, your creation is safe!" });
      } catch { /* silent */ }
    }
    studio.clearCanvas();
    clearTemplate();
  }, [studio, clearTemplate, sounds.kidMode, wall]);

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

      // Only count displayed (wall-hung) designs against free limit
      const displayedCount = wall.designs.filter(d => d.status === 'display' && !d.hidden).length;
      if (!canSave(displayedCount)) {
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
    } else if (studio.selectedId) {
      // If an element is selected, apply color to it
      studio.updateElement(studio.selectedId, { textureId });
      sounds.playDrop();
    } else {
      // Tap-to-place: place a new swatch centered on canvas
      const canvasEl = canvasRef.current;
      const cx = canvasEl ? canvasEl.clientWidth / 2 - 50 : 150;
      const cy = canvasEl ? canvasEl.clientHeight / 2 - 50 : 150;
      // Offset slightly if there are already elements (stack offset)
      const offset = (studio.elements.length % 10) * 8;
      studio.addElement(textureId, cx + offset, cy + offset);
      sounds.playPop();
      sounds.trackAction();
      toast({
        title: sounds.kidMode ? '✓ Added!' : 'Added to canvas',
        duration: 1500,
      });
    }
  }, [studio.selectedSectionId, studio.fillSection, textureApplyMode, studio.setBackgroundTextureId, studio.backgroundTextureId, studio.crayonMode, studio.setCrayonTextureId, studio.setDrawMode, studio.selectedId, studio.elements.length]);

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
    <div className="h-screen flex flex-col overflow-hidden pb-[48px] md:pb-0">
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


            {/* Stencil size picker — inline above canvas */}
            {showStencilSizePicker && studio.activeVibe && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50" data-box-drawer onClick={e => e.stopPropagation()}>
                <motion.div
                  initial={sounds.kidMode ? { scale: 0.8, opacity: 0 } : { opacity: 0 }}
                  animate={sounds.kidMode ? { scale: 1, opacity: 1 } : { opacity: 1 }}
                  transition={sounds.kidMode ? { type: 'spring', stiffness: 400, damping: 15 } : { duration: 0.15, ease: 'easeOut' }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl shadow-lg"
                  style={{
                    background: sounds.kidMode ? '#f5ede0' : '#faf8f5',
                    border: `1px solid ${sounds.kidMode ? '#e8ddd0' : '#e2ddd6'}`,
                  }}
                >
                  <span style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 600, color: '#3d3530' }}>
                    Size:
                  </span>
                  {(['S', 'M', 'L'] as const).map(size => {
                    const isDefault = size === 'L';
                    return (
                      <button
                        key={size}
                        onClick={() => handlePlaceStencilSize(size)}
                        className="flex items-center justify-center rounded-full transition-all active:scale-95"
                        style={{
                          width: 44,
                          height: 28,
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: isDefault
                            ? (sounds.kidMode ? '#f97316' : '#5a8a6a')
                            : (sounds.kidMode ? '#f7f0e8' : '#f0ebe3'),
                          color: isDefault
                            ? 'white'
                            : (sounds.kidMode ? '#6b4c2a' : '#3d3530'),
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowStencilSizePicker(false)}
                    className="p-1 rounded-lg hover:bg-black/5 ml-1"
                  >
                    <X className="w-3 h-3" style={{ color: '#3d3530' }} />
                  </button>
                </motion.div>
              </div>
            )}

            {/* ── DRAWER opens on the wood surface inside the canvas area ── */}
            {activeBox && activeBox !== 'mybox' && !(activeBox === 'toolbox' && !sounds.kidMode) && (
              isMobile && (activeBox === 'textures' || activeBox === 'stencils') ? (
                /* Mobile: side drawer from right for Colors/Stencils */
                <>
                  <div
                    className="absolute inset-0 z-30 bg-black/20"
                    onClick={closeBox}
                  />
                  <div
                    data-box-drawer
                    className="absolute top-0 right-0 bottom-0 z-40 overflow-hidden"
                    style={{
                      width: '85vw',
                      maxWidth: 320,
                      background: sounds.kidMode ? '#fdf6ee' : '#faf8f5',
                      borderLeft: `1px solid ${sounds.kidMode ? '#e8ddd0' : '#e2ddd6'}`,
                      borderRadius: '16px 0 0 16px',
                      animation: 'slide-in-from-right 250ms ease forwards',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: `1px solid ${sounds.kidMode ? '#e8ddd0' : '#e2ddd6'}` }}>
                      <span style={{ fontFamily: 'system-ui', fontSize: 16, fontWeight: 700, color: sounds.kidMode ? '#3a5c4a' : '#3d3530' }}>
                        {activeBox === 'textures' && (sounds.kidMode ? 'Colors' : 'Swatches')}
                        {activeBox === 'stencils' && (sounds.kidMode ? 'Shapes' : 'Stencils')}
                      </span>
                      <button onClick={closeBox} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                        <X className="w-4 h-4" style={{ color: '#94a3b8' }} />
                      </button>
                    </div>
                    <div className="overflow-y-auto" style={{ height: 'calc(100% - 52px)' }}>
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
                            if (!next) { studio.setDrawMode(false); studio.setCrayonTextureId(null); }
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
                    </div>
                  </div>
                </>
              ) : (
              <div
                data-box-drawer
                className="absolute z-40"
                style={drawerPos
                  ? { left: drawerPos.x, top: drawerPos.y }
                  : { bottom: 8, right: 8 }
                }
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="overflow-visible relative"
                  style={{
                    width: isMobile ? 300 : (activeBox === 'tools' ? 520 : activeBox === 'text' ? 360 : activeBox === 'toolbox' ? 380 : 340),
                    maxHeight: isMobile ? '55vh' : 460,
                    ...(sounds.kidMode ? {
                      borderRadius: 8,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                      border: '1px solid rgba(90,138,106,0.4)',
                    } : {
                      borderRadius: 16,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      border: '1px solid #e8ddd0',
                      background: '#f5ede0',
                    }),
                  }}
                >
                  {/* Header */}
                  {sounds.kidMode ? (
                    <div className="flex items-center justify-between px-2 py-1 border-b border-border/50 cursor-grab active:cursor-grabbing"
                      style={{ background: 'linear-gradient(180deg, #5a8a6a, #3d6a4a)', borderRadius: '8px 8px 0 0' }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        const el = (e.currentTarget.closest('[data-box-drawer]') as HTMLElement);
                        const rect = el.getBoundingClientRect();
                        const parentRect = el.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
                        drawerDragRef.current = { startX: e.clientX, startY: e.clientY, origX: rect.left - parentRect.left, origY: rect.top - parentRect.top };
                        const onMove = (ev: PointerEvent) => {
                          if (!drawerDragRef.current) return;
                          const dx = ev.clientX - drawerDragRef.current.startX;
                          const dy = ev.clientY - drawerDragRef.current.startY;
                          setDrawerPos({ x: drawerDragRef.current.origX + dx, y: drawerDragRef.current.origY + dy });
                        };
                        const onUp = () => { drawerDragRef.current = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                        window.addEventListener('pointermove', onMove);
                        window.addEventListener('pointerup', onUp);
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider select-none" style={{ color: 'hsla(35, 80%, 90%, 0.95)' }}>
                        {activeBox === 'textures' && '🎨 Colors'}
                        {activeBox === 'stencils' && '🧸 Shapes'}
                        {activeBox === 'tools' && '🖼️ Frame'}
                        {activeBox === 'text' && 'Text'}
                      </span>
                      <button
                        onClick={closeBox}
                        className="p-0.5 rounded hover:bg-white/10 transition-colors"
                        style={{ color: 'hsla(35, 80%, 90%, 0.8)' }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing"
                      style={{ borderBottom: '1px solid #e8ddd0', borderRadius: '16px 16px 0 0' }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        const el = (e.currentTarget.closest('[data-box-drawer]') as HTMLElement);
                        const rect = el.getBoundingClientRect();
                        const parentRect = el.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
                        drawerDragRef.current = { startX: e.clientX, startY: e.clientY, origX: rect.left - parentRect.left, origY: rect.top - parentRect.top };
                        const onMove = (ev: PointerEvent) => {
                          if (!drawerDragRef.current) return;
                          const dx = ev.clientX - drawerDragRef.current.startX;
                          const dy = ev.clientY - drawerDragRef.current.startY;
                          setDrawerPos({ x: drawerDragRef.current.origX + dx, y: drawerDragRef.current.origY + dy });
                        };
                        const onUp = () => { drawerDragRef.current = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
                        window.addEventListener('pointermove', onMove);
                        window.addEventListener('pointerup', onUp);
                      }}
                    >
                      <span style={{ fontFamily: 'system-ui', fontSize: 13, fontWeight: 600, color: '#3d3530' }}>
                        {activeBox === 'textures' && 'Swatches'}
                        {activeBox === 'stencils' && 'Stencils'}
                        {activeBox === 'tools' && 'Display'}
                        {activeBox === 'text' && 'Text'}
                        {activeBox === 'toolbox' && 'Tool Box'}
                      </span>
                      <button
                        onClick={closeBox}
                        className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" style={{ color: '#3d3530' }} />
                      </button>
                    </div>
                  )}

                  {/* Content */}
                  <div className="overflow-y-auto overflow-x-visible" style={{
                    maxHeight: isMobile ? 'calc(45vh - 28px)' : 336,
                    background: sounds.kidMode ? 'hsl(var(--popover))' : '#f5ede0',
                    borderRadius: sounds.kidMode ? undefined : '0 0 16px 16px',
                  }}>
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
                        {sounds.kidMode && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#e8ddd0' }}>
                            <RoomThemePicker theme={roomTheme} onThemeChange={setRoomTheme} />
                          </div>
                        )}
                      </div>
                    )}

                    {activeBox === 'stencils' && (
                      <div>
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

                    {activeBox === 'toolbox' && studio.elements.length > 0 && (
                      <div className="p-3">
                        <FloatingToolbar
                          element={studio.selectedId ? (studio.elements.find(e => e.id === studio.selectedId) || studio.elements[studio.elements.length - 1]) : studio.elements[studio.elements.length - 1]}
                          onUpdate={(updates) => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) { studio.updateElement(targetId, updates); kidOnboarding.notifyMove(); }
                          }}
                          onUpdateEffects={(effects) => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) { studio.updateEffects(targetId, effects); kidOnboarding.notifyToolUse(); }
                          }}
                          onDuplicate={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) studio.duplicateElement(targetId);
                          }}
                          onDelete={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) { studio.deleteElement(targetId); sounds.playDelete(); sounds.trackAction(); }
                          }}
                          onUndo={studio.undo}
                          onRedo={studio.redo}
                          canUndo={studio.canUndo}
                          canRedo={studio.canRedo}
                          elementCount={studio.elements.length}
                          onBringForward={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) studio.bringForward(targetId);
                          }}
                          onSendBackward={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) studio.sendBackward(targetId);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )
            )}

          </div>

          {/* Right-side Tool Box panel — adult mode only */}
          {!sounds.kidMode && activeBox === 'toolbox' && studio.elements.length > 0 && (
            <div
              data-box-drawer
              className="h-full overflow-y-auto shrink-0 border-l"
              style={{
                width: 320,
                background: '#f5ede0',
                borderColor: '#e8ddd0',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #e8ddd0' }}>
                <span style={{ fontFamily: 'system-ui', fontSize: 13, fontWeight: 600, color: '#3d3530' }}>Tool Box</span>
                <button onClick={closeBox} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                  <X className="w-3.5 h-3.5" style={{ color: '#3d3530' }} />
                </button>
              </div>
              <div className="p-3">
                <FloatingToolbar
                  element={studio.selectedId ? (studio.elements.find(e => e.id === studio.selectedId) || studio.elements[studio.elements.length - 1]) : studio.elements[studio.elements.length - 1]}
                  onUpdate={(updates) => {
                    const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                    if (targetId) { studio.updateElement(targetId, updates); kidOnboarding.notifyMove(); }
                  }}
                  onUpdateEffects={(effects) => {
                    const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                    if (targetId) { studio.updateEffects(targetId, effects); kidOnboarding.notifyToolUse(); }
                  }}
                  onDuplicate={() => {
                    const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                    if (targetId) studio.duplicateElement(targetId);
                  }}
                  onDelete={() => {
                    const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                    if (targetId) { studio.deleteElement(targetId); sounds.playDelete(); sounds.trackAction(); }
                  }}
                  onUndo={studio.undo}
                  onRedo={studio.redo}
                  canUndo={studio.canUndo}
                  canRedo={studio.canRedo}
                  elementCount={studio.elements.length}
                  onBringForward={() => {
                    const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                    if (targetId) studio.bringForward(targetId);
                  }}
                  onSendBackward={() => {
                    const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                    if (targetId) studio.sendBackward(targetId);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Undo/Redo/Reset */}
        <MobileCanvasActions
          kidMode={sounds.kidMode}
          onUndo={studio.undo}
          onRedo={studio.redo}
          onReset={handleClearAll}
          canUndo={studio.canUndo}
          canRedo={studio.canRedo}
        />

        {/* Kid mode actions — horizontal below canvas */}
        {sounds.kidMode && (
          <div className="w-full flex items-center justify-center gap-4 py-1.5 shrink-0">
            <button onClick={handleClearAll} className="flex items-center gap-1.5 transition-all hover:bg-black/5 active:scale-95 px-2 py-1 rounded-lg" title="Start Over">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="6" width="14" height="14" rx="2" fill="#c4956a"/>
                <rect x="7" y="8" width="10" height="10" rx="1" fill="#d9a97c"/>
                <rect x="9" y="4" width="6" height="3" rx="1" fill="#c4956a"/>
              </svg>
              <span className="text-[11px] font-medium" style={{ color: '#6b4c2a' }}>Start Over</span>
            </button>
            <button onClick={handleSaveToWall} className="flex items-center gap-1.5 transition-all hover:bg-black/5 active:scale-95 px-2 py-1 rounded-lg" title="Save">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="3" fill="#c4956a"/>
                <rect x="6" y="6" width="12" height="12" rx="2" fill="#d9a97c"/>
                <rect x="8" y="3" width="8" height="4" rx="1.5" fill="#c4956a"/>
                <circle cx="12" cy="13" r="3" fill="#c4956a"/>
                <circle cx="12" cy="13" r="1.5" fill="#d9a97c"/>
              </svg>
              <span className="text-[11px] font-medium" style={{ color: '#6b4c2a' }}>Save</span>
            </button>
            <button onClick={studio.undo} disabled={!studio.canUndo} className={`flex items-center gap-1.5 transition-all hover:bg-black/5 active:scale-95 px-2 py-1 rounded-lg ${!studio.canUndo ? 'opacity-40' : ''}`} title="Undo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 9h11a4 4 0 0 1 0 8H9" stroke="#c4956a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <polyline points="7,12 4,9 7,6" stroke="#c4956a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="text-[11px] font-medium" style={{ color: '#6b4c2a' }}>Undo</span>
            </button>
            <button onClick={studio.redo} disabled={!studio.canRedo} className={`flex items-center gap-1.5 transition-all hover:bg-black/5 active:scale-95 px-2 py-1 rounded-lg ${!studio.canRedo ? 'opacity-40' : ''}`} title="Redo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 9H9a4 4 0 0 0 0 8h6" stroke="#c4956a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <polyline points="17,12 20,9 17,6" stroke="#c4956a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="text-[11px] font-medium" style={{ color: '#6b4c2a' }}>Redo</span>
            </button>
          </div>
        )}

        {/* ── BOX BUTTONS ── */}
        <div className="relative shrink-0 flex justify-center py-3 overflow-visible" data-box-btn>
          {sounds.kidMode ? (
            /* Kid mode: wooden tray centered */
            <div className="flex items-center justify-center w-full px-4">
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
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.08) 12px, rgba(255,255,255,0.08) 13px)',
                  borderRadius: '0 0 10px 10px',
                }} />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: -14, left: -2, width: 'calc(100% + 4px)', height: 18,
                    background: 'linear-gradient(180deg, #c07830 0%, #a86828 100%)',
                    borderRadius: '6px 6px 0 0',
                    border: '2px solid rgba(0,0,0,0.12)', borderBottom: 'none',
                    transform: 'rotateX(-20deg)', transformOrigin: 'bottom center',
                    boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <BoxButton id="mybox" icon="📦" label="Keep It!" isActive={activeBox === 'mybox'}
                  onClick={() => { toggleBox('mybox'); kidTutorial.triggerBox(); }} kidMode={true} />
                <BoxButton id="textures" icon="🎨" label="Colors" isActive={activeBox === 'textures'}
                  onClick={() => { toggleBox('textures'); kidTutorial.triggerColor(); }} kidMode={true} />
                <BoxButton id="tools" icon="🖼️" label="Frame" isActive={activeBox === 'tools'}
                  onClick={() => { toggleBox('tools'); kidTutorial.triggerFrame(); }} kidMode={true} />
                <BoxButton id="stencils" icon="🧸" label="Shapes" isActive={activeBox === 'stencils'}
                  onClick={() => toggleBox('stencils')} kidMode={true} />
              </div>
            </div>
          ) : (
            /* Adult mode: tools centered, save/download above */
            <div className="flex flex-col items-center w-full">
              {/* Save/Download row */}
              <div className="flex items-center justify-center gap-2 pb-1.5">
                {/* Reset */}
                {/* Easel / Desk */}
                <button
                  onClick={() => setEaselMode(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-[0.94] text-[11px] font-medium border ${
                    easelMode
                      ? 'text-white border-transparent'
                      : 'text-foreground border-border hover:bg-accent bg-secondary'
                  }`}
                  style={easelMode ? { backgroundColor: '#5a8a6a' } : undefined}
                  title={easelMode ? 'Switch to flat desk' : 'Switch to easel'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="13" rx="1" />
                    <line x1="3" y1="16" x2="21" y2="16" />
                    <line x1="6" y1="16" x2="3" y2="23" />
                    <line x1="18" y1="16" x2="21" y2="23" />
                  </svg>
                  Easel / Desk
                </button>
                {/* Reset */}
                <button onClick={handleClearAll} className="flex items-center gap-1 px-1.5 py-1 transition-transform active:scale-[0.96]" title="Reset">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14C5.8 14 3.9 12.8 3 11" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <polyline points="1,8 3,11 5.5,9" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'system-ui,sans-serif' }}>Reset</span>
                </button>
                {/* Save */}
                <button onClick={handleSaveToWall} className="flex items-center gap-1 px-1.5 py-1 transition-transform active:scale-[0.96]" title="Save">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" fill="#5a8a6a"/>
                    <rect x="2" y="2" width="12" height="4" rx="1" fill="#7aaa8a"/>
                    <rect x="5" y="4" width="6" height="1.5" rx="0.5" fill="#d4edda"/>
                  </svg>
                  <span style={{ color: '#3d3530', fontSize: 12, fontWeight: 500, fontFamily: 'system-ui,sans-serif' }}>Save</span>
                </button>
                {/* Undo */}
                <button onClick={studio.undo} disabled={!studio.canUndo}
                  className={`flex items-center gap-1 px-1.5 py-1 transition-transform active:scale-[0.96] ${!studio.canUndo ? 'opacity-40' : ''}`} title="Undo">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 6h8a3 3 0 0 1 0 6H7" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <polyline points="5,8 3,6 5,4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'system-ui,sans-serif' }}>Undo</span>
                </button>
                {/* Redo */}
                <button onClick={studio.redo} disabled={!studio.canRedo}
                  className={`flex items-center gap-1 px-1.5 py-1 transition-transform active:scale-[0.96] ${!studio.canRedo ? 'opacity-40' : ''}`} title="Redo">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M13 6H5a3 3 0 0 0 0 6h4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <polyline points="11,8 13,6 11,4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'system-ui,sans-serif' }}>Redo</span>
                </button>
              </div>
              {/* Tool buttons centered */}
              <div className="flex items-center justify-center gap-6 py-2">
                <BoxButton id="textures" icon="" label="Swatches" isActive={activeBox === 'textures'}
                  onClick={() => toggleBox('textures')} kidMode={false} />
                <BoxButton id="tools" icon="" label="Display" isActive={activeBox === 'tools'}
                  onClick={() => toggleBox('tools')} kidMode={false} />
                <BoxButton id="stencils" icon="" label="Stencils" isActive={activeBox === 'stencils'}
                  onClick={() => toggleBox('stencils')} kidMode={false} />
                <BoxButton id="text" icon="" label="Text" isActive={activeBox === 'text'}
                  onClick={() => toggleBox('text')} kidMode={false} />
                {studio.elements.length > 0 && (
                  <BoxButton id="toolbox" icon="" label="Tool Box" isActive={activeBox === 'toolbox'}
                    onClick={() => toggleBox('toolbox')} kidMode={false} />
                )}
              </div>
            </div>
          )}
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

      {/* Mobile components */}
      <FloatingMusicButton
        kidMode={sounds.kidMode}
        ambientSound={ambientSound}
        onAmbientSoundChange={setAmbientSound}
      />
      <MobileStudioBottomNav kidMode={sounds.kidMode} />
    </div>
  );
};

export default Index;
