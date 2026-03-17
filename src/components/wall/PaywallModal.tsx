import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Replace, Sparkles } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  onUnlock: () => void;
}

export function PaywallModal({ isOpen, onClose, onReplace, onUnlock }: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-popover rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-accent">
              <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Save your work</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You can save 1 design for free.
              </p>
            </div>

            {/* Body */}
            <div className="p-6 pt-4">
              <p className="text-sm text-foreground font-medium mb-2">Unlock your Wall to:</p>
              <ul className="space-y-2 mb-6">
                {[
                  'Save unlimited designs',
                  'Build your collection',
                  'Customize your wall',
                  'Come back anytime',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={onUnlock}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Unlock My Wall — $4.99
                </button>
                <button
                  onClick={onReplace}
                  className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
                >
                  <Replace className="w-4 h-4" />
                  Replace Current Design
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
