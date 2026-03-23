import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SavedDesign, FrameStyle, HangingStyle } from '@/types/wall';

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

type BubbleSoundType = 'pop' | 'spin' | 'grow' | 'poof' | 'sparkle';

function playBubbleSound(type: BubbleSoundType, isKid: boolean) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;

    if (isKid) {
      // Kid sounds — bouncy & playful
      switch (type) {
        case 'pop':
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(900, t + 0.06);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.start(t); osc.stop(t + 0.15); break;
        case 'spin':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, t);
          osc.frequency.exponentialRampToValueAtTime(800, t + 0.12);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.start(t); osc.stop(t + 0.2); break;
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
          osc.frequency.exponentialRampToValueAtTime(1600, t + 0.08);
          osc.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.start(t); osc.stop(t + 0.25); break;
      }
    } else {
      // Adult sounds — meditative & zen
      switch (type) {
        case 'pop':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(528, t); // Solfeggio healing frequency
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc.start(t); osc.stop(t + 0.6); break;
        case 'spin':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(396, t);
          osc.frequency.exponentialRampToValueAtTime(528, t + 0.3);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc.start(t); osc.stop(t + 0.5); break;
        case 'grow':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(396, t);
          osc.frequency.exponentialRampToValueAtTime(639, t + 0.35);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc.start(t); osc.stop(t + 0.5); break;
        case 'poof':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(396, t);
          osc.frequency.exponentialRampToValueAtTime(174, t + 0.5);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc.start(t); osc.stop(t + 0.6); break;
        case 'sparkle':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(528, t);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
          osc.start(t); osc.stop(t + 0.7);
          // Harmonic overtone
          const osc2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(639, t + 0.1);
          g2.gain.setValueAtTime(0.04, t + 0.1);
          g2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc2.connect(g2).connect(ctx.destination);
          osc2.start(t + 0.1); osc2.stop(t + 0.6);
          break;
      }
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
  { id: 'grow',    emoji: '±',  label: 'Size',      angle: -120, sound: 'grow' },
  { id: 'cut',     emoji: '🖼️', label: 'Frame',     angle: -75,  sound: 'pop' },
  { id: 'hang',    emoji: '📌', label: 'Hang',      angle: -30,  sound: 'pop' },
  { id: 'spin',    emoji: '🔄', label: 'Spin',      angle: 15,   sound: 'spin' },
  { id: 'gallery', emoji: '⭐', label: 'Share!',    angle: 60,   sound: 'sparkle', color: 'hsl(280, 60%, 90%)' },
  { id: 'save',    emoji: '📦', label: 'Box',       angle: 105,  sound: 'sparkle', color: 'hsl(45, 80%, 90%)' },
  { id: 'open',    emoji: '🖍️', label: 'Open',      angle: 150,  sound: 'pop',     color: 'hsl(200, 70%, 90%)' },
  { id: 'delete',  emoji: '🗑️', label: 'Delete',    angle: 195,  sound: 'poof',    color: 'hsl(0, 70%, 92%)' },
];

const kidHangCycle: HangingStyle[] = ['red-tack', 'cork-tack', 'string', 'floating'];

const adultBubbleActions: BubbleAction[] = [
  { id: 'resize',    emoji: '↕️',  label: 'Resize',    angle: -120, sound: 'grow' },
  { id: 'frame',     emoji: '🖼️', label: 'Frame',     angle: -80,  sound: 'pop' },
  { id: 'rotate',    emoji: '🔄', label: 'Rotate',    angle: -40,  sound: 'spin' },
  { id: 'duplicate', emoji: '📋', label: 'Duplicate', angle: 0,    sound: 'sparkle' },
  { id: 'pin',       emoji: '📌', label: 'Pin',       angle: 40,   sound: 'pop' },
  { id: 'gallery',   emoji: '🎨', label: 'Gallery',   angle: 80,   sound: 'sparkle', color: 'hsl(280, 60%, 90%)' },
  { id: 'open',      emoji: '✏️', label: 'Edit',      angle: 120,  sound: 'pop',     color: 'hsl(200, 70%, 90%)' },
  { id: 'hide',      emoji: '👁️', label: 'Hide',      angle: 160,  sound: 'sparkle', color: 'hsl(45, 80%, 90%)' },
  { id: 'delete',    emoji: '🗑️', label: 'Delete',    angle: 200,  sound: 'poof',    color: 'hsl(0, 70%, 92%)' },
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
    if (action) playBubbleSound(action.sound, isKid);

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
      case 'hang': {
        const currentIdx = kidHangCycle.indexOf((design.hangingStyle || 'floating') as HangingStyle);
        const nextHang = kidHangCycle[(currentIdx + 1) % kidHangCycle.length];
        onUpdate(design.id, { hangingStyle: nextHang } as any);
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
      case 'gallery': {
        if (design.gallerySubmissionId) {
          // Already submitted
        } else {
          onSubmitToGallery?.(design.id);
        }
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
    if (action.id === 'hide') return design.hidden ? 'Show' : 'Hide';
    if (action.id === 'pin') return design.pinned ? 'Unpin' : 'Pin';
    if (action.id === 'gallery') return design.gallerySubmissionId ? 'Submitted' : 'Gallery';
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
