import { motion, AnimatePresence } from 'framer-motion';
import { SavedDesign } from '@/types/wall';

interface KidActionBubblesProps {
  design: SavedDesign;
  isOpen: boolean;
  onClose: () => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large') => void;
  onUpdate: (id: string, updates: Partial<SavedDesign>) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

// Web Audio pop sound
function playBubbleSound(type: 'pop' | 'spin' | 'grow' | 'poof' | 'sparkle') {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'pop':
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        break;
      case 'spin':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
        break;
      case 'grow':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.18);
        break;
      case 'poof':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'sparkle':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
        break;
    }
  } catch {}
}

const edgeCycle = ['clean', 'pinking', 'scallop', 'zigzag', 'wave', 'soft-fray', 'rough-torn'] as const;

const bubbleActions = [
  { id: 'grow',    emoji: '➕', angle: -90,  sound: 'grow' as const },
  { id: 'cut',     emoji: '✂️', angle: -45,  sound: 'pop' as const },
  { id: 'spin',    emoji: '🔄', angle: 0,    sound: 'spin' as const },
  { id: 'save',    emoji: '📦', angle: 45,   sound: 'sparkle' as const },
  { id: 'open',    emoji: '🖍️', angle: 90,   sound: 'pop' as const },
  { id: 'delete',  emoji: '🗑️', angle: 135,  sound: 'poof' as const },
];

export function KidActionBubbles({
  design, isOpen, onClose, onSizeChange, onUpdate, onDelete, onOpen,
}: KidActionBubblesProps) {
  const radius = 70; // distance from center

  const handleAction = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = bubbleActions.find(a => a.id === actionId);
    if (action) playBubbleSound(action.sound);

    switch (actionId) {
      case 'grow': {
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
        const currentIdx = sizes.indexOf(design.displaySize || 'medium');
        const nextSize = sizes[(currentIdx + 1) % sizes.length];
        onSizeChange(design.id, nextSize);
        break;
      }
      case 'cut': {
        // Cycle frame styles (simplified for kids)
        const kidFrames = ['shadow-box', 'gold', 'wood', 'black', 'none'] as const;
        const currentIdx = kidFrames.indexOf(design.frameStyle as any);
        const nextFrame = kidFrames[(currentIdx + 1) % kidFrames.length];
        onUpdate(design.id, { frameStyle: nextFrame } as any);
        break;
      }
      case 'spin': {
        onUpdate(design.id, { rotation: ((design.rotation || 0) + 15) % 360 });
        break;
      }
      case 'save': {
        onUpdate(design.id, { status: design.status === 'hidden' ? 'display' : 'hidden', hidden: design.status !== 'hidden' });
        break;
      }
      case 'open': {
        onOpen(design.id);
        onClose();
        break;
      }
      case 'delete': {
        onDelete(design.id);
        onClose();
        break;
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          />

          {/* Highlight ring around item */}
          <motion.div
            className="absolute inset-0 z-[9999] rounded-lg pointer-events-none"
            initial={{ boxShadow: '0 0 0 0 hsl(var(--primary) / 0)' }}
            animate={{ boxShadow: '0 0 0 4px hsl(var(--primary) / 0.4), 0 0 24px 4px hsl(var(--primary) / 0.15)' }}
            exit={{ boxShadow: '0 0 0 0 hsl(var(--primary) / 0)' }}
          />

          {/* Floating action bubbles */}
          <div className="absolute inset-0 z-[10000] pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {bubbleActions.map((action, i) => {
                const angleRad = (action.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.button
                    key={action.id}
                    className="pointer-events-auto absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white/80 bg-background hover:scale-110 active:scale-90 transition-transform"
                    style={{
                      background: action.id === 'delete'
                        ? 'hsl(0, 70%, 92%)'
                        : action.id === 'save'
                          ? 'hsl(45, 80%, 90%)'
                          : action.id === 'open'
                            ? 'hsl(200, 70%, 90%)'
                            : 'hsl(var(--secondary))',
                    }}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      x,
                      y,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 18,
                      delay: i * 0.04,
                    }}
                    onClick={(e) => handleAction(action.id, e)}
                    title={action.id}
                  >
                    {action.emoji}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
