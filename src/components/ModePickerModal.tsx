import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'kid-mode';
const PICKED_KEY = 'mode-picked';

export function ModePickerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const picked = localStorage.getItem(PICKED_KEY);
      const hasMode = localStorage.getItem(STORAGE_KEY);
      if (!picked && !hasMode) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const choose = (kid: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, kid ? 'true' : 'false');
      localStorage.setItem(PICKED_KEY, 'true');
    } catch {}
    window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: kid }));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-foreground/60 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-popover border border-border rounded-3xl shadow-2xl p-6 w-full max-w-md"
          >
            <h1 className="text-2xl font-bold text-center text-foreground mb-1">
              Welcome to Swatchbox Studio
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Who's playing today?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => choose(true)}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-secondary hover:bg-accent border-2 border-border hover:border-primary transition-all"
              >
                <span className="text-5xl">🧸</span>
                <span className="font-bold text-foreground">Kid Mode</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  Big buttons, sounds, fun!
                </span>
              </button>

              <button
                onClick={() => choose(false)}
                className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-secondary hover:bg-accent border-2 border-border hover:border-primary transition-all"
              >
                <span className="text-5xl">🪡</span>
                <span className="font-bold text-foreground">Granny Mode</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  Calm, minimal, keepsake
                </span>
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground/70 text-center mt-4">
              You can switch anytime from the top bar.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
