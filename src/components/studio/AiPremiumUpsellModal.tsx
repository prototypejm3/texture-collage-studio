import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';

interface AiPremiumUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function AiPremiumUpsellModal({ isOpen, onClose, onUpgrade }: AiPremiumUpsellModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-popover border border-border rounded-2xl p-6 w-full max-w-xs shadow-2xl"
          >
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-primary/15">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>

            <h3 className="text-center text-sm font-semibold text-foreground mb-1">
              AI is part of Studio Premium ✨
            </h3>
            <p className="text-center text-xs text-muted-foreground mb-5 leading-relaxed">
              Unlock to create your own custom designs with AI-powered stencils and moods.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onUpgrade(); onClose(); }}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                Unlock Premium
              </button>
              <button
                onClick={onClose}
                className="w-full px-3 py-2 text-xs rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                Keep Creating
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
