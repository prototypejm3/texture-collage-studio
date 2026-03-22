import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { useAiCredits } from '@/hooks/useAiCredits';

interface AiLowCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiLowCreditsModal({ isOpen, onClose }: AiLowCreditsModalProps) {
  const { handlePurchase, remainingMonthly, purchasedCredits, creditsResetAt } = useAiCredits();

  const resetDate = creditsResetAt ? new Date(creditsResetAt) : null;
  const nextReset = resetDate ? new Date(resetDate.getFullYear(), resetDate.getMonth() + 1, 1) : null;
  const resetLabel = nextReset ? nextReset.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

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
              Get More AI Stencils
            </h3>

            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-foreground">10 generations</div>
              <div className="text-lg font-semibold text-primary">$2.00</div>
              <p className="text-[11px] text-muted-foreground mt-1">Credits never expire</p>
            </div>

            <div className="text-[10px] text-muted-foreground text-center mb-4 bg-secondary/50 rounded-lg px-3 py-2">
              <div>Monthly: {remainingMonthly} left</div>
              <div>Extra: {purchasedCredits} left</div>
              {resetLabel && <div className="mt-1">or wait until {resetLabel}</div>}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => { handlePurchase(); onClose(); }}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy for $2
              </button>
              <button
                onClick={onClose}
                className="w-full px-3 py-2 text-xs rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
