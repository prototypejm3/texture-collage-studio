import { TemplateSection } from '@/types/studio';

interface Props {
  sections: TemplateSection[];
  canvasWidth: number;
  canvasHeight: number;
  filledSectionIds: Set<string>;
  onDropInSection: (sectionId: string, textureId: string) => void;
}

export function TemplateSections({ sections, canvasWidth, canvasHeight, filledSectionIds, onDropInSection }: Props) {
  return (
    <>
      {sections.map(section => {
        const isFilled = filledSectionIds.has(section.id);
        const x = (section.x / 100) * canvasWidth;
        const y = (section.y / 100) * canvasHeight;
        const w = (section.width / 100) * canvasWidth;
        const h = (section.height / 100) * canvasHeight;
        const isCircle = section.shape === 'circle';

        return (
          <div
            key={section.id}
            className="absolute pointer-events-auto"
            style={{
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: isCircle ? '50%' : '4px',
              border: isFilled ? 'none' : '2px dashed hsla(var(--muted-foreground), 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 0,
            }}
            onDragOver={e => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={e => {
              e.preventDefault();
              e.stopPropagation();
              const textureId = e.dataTransfer.getData('textureId');
              if (textureId) onDropInSection(section.id, textureId);
            }}
          >
            {!isFilled && (
              <span className="text-[10px] text-muted-foreground/40 select-none text-center leading-tight px-2">
                Drop texture here
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}
