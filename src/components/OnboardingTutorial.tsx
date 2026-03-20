import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  title: string;
  text: string;
  highlightSelector?: string;
  cta: string;
}

const kidSteps: TutorialStep[] = [
  {
    title: 'My Room 🧸',
    text: 'This is your special space!\nAll your creations live here 💛',
    highlightSelector: '[data-nav="wall"]',
    cta: 'Next',
  },
  {
    title: 'Show & Tell 🎨',
    text: 'See what other kids made\nand share your creations!',
    highlightSelector: '[data-nav="gallery"]',
    cta: 'Got it!',
  },
];

const adultSteps: TutorialStep[] = [
  {
    title: 'My Wall',
    text: 'Your personal gallery.\nSave and display your work here.',
    highlightSelector: '[data-nav="wall"]',
    cta: 'Next',
  },
  {
    title: 'Gallery',
    text: 'Explore and share creations\nfrom the community.',
    highlightSelector: '[data-nav="gallery"]',
    cta: 'Got it',
  },
];

function getStorageKey(kidMode: boolean, page: string) {
  return `tutorial-seen-${kidMode ? 'kid' : 'adult'}-${page}`;
}

interface Props {
  page: 'studio' | 'wall' | 'gallery';
}

export function OnboardingTutorial({ page }: Props) {
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const steps = kidMode ? kidSteps : adultSteps;
  const storageKey = getStorageKey(kidMode, page);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === 'true') return;
    } catch {}
    // Small delay so page renders first
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, [storageKey]);

  // Update highlight position
  useEffect(() => {
    if (!visible) return;
    const current = steps[step];
    if (!current?.highlightSelector) { setHighlightRect(null); return; }
    const el = document.querySelector(current.highlightSelector);
    if (el) {
      setHighlightRect(el.getBoundingClientRect());
    } else {
      setHighlightRect(null);
    }
  }, [visible, step, steps]);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      // Complete
      setVisible(false);
      try { localStorage.setItem(storageKey, 'true'); } catch {}
    }
  }, [step, steps.length, storageKey]);

  const handleSkip = useCallback(() => {
    setVisible(false);
    try { localStorage.setItem(storageKey, 'true'); } catch {}
  }, [storageKey]);

  if (!visible) return null;

  const current = steps[step];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200]"
          onClick={handleNext}
        >
          {/* Backdrop with cutout for highlighted element */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          {/* Highlight ring around target element */}
          {highlightRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-transparent pointer-events-none"
              style={{
                left: highlightRect.left - 6,
                top: highlightRect.top - 4,
                width: highlightRect.width + 12,
                height: highlightRect.height + 8,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.01)',
                background: 'hsla(var(--primary) / 0.08)',
              }}
            />
          )}

          {/* Card — positioned near highlighted element or centered */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute z-10"
            style={{
              left: highlightRect
                ? Math.min(Math.max(highlightRect.left - 20, 16), window.innerWidth - 300)
                : '50%',
              top: highlightRect
                ? highlightRect.bottom + 16
                : '40%',
              transform: highlightRect ? undefined : 'translate(-50%, -50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-popover border border-border rounded-2xl shadow-2xl p-5 max-w-[280px] w-[280px]">
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mb-3">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === step ? 'w-6 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-border'
                    }`}
                  />
                ))}
              </div>

              <h3 className={`font-bold text-foreground mb-1.5 ${kidMode ? 'text-lg' : 'text-base'}`}>
                {current.title}
              </h3>
              <p className={`text-muted-foreground whitespace-pre-line leading-relaxed mb-4 ${kidMode ? 'text-sm' : 'text-xs'}`}>
                {current.text}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                  className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className={`px-4 py-1.5 rounded-xl font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 ${kidMode ? 'text-sm' : 'text-xs'}`}
                >
                  {current.cta}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}