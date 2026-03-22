import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ExpandableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  direction?: 'up' | 'right' | 'down' | 'left';
  anchor?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-right' | 'left' | 'right';
  kidMode?: boolean;
  children: React.ReactNode;
  className?: string;
}

const directionVariants = {
  up: {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  down: {
    hidden: { y: '-100%', opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  right: {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  left: {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
};

export function ExpandableDrawer({
  isOpen,
  onClose,
  title,
  icon,
  direction = 'up',
  kidMode,
  children,
  className = '',
}: ExpandableDrawerProps) {
  const variants = directionVariants[direction];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className={`
            bg-popover border border-border rounded-xl shadow-2xl overflow-hidden
            flex flex-col z-40
            ${kidMode ? 'rounded-[20px]' : ''}
            ${className}
          `}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-3 shrink-0 border-b border-border ${
            kidMode ? 'py-2' : 'py-1.5'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className={kidMode ? 'text-lg' : 'text-sm'}>{icon}</span>
              <span className={`font-semibold ${kidMode ? 'text-sm' : 'text-[11px] uppercase tracking-wide text-muted-foreground'}`}>
                {title}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-secondary transition-colors"
            >
              <X className={kidMode ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
