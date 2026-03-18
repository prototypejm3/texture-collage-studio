import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface StepBackModeProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  wallClassName: string;
  wallStyle?: React.CSSProperties;
}

export function StepBackMode({ isOpen, onClose, children, wallClassName, wallStyle }: StepBackModeProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-[100] ${wallClassName}`}
          style={wallStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Subtle vignette */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)',
            }}
          />

          {/* Wall content with zoom-out effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center overflow-auto p-12"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="max-w-5xl w-full">
              {children}
            </div>
          </motion.div>

          {/* Close hint */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-3 rounded-full bg-background/10 backdrop-blur-md text-foreground/40 hover:text-foreground/70 hover:bg-background/20 transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          <motion.p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[11px] text-foreground/20 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Press ESC to exit
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
