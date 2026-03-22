import { motion } from 'framer-motion';

// Kid mode illustrated button icons
import kidBtnSave from '@/assets/kid-btn-save.png';
import kidBtnColors from '@/assets/kid-btn-colors.png';
import kidBtnFrame from '@/assets/kid-btn-frame.png';
import kidBtnShapes from '@/assets/kid-btn-shapes.png';

const kidIcons: Record<string, string> = {
  mybox: kidBtnSave,
  textures: kidBtnColors,
  tools: kidBtnFrame,
  stencils: kidBtnShapes,
};

interface BoxButtonProps {
  id: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  kidMode?: boolean;
  className?: string;
}

export function BoxButton({ id, icon, label, isActive, onClick, kidMode, className = '' }: BoxButtonProps) {
  const kidImage = kidMode ? kidIcons[id] : undefined;

  return (
    <motion.button
      data-box-btn
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      whileTap={{ scale: 0.92 }}
      className={`
        relative flex flex-col items-center justify-center select-none
        transition-all duration-200 ease-out
        ${kidMode
          ? `w-20 h-20 rounded-[18px] shadow-lg ${
              isActive
                ? 'bg-accent text-accent-foreground scale-105 shadow-xl ring-2 ring-primary/40'
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
      {kidImage ? (
        <img src={kidImage} alt={label} className="w-11 h-11 object-contain pointer-events-none" />
      ) : (
        <span className="leading-none">{icon}</span>
      )}
      {kidMode && (
        <span className="text-[9px] font-bold leading-none opacity-80 -mt-0.5">{label}</span>
      )}
    </motion.button>
  );
}
