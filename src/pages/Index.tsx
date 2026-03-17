import { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { useStudio } from '@/hooks/useStudio';
import { TextureLibrary } from '@/components/studio/TextureLibrary';
import { Canvas } from '@/components/studio/Canvas';
import { TopToolbar } from '@/components/studio/TopToolbar';
import { FloatingToolbar } from '@/components/studio/FloatingToolbar';
import { VibeSelector } from '@/components/studio/VibeSelector';
import { Vibe } from '@/types/studio';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const studio = useStudio();
  const canvasRef = useRef<HTMLDivElement>(null!);
  const dragTextureRef = useRef<string | null>(null);
  const [vibesOpen, setVibesOpen] = useState(false);

  const handleDragStart = useCallback((textureId: string) => {
    dragTextureRef.current = textureId;
  }, []);

  const handleDrop = useCallback((textureId: string, x: number, y: number) => {
    studio.addElement(textureId, x, y);
  }, [studio]);

  const handleDropInSection = useCallback((sectionId: string, textureId: string) => {
    if (!studio.activeVibe) return;
    const section = studio.activeVibe.template.sections.find(s => s.id === sectionId);
    if (!section || !canvasRef.current) return;
    const rect = canvasRef.current;
    studio.addElementToSection(sectionId, textureId, section, rect.offsetWidth, rect.offsetHeight);
  }, [studio]);

  const handleSelectVibe = useCallback((vibe: Vibe) => {
    if (!canvasRef.current) return;
    studio.applyVibe(vibe, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
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
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[260px] flex-shrink-0">
          <TextureLibrary onDragStart={handleDragStart} />
        </div>
        <Canvas
          elements={studio.elements}
          selectedId={studio.selectedId}
          frameSize={studio.frameSize}
          frameColor={studio.frameColor}
          templateSections={studio.activeVibe?.template.sections ?? null}
          onSelect={studio.setSelectedId}
          onUpdate={studio.updateElement}
          onDrop={handleDrop}
          onDropInSection={handleDropInSection}
          canvasRef={canvasRef as React.RefObject<HTMLDivElement>}
        />
        {studio.selectedElement && (
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
          onShuffle={studio.shuffleVibe}
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
