import { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { useStudio } from '@/hooks/useStudio';
import { useCustomTextures } from '@/hooks/useCustomTextures';
import { useCustomTemplate } from '@/hooks/useCustomTemplate';
import { TextureLibrary } from '@/components/studio/TextureLibrary';
import { Canvas } from '@/components/studio/Canvas';
import { TopToolbar } from '@/components/studio/TopToolbar';
import { FloatingToolbar } from '@/components/studio/FloatingToolbar';
import { VibeSelector } from '@/components/studio/VibeSelector';
import { Vibe } from '@/types/studio';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const studio = useStudio();
  const { customTextures, addCustomTexture, removeCustomTexture } = useCustomTextures();
  const { customTemplate, templateOpacity, setTemplateOpacity, uploadTemplate, clearTemplate } = useCustomTemplate();
  const canvasRef = useRef<HTMLDivElement>(null!);
  const [vibesOpen, setVibesOpen] = useState(false);

  const handleDragStartLib = useCallback((textureId: string) => {
    // TextureLibrary handles dataTransfer.setData('textureId', ...)
  }, []);

  const handleDrop = useCallback((textureId: string, x: number, y: number) => {
    studio.addElement(textureId, x, y);
  }, [studio]);

  const handleSelectVibe = useCallback((vibe: Vibe) => {
    studio.selectVibe(vibe);
  }, [studio]);

  const handleSave = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'shadow-box.png';
      link.href = dataUrl;
      link.click();
      toast({ title: 'Saved!', description: 'Your shadow box has been exported as PNG.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to export image.', variant: 'destructive' });
    }
  }, []);

  const handleTextureClick = useCallback((textureId: string) => {
    if (studio.activeVibe && studio.selectedSectionId) {
      studio.fillSection(studio.selectedSectionId, textureId);
    }
  }, [studio]);

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
      <TopToolbar
        frameSize={studio.frameSize}
        frameColor={studio.frameColor}
        onFrameSizeChange={studio.setFrameSize}
        onFrameColorChange={studio.setFrameColor}
        onGenerate={studio.generateRandom}
        onShuffle={studio.shuffleElements}
        onClear={studio.clearCanvas}
        onSave={handleSave}
        onToggleVibes={() => setVibesOpen(v => !v)}
        vibesActive={vibesOpen}
        customTemplate={customTemplate}
        templateOpacity={templateOpacity}
        onUploadTemplate={handleUploadTemplate}
        onClearTemplate={clearTemplate}
        onTemplateOpacityChange={setTemplateOpacity}
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
          canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
        />
        {studio.selectedElement && !studio.activeVibe && (
          <FloatingToolbar
            element={studio.selectedElement}
            onUpdate={(updates) => studio.updateElement(studio.selectedId!, updates)}
            onUpdateEffects={(effects) => studio.updateEffects(studio.selectedId!, effects)}
            onDuplicate={() => studio.duplicateElement(studio.selectedId!)}
            onDelete={() => studio.deleteElement(studio.selectedId!)}
          />
        )}

        {/* Vibe selector overlay */}
        <VibeSelector
          isOpen={vibesOpen}
          activeVibeId={studio.activeVibe?.id ?? null}
          onClose={() => setVibesOpen(false)}
          onSelectVibe={handleSelectVibe}
          onShuffle={studio.shuffleVibeFills}
        />
      </div>

      {/* SVG Filters for wrinkle effects */}
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
