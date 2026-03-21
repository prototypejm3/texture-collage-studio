import { useCallback, useRef } from 'react';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  onFinishDraw: (pathD: string) => void;
  onCancel: () => void;
  crayonMode?: boolean;
  onUndoLast?: () => void;
  canUndo?: boolean;
}

/**
 * Ramer-Douglas-Peucker simplification to reduce point count
 * while preserving shape fidelity.
 */
function simplify(points: { x: number; y: number }[], epsilon: number): { x: number; y: number }[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIdx = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDist(points[i], first, last);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = simplify(points.slice(0, maxIdx + 1), epsilon);
    const right = simplify(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [first, last];
}

function perpendicularDist(
  pt: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(pt.x - lineStart.x, pt.y - lineStart.y);
  return Math.abs(dy * pt.x - dx * pt.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / Math.sqrt(lenSq);
}

function smoothToSvgPath(rawPoints: { x: number; y: number }[], autoClose: boolean): string {
  // Simplify while keeping shape detail — epsilon in canvas coords
  const pts = simplify(rawPoints, 2);
  if (pts.length < 2) return '';

  if (pts.length === 2) {
    const [a, b] = pts;
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const rx = Math.max(Math.abs(b.x - a.x) / 2, 12);
    const ry = Math.max(Math.abs(b.y - a.y) / 2, 12);
    return `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;
  }

  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;

  // Catmull-Rom → cubic Bézier with moderate tension
  const tension = 4; // lower = smoother curves, higher = tighter to points
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / tension;
    const cp1y = p1.y + (p2.y - p0.y) / tension;
    const cp2x = p2.x - (p3.x - p1.x) / tension;
    const cp2y = p2.y - (p3.y - p1.y) / tension;

    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  if (autoClose) d += ' Z';
  return d;
}

export function DrawOverlay({ canvasWidth, canvasHeight, onFinishDraw, onCancel, crayonMode = false, onUndoLast, canUndo }: Props) {
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

  const updateLivePath = useCallback(() => {
    const pts = pointsRef.current;
    if (pts.length < 2) return;
    // Show live preview without closing
    const d = smoothToSvgPath(pts, false);
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
    updateLivePath();
  }, [getPoint, updateLivePath]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pt = getPoint(e);
    if (!pt) return;
    // Capture every ~1.5px of movement for high fidelity
    const last = pointsRef.current[pointsRef.current.length - 1];
    const dx = pt.x - last.x;
    const dy = pt.y - last.y;
    if (dx * dx + dy * dy > 2.25) {
      pointsRef.current.push(pt);
      updateLivePath();
    }
  }, [getPoint, updateLivePath]);

  const handleEnd = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const pts = pointsRef.current;
    if (pts.length >= 3) {
      // Auto-close if the start and end points are within 30px of each other
      const first = pts[0];
      const last = pts[pts.length - 1];
      const closeDist = Math.hypot(last.x - first.x, last.y - first.y);
      const autoClose = closeDist < 30;

      const pathD = smoothToSvgPath(pts, autoClose);
      if (pathD) onFinishDraw(autoClose ? pathD : pathD + ' Z');
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
        {crayonMode ? (localStorage.getItem('kid-mode') !== 'false' ? '🖍️ Draw with your crayon!' : '🧵 Sew a shape — nice and easy') : '✏️ Draw a shape — it will auto-close'}
        {canUndo && onUndoLast && (
          <button
            onClick={(e) => { e.stopPropagation(); onUndoLast(); }}
            className="ml-1 px-1.5 py-0.5 rounded bg-destructive/80 hover:bg-destructive text-destructive-foreground text-[10px] transition-colors"
          >
            🗑️ Undo Last
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="ml-1 px-1.5 py-0.5 rounded bg-primary-foreground/20 hover:bg-primary-foreground/30 text-[10px] transition-colors"
        >
          {crayonMode ? 'Done' : 'Cancel'}
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
        
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <rect width="100%" height="100%" fill={crayonMode ? 'transparent' : 'hsla(40, 20%, 95%, 0.06)'} />

        {/* Soft shadow */}
        <path
          ref={smudgePathRef}
          d=""
          fill="none"
          stroke={crayonMode ? 'hsla(0, 0%, 30%, 0.12)' : 'hsla(0, 0%, 30%, 0.08)'}
          strokeWidth={crayonMode ? 8 : 4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Main line */}
        <path
          ref={livePathRef}
          d=""
          fill={crayonMode ? 'hsla(30, 60%, 50%, 0.15)' : 'hsla(220, 60%, 50%, 0.06)'}
          stroke={crayonMode ? 'hsl(30, 70%, 45%)' : 'hsl(220, 60%, 45%)'}
          strokeWidth={crayonMode ? 5 : 2}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={crayonMode ? undefined : '6 3'}
          opacity={crayonMode ? 0.9 : 0.8}
        />
      </svg>
    </div>
  );
}
