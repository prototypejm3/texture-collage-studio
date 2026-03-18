import { useCallback, useRef } from 'react';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  onFinishDraw: (pathD: string) => void;
  onCancel: () => void;
}

function smoothToSvgPath(points: { x: number; y: number }[]): string {
  if (points.length < 3) return '';
  // Use catmull-rom → cubic bezier for smooth curves
  const pts = points;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

export function DrawOverlay({ canvasWidth, canvasHeight, onFinishDraw, onCancel }: Props) {
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const isDrawingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const livePathRef = useRef<SVGPathElement>(null);
  const smudgePathRef = useRef<SVGPathElement>(null);

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

  // Directly mutate refs + DOM for zero-lag drawing
  const updatePath = useCallback(() => {
    const pts = pointsRef.current;
    if (pts.length < 2) return;
    // Downsample for perf: keep every 2nd point
    const sampled = pts.filter((_, i) => i % 2 === 0 || i === pts.length - 1);
    const d = sampled.length >= 3 ? smoothToSvgPath(sampled) : '';
    if (livePathRef.current) livePathRef.current.setAttribute('d', d);
    if (smudgePathRef.current) smudgePathRef.current.setAttribute('d', d);
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pt = getPoint(e);
    if (!pt) return;
    isDrawingRef.current = true;
    pointsRef.current = [pt];
    updatePath();
  }, [getPoint, updatePath]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pt = getPoint(e);
    if (!pt) return;
    pointsRef.current.push(pt);
    updatePath();
  }, [getPoint, updatePath]);

  const handleEnd = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const pts = pointsRef.current;
    if (pts.length >= 5) {
      const sampled = pts.filter((_, i) => i % 2 === 0 || i === pts.length - 1);
      const pathD = smoothToSvgPath(sampled);
      if (pathD) onFinishDraw(pathD);
    }
    pointsRef.current = [];
    if (livePathRef.current) livePathRef.current.setAttribute('d', '');
    if (smudgePathRef.current) smudgePathRef.current.setAttribute('d', '');
  }, [onFinishDraw]);

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
        <rect width="100%" height="100%" fill="hsla(40, 20%, 95%, 0.06)" />

        <defs>
          <filter id="pencil-rough" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Graphite smudge shadow */}
        <path
          ref={smudgePathRef}
          d=""
          fill="none"
          stroke="hsla(0, 0%, 30%, 0.06)"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#pencil-rough)"
        />
        {/* Main pencil line */}
        <path
          ref={livePathRef}
          d=""
          fill="hsla(0, 0%, 40%, 0.04)"
          stroke="hsl(0, 0%, 25%)"
          strokeWidth={1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#pencil-rough)"
          opacity={0.85}
        />
      </svg>
    </div>
  );
}
