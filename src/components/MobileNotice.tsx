import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISSED_KEY = 'mobile-notice-dismissed';

export function MobileNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 640 && 'ontouchstart' in window;
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!isMobile || dismissed) return;

    // Delay mobile hint so it doesn't overlap with onboarding prompts
    const timer = setTimeout(() => {
      // Check if a stencil/color prompt is active
      const stencilPromptActive = document.querySelector('[data-studio-hint]');
      if (!stencilPromptActive) {
        setShow(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      setShow(false);
      localStorage.setItem(DISMISSED_KEY, '1');
    }, 6000);
    return () => clearTimeout(timer);
  }, [show]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed z-[900] left-1/2 -translate-x-1/2"
          style={{ top: 16 }}
          onClick={dismiss}
        >
          <div
            className="px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer select-none"
            style={{
              background: 'hsla(0, 0%, 100%, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 2px 12px hsla(0, 0%, 0%, 0.08)',
              border: '1px solid hsla(0, 0%, 0%, 0.06)',
            }}
          >
            Best experienced on a larger screen
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
