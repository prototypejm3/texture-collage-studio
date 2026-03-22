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

/* ─── Kid Mode Icons (playful, illustrated) ─── */

function SaveIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="22" width="28" height="18" rx="2" fill="#c4956a" stroke="#a0713a" strokeWidth="1.5" />
      <line x1="24" y1="22" x2="24" y2="40" stroke="#a0713a" strokeWidth="1" opacity="0.4" />
      <path d="M8 22 L14 14 L34 14 L40 22 Z" fill="#d9a97c" stroke="#a0713a" strokeWidth="1.5" strokeLinejoin="round" />
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
      <rect x="8" y="10" width="32" height="28" rx="2" fill="#c4956a" stroke="#a0713a" strokeWidth="1.5" />
      <rect x="13" y="15" width="22" height="18" rx="1" fill="#87ceeb" />
      <path d="M13 27 Q20 24 24 27 Q28 30 35 26 L35 33 L13 33 Z" fill="#7ec87e" />
      <circle cx="30" cy="20" r="3.5" fill="#fbbf24" />
      <ellipse cx="20" cy="20" rx="5" ry="2.5" fill="white" />
      <ellipse cx="18" cy="21" rx="3" ry="2" fill="white" />
    </svg>
  );
}

function ShapesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="24" cy="30" rx="8" ry="9" fill="#c4956a" />
      <ellipse cx="24" cy="31" rx="5" ry="6" fill="#d9a97c" />
      <circle cx="24" cy="20" r="7" fill="#c4956a" />
      <circle cx="17" cy="15" r="3.5" fill="#c4956a" />
      <circle cx="31" cy="15" r="3.5" fill="#c4956a" />
      <circle cx="17" cy="15" r="2" fill="#d9a97c" />
      <circle cx="31" cy="15" r="2" fill="#d9a97c" />
      <path d="M18 24 Q24 27 30 24" stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="10,10 11,13 14,13 11.5,15 12.5,18 10,16 7.5,18 8.5,15 6,13 9,13" fill="#fbbf24" />
      <polygon points="37,9 34,15 36,15 33,21 39,14 37,14" fill="#fb923c" />
      <circle cx="8" cy="28" r="2.5" fill="#38bdf8" />
      <ellipse cx="8" cy="28" rx="5" ry="1.2" fill="none" stroke="#38bdf8" strokeWidth="0.8" transform="rotate(-20 8 28)" />
      <rect x="6" y="36" width="8" height="5" rx="2.5" fill="#94a3b8" />
      <circle cx="8" cy="38" r="0.8" fill="#6b7280" />
      <circle cx="12" cy="38" r="0.8" fill="#6b7280" />
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

/* ─── Adult Mode Icons (flat, geometric, refined) ─── */

function AdultSaveIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="26" width="48" height="38" rx="4" fill="#c4956a"/>
      <rect x="4" y="14" width="56" height="16" rx="4" fill="#d9a97c"/>
      <rect x="27" y="14" width="10" height="16" rx="2" fill="#e8c49a"/>
      <line x1="32" y1="30" x2="32" y2="64" stroke="#b07d52" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function AdultColorsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 72 72" fill="none">
      <rect x="4" y="4" width="20" height="20" rx="5" fill="#e07070"/>
      <rect x="28" y="4" width="20" height="20" rx="5" fill="#e8a84a"/>
      <rect x="52" y="4" width="20" height="20" rx="5" fill="#6abf7a"/>
      <rect x="4" y="28" width="20" height="20" rx="5" fill="#6aaed4"/>
      <rect x="28" y="28" width="20" height="20" rx="5" fill="#9b7fd4"/>
      <rect x="52" y="28" width="20" height="20" rx="5" fill="#d4826a"/>
      <rect x="4" y="52" width="20" height="14" rx="5" fill="#c4a882"/>
      <rect x="28" y="52" width="20" height="14" rx="5" fill="#9eaab8"/>
      <rect x="52" y="52" width="20" height="14" rx="5" fill="#d4b8b8"/>
    </svg>
  );
}

function AdultFrameIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 72 72" fill="none">
      <rect x="4" y="4" width="64" height="64" rx="6" fill="none" stroke="#c4956a" strokeWidth="8"/>
      <rect x="18" y="18" width="36" height="36" rx="3" fill="#f0e8dc"/>
      <line x1="20" y1="20" x2="26" y2="20" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="20" y1="20" x2="20" y2="26" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="52" y1="20" x2="46" y2="20" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="52" y1="20" x2="52" y2="26" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="20" y1="52" x2="26" y2="52" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="20" y1="52" x2="20" y2="46" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="52" y1="52" x2="46" y2="52" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="52" y1="52" x2="52" y2="46" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function AdultElementsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 72 72" fill="none">
      <polygon points="36,6 14,62 58,62" fill="#e8c49a"/>
      <rect x="36" y="22" width="32" height="32" rx="5" fill="#d9a97c"/>
      <circle cx="24" cy="34" r="18" fill="#c4956a"/>
    </svg>
  );
}

const adultSvgIcons: Record<string, React.FC> = {
  mybox: AdultSaveIcon,
  textures: AdultColorsIcon,
  tools: AdultFrameIcon,
  stencils: AdultElementsIcon,
};

/* ─── BoxButton ─── */

export function BoxButton({ id, icon, label, isActive, onClick, kidMode, className = '' }: BoxButtonProps) {
  const KidIcon = kidMode ? kidSvgIcons[id] : undefined;
  const AdultIcon = !kidMode ? adultSvgIcons[id] : undefined;
  const SvgIcon = KidIcon || AdultIcon;

  return (
    <motion.button
      data-box-btn
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      whileTap={{ scale: kidMode ? 0.93 : 0.97 }}
      transition={kidMode
        ? { type: 'spring', stiffness: 400, damping: 15 }
        : { duration: 0.15, ease: 'easeOut' }
      }
      className={`
        relative flex flex-col items-center justify-center select-none
        w-20 h-20 rounded-[18px]
        ${kidMode
          ? `shadow-lg ${isActive ? 'scale-105 shadow-xl ring-2 ring-primary/40' : 'hover:shadow-xl hover:scale-105'}`
          : `shadow-md ${isActive ? 'scale-[1.03] shadow-lg' : 'hover:shadow-lg hover:scale-[1.03]'}`
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
          ? (kidMode ? 'hsl(var(--toybox-wood))' : '#c4956a')
          : 'hsl(var(--toybox-border))',
        transition: 'border-color 150ms ease, background-color 150ms ease',
      }}
      title={label}
    >
      {SvgIcon ? (
        <SvgIcon />
      ) : (
        <span className="leading-none text-[22px]">{icon}</span>
      )}
      <span
        className={`leading-none -mt-1 ${
          kidMode
            ? 'text-[11px] font-semibold'
            : 'text-[11px] font-medium'
        }`}
        style={{ color: kidMode ? 'hsl(var(--toybox-text))' : '#3d3530' }}
      >
        {label}
      </span>
    </motion.button>
  );
}
