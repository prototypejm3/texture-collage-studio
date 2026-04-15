import { motion, AnimatePresence } from 'framer-motion';
import { CanvasElement, MaterialEffects, EdgeStyle, ElementShape, WrinkleLevel } from '@/types/studio';

interface Props {
  element: CanvasElement;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onUpdateEffects: (effects: Partial<MaterialEffects>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

type BubbleSoundType = 'pop' | 'grow' | 'poof' | 'sparkle';

function playSound(type: BubbleSoundType) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    switch (type) {
      case 'pop':
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.06);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t); osc.stop(t + 0.15); break;
      case 'grow':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t); osc.stop(t + 0.18); break;
      case 'poof':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.25);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.3); break;
      case 'sparkle':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t); osc.stop(t + 0.25); break;
    }
  } catch {}
}

const edgeCycle: EdgeStyle[] = ['clean', 'pinking', 'scallop', 'zigzag', 'wave', 'soft-fray', 'rough-torn'];
const wrinkleCycle: WrinkleLevel[] = ['none', 'light', 'medium', 'heavy'];

function edgeDisplayName(edge: EdgeStyle): string {
  const names: Record<EdgeStyle, string> = {
    clean: 'Smooth', 'soft-fray': 'Fuzzy', 'rough-torn': 'Ripped',
    pinking: 'Zigzag', scallop: 'Wavy', zigzag: 'Zappy', wave: 'Swirly',
  };
  return names[edge] || edge;
}

interface BubbleAction {
  id: string;
  emoji: string;
  label: string;
  angle: number;
  sound: BubbleSoundType;
  color?: string;
}

const bubbleActions: BubbleAction[] = [
  { id: 'grow',    emoji: '➕', label: 'Bigger',   angle: -135, sound: 'grow' },
  { id: 'shrink',  emoji: '➖', label: 'Smaller',  angle: -90,  sound: 'grow' },
  { id: 'cut',     emoji: '✂️', label: 'Cut',      angle: -45,  sound: 'pop' },
  { id: 'crumple', emoji: '🤜', label: 'Crumple',  angle: 0,    sound: 'pop' },
  { id: 'twin',    emoji: '👯', label: 'Twin',     angle: 45,   sound: 'sparkle' },
  { id: 'fade',    emoji: '🌫️', label: 'Fade',     angle: 90,   sound: 'pop' },
  { id: 'toss',    emoji: '🗑️', label: 'Toss',     angle: 135,  sound: 'poof', color: 'hsl(0, 70%, 92%)' },
];

export function KidSwatchBubbles({ element, isOpen, onClose, onUpdate, onUpdateEffects, onDuplicate, onDelete }: Props) {
  const radius = 72;

  const handleAction = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = bubbleActions.find(a => a.id === actionId);
    if (action) playSound(action.sound);

    switch (actionId) {
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
      case 'crumple': {
        const currentIdx = wrinkleCycle.indexOf(element.effects.wrinkle);
        const nextWrinkle = wrinkleCycle[(currentIdx + 1) % wrinkleCycle.length];
        onUpdateEffects({ wrinkle: nextWrinkle });
        break;
      }
      case 'twin':
        onDuplicate();
        onClose();
        break;
      case 'fade': {
        const nextFade = element.effects.bleachFade >= 100 ? 0 : element.effects.bleachFade + 25;
        onUpdateEffects({ bleachFade: nextFade });
        break;
      }
      case 'toss':
        onDelete();
        onClose();
        break;
    }
  };

  const getLabel = (action: BubbleAction) => {
    if (action.id === 'cut') return edgeDisplayName(element.effects.edgeStyle);
    if (action.id === 'crumple') return element.effects.wrinkle !== 'none' ? element.effects.wrinkle : 'Crumple';
    if (action.id === 'fade') return element.effects.bleachFade > 0 ? `${element.effects.bleachFade}%` : 'Fade';
    return action.label;
  };

  // Position centered on the element
  const cx = element.x + element.width / 2;
  const cy = element.y + element.height / 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          />

          {/* Bubbles positioned absolute in canvas space */}
          <div
            className="absolute z-[10000] pointer-events-none"
            style={{ left: cx, top: cy, width: 0, height: 0 }}
          >
            {bubbleActions.map((action, i) => {
              const angleRad = (action.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.button
                  key={action.id}
                  className="pointer-events-auto absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white/80 hover:scale-110 active:scale-90 transition-transform"
                  style={{
                    background: action.color || 'hsl(var(--secondary))',
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 18,
                    delay: i * 0.04,
                  }}
                  onClick={(e) => handleAction(action.id, e)}
                  title={getLabel(action)}
                >
                  <span className="text-lg leading-none">{action.emoji}</span>
                  <span className="text-[7px] font-bold text-foreground/80 leading-none mt-0.5">
                    {getLabel(action)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
