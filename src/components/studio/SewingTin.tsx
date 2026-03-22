import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sewingTinClosed from '@/assets/sewing-tin-closed.png';
import sewingTinOpen from '@/assets/sewing-tin-open.png';

interface SewingTinProps {
  isOpen: boolean;
  onToggle: () => void;
  itemCount: number;
}

export function SewingTin({ isOpen, onToggle, itemCount }: SewingTinProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showOpen = isOpen || isHovered;

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
        className="w-16 h-14 relative"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={showOpen ? 'open' : 'closed'}
            src={showOpen ? sewingTinOpen : sewingTinClosed}
            alt="Keepsakes tin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>
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
