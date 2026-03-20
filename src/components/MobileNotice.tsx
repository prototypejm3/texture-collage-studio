import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor } from 'lucide-react';

const DISMISSED_KEY = 'mobile-notice-dismissed';

export function MobileNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (isMobile && !dismissed) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-3">👀</div>
            <h2 className="text-lg font-bold text-foreground mb-1">
              Hey! We noticed you're on mobile
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              You can keep going — but this is <span className="font-semibold text-foreground">way better on desktop</span>.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-5">
              <Monitor className="w-4 h-4" />
              <span>Best on laptop or tablet</span>
            </div>
            <button
              onClick={dismiss}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Got it, let me in! 🎨
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
