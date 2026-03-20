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
  { value: 'pinking', label: '✂ Pinking', kidLabel: 'Zigzag Cut' },
  { value: 'scallop', label: '✂ Scallop', kidLabel: 'Wavy Cut' },
  { value: 'zigzag', label: '✂ Zigzag', kidLabel: 'Zappy Cut' },
  { value: 'wave', label: '✂ Wave', kidLabel: 'Swirly Cut' },
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
            {kidMode ? '🔷 Pick a Shape' : '✂️ Shapes'}
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
                    {kidMode ? '✂️ How the Edges Look' : 'Edge Style (✂ = Scissor Cuts)'}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {edgeOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => onUpdateEffects({ edgeStyle: o.value })}
                        className={`text-[10px] py-1.5 px-2 rounded-md transition-colors ${
                          element.effects.edgeStyle === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {kidMode ? o.kidLabel : o.label}
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
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-colors ${
                          element.effects.wrinkle === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {kidMode ? o.kidLabel : o.label}
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
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-colors ${
                          element.effects.shadowDepth === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {kidMode ? o.kidLabel : o.label}
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
