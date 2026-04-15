import { motion } from 'framer-motion';

interface KidToolBoxProps {
  id: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  variant: 'colors' | 'frame' | 'shapes';
}

/* Small illustrated toy boxes that sit on the table surface in Kid mode */

function ColorsBoxSVG({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
      {/* Shadow */}
      <ellipse cx="45" cy="76" rx="38" ry="4" fill="#00000020" />
      {/* Body */}
      <rect x="8" y="32" width="74" height="44" rx="6" fill="#d94f8a" />
      <rect x="12" y="36" width="66" height="36" rx="4" fill="#e06898" />
      {/* Color dots on body */}
      <circle cx="24" cy="52" r="6" fill="#f87171" />
      <circle cx="40" cy="52" r="6" fill="#fbbf24" />
      <circle cx="56" cy="52" r="6" fill="#4ade80" />
      <circle cx="32" cy="64" r="5" fill="#38bdf8" />
      <circle cx="48" cy="64" r="5" fill="#a78bfa" />
      <circle cx="64" cy="64" r="5" fill="#fb923c" />
      {/* Lid */}
      <g style={{
        transformOrigin: '8px 32px',
        transform: isOpen ? 'rotate(-30deg) translateY(-6px)' : 'rotate(0deg)',
        transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <rect x="4" y="22" width="82" height="14" rx="5" fill="#c24480" stroke="#a03068" strokeWidth="0.8" />
        <rect x="30" y="17" width="30" height="8" rx="4" fill="#c24480" stroke="#a03068" strokeWidth="0.8" />
        <rect x="33" y="19" width="24" height="4" rx="2" fill="#e06898" />
        {/* Rainbow stripe on lid */}
        <rect x="10" y="28" width="10" height="4" rx="1" fill="#f87171" />
        <rect x="22" y="28" width="10" height="4" rx="1" fill="#fbbf24" />
        <rect x="34" y="28" width="10" height="4" rx="1" fill="#4ade80" />
        <rect x="46" y="28" width="10" height="4" rx="1" fill="#38bdf8" />
        <rect x="58" y="28" width="10" height="4" rx="1" fill="#a78bfa" />
        <rect x="70" y="28" width="10" height="4" rx="1" fill="#fb923c" />
      </g>
    </svg>
  );
}

function FrameBoxSVG({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
      <ellipse cx="45" cy="76" rx="38" ry="4" fill="#00000020" />
      {/* Body */}
      <rect x="8" y="32" width="74" height="44" rx="6" fill="#5a8a6a" />
      <rect x="12" y="36" width="66" height="36" rx="4" fill="#6b9e7a" />
      {/* Mini frame on body */}
      <rect x="24" y="42" width="42" height="26" rx="2" fill="#c4956a" stroke="#a0713a" strokeWidth="1.5" />
      <rect x="29" y="46" width="32" height="18" rx="1" fill="#87ceeb" />
      <circle cx="52" cy="51" r="4" fill="#fbbf24" />
      <path d="M29 58 Q38 54 45 58 Q52 62 61 56 L61 64 L29 64 Z" fill="#6bba6b" />
      {/* Lid */}
      <g style={{
        transformOrigin: '8px 32px',
        transform: isOpen ? 'rotate(-30deg) translateY(-6px)' : 'rotate(0deg)',
        transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <rect x="4" y="22" width="82" height="14" rx="5" fill="#4a7a5a" stroke="#3a6a4a" strokeWidth="0.8" />
        <rect x="30" y="17" width="30" height="8" rx="4" fill="#4a7a5a" stroke="#3a6a4a" strokeWidth="0.8" />
        <rect x="33" y="19" width="24" height="4" rx="2" fill="#6b9e7a" />
      </g>
    </svg>
  );
}

function ShapesBoxSVG({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
      <ellipse cx="45" cy="76" rx="38" ry="4" fill="#00000020" />
      {/* Body */}
      <rect x="8" y="32" width="74" height="44" rx="6" fill="#5885b5" />
      <rect x="12" y="36" width="66" height="36" rx="4" fill="#6a9bc5" />
      {/* Bear face on body */}
      <circle cx="45" cy="54" r="12" fill="#c4956a" />
      <circle cx="36" cy="44" r="5" fill="#c4956a" />
      <circle cx="54" cy="44" r="5" fill="#c4956a" />
      <circle cx="36" cy="44" r="3" fill="#d9b88c" />
      <circle cx="54" cy="44" r="3" fill="#d9b88c" />
      <circle cx="41" cy="52" r="1.5" fill="#6b4c2a" />
      <circle cx="49" cy="52" r="1.5" fill="#6b4c2a" />
      <ellipse cx="45" cy="56" rx="3" ry="2" fill="#d9b88c" />
      <circle cx="45" cy="55.5" r="1" fill="#6b4c2a" />
      <path d="M42 58 Q45 61 48 58" stroke="#6b4c2a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Star */}
      <polygon points="22,46 23,49 26,49 23.5,51 24.5,54 22,52 19.5,54 20.5,51 18,49 21,49" fill="#fbbf24" />
      {/* Lid */}
      <g style={{
        transformOrigin: '8px 32px',
        transform: isOpen ? 'rotate(-30deg) translateY(-6px)' : 'rotate(0deg)',
        transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <rect x="4" y="22" width="82" height="14" rx="5" fill="#4870a0" stroke="#3860880" strokeWidth="0.8" />
        <rect x="30" y="17" width="30" height="8" rx="4" fill="#4870a0" stroke="#386088" strokeWidth="0.8" />
        <rect x="33" y="19" width="24" height="4" rx="2" fill="#6a9bc5" />
      </g>
    </svg>
  );
}

const variantSVG: Record<string, React.FC<{ isOpen: boolean }>> = {
  colors: ColorsBoxSVG,
  frame: FrameBoxSVG,
  shapes: ShapesBoxSVG,
};

export function KidToolBox({ id, label, isOpen, onToggle, variant }: KidToolBoxProps) {
  const SVG = variantSVG[variant];

  return (
    <motion.button
      data-box-btn
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      whileTap={{ scale: 0.93 }}
      className="relative flex flex-col items-center select-none cursor-pointer"
      title={label}
      style={{ width: 90, height: 90 }}
    >
      <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
        {SVG && <SVG isOpen={isOpen} />}
      </div>
      <span
        className="text-[10px] font-bold leading-none -mt-1"
        style={{ color: '#6b4c2a' }}
      >
        {label}
      </span>
    </motion.button>
  );
}
