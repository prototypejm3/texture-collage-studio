import { useState, useEffect, useRef } from 'react';
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
  const [mode, setMode] = useState<'question' | 'pin' | 'set-pin'>('question');
  const [pin, setPin] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [pinHint, setPinHint] = useState('');
  const [pinError, setPinError] = useState(false);
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const newPinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const savedPin = typeof window !== 'undefined' ? localStorage.getItem('grownup-pin') : null;

  useEffect(() => {
    if (isOpen) {
      setAnswer('');
      setResult(null);
      setPin(['', '', '', '']);
      setNewPin(['', '', '', '']);
      setPinHint('');
      setPinError(false);
      // If a PIN is saved, go straight to PIN entry
      setMode(savedPin ? 'pin' : 'question');
    }
  }, [isOpen, savedPin]);

  const handleSubmit = () => {
    const trimmed = answer.trim().toLowerCase();
    if (!trimmed) return;
    const grownUpKeywords = ['mortgage', 'interest', 'loan', 'escrow', 'credit', 'insurance', 'premium', 'deductible', 'apr', 'refinance', 'amortiz', 'equity', 'down payment', 'principal', 'rate', 'bank', 'lender', 'payment', 'house', 'home', 'buy', 'borrow', 'debt', 'monthly', 'fixed', 'variable', 'arm',
      'tax', 'w-2', 'w2', 'wage', 'irs', 'income', 'employer', '1099', 'withholding', 'deduction', 'refund', 'filing',
      'annual', 'percent'];
    const isGrownUp = grownUpKeywords.some(kw => trimmed.includes(kw));
    if (isGrownUp) {
      setResult('correct');
      // Show set-pin step after a brief delay
      setTimeout(() => setMode('set-pin'), 1200);
    } else {
      setResult('wrong');
    }
  };

  const handlePinInput = (index: number, value: string, isNewPin: boolean) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const arr = isNewPin ? [...newPin] : [...pin];
    arr[index] = digit;
    if (isNewPin) {
      setNewPin(arr);
    } else {
      setPin(arr);
      setPinError(false);
    }
    // Auto-focus next
    if (digit && index < 3) {
      const refs = isNewPin ? newPinRefs : pinRefs;
      refs[index + 1].current?.focus();
    }
    // Auto-submit when all 4 filled
    if (digit && index === 3) {
      const fullPin = arr.join('');
      if (fullPin.length === 4) {
        if (isNewPin) {
          // Save new PIN and optional hint
          localStorage.setItem('grownup-pin', fullPin);
          if (pinHint.trim()) {
            localStorage.setItem('grownup-pin-hint', pinHint.trim());
          } else {
            localStorage.removeItem('grownup-pin-hint');
          }
          onSuccess();
        } else {
          // Check PIN
          if (fullPin === savedPin) {
            onSuccess();
          } else {
            setPinError(true);
            setPin(['', '', '', '']);
            const refs = isNewPin ? newPinRefs : pinRefs;
            setTimeout(() => refs[0].current?.focus(), 100);
          }
        }
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent, isNewPin: boolean) => {
    if (e.key === 'Backspace') {
      const arr = isNewPin ? [...newPin] : [...pin];
      if (!arr[index] && index > 0) {
        const refs = isNewPin ? newPinRefs : pinRefs;
        refs[index - 1].current?.focus();
      }
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

        <AnimatePresence mode="wait">
          {/* PIN entry mode (when PIN is already set) */}
          {mode === 'pin' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm font-medium text-foreground mb-4 text-center">
                Enter your 4-digit PIN
              </p>
              <div className="flex justify-center gap-3 mb-4">
                {pin.map((d, i) => (
                  <input
                    key={i}
                    ref={pinRefs[i]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handlePinInput(i, e.target.value, false)}
                    onKeyDown={(e) => handlePinKeyDown(i, e, false)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-secondary/30 text-foreground focus:outline-none focus:border-primary transition-colors ${
                      pinError ? 'border-destructive animate-shake' : 'border-border'
                    }`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {pinError && (
                <p className="text-xs text-destructive text-center mb-3">Wrong PIN — try again</p>
              )}
              <button
                onClick={() => setMode('question')}
                className="w-full text-xs text-muted-foreground hover:text-foreground text-center py-1"
              >
                Forgot PIN? Answer question instead
              </button>
            </motion.div>
          )}

          {/* Question mode */}
          {mode === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm font-medium text-foreground mb-4 text-center leading-relaxed">
                What does APR stand for on a mortgage?
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
          )}

          {/* Set PIN mode (after answering correctly) */}
          {mode === 'set-pin' && (
            <motion.div
              key="set-pin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm font-medium text-foreground mb-1 text-center">
                Set a 4-digit PIN
              </p>
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Use this next time instead of the question
              </p>
              <div className="flex justify-center gap-3 mb-5">
                {newPin.map((d, i) => (
                  <input
                    key={i}
                    ref={newPinRefs[i]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handlePinInput(i, e.target.value, true)}
                    onKeyDown={(e) => handlePinKeyDown(i, e, true)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-secondary/30 text-foreground focus:outline-none focus:border-primary transition-colors"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button
                onClick={() => onSuccess()}
                className="w-full text-xs text-muted-foreground hover:text-foreground text-center py-1"
              >
                Skip for now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}