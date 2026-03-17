import { useState, useCallback } from 'react';
import { Vibe, VibeFills, TextureSwatch } from '@/types/studio';
import { textures } from '@/data/textures';
import { Paintbrush, Scissors } from 'lucide-react';

interface Props {
  vibe: Vibe;
  fills: VibeFills;
  selectedSectionId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
  onDropAsSwatch: (textureId: string, x: number, y: number) => void;
  customTextures?: TextureSwatch[];
}

interface DropChoice {
  sectionId: string;
  textureId: string;
  screenX: number;
  screenY: number;
}

export function VibeOutline({
  vibe, fills, selectedSectionId,
  canvasWidth, canvasHeight,
  onSelectSection, onDropInSection, onDropAsSwatch,
  customTextures = [],
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dropChoice, setDropChoice] = useState<DropChoice | null>(null);

  const patternIdFor = (sectionId: string, textureId: string) => `fill-${sectionId}-${textureId}`;

  const handleDrop = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredId(null);
    const textureId = e.dataTransfer.getData('textureId');
    if (!textureId) return;

    // Show choice popup at drop position
    setDropChoice({
      sectionId,
      textureId,
      screenX: e.clientX,
      screenY: e.clientY,
    });
  }, []);

  const handleChooseFill = useCallback(() => {
    if (!dropChoice) return;
    onDropInSection(dropChoice.sectionId, dropChoice.textureId);
    setDropChoice(null);
  }, [dropChoice, onDropInSection]);

  const handleChooseSwatch = useCallback(() => {
    if (!dropChoice) return;
    // Convert screen coords to approximate canvas-relative position
    const svgEl = document.querySelector('[data-vibe-svg]') as SVGSVGElement | null;
    if (svgEl) {
      const rect = svgEl.getBoundingClientRect();
      const x = dropChoice.screenX - rect.left - 50;
      const y = dropChoice.screenY - rect.top - 50;
      onDropAsSwatch(dropChoice.textureId, x, y);
    }
    setDropChoice(null);
  }, [dropChoice, onDropAsSwatch]);

  return (
    <>
      <svg
        data-vibe-svg
        viewBox={vibe.viewBox}
        width={canvasWidth}
        height={canvasHeight}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <defs>
          {/* Create pattern fills for each filled section */}
          {Object.entries(fills).map(([sectionId, textureId]) => {
            const allTex = [...textures, ...customTextures];
            const tex = allTex.find(t => t.id === textureId);
            if (!tex) return null;
            return (
              <pattern
                key={sectionId}
                id={`fill-${sectionId}`}
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
              >
                <rect width="40" height="40" fill="transparent" />
                <foreignObject width="40" height="40">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: tex.cssBackground,
                      backgroundSize: '40px 40px',
                    }}
                  />
                </foreignObject>
              </pattern>
            );
          })}
        </defs>

        {vibe.sections.map(section => {
          const isFilled = !!fills[section.id];
          const isHovered = hoveredId === section.id;
          const isSelected = selectedSectionId === section.id;

          return (
            <g key={section.id}>
              {/* Fill layer */}
              <path
                d={section.path}
                fill={isFilled ? `url(#fill-${section.id})` : 'transparent'}
                className="pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSection(section.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setHoveredId(section.id);
                }}
                onDragLeave={() => setHoveredId(null)}
                onDrop={(e) => handleDrop(e, section.id)}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
              />

              {/* Outline stroke */}
              <path
                d={section.path}
                fill="none"
                stroke={isSelected ? 'hsl(24, 80%, 50%)' : isHovered ? 'hsl(24, 60%, 60%)' : 'hsl(220, 15%, 25%)'}
                strokeWidth={isSelected ? 4.5 : 3.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="pointer-events-none transition-colors"
                style={{ opacity: isFilled ? 0.5 : 0.9 }}
              />

              {/* Empty state label */}
              {!isFilled && (
                <VibeLabel section={section} isHovered={isHovered} />
              )}

              {/* Hover highlight */}
              {isHovered && !isFilled && (
                <path
                  d={section.path}
                  fill="hsl(24, 80%, 50%)"
                  opacity={0.06}
                  className="pointer-events-none"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Drop choice popup */}
      {dropChoice && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setDropChoice(null)}
          />
          <div
            className="fixed z-[101] bg-popover border border-border rounded-xl shadow-xl py-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: dropChoice.screenX,
              top: dropChoice.screenY,
              transform: 'translate(-50%, -100%) translateY(-8px)',
            }}
          >
            <button
              onClick={handleChooseFill}
              className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary flex items-center gap-2.5 text-foreground transition-colors"
            >
              <Paintbrush className="w-3.5 h-3.5 text-primary" />
              Fill whole shape
            </button>
            <div className="border-t border-border mx-2 my-0.5" />
            <button
              onClick={handleChooseSwatch}
              className="w-full text-left px-3.5 py-2 text-xs hover:bg-secondary flex items-center gap-2.5 text-foreground transition-colors"
            >
              <Scissors className="w-3.5 h-3.5 text-muted-foreground" />
              Drop single swatch
            </button>
          </div>
        </>
      )}
    </>
  );
}

/** Renders a centered label inside the section path bounding box */
function VibeLabel({ section, isHovered }: { section: { id: string; label: string; path: string }; isHovered: boolean }) {
  const center = getPathCenter(section.path);
  if (!center) return null;

  return (
    <text
      x={center.x}
      y={center.y}
      textAnchor="middle"
      dominantBaseline="middle"
      className="pointer-events-none select-none"
      fill={isHovered ? 'hsl(24, 80%, 45%)' : 'hsl(220, 10%, 55%)'}
      fontSize="12"
      fontFamily="'DM Sans', sans-serif"
      fontWeight="500"
    >
      {section.label}
    </text>
  );
}

/** Rough center of SVG path by parsing coordinates */
function getPathCenter(path: string): { x: number; y: number } | null {
  const nums = path.match(/[\d.]+/g);
  if (!nums || nums.length < 4) return null;
  const coords: number[] = nums.map(Number);
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < coords.length - 1; i += 2) {
    sumX += coords[i];
    sumY += coords[i + 1];
    count++;
  }
  return count > 0 ? { x: sumX / count, y: sumY / count } : null;
}
