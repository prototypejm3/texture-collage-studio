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

function SaveIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Box body */}
      <rect x="10" y="22" width="28" height="18" rx="2" fill="#c4956a" stroke="#a0713a" strokeWidth="1.5" />
      {/* Center line */}
      <line x1="24" y1="22" x2="24" y2="40" stroke="#a0713a" strokeWidth="1" opacity="0.4" />
      {/* Lid */}
      <path d="M8 22 L14 14 L34 14 L40 22 Z" fill="#d9a97c" stroke="#a0713a" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Tape strip */}
      <rect x="21" y="13" width="6" height="27" rx="1" fill="#f7f0e8" opacity="0.5" />
    </svg>
  );
}

function ColorsIcon() {
  const colors = [
    ['#f87171', '#fbbf24', '#4ade80'],
    ['#38bdf8', '#a78bfa', '#fb923c'],
    ['#c4956a', '#94a3b8', '#f9a8d4'],
  ];
  const size = 11;
  const gap = 3;
  const startX = 24 - (size * 3 + gap * 2) / 2;
  const startY = 24 - (size * 3 + gap * 2) / 2;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {colors.map((row, ri) =>
        row.map((color, ci) => (
          <rect
            key={`${ri}-${ci}`}
            x={startX + ci * (size + gap)}
            y={startY + ri * (size + gap)}
            width={size}
            height={size}
            rx={3}
            fill={color}
          />
        ))
      )}
    </svg>
  );
}

function FrameIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Outer frame */}
      <rect x="8" y="10" width="32" height="28" rx="2" fill="#c4956a" stroke="#a0713a" strokeWidth="1.5" />
      {/* Inner canvas */}
      <rect x="13" y="15" width="22" height="18" rx="1" fill="#87ceeb" />
      {/* Ground */}
      <path d="M13 27 Q20 24 24 27 Q28 30 35 26 L35 33 L13 33 Z" fill="#7ec87e" />
      {/* Sun */}
      <circle cx="30" cy="20" r="3.5" fill="#fbbf24" />
      {/* Cloud */}
      <ellipse cx="20" cy="20" rx="5" ry="2.5" fill="white" />
      <ellipse cx="18" cy="21" rx="3" ry="2" fill="white" />
    </svg>
  );
}

function ShapesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Bear body */}
      <ellipse cx="24" cy="30" rx="8" ry="9" fill="#c4956a" />
      {/* Belly patch */}
      <ellipse cx="24" cy="31" rx="5" ry="6" fill="#d9a97c" />
      {/* Head */}
      <circle cx="24" cy="20" r="7" fill="#c4956a" />
      {/* Ears */}
      <circle cx="17" cy="15" r="3.5" fill="#c4956a" />
      <circle cx="31" cy="15" r="3.5" fill="#c4956a" />
      <circle cx="17" cy="15" r="2" fill="#d9a97c" />
      <circle cx="31" cy="15" r="2" fill="#d9a97c" />
      {/* Bandana */}
      <path d="M18 24 Q24 27 30 24" stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Star top-left */}
      <polygon points="10,10 11,13 14,13 11.5,15 12.5,18 10,16 7.5,18 8.5,15 6,13 9,13" fill="#fbbf24" />
      {/* Lightning top-right */}
      <polygon points="37,9 34,15 36,15 33,21 39,14 37,14" fill="#fb923c" />
      {/* Planet middle-left */}
      <circle cx="8" cy="28" r="2.5" fill="#38bdf8" />
      <ellipse cx="8" cy="28" rx="5" ry="1.2" fill="none" stroke="#38bdf8" strokeWidth="0.8" transform="rotate(-20 8 28)" />
      {/* Controller bottom-left */}
      <rect x="6" y="36" width="8" height="5" rx="2.5" fill="#94a3b8" />
      <circle cx="8" cy="38" r="0.8" fill="#6b7280" />
      <circle cx="12" cy="38" r="0.8" fill="#6b7280" />
      {/* Star bottom-right */}
      <polygon points="39,36 40,38 42,38 40.5,39.5 41,42 39,40.5 37,42 37.5,39.5 36,38 38,38" fill="#fbbf24" />
    </svg>
  );
}

const kidSvgIcons: Record<string, React.FC> = {
  mybox: SaveIcon,
  textures: ColorsIcon,
  tools: FrameIcon,
  stencils: ShapesIcon,
};

/* ─── Adult / Granny mode icons ─── */

function AdultColorsIcon() {
  const colors = [
    ['#e88c8c', '#d4a854', '#6db87a'],
    ['#5ba0d4', '#9b82c8', '#d48a5c'],
    ['#c4956a', '#8a9aaa', '#d4a0b8'],
  ];
  const size = 12;
  const gap = 2.5;
  const startX = 24 - (size * 3 + gap * 2) / 2;
  const startY = 24 - (size * 3 + gap * 2) / 2;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {colors.map((row, ri) =>
        row.map((color, ci) => (
          <rect
            key={`${ri}-${ci}`}
            x={startX + ci * (size + gap)}
            y={startY + ri * (size + gap)}
            width={size}
            height={size}
            rx={3.5}
            fill={color}
          />
        ))
      )}
    </svg>
  );
}

function AdultFrameIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Outer frame */}
      <rect x="8" y="8" width="32" height="32" rx="3" fill="#c4956a" stroke="#a0713a" strokeWidth="1.5" />
      {/* Inner mat */}
      <rect x="12" y="12" width="24" height="24" rx="2" fill="#e8ddd0" />
      {/* Canvas area with dashed border */}
      <rect x="15" y="15" width="18" height="18" rx="1" fill="#f7f0e8" stroke="#c4956a" strokeWidth="1" strokeDasharray="3 2" />
      {/* Small center square */}
      <rect x="20" y="20" width="8" height="8" rx="1" fill="none" stroke="#c4956a" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function AdultElementsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Triangle behind */}
      <polygon points="24,8 38,34 10,34" fill="#d9a97c" />
      {/* Circle in front */}
      <circle cx="24" cy="28" r="12" fill="#c4956a" />
      {/* Subtle highlight */}
      <ellipse cx="21" cy="24" rx="4" ry="3" fill="#d9a97c" opacity="0.4" />
    </svg>
  );
}

function AdultTextIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* T letterform */}
      <rect x="14" y="12" width="20" height="4" rx="1.5" fill="#c4956a" />
      <rect x="22" y="12" width="4" height="26" rx="1.5" fill="#c4956a" />
      {/* Serif feet */}
      <rect x="18" y="35" width="12" height="2.5" rx="1" fill="#c4956a" />
      {/* Underline decorations */}
      <line x1="14" y1="42" x2="34" y2="42" stroke="#d9a97c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="45" x2="31" y2="45" stroke="#d9a97c" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

const adultSvgIcons: Record<string, React.FC> = {
  mybox: AdultTextIcon,
  textures: AdultColorsIcon,
  tools: AdultFrameIcon,
  stencils: AdultElementsIcon,
};

export function BoxButton({ id, icon, label, isActive, onClick, kidMode, className = '' }: BoxButtonProps) {
  const KidIcon = kidMode ? kidSvgIcons[id] : undefined;
  const AdultIcon = !kidMode ? adultSvgIcons[id] : undefined;
  const SvgIcon = KidIcon || AdultIcon;

  return (
    <motion.button
      data-box-btn
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      whileTap={{ scale: 0.92 }}
      className={`
        relative flex flex-col items-center justify-center select-none
        transition-all duration-200 ease-out
        w-20 h-20 rounded-[18px] shadow-lg
        ${isActive
          ? 'scale-105 shadow-xl ring-2 ring-primary/40'
          : 'hover:shadow-xl hover:scale-105'
        }
        ${className}
      `}
      style={{
        backgroundColor: isActive
          ? (kidMode ? 'hsl(var(--toybox-border))' : 'hsl(var(--toybox-card))')
          : 'hsl(var(--toybox-card))',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: isActive
          ? (kidMode ? 'hsl(var(--toybox-wood))' : 'hsl(var(--primary))')
          : 'hsl(var(--toybox-border))',
      }}
      title={label}
    >
      {SvgIcon ? (
        <SvgIcon />
      ) : (
        <span className="leading-none text-[22px]">{icon}</span>
      )}
      <span
        className="text-[11px] font-medium leading-none -mt-1"
        style={{ color: 'hsl(var(--toybox-text))' }}
      >
        {label}
      </span>
    </motion.button>
  );
}
