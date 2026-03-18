import { useRef, useCallback, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStudio } from '@/hooks/useStudio';
import { useCustomTextures } from '@/hooks/useCustomTextures';
import { useCustomTemplate } from '@/hooks/useCustomTemplate';
import { useWall } from '@/hooks/useWall';
import { useUserTier } from '@/hooks/useUserTier';
import { TextureLibrary } from '@/components/studio/TextureLibrary';
import { Canvas } from '@/components/studio/Canvas';
import { TopToolbar } from '@/components/studio/TopToolbar';
import { BottomBar } from '@/components/studio/BottomBar';
import { FloatingToolbar } from '@/components/studio/FloatingToolbar';
import { VibeSelector } from '@/components/studio/VibeSelector';
import { NavBar } from '@/components/NavBar';
import { PaywallModal } from '@/components/wall/PaywallModal';
import { Vibe } from '@/types/studio';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studio = useStudio();
  const { customTextures, addCustomTexture, removeCustomTexture } = useCustomTextures();
  const { customTemplate, templateOpacity, setTemplateOpacity, uploadTemplate, clearTemplate } = useCustomTemplate();
  const wall = useWall();
  const { isPremium, canSave, upgradeToPremium } = useUserTier();
  const canvasRef = useRef<HTMLDivElement>(null!);
  const [vibesOpen, setVibesOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingSave, setPendingSave] = useState<{ preview: string; name: string; vibeName?: string } | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);

  // Load design state when editing from wall
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const design = wall.designs.find(d => d.id === editId);
      if (design?.studioState) {
        studio.loadState(design.studioState);
        setEditingDesignId(editId);
      }
    }
  }, []); // Run once on mount

  const handleDragStartLib = useCallback((textureId: string) => {}, []);

  const handleDrop = useCallback((textureId: string, x: number, y: number) => {
    studio.addElement(textureId, x, y);
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
      const studioState = studio.getState();

      // If editing an existing design, update it
      if (editingDesignId) {
        wall.updateDesign(editingDesignId, { previewImage: dataUrl, name, vibeName, studioState });
        toast({ title: 'Updated!', description: 'Your design has been updated on My Wall.' });
        return;
      }

      if (!canSave(wall.designs.length)) {
        setPendingSave({ preview: dataUrl, name, vibeName });
        setShowPaywall(true);
        return;
      }

      wall.addDesign(dataUrl, name, vibeName, studioState);
      toast({ title: 'Saved to Wall!', description: 'Your design has been added to My Wall.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save design.', variant: 'destructive' });
    }
  }, [studio, wall, canSave, editingDesignId]);

  const handleReplace = useCallback(() => {
    if (pendingSave) {
      wall.replaceDesign(pendingSave.preview, pendingSave.name, pendingSave.vibeName);
      toast({ title: 'Design replaced!', description: 'Your old design was replaced with the new one.' });
    }
    setPendingSave(null);
    setShowPaywall(false);
  }, [pendingSave, wall]);

  const handleUnlock = useCallback(() => {
    // TODO: real Stripe payment
    upgradeToPremium();
    if (pendingSave) {
      wall.addDesign(pendingSave.preview, pendingSave.name, pendingSave.vibeName);
    }
    setPendingSave(null);
    setShowPaywall(false);
    toast({ title: 'Welcome to Premium!', description: 'Your wall is now fully unlocked.' });
  }, [pendingSave, wall, upgradeToPremium]);

  const handleTextureClick = useCallback((textureId: string) => {
    if (studio.activeVibe && studio.selectedSectionId) {
      studio.fillSection(studio.selectedSectionId, textureId);
    }
  }, [studio.activeVibe, studio.selectedSectionId, studio.fillSection]);

  const handleUploadTexture = useCallback(async (file: File) => {
    await addCustomTexture(file);
    toast({ title: 'Texture added!', description: `"${file.name}" is now available in your library.` });
  }, [addCustomTexture]);

  const handleUploadTemplate = useCallback(async (file: File) => {
    await uploadTemplate(file);
    toast({ title: 'Reference set!', description: 'Image is shown as a canvas background guide.' });
  }, [uploadTemplate]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <TopToolbar
        frameSize={studio.frameSize}
        frameColor={studio.frameColor}
        onFrameSizeChange={studio.setFrameSize}
        onFrameColorChange={studio.setFrameColor}
        onGenerate={studio.generateRandom}
        onShuffle={studio.shuffleElements}
        onClear={studio.clearCanvas}
        onSave={handleExport}
        onSaveToWall={handleSaveToWall}
        onToggleVibes={() => setVibesOpen(v => !v)}
        vibesActive={vibesOpen}
        customTemplate={customTemplate}
        templateOpacity={templateOpacity}
        onUploadTemplate={handleUploadTemplate}
        onClearTemplate={clearTemplate}
        onTemplateOpacityChange={setTemplateOpacity}
        isPremium={isPremium}
        onRequestUpgrade={() => setShowPaywall(true)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[260px] flex-shrink-0">
          <TextureLibrary
            onDragStart={handleDragStartLib}
            onTextureClick={handleTextureClick}
            activeSectionId={studio.activeVibe ? studio.selectedSectionId : null}
            customTextures={customTextures}
            onUploadTexture={handleUploadTexture}
            onRemoveCustomTexture={removeCustomTexture}
            isPremium={isPremium}
            onRequestUpgrade={() => setShowPaywall(true)}
          />
        </div>
        <Canvas
          elements={studio.elements}
          selectedId={studio.selectedId}
          frameSize={studio.frameSize}
          frameColor={studio.frameColor}
          activeVibe={studio.activeVibe}
          vibeFills={studio.vibeFills}
          selectedSectionId={studio.selectedSectionId}
          customTemplate={customTemplate}
          templateOpacity={templateOpacity}
          customTextures={customTextures}
          onSelect={studio.setSelectedId}
          onUpdate={studio.updateElement}
          onDrop={handleDrop}
          onSelectSection={studio.selectSection}
          onDropInSection={studio.fillSection}
          onDropAsSwatch={handleDrop}
          canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
        />

        <div className="w-[240px] flex-shrink-0 border-l border-border bg-popover overflow-y-auto">
          {studio.selectedElement ? (
            <FloatingToolbar
              element={studio.selectedElement}
              onUpdate={(updates) => studio.updateElement(studio.selectedId!, updates)}
              onUpdateEffects={(effects) => studio.updateEffects(studio.selectedId!, effects)}
              onDuplicate={() => studio.duplicateElement(studio.selectedId!)}
              onDelete={() => studio.deleteElement(studio.selectedId!)}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-xs text-muted-foreground text-center">Click an element to edit its shape, size, and effects</p>
            </div>
          )}
        </div>

        <VibeSelector
          isOpen={vibesOpen}
          activeVibeId={studio.activeVibe?.id ?? null}
          isPremium={isPremium}
          onClose={() => setVibesOpen(false)}
          onSelectVibe={handleSelectVibe}
          onShuffle={studio.shuffleVibeFills}
          onRequestUpgrade={() => setShowPaywall(true)}
        />
      </div>

      <BottomBar
        frameSize={studio.frameSize}
        onFrameSizeChange={studio.setFrameSize}
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
