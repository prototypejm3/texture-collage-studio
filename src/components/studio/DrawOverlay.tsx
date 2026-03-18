import { useCallback, useRef } from 'react';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  onFinishDraw: (pathD: string) => void;
  onCancel: () => void;
}

function smoothToSvgPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    const [a, b] = points;
    // Make a small ellipse between two points
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const rx = Math.max(Math.abs(b.x - a.x) / 2, 8);
    const ry = Math.max(Math.abs(b.y - a.y) / 2, 8);
    return `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;
  }

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

  // Allow drawing beyond canvas bounds — no clamping
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

  const updatePath = useCallback(() => {
    const pts = pointsRef.current;
    if (pts.length < 2) return;
    const d = smoothToSvgPath(pts);
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
    // Only add point if moved enough (3px in canvas coords) to avoid clutter
    const last = pointsRef.current[pointsRef.current.length - 1];
    const dx = pt.x - last.x;
    const dy = pt.y - last.y;
    if (dx * dx + dy * dy > 9) {
      pointsRef.current.push(pt);
      updatePath();
    }
  }, [getPoint, updatePath]);

  const handleEnd = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const pts = pointsRef.current;
    if (pts.length >= 2) {
      const pathD = smoothToSvgPath(pts);
      if (pathD) onFinishDraw(pathD);
    }
    pointsRef.current = [];
    if (livePathRef.current) livePathRef.current.setAttribute('d', '');
    if (smudgePathRef.current) smudgePathRef.current.setAttribute('d', '');
  }, [onFinishDraw]);

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 50, cursor: 'crosshair' }}
    >
      {/* Instructions */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[51] px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg flex items-center gap-2">
        ✏️ Draw a shape — any size
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
        style={{ overflow: 'visible' }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <rect width="100%" height="100%" fill="hsla(40, 20%, 95%, 0.06)" />

        {/* Soft shadow */}
        <path
          ref={smudgePathRef}
          d=""
          fill="none"
          stroke="hsla(0, 0%, 30%, 0.08)"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Main line */}
        <path
          ref={livePathRef}
          d=""
          fill="hsla(220, 60%, 50%, 0.06)"
          stroke="hsl(220, 60%, 45%)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="6 3"
          opacity={0.8}
        />
      </svg>
    </div>
  );
}
