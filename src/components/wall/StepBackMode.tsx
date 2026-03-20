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
          style={{ background: '#111' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Full scene with perspective — camera looking slightly down at the wall */}
          <div
            className="absolute inset-0"
            style={{ perspective: '2200px', perspectiveOrigin: '50% 35%' }}
          >
            {/* Scene container — everything tilts together for realism */}
            <div
              className="absolute inset-0 flex flex-col"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* ═══ CEILING ZONE ═══ */}
              <div
                className="relative flex-shrink-0 pointer-events-none"
                style={{ height: '6%' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, hsl(0,0%,8%) 0%, hsl(0,0%,14%) 100%)',
                  }}
                />
                {/* Ceiling-wall edge — subtle shadow line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0.15), rgba(0,0,0,0.3))',
                  }}
                />
              </div>

              {/* ═══ WALL ZONE — the main surface ═══ */}
              <motion.div
                className="relative flex-1"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center 60%',
                }}
                initial={{ rotateX: 0, scale: 1.02 }}
                animate={{ rotateX: 2, scale: 0.94 }}
                exit={{ rotateX: 0, scale: 1.02 }}
                transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Wall background texture */}
                <div
                  className={`absolute inset-0 ${wallClassName}`}
                  style={wallStyle}
                />

                {/* Wall lighting — center brighter, edges darker (gallery spotlighting) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 65% 55% at 50% 42%, transparent 25%, rgba(0,0,0,0.18) 100%)
                    `,
                  }}
                />

                {/* Top-down gallery light wash */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,252,240,0.08) 0%, rgba(255,252,240,0.02) 20%, transparent 40%)',
                  }}
                />

                {/* Wall content — the frames */}
                <div className="absolute inset-0 flex items-center justify-center overflow-auto p-8 md:p-12">
                  <div className="max-w-5xl w-full">
                    {children}
                  </div>
                </div>

                {/* Bottom edge contact shadow — wall meets baseboard */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[4px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.25))',
                  }}
                />
              </motion.div>

              {/* ═══ BASEBOARD ═══ */}
              <div
                className="relative flex-shrink-0 pointer-events-none"
                style={{ height: '14px' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, hsl(30,12%,32%) 0%, hsl(28,10%,25%) 50%, hsl(25,8%,20%) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 3px 8px rgba(0,0,0,0.4)',
                  }}
                />
                {/* Baseboard top molding highlight */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent)',
                  }}
                />
                {/* Baseboard bottom groove */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                />
              </div>

              {/* ═══ FLOOR — polished concrete ═══ */}
              <motion.div
                className="relative flex-shrink-0 pointer-events-none"
                style={{
                  height: '22%',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center top',
                }}
                initial={{ opacity: 0, rotateX: 0 }}
                animate={{ opacity: 1, rotateX: -4 }}
                exit={{ opacity: 0, rotateX: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Concrete base color */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(180deg,
                        hsl(210, 3%, 28%) 0%,
                        hsl(210, 2%, 24%) 30%,
                        hsl(210, 2%, 20%) 60%,
                        hsl(210, 2%, 15%) 100%
                      )
                    `,
                  }}
                />

                {/* Concrete speckle texture — layered noise-like gradients */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle 1px at 15% 20%, rgba(255,255,255,0.04) 0%, transparent 100%),
                      radial-gradient(circle 1px at 45% 35%, rgba(255,255,255,0.03) 0%, transparent 100%),
                      radial-gradient(circle 2px at 72% 15%, rgba(255,255,255,0.04) 0%, transparent 100%),
                      radial-gradient(circle 1px at 28% 60%, rgba(0,0,0,0.06) 0%, transparent 100%),
                      radial-gradient(circle 2px at 85% 45%, rgba(255,255,255,0.03) 0%, transparent 100%),
                      radial-gradient(circle 1px at 55% 75%, rgba(0,0,0,0.05) 0%, transparent 100%),
                      radial-gradient(circle 1.5px at 10% 80%, rgba(255,255,255,0.03) 0%, transparent 100%),
                      radial-gradient(circle 1px at 90% 70%, rgba(0,0,0,0.04) 0%, transparent 100%)
                    `,
                  }}
                />

                {/* Concrete aggregate / micro-variation pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      repeating-conic-gradient(
                        rgba(255,255,255,0.015) 0deg, transparent 3deg, transparent 90deg
                      )
                    `,
                    backgroundSize: '80px 80px',
                  }}
                />

                {/* Subtle surface imperfections — light patches */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 30% 40% at 25% 30%, rgba(255,255,255,0.03) 0%, transparent 100%),
                      radial-gradient(ellipse 25% 35% at 70% 50%, rgba(255,255,255,0.025) 0%, transparent 100%),
                      radial-gradient(ellipse 20% 30% at 50% 20%, rgba(0,0,0,0.03) 0%, transparent 100%)
                    `,
                  }}
                />

                {/* Floor reflection of the wall — very subtle mirror */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 30%, transparent 60%)',
                  }}
                />

                {/* Perspective fade — floor recedes into darkness */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 15%, rgba(0,0,0,0.5) 100%)',
                  }}
                />

                {/* Contact shadow at baseboard-floor junction */}
                <div
                  className="absolute top-0 left-0 right-0 h-[6px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 100%)',
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Vignette — cinematic darkened edges */}
          <div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: `
                radial-gradient(ellipse 75% 65% at 50% 38%, transparent 35%, rgba(0,0,0,0.35) 100%)
              `,
            }}
          />

          {/* Side wall hints — very subtle edge shadows suggesting depth */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              boxShadow: 'inset 60px 0 80px -30px rgba(0,0,0,0.2), inset -60px 0 80px -30px rgba(0,0,0,0.2)',
            }}
          />

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-3 rounded-full bg-popover/80 text-muted-foreground hover:text-foreground hover:bg-popover transition-all border border-border shadow-lg"
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
