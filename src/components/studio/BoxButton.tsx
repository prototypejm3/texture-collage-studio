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

export function BoxButton({ id, icon, label, isActive, onClick, kidMode, className = '' }: BoxButtonProps) {
  const KidIcon = kidMode ? kidSvgIcons[id] : undefined;

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
                ? 'scale-105 shadow-xl ring-2 ring-primary/40'
                : 'hover:shadow-xl hover:scale-105'
            }`
          : `w-[52px] h-[52px] rounded-xl text-[22px] shadow-md ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card text-card-foreground border border-border hover:bg-secondary'
            }`
        }
        ${className}
      `}
      style={kidMode ? {
        backgroundColor: isActive ? 'hsl(var(--toybox-border))' : 'hsl(var(--toybox-card))',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: isActive ? 'hsl(var(--toybox-wood))' : 'hsl(var(--toybox-border))',
      } : undefined}
      title={label}
    >
      {KidIcon ? (
        <KidIcon />
      ) : (
        <span className="leading-none">{icon}</span>
      )}
      {kidMode && (
        <span className="text-[11px] font-medium leading-none -mt-1" style={{ color: 'hsl(var(--toybox-text))' }}>{label}</span>
      )}
    </motion.button>
  );
}
