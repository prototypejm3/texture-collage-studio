import { motion } from 'framer-motion';

interface BoxButtonProps {
  id: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  kidMode?: boolean;
  className?: string;
}

export function BoxButton({ icon, label, isActive, onClick, kidMode, className = '' }: BoxButtonProps) {
  return (
    <motion.button
      data-box-btn
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      whileTap={{ scale: 0.92 }}
      className={`
        relative flex flex-col items-center justify-center select-none
        transition-all duration-200 ease-out
        ${kidMode
          ? `w-16 h-16 rounded-[20px] text-[28px] shadow-lg ${
              isActive
                ? 'bg-accent text-accent-foreground scale-105 shadow-xl'
                : 'bg-card text-card-foreground border border-border hover:shadow-xl hover:scale-105'
            }`
          : `w-[52px] h-[52px] rounded-xl text-[22px] shadow-md ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card text-card-foreground border border-border hover:bg-secondary'
            }`
        }
        ${className}
      `}
      title={label}
    >
      <span className="leading-none">{icon}</span>
      {kidMode && (
        <span className="text-[8px] font-bold mt-0.5 leading-none opacity-80">{label}</span>
      )}
    </motion.button>
  );
}
