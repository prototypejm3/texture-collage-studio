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
import { RightSidebar } from '@/components/studio/RightSidebar';

import { PaywallModal } from '@/components/wall/PaywallModal';
import { GenerateVibeModal } from '@/components/studio/GenerateVibeModal';
import { AmbientSoundPlayer } from '@/components/wall/AmbientSound';
import { useGenerateVibe } from '@/hooks/useGenerateVibe';
import { Vibe } from '@/types/studio';
import { AmbientSound as AmbientSoundType } from '@/types/wall';
import { toast } from '@/hooks/use-toast';

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
  const [pendingSave, setPendingSave] = useState<{ preview: string; name: string; vibeName?: string } | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const draftKeyRef = useRef<string>(`draft-${Date.now()}`);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');

  // Load design state when editing from wall
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const design = wall.designs.find(d => d.id === editId);
      if (design?.studioState) {
        studio.loadState(design.studioState);
        setEditingDesignId(editId);
        draftKeyRef.current = editId; // reuse same id for draft saves
      }
    }
  }, []); // Run once on mount

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
        const studioState = studio.getState();
        // Don't overwrite a design that's already saved (status = 'display')
        if (editingDesignId) {
          wall.updateDesign(editingDesignId, { previewImage: dataUrl, studioState, updatedAt: new Date().toISOString() } as any);
        } else {
          wall.saveDraft(draftKeyRef.current, dataUrl, name, vibeName, studioState);
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

      // If there's an existing draft, promote it instead of creating new
      const draftExists = wall.designs.find(d => d.id === draftKeyRef.current);
      if (draftExists) {
        wall.updateDesign(draftKeyRef.current, { previewImage: dataUrl, name, vibeName, studioState, status: 'display' as any });
      } else {
        wall.addDesign(dataUrl, name, vibeName, studioState);
      }
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
    upgradeToPremium();
    if (pendingSave) {
      wall.addDesign(pendingSave.preview, pendingSave.name, pendingSave.vibeName);
    }
    setPendingSave(null);
    setShowPaywall(false);
    toast({ title: 'Welcome to Premium!', description: 'Your wall is now fully unlocked.' });
  }, [pendingSave, wall, upgradeToPremium]);

  const handleTextureClick = useCallback((textureId: string) => {
    if (studio.selectedSectionId) {
      studio.fillSection(studio.selectedSectionId, textureId);
    } else if (!studio.selectedId && !studio.activeVibe) {
      // Toggle background: click same texture to clear
      studio.setBackgroundTextureId(studio.backgroundTextureId === textureId ? null : textureId);
    }
  }, [studio.selectedSectionId, studio.fillSection, studio.selectedId, studio.activeVibe, studio.setBackgroundTextureId]);

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
      const vibe = vibeGen.toVibe(result);
      // Apply the mood's texture fills to current stencil sections
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
      // Apply frame style if suggested
      if (result.frameChoice) {
        const validFrameStyles = ['gold', 'chrome', 'copper', 'silver', 'minimal', 'shadow-box', 'wood', 'floating', 'polaroid', 'none'];
        if (validFrameStyles.includes(result.frameChoice)) {
          studio.setWallFrameStyle(result.frameChoice as any);
        }
      }
      toast({ title: `${result.emoji} ${result.name}`, description: 'Mood applied — textures auto-filled!' });
    }
  }, [vibeGen, studio]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
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
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[260px] flex-shrink-0">
          <TextureLibrary
            onDragStart={handleDragStartLib}
            onTextureClick={handleTextureClick}
            activeSectionId={studio.selectedSectionId}
            customTextures={customTextures}
            onUploadTexture={handleUploadTexture}
            onRemoveCustomTexture={removeCustomTexture}
            isPremium={isPremium}
            onRequestUpgrade={() => setShowPaywall(true)}
            selectedElement={studio.selectedElement ?? null}
            onUpdateElement={(updates) => studio.updateElement(studio.selectedId!, updates)}
            onUpdateEffects={(effects) => studio.updateEffects(studio.selectedId!, effects)}
            onDuplicate={() => studio.duplicateElement(studio.selectedId!)}
            onDelete={() => studio.deleteElement(studio.selectedId!)}
            drawMode={studio.drawMode}
            onToggleDraw={() => studio.setDrawMode(!studio.drawMode)}
          />
        </div>
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
          onSelect={studio.setSelectedId}
          onUpdate={studio.updateElement}
          onDrop={handleDrop}
          onSelectSection={studio.selectSection}
          onDropInSection={studio.fillSection}
          onDropAsSwatch={handleDrop}
          onDetachSection={studio.detachSection}
          onDeleteSection={studio.deleteSection}
          onUpdateSectionTransform={studio.updateSectionTransform}
          canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
          drawMode={studio.drawMode}
          onFinishDraw={studio.addCustomSection}
          onCancelDraw={() => studio.setDrawMode(false)}
        />

        <RightSidebar
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
        />
      </div>

      <BottomBar
        frameSize={studio.frameSize}
        onFrameSizeChange={studio.setFrameSize}
        wallFrameStyle={studio.wallFrameStyle}
        onWallFrameStyleChange={studio.setWallFrameStyle}
        onClear={studio.clearCanvas}
        onSave={handleExport}
        onSaveToWall={handleSaveToWall}
      />

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
