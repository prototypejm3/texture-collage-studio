import { useState, useCallback, useRef } from 'react';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  onFinishDraw: (pathD: string) => void;
  onCancel: () => void;
}

function simplifyPoints(points: { x: number; y: number }[], tolerance = 3): { x: number; y: number }[] {
  if (points.length < 3) return points;
  const result = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const dx = points[i].x - prev.x;
    const dy = points[i].y - prev.y;
    if (Math.sqrt(dx * dx + dy * dy) >= tolerance) {
      result.push(points[i]);
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

function pointsToSvgPath(points: { x: number; y: number }[]): string {
  if (points.length < 3) return '';
  const simplified = simplifyPoints(points, 4);
  let d = `M${simplified[0].x.toFixed(1)},${simplified[0].y.toFixed(1)}`;
  for (let i = 1; i < simplified.length; i++) {
    d += ` L${simplified[i].x.toFixed(1)},${simplified[i].y.toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

export function DrawOverlay({ canvasWidth, canvasHeight, onFinishDraw, onCancel }: Props) {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasWidth, canvasHeight]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pt = getPoint(e);
    if (!pt) return;
    setIsDrawing(true);
    setPoints([pt]);
  }, [getPoint]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getPoint(e);
    if (!pt) return;
    setPoints(prev => [...prev, pt]);
  }, [isDrawing, getPoint]);

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (points.length >= 10) {
      const pathD = pointsToSvgPath(points);
      if (pathD) {
        onFinishDraw(pathD);
      }
    }
    setPoints([]);
  }, [isDrawing, points, onFinishDraw]);

  const currentPath = points.length >= 2 ? pointsToSvgPath(points) : '';

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 50, cursor: 'crosshair' }}
    >
      {/* Instructions */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[51] px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg flex items-center gap-2">
        ✏️ Draw a shape — release to finish
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="ml-1 px-1.5 py-0.5 rounded bg-primary-foreground/20 hover:bg-primary-foreground/30 text-[10px] transition-colors"
        >
          Cancel
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        width="100%"
        height="100%"
        className="absolute inset-0"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Semi-transparent overlay */}
        <rect width="100%" height="100%" fill="hsla(24, 80%, 50%, 0.05)" />

        {/* Drawing preview */}
        {currentPath && (
          <>
            <path
              d={currentPath}
              fill="hsla(24, 80%, 50%, 0.15)"
              stroke="hsl(24, 80%, 50%)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="6 3"
            />
          </>
        )}

        {/* Points preview */}
        {points.length > 0 && points.length < 10 && (
          <text
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            textAnchor="middle"
            fill="hsl(24, 80%, 50%)"
            fontSize="14"
            fontFamily="'DM Sans', sans-serif"
            opacity={0.6}
          >
            Keep drawing...
          </text>
        )}
      </svg>
    </div>
  );
}
