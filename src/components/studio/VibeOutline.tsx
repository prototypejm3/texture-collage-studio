import { useState, useCallback, useMemo } from 'react';
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
  onDetachSection: (sectionId: string) => void;
  customTextures?: TextureSwatch[];
}

interface DropChoice {
  sectionId: string;
  textureId: string;
  screenX: number;
  screenY: number;
}

function getTextureBackgroundSize(texture: TextureSwatch) {
  return texture.id.startsWith('custom-') || texture.cssBackground.startsWith('url(')
    ? 'cover'
    : '40px 40px';
}

export function VibeOutline({
  vibe, fills, selectedSectionId,
  canvasWidth, canvasHeight,
  onSelectSection, onDropInSection, onDropAsSwatch,
  customTextures = [],
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dropChoice, setDropChoice] = useState<DropChoice | null>(null);
  const allTextures = useMemo(() => [...textures, ...customTextures], [customTextures]);

  const handleDrop = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredId(null);
    const textureId = e.dataTransfer.getData('textureId');
    if (!textureId) return;

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
    const svgEl = document.querySelector('[data-vibe-svg]') as SVGSVGElement | null;
    if (svgEl) {
      const rect = svgEl.getBoundingClientRect();
      const x = dropChoice.screenX - rect.left - 50;
      const y = dropChoice.screenY - rect.top - 50;
      onDropAsSwatch(dropChoice.textureId, x, y);
    }
    setDropChoice(null);
  }, [dropChoice, onDropAsSwatch]);

  // Parse viewBox to get SVG coordinate dimensions
  const [vbX, vbY, vbW, vbH] = useMemo(() => {
    const parts = vibe.viewBox.split(/\s+/).map(Number);
    return parts.length === 4 ? parts : [0, 0, 480, 480];
  }, [vibe.viewBox]);

  return (
    <>
      {/* Single SVG handles both texture fills and strokes — guaranteed alignment */}
      <svg
        data-vibe-svg
        viewBox={vibe.viewBox}
        width={canvasWidth}
        height={canvasHeight}
        className="absolute inset-0"
        style={{ zIndex: 10 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {vibe.sections.map(section => (
            <clipPath key={`clip-${section.id}`} id={`clip-${section.id}`}>
              <path d={section.path} />
            </clipPath>
          ))}
        </defs>

        {/* Texture fills using foreignObject inside clipPath */}
        {vibe.sections.map(section => {
          const textureId = fills[section.id];
          if (!textureId) return null;

          const texture = allTextures.find(t => t.id === textureId);
          if (!texture) return null;

          return (
            <foreignObject
              key={`fill-${section.id}-${textureId}`}
              x={vbX}
              y={vbY}
              width={vbW}
              height={vbH}
              clipPath={`url(#clip-${section.id})`}
              className="pointer-events-none"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: texture.cssBackground,
                  backgroundSize: getTextureBackgroundSize(texture),
                  backgroundPosition: 'center',
                }}
              />
            </foreignObject>
          );
        })}

        {/* Interactive paths and strokes */}
        {vibe.sections.map(section => {
          const isFilled = !!fills[section.id];
          const isHovered = hoveredId === section.id;
          const isSelected = selectedSectionId === section.id;

          return (
            <g key={section.id}>
              {/* Hit area */}
              <path
                d={section.path}
                fill="transparent"
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

              {/* Selected highlight */}
              {isSelected && (
                <path
                  d={section.path}
                  fill="hsl(24, 80%, 50%)"
                  opacity={0.12}
                  className="pointer-events-none animate-pulse"
                />
              )}

              {/* Hover highlight */}
              {isHovered && !isSelected && !isFilled && (
                <path
                  d={section.path}
                  fill="hsl(24, 80%, 50%)"
                  opacity={0.06}
                  className="pointer-events-none"
                />
              )}

              {/* Stroke */}
              <path
                d={section.path}
                fill="none"
                stroke={isSelected ? 'hsl(24, 80%, 50%)' : isHovered ? 'hsl(24, 60%, 60%)' : 'hsl(220, 15%, 25%)'}
                strokeWidth={isSelected ? 4.5 : 3.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="pointer-events-none transition-colors"
                style={{ opacity: isFilled && !isSelected ? 0.5 : 0.9 }}
              />
            </g>
          );
        })}
      </svg>

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
