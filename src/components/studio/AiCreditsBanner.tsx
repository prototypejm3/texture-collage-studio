import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap } from 'lucide-react';

interface AiCreditsBannerProps {
  type: 'limit' | 'warning';
  visible: boolean;
  onDismiss: () => void;
}

export function AiCreditsBanner({ type, visible, onDismiss }: AiCreditsBannerProps) {
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
                  AI is taking a little break ✨
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  Studio magic running low ⚡
                </>
              )}
            </span>
            <button onClick={onDismiss} className="p-0.5 rounded hover:bg-foreground/10 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
