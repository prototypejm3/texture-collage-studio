import { useState } from 'react';
import { Vibe, VibeFills } from '@/types/studio';
import { textures } from '@/data/textures';

interface Props {
  vibe: Vibe;
  fills: VibeFills;
  selectedSectionId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
}

export function VibeOutline({
  vibe, fills, selectedSectionId,
  canvasWidth, canvasHeight,
  onSelectSection, onDropInSection,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute scale from vibe viewBox to actual canvas size
  const [, , vbW, vbH] = vibe.viewBox.split(' ').map(Number);
  const scaleX = canvasWidth / vbW;
  const scaleY = canvasHeight / vbH;

  return (
    <svg
      viewBox={vibe.viewBox}
      width={canvasWidth}
      height={canvasHeight}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <defs>
        {/* Create pattern fills for each filled section */}
        {Object.entries(fills).map(([sectionId, textureId]) => {
          const tex = textures.find(t => t.id === textureId);
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
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setHoveredId(null);
                const textureId = e.dataTransfer.getData('textureId');
                if (textureId) onDropInSection(section.id, textureId);
              }}
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
  );
}

/** Renders a centered label inside the section path bounding box */
function VibeLabel({ section, isHovered }: { section: { id: string; label: string; path: string }; isHovered: boolean }) {
  // Simple center calculation from the path's bounding area
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
