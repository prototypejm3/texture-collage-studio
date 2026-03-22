import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, ShoppingCart } from 'lucide-react';
import { useAiCredits } from '@/hooks/useAiCredits';

interface AiCreditsBannerProps {
  type: 'limit' | 'warning';
  visible: boolean;
  onDismiss: () => void;
}

export function AiCreditsBanner({ type, visible, onDismiss }: AiCreditsBannerProps) {
  const { totalRemaining, handlePurchase } = useAiCredits();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className={`flex items-center justify-between px-3 py-1.5 text-xs ${
            type === 'limit'
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-b border-amber-200 dark:border-amber-800'
              : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800'
          }`}>
            <span className="flex items-center gap-1.5">
              {type === 'limit' ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  You're out of AI stencil credits
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  Almost out — {totalRemaining} left
                </>
              )}
            </span>
            <button
              onClick={handlePurchase}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ShoppingCart className="w-2.5 h-2.5" />
              Get 10 more for $2
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
