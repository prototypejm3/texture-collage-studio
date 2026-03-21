import { motion, AnimatePresence } from 'framer-motion';
import { CelebrationToast as ToastType } from '@/hooks/useKidCelebration';

interface Props {
  toasts: ToastType[];
}

export function CelebrationOverlay({ toasts }: Props) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
              duration: 0.4,
            }}
            className="absolute px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg whitespace-nowrap"
            style={{
              left: toast.x,
              top: toast.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {toast.message}
            {/* Sparkle effect */}
            <motion.span
              className="absolute -top-1 -right-1 text-xs"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: 1 }}
            >
              ✨
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
