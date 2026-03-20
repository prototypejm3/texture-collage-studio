import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AiWelcomeModalProps {
  isOpen: boolean;
  onClose: (aiEnabled: boolean) => void;
}

export function AiWelcomeModal({ isOpen, onClose }: AiWelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-foreground/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-popover border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/15">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>

            <h2 className="text-lg font-bold text-center text-foreground mb-2">
              ✨ AI Stencil Generation
            </h2>

            <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
              Swatchbox Studio can use AI to create custom stencil shapes from a short description — like "butterfly" or "castle".
              <br /><br />
              This feature is <strong>on by default</strong> in Kids Mode too! Parents can turn it off anytime using the <Sparkles className="w-3 h-3 inline text-primary" /> toggle in the top bar.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onClose(true)}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                ✨ Keep AI On
              </button>
              <button
                onClick={() => onClose(false)}
                className="w-full px-4 py-2 text-xs rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                Turn AI Off for now
              </button>
              <p className="text-[9px] text-muted-foreground text-center mt-1">
                You can change this anytime from the top bar
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
