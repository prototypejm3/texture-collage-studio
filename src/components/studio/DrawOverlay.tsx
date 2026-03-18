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
      style={{ zIndex: 50, cursor: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M3 21l1.65-3.8a.85.85 0 01.25-.34L17.64 4.12a2.1 2.1 0 012.97 2.97L7.87 19.83a.85.85 0 01-.34.25L3 21z\' fill=\'%23555\' stroke=\'%23333\' stroke-width=\'0.5\'/%3E%3Cpath d=\'M3 21l.6-1.4\' stroke=\'%23888\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E") 2 22, crosshair' }}
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
        {/* Subtle paper-like overlay */}
        <rect width="100%" height="100%" fill="hsla(40, 20%, 95%, 0.08)" />

        {/* SVG filter for pencil-sketch look */}
        <defs>
          <filter id="pencil-rough" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Drawing preview — pencil stroke */}
        {currentPath && (
          <>
            {/* Shadow / graphite smudge */}
            <path
              d={currentPath}
              fill="none"
              stroke="hsla(0, 0%, 30%, 0.08)"
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#pencil-rough)"
            />
            {/* Main pencil line */}
            <path
              d={currentPath}
              fill="hsla(0, 0%, 40%, 0.06)"
              stroke="hsl(0, 0%, 25%)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#pencil-rough)"
              opacity={0.85}
            />
            {/* Lighter overlay pass for texture */}
            <path
              d={currentPath}
              fill="none"
              stroke="hsla(0, 0%, 45%, 0.4)"
              strokeWidth={0.8}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="2 1.5"
              filter="url(#pencil-rough)"
            />
          </>
        )}

        {/* Hint text */}
        {points.length > 0 && points.length < 10 && (
          <text
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            textAnchor="middle"
            fill="hsl(0, 0%, 50%)"
            fontSize="13"
            fontFamily="'DM Sans', sans-serif"
            fontStyle="italic"
            opacity={0.5}
          >
            Keep drawing...
          </text>
        )}
      </svg>
    </div>
  );
}
