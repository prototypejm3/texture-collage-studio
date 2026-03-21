import { motion, AnimatePresence } from 'framer-motion';
import { SavedDesign, FrameStyle } from '@/types/wall';

interface ActionBubblesProps {
  design: SavedDesign;
  isOpen: boolean;
  onClose: () => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large') => void;
  onUpdate: (id: string, updates: Partial<SavedDesign>) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onSubmitToGallery?: (id: string) => void;
  mode?: 'kid' | 'adult';
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

interface BubbleAction {
  id: string;
  emoji: string;
  label: string;
  angle: number;
  sound: 'pop' | 'spin' | 'grow' | 'poof' | 'sparkle';
  color?: string;
}

const kidBubbleActions: BubbleAction[] = [
  { id: 'grow',   emoji: '➕', label: 'Grow',   angle: -90,  sound: 'grow' },
  { id: 'cut',    emoji: '✂️', label: 'Frame',  angle: -45,  sound: 'pop' },
  { id: 'spin',   emoji: '🔄', label: 'Spin',   angle: 0,    sound: 'spin' },
  { id: 'save',   emoji: '📦', label: 'Box',    angle: 45,   sound: 'sparkle', color: 'hsl(45, 80%, 90%)' },
  { id: 'open',   emoji: '🖍️', label: 'Open',   angle: 90,   sound: 'pop',     color: 'hsl(200, 70%, 90%)' },
  { id: 'delete', emoji: '🗑️', label: 'Delete', angle: 135,  sound: 'poof',    color: 'hsl(0, 70%, 92%)' },
];

const adultBubbleActions: BubbleAction[] = [
  { id: 'resize',    emoji: '↕️',  label: 'Resize',    angle: -108, sound: 'grow' },
  { id: 'frame',     emoji: '🖼️', label: 'Frame',     angle: -60,  sound: 'pop' },
  { id: 'rotate',    emoji: '🔄', label: 'Rotate',    angle: -12,  sound: 'spin' },
  { id: 'duplicate', emoji: '📋', label: 'Duplicate', angle: 36,   sound: 'sparkle' },
  { id: 'pin',       emoji: '📌', label: 'Pin',       angle: 84,   sound: 'pop' },
  { id: 'open',      emoji: '✏️', label: 'Edit',      angle: 132,  sound: 'pop',     color: 'hsl(200, 70%, 90%)' },
  { id: 'hide',      emoji: '👁️', label: 'Hide',      angle: 168,  sound: 'sparkle', color: 'hsl(45, 80%, 90%)' },
  { id: 'delete',    emoji: '🗑️', label: 'Delete',    angle: 210,  sound: 'poof',    color: 'hsl(0, 70%, 92%)' },
];

const adultFrameCycle: FrameStyle[] = ['shadow-box', 'gold', 'chrome', 'copper', 'silver', 'black', 'wood', 'minimal', 'floating', 'polaroid', 'none'];

export function KidActionBubbles({
  design, isOpen, onClose, onSizeChange, onUpdate, onDelete, onOpen,
  onDuplicate, onTogglePin, onSubmitToGallery,
  mode = 'kid',
}: ActionBubblesProps) {
  const isKid = mode === 'kid';
  const actions = isKid ? kidBubbleActions : adultBubbleActions;
  const radius = isKid ? 70 : 85;

  const handleAction = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = actions.find(a => a.id === actionId);
    if (action) playBubbleSound(action.sound);

    switch (actionId) {
      case 'grow':
      case 'resize': {
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
        const currentIdx = sizes.indexOf(design.displaySize || 'medium');
        const nextSize = sizes[(currentIdx + 1) % sizes.length];
        onSizeChange(design.id, nextSize);
        break;
      }
      case 'cut': {
        const kidFrames = ['black', 'none', 'rainbow'] as const;
        const currentIdx = kidFrames.indexOf(design.frameStyle as any);
        const nextFrame = kidFrames[(currentIdx + 1) % kidFrames.length];
        onUpdate(design.id, { frameStyle: nextFrame } as any);
        break;
      }
      case 'frame': {
        const currentIdx = adultFrameCycle.indexOf(design.frameStyle);
        const nextFrame = adultFrameCycle[(currentIdx + 1) % adultFrameCycle.length];
        onUpdate(design.id, { frameStyle: nextFrame });
        break;
      }
      case 'spin':
      case 'rotate': {
        onUpdate(design.id, { rotation: ((design.rotation || 0) + 15) % 360 });
        break;
      }
      case 'save': {
        const newStatus = design.status === 'hidden' ? 'display' : 'hidden';
        onUpdate(design.id, { status: newStatus, hidden: newStatus === 'hidden' });
        onClose();
        break;
      }
      case 'hide': {
        const newStatus = design.status === 'hidden' ? 'display' : 'hidden';
        onUpdate(design.id, { status: newStatus, hidden: newStatus === 'hidden' });
        break;
      }
      case 'duplicate': {
        onDuplicate?.(design.id);
        onClose();
        break;
      }
      case 'pin': {
        onTogglePin?.(design.id);
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

  const getBubbleColor = (action: BubbleAction) => {
    if (action.color) return action.color;
    return isKid ? 'hsl(var(--secondary))' : 'hsl(var(--popover))';
  };

  const getLabel = (action: BubbleAction) => {
    // For adult hide bubble, show current state
    if (action.id === 'hide') return design.hidden ? 'Show' : 'Hide';
    if (action.id === 'pin') return design.pinned ? 'Unpin' : 'Pin';
    return action.label;
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
              {actions.map((action, i) => {
                const angleRad = (action.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.button
                    key={action.id}
                    className={`pointer-events-auto absolute rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white/80 hover:scale-110 active:scale-90 transition-transform ${
                      isKid
                        ? 'w-14 h-14 -ml-7 -mt-7 text-2xl'
                        : 'w-12 h-12 -ml-6 -mt-6 text-lg'
                    }`}
                    style={{ background: getBubbleColor(action) }}
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
                    <span>{action.emoji}</span>
                    {!isKid && (
                      <span className="text-[7px] font-medium text-foreground/70 leading-none mt-0.5">
                        {getLabel(action)}
                      </span>
                    )}
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
