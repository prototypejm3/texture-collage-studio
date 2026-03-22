import { CanvasElement, ElementShape, EdgeStyle, WrinkleLevel, ShadowDepth, MaterialEffects, BlendMode } from '@/types/studio';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, RotateCw, RectangleHorizontal, Minus, Maximize2, ChevronDown, ChevronUp, Undo2, Redo2, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onUpdateEffects: (effects: Partial<MaterialEffects>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  elementCount?: number;
  onBringForward?: () => void;
  onSendBackward?: () => void;
}

// Stencil shape icons as tiny SVG previews
function StencilIcon({ shape, active }: { shape: ElementShape; active: boolean }) {
  const fill = active ? 'currentColor' : 'currentColor';
  const size = 16;
  switch (shape) {
    case 'soft-square':
      return <svg width={size} height={size} viewBox="0 0 20 20"><polygon points="1,0.5 10,0 19,0.5 19.5,10 19,19 10,19.5 1,19 0.5,10" fill={fill} opacity={0.8} /></svg>;
    case 'torn-edge':
      return <svg width={size} height={size} viewBox="0 0 20 20"><polygon points="0.5,0 4,1 7,0 10,1 13,0 16,1 19.5,0 20,4 19,7 20,10 19,13 20,16 19,20 16,19 13,20 10,19 7,20 4,19 0,20 1,16 0,13 1,10 0,7 1,4" fill={fill} opacity={0.8} /></svg>;
    case 'circle':
      return <svg width={size} height={size} viewBox="0 0 20 20"><polygon points="10,0.5 14,1 17,3 19,6 20,10 19,14 17,17 14,19 10,20 6,19 3,17 1,14 0,10 1,6 3,3 6,1" fill={fill} opacity={0.8} /></svg>;
    case 'blob':
      return <svg width={size} height={size} viewBox="0 0 20 20"><polygon points="7,0.5 12,0 16,1 19,4 20,8 20,13 18,17 14,19 10,20 6,19 3,17 1,13 0,9 1,5 3,2" fill={fill} opacity={0.8} /></svg>;
    case 'strip':
      return <Minus className="w-3.5 h-3.5" />;
    case 'rectangle':
      return <RectangleHorizontal className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function EdgeIcon({ edge, size = 20 }: { edge: EdgeStyle; size?: number }) {
  const s = size;
  switch (edge) {
    case 'clean': return <svg width={s} height={s} viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
    case 'soft-fray': return <svg width={s} height={s} viewBox="0 0 20 20"><polygon points="2,1 6,2 10,0.5 14,2 18,1 19,5 18,9 19,13 18,17 19,19 14,18 10,19 6,18 2,19 1,15 2,11 1,7 2,3" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;
    case 'rough-torn': return <svg width={s} height={s} viewBox="0 0 20 20"><polygon points="3,0 7,3 11,0 15,4 19,1 20,6 17,10 20,14 18,19 14,17 10,20 6,17 2,20 0,15 3,11 0,7 2,3" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;
    case 'pinking': return <svg width={s} height={s} viewBox="0 0 20 20"><polygon points="0,3 3,0 6,3 9,0 12,3 15,0 18,3 20,3 20,6 17,9 20,12 17,15 20,18 18,20 15,17 12,20 9,17 6,20 3,17 0,18 0,15 3,12 0,9 3,6" fill="none" stroke="currentColor" strokeWidth="1.1" /></svg>;
    case 'scallop': return <svg width={s} height={s} viewBox="0 0 20 20"><path d="M3,1 Q5,4 7,1 Q9,4 11,1 Q13,4 15,1 Q17,4 19,2 Q20,5 17,7 Q20,9 17,11 Q20,13 17,15 Q20,17 18,19 Q15,17 13,19 Q11,17 9,19 Q7,17 5,19 Q3,17 1,18 Q0,15 3,13 Q0,11 3,9 Q0,7 3,5 Q0,3 2,1 Z" fill="none" stroke="currentColor" strokeWidth="1.1" /></svg>;
    case 'zigzag': return <svg width={s} height={s} viewBox="0 0 20 20"><polygon points="0,4 4,0 8,4 12,0 16,4 20,0 20,4 16,8 20,12 16,16 20,20 16,20 12,16 8,20 4,16 0,20 0,16 4,12 0,8 4,4" fill="none" stroke="currentColor" strokeWidth="1.1" /></svg>;
    case 'wave': return <svg width={s} height={s} viewBox="0 0 20 20"><path d="M2,2 Q5,-1 8,2 Q11,5 14,2 Q17,-1 19,2 Q22,5 19,8 Q16,11 19,14 Q22,17 19,18 Q16,21 13,18 Q10,15 7,18 Q4,21 2,18 Q-1,15 2,14 Q5,11 2,8 Q-1,5 2,2 Z" fill="none" stroke="currentColor" strokeWidth="1.1" /></svg>;
    default: return null;
  }
}

function WrinkleIcon({ level, size = 20 }: { level: WrinkleLevel; size?: number }) {
  const s = size;
  switch (level) {
    case 'none': return <svg width={s} height={s} viewBox="0 0 20 20"><rect x="2" y="6" width="16" height="8" rx="1" fill="currentColor" opacity="0.6" /></svg>;
    case 'light': return <svg width={s} height={s} viewBox="0 0 20 20"><path d="M2,10 Q5,7 8,10 Q11,13 14,10 Q17,7 18,10" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
    case 'medium': return <svg width={s} height={s} viewBox="0 0 20 20"><path d="M1,10 Q3,5 5,10 Q7,15 9,10 Q11,5 13,10 Q15,15 17,10 Q19,5 20,10" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
    case 'heavy': return <svg width={s} height={s} viewBox="0 0 20 20"><path d="M0,10 Q1.5,3 3,10 Q4.5,17 6,10 Q7.5,3 9,10 Q10.5,17 12,10 Q13.5,3 15,10 Q16.5,17 18,10 Q19.5,3 20,10" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
    default: return null;
  }
}

function ShadowIcon({ depth, size = 20 }: { depth: ShadowDepth; size?: number }) {
  const s = size;
  switch (depth) {
    case 'flat': return <svg width={s} height={s} viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" fill="currentColor" opacity="0.6" /></svg>;
    case 'lifted': return <svg width={s} height={s} viewBox="0 0 20 20"><rect x="5" y="9" width="12" height="6" rx="1" fill="currentColor" opacity="0.15" /><rect x="3" y="4" width="14" height="10" rx="2" fill="currentColor" opacity="0.6" /></svg>;
    case 'floating': return <svg width={s} height={s} viewBox="0 0 20 20"><rect x="6" y="12" width="12" height="5" rx="2" fill="currentColor" opacity="0.1" /><rect x="3" y="2" width="14" height="10" rx="2" fill="currentColor" opacity="0.6" /></svg>;
    default: return null;
  }
}

const shapeOptions: { value: ElementShape; label: string }[] = [
  { value: 'soft-square', label: 'Soft Square' },
  { value: 'torn-edge', label: 'Torn Edge' },
  { value: 'circle', label: 'Circle' },
  { value: 'blob', label: 'Blob' },
  { value: 'strip', label: 'Strip' },
  { value: 'rectangle', label: 'Rectangle' },
];

const edgeOptions: { value: EdgeStyle; label: string }[] = [
  { value: 'clean', label: 'Clean' },
  { value: 'soft-fray', label: 'Soft Fray' },
  { value: 'rough-torn', label: 'Rough Torn' },
  { value: 'pinking', label: 'Pinking' },
  { value: 'scallop', label: 'Scallop' },
  { value: 'zigzag', label: 'Zigzag' },
  { value: 'wave', label: 'Wave' },
];

const wrinkleOptions: { value: WrinkleLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

const shadowOptions: { value: ShadowDepth; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'lifted', label: 'Lifted' },
  { value: 'floating', label: 'Floating' },
];

const blendModeOptions: { value: BlendMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
];

// ── Kid Mode Tool Box ──

const edgeCycle: EdgeStyle[] = ['clean', 'pinking', 'scallop', 'zigzag', 'wave', 'soft-fray', 'rough-torn'];
const wrinkleCycle: WrinkleLevel[] = ['none', 'light', 'medium', 'heavy'];

interface ToolDef {
  id: string;
  label: string;
}

const kidTools: ToolDef[] = [
  { id: 'grow',    label: 'Grow' },
  { id: 'shrink',  label: 'Shrink' },
  { id: 'cut',     label: 'Cut' },
  { id: 'twin',    label: 'Twin' },
  { id: 'fade',    label: 'Fade' },
  { id: 'crumple', label: 'Crumple' },
  { id: 'toss',    label: 'Toss' },
];

const adultTools: ToolDef[] = [
  { id: 'grow',    label: 'Scale Up' },
  { id: 'shrink',  label: 'Scale Down' },
  { id: 'cut',     label: 'Edge Style' },
  { id: 'twin',    label: 'Duplicate' },
  { id: 'fade',    label: 'Opacity' },
  { id: 'crumple', label: 'Distort' },
  { id: 'toss',    label: 'Delete' },
];

const kidShapes: { id: ElementShape; label: string; emoji: string }[] = [
  { id: 'soft-square', label: 'Square', emoji: '🟧' },
  { id: 'rectangle',   label: 'Long',   emoji: '▭' },
  { id: 'circle',      label: 'Circle', emoji: '⚫' },
  { id: 'strip',       label: 'Thin',   emoji: '➖' },
  { id: 'torn-edge',   label: 'Ripped', emoji: '🧩' },
  { id: 'blob',        label: 'Blob',   emoji: '🫧' },
];

// SVG tool icons — visually distinct, kid-friendly
function ToolIcon({ id, size = 32 }: { id: string; size?: number }) {
  switch (id) {
    case 'grow':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32">
          <rect x="13" y="6" width="6" height="20" rx="1.5" fill="currentColor" opacity={0.7} />
          <rect x="6" y="13" width="20" height="6" rx="1.5" fill="currentColor" opacity={0.7} />
        </svg>
      );
    case 'shrink':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32">
          <rect x="6" y="13" width="20" height="6" rx="1.5" fill="currentColor" opacity={0.7} />
        </svg>
      );
    case 'cut':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32">
          {/* Scissors */}
          <circle cx="10" cy="24" r="4" fill="none" stroke="hsl(0, 70%, 55%)" strokeWidth="1.8" />
          <circle cx="22" cy="24" r="4" fill="none" stroke="hsl(0, 70%, 55%)" strokeWidth="1.8" />
          <line x1="12" y1="21" x2="20" y2="8" stroke="hsl(220, 10%, 50%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="21" x2="12" y2="8" stroke="hsl(220, 10%, 50%)" strokeWidth="2" strokeLinecap="round" />
          {/* Screw */}
          <circle cx="16" cy="15" r="1.5" fill="hsl(220, 10%, 60%)" />
        </svg>
      );
    case 'twin':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32">
          {/* Two overlapping papers */}
          <rect x="4" y="6" width="16" height="20" rx="2" fill="hsl(200, 50%, 70%)" opacity={0.6} />
          <rect x="10" y="4" width="16" height="20" rx="2" fill="hsl(200, 50%, 55%)" opacity={0.8} />
        </svg>
      );
    case 'fade':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32">
          <defs>
            <linearGradient id="fade-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="24" height="24" rx="4" fill="url(#fade-grad)" />
          {/* Fog lines */}
          <line x1="7" y1="12" x2="25" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          <line x1="9" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
          <line x1="11" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.1" strokeLinecap="round" />
        </svg>
      );
    case 'crumple':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32">
          {/* Crumpled paper ball */}
          <path d="M10,8 L22,6 L26,12 L28,22 L22,28 L12,26 L6,20 L8,12 Z" fill="hsl(40, 20%, 85%)" stroke="hsl(30, 15%, 65%)" strokeWidth="1" />
          {/* Crumple creases */}
          <line x1="12" y1="10" x2="18" y2="18" stroke="hsl(30, 15%, 60%)" strokeWidth="0.8" opacity="0.6" />
          <line x1="20" y1="10" x2="14" y2="22" stroke="hsl(30, 15%, 60%)" strokeWidth="0.8" opacity="0.5" />
          <line x1="10" y1="16" x2="22" y2="14" stroke="hsl(30, 15%, 60%)" strokeWidth="0.8" opacity="0.4" />
          <line x1="16" y1="22" x2="24" y2="18" stroke="hsl(30, 15%, 60%)" strokeWidth="0.6" opacity="0.3" />
        </svg>
      );
    default:
      return null;
  }
}

// Friendly edge name for kids
function edgeDisplayName(edge: EdgeStyle): string {
  const names: Record<EdgeStyle, string> = {
    clean: 'Smooth',
    'soft-fray': 'Fuzzy',
    'rough-torn': 'Ripped',
    pinking: 'Zigzag',
    scallop: 'Wavy',
    zigzag: 'Zappy',
    wave: 'Swirly',
  };
  return names[edge] || edge;
}

function KidToolBox({ element, onUpdate, onUpdateEffects, onDuplicate, onDelete, onUndo, onRedo, canUndo, canRedo }: Props) {
  const handleToolTap = (toolId: string) => {
    switch (toolId) {
      case 'grow':
        onUpdate({
          width: Math.min(element.width + 20, 300),
          height: element.shape === 'strip' ? element.height : Math.min(element.height + 20, 300),
        });
        break;
      case 'shrink':
        onUpdate({
          width: Math.max(element.width - 20, 30),
          height: element.shape === 'strip' ? element.height : Math.max(element.height - 20, 30),
        });
        break;
      case 'cut': {
        const currentIdx = edgeCycle.indexOf(element.effects.edgeStyle);
        const nextEdge = edgeCycle[(currentIdx + 1) % edgeCycle.length];
        onUpdateEffects({ edgeStyle: nextEdge });
        break;
      }
      case 'twin':
        onDuplicate();
        break;
      case 'fade': {
        const nextFade = element.effects.bleachFade >= 100 ? 0 : element.effects.bleachFade + 25;
        onUpdateEffects({ bleachFade: nextFade });
        break;
      }
      case 'crumple': {
        const currentWrinkleIdx = wrinkleCycle.indexOf(element.effects.wrinkle);
        const nextWrinkle = wrinkleCycle[(currentWrinkleIdx + 1) % wrinkleCycle.length];
        onUpdateEffects({ wrinkle: nextWrinkle });
        break;
      }
      case 'toss':
        onDelete();
        break;
    }
  };

  const getSubtitle = (toolId: string): string | null => {
    switch (toolId) {
      case 'cut': return edgeDisplayName(element.effects.edgeStyle);
      case 'fade': return element.effects.bleachFade > 0 ? `${element.effects.bleachFade}%` : null;
      case 'crumple': return element.effects.wrinkle !== 'none' ? element.effects.wrinkle : null;
      default: return null;
    }
  };

  return (
    <div className="p-3 space-y-3" data-kid-toolbox>
      {/* Header with undo/redo */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">🧰 Tool Box</span>
        <div className="flex gap-1">
          {onUndo && (
            <Button size="sm" variant="ghost" onClick={onUndo} disabled={!canUndo} className="h-8 w-8 p-0" title="Undo">
              <Undo2 className="w-4 h-4" />
            </Button>
          )}
          {onRedo && (
            <Button size="sm" variant="ghost" onClick={onRedo} disabled={!canRedo} className="h-8 w-8 p-0" title="Redo">
              <Redo2 className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-destructive hover:text-destructive" title="Remove">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {kidTools.map(tool => {
          const subtitle = getSubtitle(tool.id);
          return (
            <motion.button
              key={tool.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleToolTap(tool.id)}
              className="flex flex-col items-center justify-center gap-0.5 rounded-xl p-3 min-h-[72px] transition-colors border border-border bg-secondary hover:bg-accent"
            >
              <ToolIcon id={tool.id} size={32} />
              <span className="text-[10px] font-semibold text-foreground">{tool.label}</span>
              {subtitle && (
                <span className="text-[8px] text-muted-foreground -mt-0.5">{subtitle}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Shape row */}
      <div>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Shape</span>
        <div className="flex flex-wrap gap-1.5">
          {kidShapes.map(shape => {
            const isActive = element.shape === shape.id;
            return (
              <motion.button
                key={shape.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onUpdate({ shape: shape.id })}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30'
                    : 'bg-secondary text-foreground border border-border hover:bg-accent'
                }`}
              >
                <span className="text-xs">{shape.emoji}</span>
                {shape.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Lighter / Darker slider (kid-friendly opacity) */}
      <div>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
          {(element.opacity ?? 100) < 50 ? '🌫️ Lighter' : '✨ Darker'}
        </span>
        <Slider
          value={[element.opacity ?? 100]}
          onValueChange={([v]) => onUpdate({ opacity: v })}
          min={5}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
    </div>
  );
}

// ── Main Export ──

export function FloatingToolbar({ element, onUpdate, onUpdateEffects, onDuplicate, onDelete, onUndo, onRedo, canUndo, canRedo, elementCount, onBringForward, onSendBackward }: Props) {
  const [showEffects, setShowEffects] = useState(true);
  const [showShapes, setShowShapes] = useState(true);
  const [showBlending, setShowBlending] = useState(false);

  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  if (kidMode) {
    return <KidToolBox element={element} onUpdate={onUpdate} onUpdateEffects={onUpdateEffects} onDuplicate={onDuplicate} onDelete={onDelete} onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />;
  }

  return (
    <div className="p-3 space-y-2">
      {/* Header with undo/redo/delete */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {elementCount !== undefined ? `${elementCount} element${elementCount !== 1 ? 's' : ''}` : 'Element'}
        </span>
        <div className="flex gap-0.5">
          {onUndo && (
            <Button size="sm" variant="ghost" onClick={onUndo} disabled={!canUndo} className="h-7 w-7 p-0" title="Undo">
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
          )}
          {onRedo && (
            <Button size="sm" variant="ghost" onClick={onRedo} disabled={!canRedo} className="h-7 w-7 p-0" title="Redo">
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDelete} className="h-7 w-7 p-0 text-destructive hover:text-destructive" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>


      <button onClick={() => setShowShapes(!showShapes)} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors mb-1">
        Elements
        {showShapes ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>

      {showShapes && (
        <div className="flex flex-wrap items-center gap-1 mb-2 px-1">
          {shapeOptions.map(s => (
            <Button key={s.value} size="sm" variant={element.shape === s.value ? 'default' : 'ghost'}
              onClick={() => {
                const updates: Partial<CanvasElement> = { shape: s.value };
                if (s.value === 'strip') { updates.width = 40; updates.height = 160; }
                else if (s.value === 'rectangle') { updates.width = 120; updates.height = 80; }
                else { updates.width = element.width; updates.height = Math.min(element.width, element.height); }
                onUpdate(updates);
              }}
              className="h-8 px-2 gap-1" title={s.label}
            >
              <StencilIcon shape={s.value} active={element.shape === s.value} />
              <span className="text-[9px] hidden sm:inline">{s.label}</span>
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mb-2 px-1">
        <div className="flex items-center gap-1">
          <Maximize2 className="w-3 h-3 text-muted-foreground" />
          <input type="number" value={Math.round(element.width)} onChange={e => onUpdate({ width: Number(e.target.value) || 50 })} className="w-12 h-7 text-xs text-center bg-secondary rounded-md border-none" />
          <span className="text-xs text-muted-foreground">×</span>
          <input type="number" value={Math.round(element.height)} onChange={e => onUpdate({ height: Number(e.target.value) || 50 })} className="w-12 h-7 text-xs text-center bg-secondary rounded-md border-none" />
        </div>
        <div className="w-px h-6 bg-border mx-1" />
        <div className="flex items-center gap-1">
          <RotateCw className="w-3 h-3 text-muted-foreground" />
          <input type="number" value={element.rotation} onChange={e => onUpdate({ rotation: Number(e.target.value) })} className="w-12 h-7 text-xs text-center bg-secondary rounded-md border-none" />
          <span className="text-[10px] text-muted-foreground">°</span>
        </div>
        <div className="w-px h-6 bg-border mx-1" />
        <Button size="sm" variant="ghost" onClick={onDuplicate} className="h-8 w-8 p-0" title="Duplicate"><Copy className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-destructive hover:text-destructive" title="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
        {onBringForward && (
          <Button size="sm" variant="ghost" onClick={onBringForward} className="h-8 w-8 p-0" title="Bring Forward"><ArrowUp className="w-3.5 h-3.5" /></Button>
        )}
        {onSendBackward && (
          <Button size="sm" variant="ghost" onClick={onSendBackward} className="h-8 w-8 p-0" title="Send Backward"><ArrowDown className="w-3.5 h-3.5" /></Button>
        )}
      </div>

      {/* Opacity & Blend Mode */}
      <button onClick={() => setShowBlending(!showBlending)} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
        Opacity & Blending
        {showBlending ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>

      {showBlending && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
          <div className="space-y-3 pt-2 px-1">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Opacity — {element.opacity ?? 100}%</label>
              <Slider value={[element.opacity ?? 100]} onValueChange={([v]) => onUpdate({ opacity: v })} min={5} max={100} step={1} className="w-full" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Blend Mode</label>
              <div className="flex flex-wrap gap-1">
                {blendModeOptions.map(bm => (
                  <button key={bm.value} onClick={() => onUpdate({ blendMode: bm.value })}
                    className={`text-[10px] py-1 px-2 rounded-md transition-colors ${(element.blendMode || 'normal') === bm.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}>
                    {bm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <button onClick={() => setShowEffects(!showEffects)} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
        Material Effects
        {showEffects ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>

      {showEffects && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
          <div className="space-y-3 pt-2 px-1">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Bleach / Fade — {element.effects.bleachFade}%</label>
              <Slider value={[element.effects.bleachFade]} onValueChange={([v]) => onUpdateEffects({ bleachFade: v })} max={100} step={1} className="w-full" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Edge Style</label>
              <div className="flex flex-wrap gap-1">
                {edgeOptions.map(o => (
                  <button key={o.value} onClick={() => onUpdateEffects({ edgeStyle: o.value })}
                    className={`flex items-center gap-1 text-[10px] py-1.5 px-2 rounded-md transition-colors ${element.effects.edgeStyle === o.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`} title={o.label}>
                    <EdgeIcon edge={o.value} size={16} /><span className="hidden sm:inline">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Wrinkle</label>
              <div className="flex gap-1">
                {wrinkleOptions.map(o => (
                  <button key={o.value} onClick={() => onUpdateEffects({ wrinkle: o.value })}
                    className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] py-1.5 rounded-md transition-colors ${element.effects.wrinkle === o.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`} title={o.label}>
                    <WrinkleIcon level={o.value} size={16} /><span className="text-[8px]">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Grain / Texture Boost — {element.effects.grainBoost}%</label>
              <Slider value={[element.effects.grainBoost]} onValueChange={([v]) => onUpdateEffects({ grainBoost: v })} max={100} step={1} className="w-full" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Shadow Depth</label>
              <div className="flex gap-1">
                {shadowOptions.map(o => (
                  <button key={o.value} onClick={() => onUpdateEffects({ shadowDepth: o.value })}
                    className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] py-1.5 rounded-md transition-colors ${element.effects.shadowDepth === o.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`} title={o.label}>
                    <ShadowIcon depth={o.value} size={16} /><span className="text-[8px]">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}