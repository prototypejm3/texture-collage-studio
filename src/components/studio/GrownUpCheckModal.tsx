import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AdultCheck {
  question: string;
  options: { label: string; text: string }[];
  accepted: string[]; // accepted label letters
}

const adultChecks: AdultCheck[] = [
  {
    question: "What is Santa's real first name?",
    options: [
      { label: 'A', text: 'Santa' },
      { label: 'B', text: 'Kris' },
      { label: 'C', text: 'Nicholas' },
    ],
    accepted: ['C'],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GrownUpCheckModal({ isOpen, onClose, onSuccess }: Props) {
  const [check, setCheck] = useState<AdultCheck>(() => adultChecks[Math.floor(Math.random() * adultChecks.length)]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  // Pick a new random question each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setCheck(adultChecks[Math.floor(Math.random() * adultChecks.length)]);
      setSelected(null);
      setResult(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selected) return;
    if (check.accepted.includes(selected)) {
      setResult('correct');
      setTimeout(() => onSuccess(), 600);
    } else {
      setResult('wrong');
      setTimeout(() => {
        setResult(null);
        setSelected(null);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-popover border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-3xl">🔒</span>
          <h2 className="text-base font-bold text-foreground mt-2">Grown-Up Check</h2>
          <p className="text-xs text-muted-foreground mt-1">Just making sure 🙂</p>
        </div>

        {/* Question */}
        <p className="text-sm font-medium text-foreground mb-4 text-center leading-relaxed">
          {check.question}
        </p>

        {/* Options */}
        <div className="space-y-2 mb-5">
          {check.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { if (!result) { setSelected(opt.label); setResult(null); } }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border-2 ${
                selected === opt.label
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-secondary/30 text-foreground hover:border-primary/40 hover:bg-secondary/60'
              } ${result ? 'pointer-events-none' : ''}`}
            >
              <span className="font-bold text-primary mr-2">{opt.label}.</span>
              {opt.text}
            </button>
          ))}
        </div>

        {/* Result feedback */}
        <AnimatePresence mode="wait">
          {result === 'wrong' && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-destructive mb-3"
            >
              hmm… not quite. try again 🤔
            </motion.p>
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

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selected || !!result}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check
        </button>
      </motion.div>
    </div>
  );
}
