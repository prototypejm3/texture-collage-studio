import { CanvasElement, ElementShape, EdgeStyle, WrinkleLevel, ShadowDepth, MaterialEffects } from '@/types/studio';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, RotateCw, RectangleHorizontal, Minus, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onUpdateEffects: (effects: Partial<MaterialEffects>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

// Stencil shape icons as tiny SVG previews
function StencilIcon({ shape, active }: { shape: ElementShape; active: boolean }) {
  const fill = active ? 'currentColor' : 'currentColor';
  const size = 16;

  switch (shape) {
    case 'soft-square':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="1,0.5 10,0 19,0.5 19.5,10 19,19 10,19.5 1,19 0.5,10" fill={fill} opacity={0.8} />
        </svg>
      );
    case 'torn-edge':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="0.5,0 4,1 7,0 10,1 13,0 16,1 19.5,0 20,4 19,7 20,10 19,13 20,16 19,20 16,19 13,20 10,19 7,20 4,19 0,20 1,16 0,13 1,10 0,7 1,4" fill={fill} opacity={0.8} />
        </svg>
      );
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="10,0.5 14,1 17,3 19,6 20,10 19,14 17,17 14,19 10,20 6,19 3,17 1,14 0,10 1,6 3,3 6,1" fill={fill} opacity={0.8} />
        </svg>
      );
    case 'blob':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="7,0.5 12,0 16,1 19,4 20,8 20,13 18,17 14,19 10,20 6,19 3,17 1,13 0,9 1,5 3,2" fill={fill} opacity={0.8} />
        </svg>
      );
    case 'strip':
      return <Minus className="w-3.5 h-3.5" />;
    case 'rectangle':
      return <RectangleHorizontal className="w-3.5 h-3.5" />;
    default:
      return null;
  }
}

// Edge style icons — small SVG preview of each edge pattern
function EdgeIcon({ edge, size = 20 }: { edge: EdgeStyle; size?: number }) {
  const s = size;
  switch (edge) {
    case 'clean':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <rect x="2" y="2" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'soft-fray':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <polygon points="2,1 6,2 10,0.5 14,2 18,1 19,5 18,9 19,13 18,17 19,19 14,18 10,19 6,18 2,19 1,15 2,11 1,7 2,3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'rough-torn':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <polygon points="3,0 7,3 11,0 15,4 19,1 20,6 17,10 20,14 18,19 14,17 10,20 6,17 2,20 0,15 3,11 0,7 2,3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'pinking':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <polygon points="0,3 3,0 6,3 9,0 12,3 15,0 18,3 20,3 20,6 17,9 20,12 17,15 20,18 18,20 15,17 12,20 9,17 6,20 3,17 0,18 0,15 3,12 0,9 3,6" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      );
    case 'scallop':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <path d="M3,1 Q5,4 7,1 Q9,4 11,1 Q13,4 15,1 Q17,4 19,2 Q20,5 17,7 Q20,9 17,11 Q20,13 17,15 Q20,17 18,19 Q15,17 13,19 Q11,17 9,19 Q7,17 5,19 Q3,17 1,18 Q0,15 3,13 Q0,11 3,9 Q0,7 3,5 Q0,3 2,1 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      );
    case 'zigzag':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <polygon points="0,4 4,0 8,4 12,0 16,4 20,0 20,4 16,8 20,12 16,16 20,20 16,20 12,16 8,20 4,16 0,20 0,16 4,12 0,8 4,4" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      );
    case 'wave':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <path d="M2,2 Q5,-1 8,2 Q11,5 14,2 Q17,-1 19,2 Q22,5 19,8 Q16,11 19,14 Q22,17 19,18 Q16,21 13,18 Q10,15 7,18 Q4,21 2,18 Q-1,15 2,14 Q5,11 2,8 Q-1,5 2,2 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      );
    default:
      return null;
  }
}

// Wrinkle level icons
function WrinkleIcon({ level, size = 20 }: { level: WrinkleLevel; size?: number }) {
  const s = size;
  switch (level) {
    case 'none':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <rect x="2" y="6" width="16" height="8" rx="1" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'light':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <path d="M2,10 Q5,7 8,10 Q11,13 14,10 Q17,7 18,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'medium':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <path d="M1,10 Q3,5 5,10 Q7,15 9,10 Q11,5 13,10 Q15,15 17,10 Q19,5 20,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'heavy':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <path d="M0,10 Q1.5,3 3,10 Q4.5,17 6,10 Q7.5,3 9,10 Q10.5,17 12,10 Q13.5,3 15,10 Q16.5,17 18,10 Q19.5,3 20,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default: return null;
  }
}

// Shadow depth icons
function ShadowIcon({ depth, size = 20 }: { depth: ShadowDepth; size?: number }) {
  const s = size;
  switch (depth) {
    case 'flat':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <rect x="3" y="5" width="14" height="10" rx="2" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'lifted':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <rect x="5" y="9" width="12" height="6" rx="1" fill="currentColor" opacity="0.15" />
          <rect x="3" y="4" width="14" height="10" rx="2" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case 'floating':
      return (
        <svg width={s} height={s} viewBox="0 0 20 20">
          <rect x="6" y="12" width="12" height="5" rx="2" fill="currentColor" opacity="0.1" />
          <rect x="3" y="2" width="14" height="10" rx="2" fill="currentColor" opacity="0.6" />
        </svg>
      );
    default: return null;
  }
}

const shapeOptions: { value: ElementShape; label: string; kidLabel: string }[] = [
  { value: 'soft-square', label: 'Soft Square', kidLabel: 'Squishy' },
  { value: 'torn-edge', label: 'Torn Edge', kidLabel: 'Ripped' },
  { value: 'circle', label: 'Circle', kidLabel: 'Round' },
  { value: 'blob', label: 'Blob', kidLabel: 'Blobby' },
  { value: 'strip', label: 'Strip', kidLabel: 'Skinny' },
  { value: 'rectangle', label: 'Rectangle', kidLabel: 'Wide' },
];

const edgeOptions: { value: EdgeStyle; label: string; kidLabel: string }[] = [
  { value: 'clean', label: 'Clean', kidLabel: 'Smooth' },
  { value: 'soft-fray', label: 'Soft Fray', kidLabel: 'Fuzzy' },
  { value: 'rough-torn', label: 'Rough Torn', kidLabel: 'Ripped' },
  { value: 'pinking', label: 'Pinking', kidLabel: '✂️ Zigzag' },
  { value: 'scallop', label: 'Scallop', kidLabel: '✂️ Wavy' },
  { value: 'zigzag', label: 'Zigzag', kidLabel: '⚡ Zappy' },
  { value: 'wave', label: 'Wave', kidLabel: '🌊 Swirly' },
];

const wrinkleOptions: { value: WrinkleLevel; label: string; kidLabel: string }[] = [
  { value: 'none', label: 'None', kidLabel: 'Flat' },
  { value: 'light', label: 'Light', kidLabel: 'A Little' },
  { value: 'medium', label: 'Medium', kidLabel: 'Crunchy' },
  { value: 'heavy', label: 'Heavy', kidLabel: 'Super Wrinkly' },
];

const shadowOptions: { value: ShadowDepth; label: string; kidLabel: string }[] = [
  { value: 'flat', label: 'Flat', kidLabel: 'Flat' },
  { value: 'lifted', label: 'Lifted', kidLabel: 'Peeling Up' },
  { value: 'floating', label: 'Floating', kidLabel: 'Floating!' },
];




export function FloatingToolbar({ element, onUpdate, onUpdateEffects, onDuplicate, onDelete }: Props) {
  const [showEffects, setShowEffects] = useState(true);
  const [showShapes, setShowShapes] = useState(true);

  // Kid mode
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  return (
    <div className="p-3 space-y-2">
          {/* Shapes section */}
          <button
            onClick={() => setShowShapes(!showShapes)}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors mb-1"
          >
            {kidMode ? '🔷 Pick a Shape' : 'Shapes'}
            {showShapes ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>

          {showShapes && (
            <div className="flex flex-wrap items-center gap-1 mb-2 px-1">
              {shapeOptions.map(s => (
                <Button
                  key={s.value}
                  size="sm"
                  variant={element.shape === s.value ? 'default' : 'ghost'}
                  onClick={() => {
                    const updates: Partial<CanvasElement> = { shape: s.value };
                    if (s.value === 'strip') { updates.width = 40; updates.height = 160; }
                    else if (s.value === 'rectangle') { updates.width = 120; updates.height = 80; }
                    else { updates.width = element.width; updates.height = Math.min(element.width, element.height); }
                    onUpdate(updates);
                  }}
                  className="h-8 px-2 gap-1"
                  title={kidMode ? s.kidLabel : s.label}
                >
                  <StencilIcon shape={s.value} active={element.shape === s.value} />
                  <span className="text-[9px] hidden sm:inline">{kidMode ? s.kidLabel : s.label}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Quick actions row */}
          <div className="flex items-center gap-1 mb-2 px-1">
            {/* Resize */}
            {kidMode ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">📐 Size</span>
                <Slider
                  value={[element.width]}
                  onValueChange={([v]) => onUpdate({ width: v, height: element.shape === 'strip' ? element.height : v })}
                  min={30}
                  max={200}
                  step={5}
                  className="w-20"
                />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-muted-foreground" />
                <input
                  type="number"
                  value={Math.round(element.width)}
                  onChange={e => onUpdate({ width: Number(e.target.value) || 50 })}
                  className="w-12 h-7 text-xs text-center bg-secondary rounded-md border-none"
                />
                <span className="text-xs text-muted-foreground">×</span>
                <input
                  type="number"
                  value={Math.round(element.height)}
                  onChange={e => onUpdate({ height: Number(e.target.value) || 50 })}
                  className="w-12 h-7 text-xs text-center bg-secondary rounded-md border-none"
                />
              </div>
            )}

            <div className="w-px h-6 bg-border mx-1" />

            {/* Rotate */}
            {kidMode ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">🔄 Spin</span>
                <Slider
                  value={[element.rotation + 180]}
                  onValueChange={([v]) => onUpdate({ rotation: v - 180 })}
                  min={0}
                  max={360}
                  step={5}
                  className="w-16"
                />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-muted-foreground" />
                <input
                  type="number"
                  value={element.rotation}
                  onChange={e => onUpdate({ rotation: Number(e.target.value) })}
                  className="w-12 h-7 text-xs text-center bg-secondary rounded-md border-none"
                />
                <span className="text-[10px] text-muted-foreground">°</span>
              </div>
            )}

            <div className="w-px h-6 bg-border mx-1" />

            <Button size="sm" variant="ghost" onClick={onDuplicate} className="h-8 w-8 p-0" title={kidMode ? 'Make a Copy' : 'Duplicate'}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-destructive hover:text-destructive" title={kidMode ? 'Remove' : 'Delete'}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Effects toggle */}
          <button
            onClick={() => setShowEffects(!showEffects)}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
          >
            {kidMode ? '🎨 Make It Look Cool' : 'Material Effects'}
            {showEffects ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>

          {showEffects && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2 px-1">
                {/* Bleach/Fade */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                    {kidMode
                      ? `☀️ Fade It Out — ${element.effects.bleachFade}%`
                      : `Bleach / Fade — ${element.effects.bleachFade}%`
                    }
                  </label>
                  <Slider
                    value={[element.effects.bleachFade]}
                    onValueChange={([v]) => onUpdateEffects({ bleachFade: v })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Edge Style */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                    {kidMode ? '✂️ How the Edges Look' : 'Edge Style'}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {edgeOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => onUpdateEffects({ edgeStyle: o.value })}
                        className={`flex items-center gap-1 text-[10px] py-1.5 px-2 rounded-md transition-colors ${
                          element.effects.edgeStyle === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                        title={o.label}
                      >
                        <EdgeIcon edge={o.value} size={16} />
                        <span className="hidden sm:inline">{kidMode ? o.kidLabel : o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wrinkle */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                    {kidMode ? '🤏 Crumple It Up?' : 'Wrinkle'}
                  </label>
                  <div className="flex gap-1">
                    {wrinkleOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => onUpdateEffects({ wrinkle: o.value })}
                        className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] py-1.5 rounded-md transition-colors ${
                          element.effects.wrinkle === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                        title={o.label}
                      >
                        <WrinkleIcon level={o.value} size={16} />
                        <span className="text-[8px]">{kidMode ? o.kidLabel : o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grain Boost */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                    {kidMode
                      ? `🔍 Make It Bumpy — ${element.effects.grainBoost}%`
                      : `Grain / Texture Boost — ${element.effects.grainBoost}%`
                    }
                  </label>
                  <Slider
                    value={[element.effects.grainBoost]}
                    onValueChange={([v]) => onUpdateEffects({ grainBoost: v })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Shadow Depth */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                    {kidMode ? '👻 How Floaty Is It?' : 'Shadow Depth'}
                  </label>
                  <div className="flex gap-1">
                    {shadowOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => onUpdateEffects({ shadowDepth: o.value })}
                        className={`flex-1 flex flex-col items-center gap-0.5 text-[10px] py-1.5 rounded-md transition-colors ${
                          element.effects.shadowDepth === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                        title={o.label}
                      >
                        <ShadowIcon depth={o.value} size={16} />
                        <span className="text-[8px]">{kidMode ? o.kidLabel : o.label}</span>
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
