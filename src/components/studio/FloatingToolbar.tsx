import { CanvasElement, ElementShape, EdgeStyle, WrinkleLevel, ShadowDepth, MaterialEffects } from '@/types/studio';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, RotateCw, RectangleHorizontal, Minus, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
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
  { value: 'pinking', label: '✂ Pinking' },
  { value: 'scallop', label: '✂ Scallop' },
  { value: 'zigzag', label: '✂ Zigzag' },
  { value: 'wave', label: '✂ Wave' },
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

export function FloatingToolbar({ element, onUpdate, onUpdateEffects, onDuplicate, onDelete }: Props) {
  const [showEffects, setShowEffects] = useState(false);
  const [showStencils, setShowStencils] = useState(true);

  return (
    <div className="p-3 space-y-2">
          {/* Stencils section */}
          <button
            onClick={() => setShowStencils(!showStencils)}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors mb-1"
          >
            ✂️ Stencils
            {showStencils ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>

          {showStencils && (
            <div className="flex flex-wrap items-center gap-1 mb-2 px-1">
              {stencilShapes.map(s => (
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
                  title={s.label}
                >
                  <StencilIcon shape={s.value} active={element.shape === s.value} />
                  <span className="text-[9px] hidden sm:inline">{s.label}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Quick actions row */}
          <div className="flex items-center gap-1 mb-2 px-1">
            {/* Resize */}
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

            <div className="w-px h-6 bg-border mx-1" />

            {/* Rotate */}
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

            <div className="w-px h-6 bg-border mx-1" />

            <Button size="sm" variant="ghost" onClick={onDuplicate} className="h-8 w-8 p-0" title="Duplicate">
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-destructive hover:text-destructive" title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Effects toggle */}
          <button
            onClick={() => setShowEffects(!showEffects)}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
          >
            Material Effects
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
                    Bleach / Fade — {element.effects.bleachFade}%
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
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Edge Style</label>
                  <div className="flex gap-1">
                    {edgeOptions.map(o => (
                      <button
                        key={o.value}
                        onClick={() => onUpdateEffects({ edgeStyle: o.value })}
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-colors ${
                          element.effects.edgeStyle === o.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wrinkle */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Wrinkle</label>
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
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grain Boost */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                    Grain / Texture Boost — {element.effects.grainBoost}%
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
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Shadow Depth</label>
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
                        {o.label}
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
