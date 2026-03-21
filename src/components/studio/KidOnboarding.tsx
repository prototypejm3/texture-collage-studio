import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'intro' | 'pick' | 'move' | 'tool' | 'save' | 'done';

const STORAGE_KEY = 'kid-onboarding-complete';

export function useKidOnboarding(kidMode: boolean) {
  const [step, setStep] = useState<Step | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!kidMode) { setActive(false); return; }
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    } catch {}
    const t = setTimeout(() => {
      setStep('intro');
      setActive(true);
    }, 800);
    return () => clearTimeout(t);
  }, [kidMode]);

  const advanceTo = useCallback((next: Step) => {
    setStep(next);
    if (next === 'done') {
      setTimeout(() => {
        setActive(false);
        setStep(null);
        try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
      }, 2200);
    }
  }, []);

  // Called when a texture is dragged/dropped onto canvas
  const notifyPick = useCallback(() => {
    if (step === 'pick') advanceTo('move');
  }, [step, advanceTo]);

  const notifyMove = useCallback(() => {
    if (step === 'move') advanceTo('tool');
  }, [step, advanceTo]);

  const notifyToolUse = useCallback(() => {
    if (step === 'tool') advanceTo('save');
  }, [step, advanceTo]);

  const notifySave = useCallback(() => {
    if (step === 'save') advanceTo('done');
  }, [step, advanceTo]);

  const skip = useCallback(() => {
    setActive(false);
    setStep(null);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
  }, []);

  return { step, active, notifyPick, notifyMove, notifyToolUse, notifySave, skip, advanceTo };
}

interface OverlayProps {
  step: Step | null;
  active: boolean;
  onSkip: () => void;
  onAdvance: (next: Step) => void;
}

const confettiEmojis = ['🎨', '✨', '🌟', '🎉', '💛', '⭐'];

const stepConfig: Record<string, { emoji: string; title: string; sub: string }> = {
  pick: { emoji: '👇', title: 'Pick a color or a stencil!', sub: 'Drag a swatch or stencil onto the canvas' },
  move: { emoji: '👆', title: 'Move it!', sub: 'Drag the shape around' },
  tool: { emoji: '✂️', title: 'Try a tool!', sub: 'Tap a tool on the shape' },
  save: { emoji: '📦', title: 'Save it!', sub: 'Drag it to the box' },
};

const stepOrder = ['pick', 'move', 'tool', 'save'];

export function KidOnboardingOverlay({ step, active, onSkip, onAdvance }: OverlayProps) {
  const [confetti, setConfetti] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  // Auto-advance from intro → pick
  useEffect(() => {
    if (step === 'intro') {
      const t = setTimeout(() => onAdvance('pick'), 2000);
      return () => clearTimeout(t);
    }
  }, [step, onAdvance]);

  // Confetti on done
  useEffect(() => {
    if (step === 'done') {
      const items = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: confettiEmojis[i % confettiEmojis.length],
        x: 10 + Math.random() * 80,
        delay: Math.random() * 0.4,
      }));
      setConfetti(items);
    } else {
      setConfetti([]);
    }
  }, [step]);

  if (!active || !step) return null;

  const isActionStep = step && stepConfig[step];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <AnimatePresence mode="wait">
      {/* Intro screen */}
      {step === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 150 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
              Let's play!
            </h1>
          </motion.div>
        </motion.div>
      )}

      {/* "Pick a color" step — positioned right above the texture swatches */}
      {step === 'pick' && (
        <motion.div
          key="pick"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed z-[300] pointer-events-auto"
          style={{ bottom: 'calc(30% + 8px)', left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* Step dots */}
            <div className="flex gap-1.5 mb-1">
              {stepOrder.map((s, i) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    s === step ? 'w-8 bg-primary' :
                    currentStepIndex > i ? 'w-4 bg-primary/50' : 'w-4 bg-muted'
                  }`}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <span className="text-3xl">👇</span>
              <div>
                <p className="text-lg font-bold leading-tight">Pick a color!</p>
                <p className="text-xs opacity-80">Drag a swatch up to the canvas</p>
              </div>
            </motion.div>

            {/* Bouncing arrow pointing down to swatches */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl"
            >
              ⬇️
            </motion.div>

            <button
              onClick={onSkip}
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors mt-1"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}

      {/* Move / Tool / Save steps — top of screen */}
      {isActionStep && step !== 'pick' && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 mb-1">
              {stepOrder.map((s, i) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    s === step ? 'w-8 bg-primary' :
                    currentStepIndex > i ? 'w-4 bg-primary/50' : 'w-4 bg-muted'
                  }`}
                />
              ))}
            </div>

            <motion.div
              key={`bubble-${step}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <span className="text-3xl">{stepConfig[step].emoji}</span>
              <div>
                <p className="text-lg font-bold leading-tight">{stepConfig[step].title}</p>
                <p className="text-xs opacity-80">{stepConfig[step].sub}</p>
              </div>
            </motion.div>

            <button
              onClick={onSkip}
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors mt-1"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}

      {/* Pulsing glow on texture panel during pick step */}
      {step === 'pick' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[299] pointer-events-none"
        >
          <style>{`
            [data-texture-panel] {
              animation: onboarding-glow 1.2s ease-in-out infinite alternate;
            }
            @keyframes onboarding-glow {
              from { box-shadow: 0 0 8px 2px hsl(var(--primary) / 0.3); }
              to { box-shadow: 0 0 20px 6px hsl(var(--primary) / 0.6); }
            }
          `}</style>
        </motion.div>
      )}

      {/* Ghost hand for move step */}
      {step === 'move' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[299] pointer-events-none"
        >
          <motion.div
            animate={{
              x: [0, 30, 30, 0],
              y: [0, -10, -10, 0],
              opacity: [0.7, 0.9, 0.9, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 text-4xl"
          >
            👆
          </motion.div>
        </motion.div>
      )}

      {step === 'tool' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[299] pointer-events-none"
        >
          <style>{`
            [data-kid-toolbox] {
              animation: onboarding-glow 1.2s ease-in-out infinite alternate;
            }
          `}</style>
        </motion.div>
      )}

      {step === 'save' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[299] pointer-events-none"
        >
          <style>{`
            [data-kid-box] {
              animation: onboarding-glow 1.2s ease-in-out infinite alternate;
            }
          `}</style>
        </motion.div>
      )}

      {/* Done screen with confetti */}
      {step === 'done' && (
        <motion.div
          key="done"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
        >
          {confetti.map(c => (
            <motion.span
              key={c.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: [0, -60, 200],
                x: [0, (Math.random() - 0.5) * 60],
                opacity: [1, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 1.8, delay: c.delay, ease: 'easeOut' }}
              className="fixed text-2xl pointer-events-none"
              style={{ left: `${c.x}%`, top: '40%' }}
            >
              {c.emoji}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 120, delay: 0.2 }}
            className="text-center bg-primary/90 backdrop-blur-sm text-primary-foreground px-8 py-5 rounded-3xl shadow-2xl"
          >
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-extrabold">You're ready!</h2>
            <p className="text-sm opacity-80 mt-1">Go make something awesome!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
