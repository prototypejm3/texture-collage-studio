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
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: '#1a1a1a' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Room container with perspective */}
          <div
            className="absolute inset-0 flex flex-col"
            style={{ perspective: '1800px' }}
          >
            {/* Ceiling hint — subtle dark gradient at top */}
            <div
              className="absolute top-0 left-0 right-0 h-[8%] pointer-events-none z-[2]"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 40%, transparent 100%)',
              }}
            />

            {/* Wall surface — takes up ~75% of screen, has subtle perspective tilt */}
            <motion.div
              className="relative flex-1"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center bottom',
                transform: 'rotateX(1.5deg) scale(0.92)',
              }}
              initial={{ scale: 1.05, rotateX: 0 }}
              animate={{ scale: 0.92, rotateX: 1.5 }}
              exit={{ scale: 1.05, rotateX: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Wall background texture */}
              <div
                className={`absolute inset-0 ${wallClassName}`}
                style={{
                  ...wallStyle,
                  borderRadius: '0 0 2px 2px',
                }}
              />

              {/* Wall gradient — lighter center, darker edges */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse 70% 60% at 50% 45%, transparent 30%, rgba(0,0,0,0.12) 100%)
                  `,
                }}
              />

              {/* Top gallery light wash — subtle downward illumination */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,252,240,0.06) 0%, transparent 25%)',
                }}
              />

              {/* Wall content — the frames */}
              <div className="absolute inset-0 flex items-center justify-center overflow-auto p-8 md:p-12">
                <div className="max-w-5xl w-full">
                  {children}
                </div>
              </div>

              {/* Bottom edge shadow — where wall meets baseboard */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.2))',
                }}
              />
            </motion.div>

            {/* Baseboard / wall-floor junction */}
            <div
              className="relative flex-shrink-0 pointer-events-none"
              style={{ height: '12px' }}
            >
              {/* Baseboard trim */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, hsl(30, 15%, 35%) 0%, hsl(30, 12%, 28%) 60%, hsl(30, 10%, 22%) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.3)',
                }}
              />
              {/* Baseboard top highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
            </div>

            {/* Floor — subtle perspective plane */}
            <motion.div
              className="relative flex-shrink-0 pointer-events-none"
              style={{
                height: '18%',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center top',
                transform: 'rotateX(-2deg)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Floor surface — hardwood feel */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(180deg, 
                      hsl(25, 18%, 22%) 0%, 
                      hsl(25, 15%, 18%) 40%,
                      hsl(25, 12%, 14%) 100%
                    )
                  `,
                }}
              />
              {/* Floor reflection — very subtle */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
                }}
              />
              {/* Floor fade to darkness */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.4) 100%)',
                }}
              />
            </motion.div>
          </div>

          {/* Vignette — darkened edges, brighter center */}
          <div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: `
                radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, rgba(0,0,0,0.3) 100%)
              `,
            }}
          />

          {/* Close button */}
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
