import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Replace, Sparkles, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const VALID_PROMO_CODES: Record<string, { tier: string; durationDays: number }> = {
  'BYPASS': { tier: 'premium', durationDays: 36500 },
  'SNACKCLUB': { tier: 'premium', durationDays: 30 },
};

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  onUnlock: () => void;
}

export function PaywallModal({ isOpen, onClose, onReplace, onUnlock }: PaywallModalProps) {
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    const promo = VALID_PROMO_CODES[code];
    if (promo) {
      // Store expiration date
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + promo.durationDays);
      localStorage.setItem('premium-expiry', expiry.toISOString());
      localStorage.setItem('promo-code-used', code);
      const durationLabel = promo.durationDays >= 365 ? 'lifetime' : `${promo.durationDays} days`;
      toast({ title: '🎉 Code accepted!', description: `You've unlocked premium for ${durationLabel}!` });
      onUnlock();
      setPromoCode('');
      setShowPromo(false);
    } else {
      toast({ title: 'Invalid code', description: 'That promo code doesn\'t exist. Double-check and try again.', variant: 'destructive' });
    }
  };

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
              <h2 className="text-lg font-bold text-foreground">Unlock your full Wall</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Save unlimited designs, customize your gallery, and build your collection.
              </p>
            </div>

            {/* Body */}
            <div className="p-6 pt-4">
              <p className="text-sm text-foreground font-medium mb-2">Unlock your Wall to:</p>
              <ul className="space-y-2 mb-6">
                {[
                  'Unlimited designs on your wall',
                  'Upload custom textures',
                  'Upload reference images',
                  'AI-generate custom stencils',
                  'Upload your own wall photo',
                  'All wall layouts & backgrounds',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2.5">
                <a
                  href="https://buy.stripe.com/9B63cn69tfkC72u59OdQQ04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Unlock — $4.99
                </a>
                <p className="text-center text-[11px] text-muted-foreground -mt-1">
                  Includes a 7-day free trial · Cancel anytime
                </p>
                <button
                  onClick={onReplace}
                  className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
                >
                  <Replace className="w-4 h-4" />
                  Replace Current Design
                </button>
              </div>

              {/* Promo Code */}
              <div className="mt-4 pt-4 border-t border-border">
                {!showPromo ? (
                  <button
                    onClick={() => setShowPromo(true)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Tag className="w-3 h-3" />
                    Have a promo code?
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim()}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
