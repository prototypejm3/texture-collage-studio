import { CanvasElement, ElementShape, EdgeStyle, WrinkleLevel, ShadowDepth, MaterialEffects } from '@/types/studio';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, RotateCw, Square, RectangleHorizontal, Circle, Minus, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onUpdateEffects: (effects: Partial<MaterialEffects>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const shapes: { value: ElementShape; icon: React.ReactNode; label: string }[] = [
  { value: 'square', icon: <Square className="w-3.5 h-3.5" />, label: 'Square' },
  { value: 'rectangle', icon: <RectangleHorizontal className="w-3.5 h-3.5" />, label: 'Rectangle' },
  { value: 'circle', icon: <Circle className="w-3.5 h-3.5" />, label: 'Circle' },
  { value: 'strip', icon: <Minus className="w-3.5 h-3.5" />, label: 'Strip' },
];

const edgeOptions: { value: EdgeStyle; label: string }[] = [
  { value: 'clean', label: 'Clean' },
  { value: 'soft-fray', label: 'Soft Fray' },
  { value: 'rough-torn', label: 'Rough Torn' },
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-popover border border-border rounded-xl shadow-xl p-2 min-w-[320px]">
          {/* Top row: quick actions */}
          <div className="flex items-center gap-1 mb-2">
            {/* Shape switcher */}
            {shapes.map(s => (
              <Button
                key={s.value}
                size="sm"
                variant={element.shape === s.value ? 'default' : 'ghost'}
                onClick={() => {
                  const updates: Partial<CanvasElement> = { shape: s.value };
                  if (s.value === 'strip') { updates.width = 40; updates.height = 160; }
                  else if (s.value === 'rectangle') { updates.width = 120; updates.height = 80; }
                  else { updates.width = 100; updates.height = 100; }
                  onUpdate(updates);
                }}
                className="h-8 w-8 p-0"
                title={s.label}
              >
                {s.icon}
              </Button>
            ))}

            <div className="w-px h-6 bg-border mx-1" />

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
      </motion.div>
    </AnimatePresence>
  );
}
