import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SewingTinProps {
  isOpen: boolean;
  onToggle: () => void;
  itemCount: number;
}

function TinSVG({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
      {/* Tin body */}
      <rect x="4" y="18" width="56" height="30" rx="4" fill="#8a8a8a" />
      <rect x="4" y="18" width="56" height="30" rx="4" fill="url(#tinGrad)" />
      {/* Label on tin */}
      <rect x="14" y="24" width="36" height="16" rx="2" fill="#d4c4a8" opacity="0.6" />
      <rect x="16" y="26" width="32" height="12" rx="1" fill="none" stroke="#b8a88c" strokeWidth="0.5" />
      {/* Tiny thread spool inside */}
      {isOpen && (
        <>
          <circle cx="22" cy="30" r="3" fill="#c0392b" opacity="0.7" />
          <circle cx="22" cy="30" r="1.5" fill="#e8d0b8" />
          <circle cx="34" cy="28" r="2" fill="#2980b9" opacity="0.6" />
          <rect x="40" y="27" width="6" height="4" rx="1" fill="#d4a574" opacity="0.5" />
          {/* Button */}
          <circle cx="44" cy="32" r="2.5" fill="#e8d8c4" stroke="#b8a88c" strokeWidth="0.5" />
          <circle cx="43.5" cy="31.5" r="0.5" fill="#a09080" />
          <circle cx="44.5" cy="31.5" r="0.5" fill="#a09080" />
          <circle cx="43.5" cy="32.5" r="0.5" fill="#a09080" />
          <circle cx="44.5" cy="32.5" r="0.5" fill="#a09080" />
        </>
      )}
      {/* Lid */}
      <motion.g
        animate={{ rotate: isOpen ? -35 : -5, y: isOpen ? -8 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ originX: '4px', originY: '18px', transformOrigin: '4px 18px' }}
      >
        <rect x="2" y="10" width="60" height="10" rx="3" fill="#9a9a9a" />
        <rect x="2" y="10" width="60" height="10" rx="3" fill="url(#lidGrad)" />
        {/* Lid clasp */}
        <rect x="26" y="14" width="12" height="4" rx="1.5" fill="#b0b0b0" stroke="#888" strokeWidth="0.5" />
        {/* Embossed pattern on lid */}
        <rect x="8" y="12" width="48" height="6" rx="2" fill="none" stroke="#aaa" strokeWidth="0.3" opacity="0.5" />
      </motion.g>
      {/* Gradients */}
      <defs>
        <linearGradient id="tinGrad" x1="0" y1="18" x2="0" y2="48">
          <stop offset="0%" stopColor="#b0b0b0" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#888" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#666" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="10" x2="0" y2="20">
          <stop offset="0%" stopColor="#c0c0c0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#888" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SewingTin({ isOpen, onToggle, itemCount }: SewingTinProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center cursor-pointer select-none"
      title="Keepsakes"
    >
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <TinSVG isOpen={isOpen || isHovered} />
      </motion.div>
      {/* Item count badge */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center"
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="text-[9px] text-muted-foreground mt-0.5 opacity-60">Keepsakes</span>
    </motion.button>
  );
}
