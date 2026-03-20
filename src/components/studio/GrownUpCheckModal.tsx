import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GrownUpCheckModal({ isOpen, onClose, onSuccess }: Props) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAnswer('');
      setResult(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = answer.trim().toLowerCase();
    if (!trimmed) return;
    // Accept common correct answers
    if (trimmed === 'w-2' || trimmed === 'w2' || trimmed === 'a tax form' || trimmed === 'tax form' || trimmed === 'wage and tax statement' || trimmed === 'taxes' || trimmed === 'a w-2' || trimmed === 'a w2') {
      setResult('correct');
      setTimeout(() => onSuccess(), 1800);
    } else {
      setResult('wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-popover border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <span className="text-3xl">🔒</span>
          <h2 className="text-base font-bold text-foreground mt-2">Grown-Up Check</h2>
          <p className="text-xs text-muted-foreground mt-1">Just making sure 🙂</p>
        </div>

        <p className="text-sm font-medium text-foreground mb-4 text-center leading-relaxed">
          What is a W2?
        </p>

        <input
          type="text"
          value={answer}
          onChange={(e) => { if (!result) setAnswer(e.target.value); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="Type your answer…"
          maxLength={100}
          className={`w-full px-4 py-3 rounded-xl text-sm border-2 bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-5 ${
            result ? 'pointer-events-none opacity-60' : 'border-border'
          }`}
          autoFocus
        />

        <AnimatePresence mode="wait">
          {result === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mb-3"
            >
              <p className="text-sm text-foreground font-medium mb-1">
                Just checking 😊 are you sure you're not a kid?
              </p>
              <p className="text-xs text-muted-foreground">
                The kid space is way more fun 🎨💛
              </p>
              <button
                onClick={onClose}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Back to Kid Land 🧸
              </button>
            </motion.div>
          )}
          {result === 'correct' && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-primary font-medium mb-3"
            >
              ✅ Yep, you're a grown-up!
            </motion.p>
          )}
        </AnimatePresence>

        {!result && (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check
          </button>
        )}
      </motion.div>
    </div>
  );
}
