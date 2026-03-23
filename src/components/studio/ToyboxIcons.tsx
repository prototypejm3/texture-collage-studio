// Toybox-style SVG icon components for Kid Mode navbar
// All icons are flat, hand-drawn style with warm brown palette

export function KidCrownIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* Face */}
      <circle cx="14" cy="16" r="9" fill="#fbbf24" />
      {/* Eyes */}
      <circle cx="11" cy="15" r="1.2" fill="#6b4c2a" />
      <circle cx="17" cy="15" r="1.2" fill="#6b4c2a" />
      {/* Smile */}
      <path d="M11 18.5 Q14 21 17 18.5" stroke="#6b4c2a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Crown */}
      <path d="M7 12 L9 6 L12 10 L14 4 L16 10 L19 6 L21 12" fill="#f97316" stroke="#c2410c" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

export function GrannyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* Face */}
      <circle cx="14" cy="15" r="9" fill="#e8ddd0" />
      {/* Hair bun */}
      <circle cx="14" cy="7" r="4" fill="#94a3b8" />
      {/* Glasses */}
      <circle cx="11" cy="14" r="3" fill="none" stroke="#6b4c2a" strokeWidth="1.2" />
      <circle cx="18" cy="14" r="3" fill="none" stroke="#6b4c2a" strokeWidth="1.2" />
      <line x1="14" y1="14" x2="15" y2="14" stroke="#6b4c2a" strokeWidth="1" />
      {/* Eyes behind glasses */}
      <circle cx="11" cy="14" r="0.8" fill="#6b4c2a" />
      <circle cx="18" cy="14" r="0.8" fill="#6b4c2a" />
      {/* Broccoli */}
      <circle cx="20" cy="21" r="2.5" fill="#4ade80" />
      <rect x="19.5" y="22" width="1.5" height="3" rx="0.5" fill="#6b4c2a" />
    </svg>
  );
}

export function HouseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* Roof */}
      <path d="M3 10 L11 3 L19 10" fill="#7aaa8a" stroke="#5a8a6a" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Body */}
      <rect x="5" y="10" width="12" height="9" fill="#f7f0e8" stroke="#5a8a6a" strokeWidth="1" />
      {/* Door */}
      <rect x="9" y="13" width="4" height="6" rx="1" fill="#7aaa8a" />
      {/* Window */}
      <rect x="6.5" y="12" width="3" height="3" rx="0.5" fill="#87ceeb" stroke="#5a8a6a" strokeWidth="0.8" />
      {/* Flag */}
      <line x1="14" y1="3" x2="14" y2="7" stroke="#5a8a6a" strokeWidth="1" />
      <polygon points="14,3 18,4.5 14,6" fill="#f97316" />
    </svg>
  );
}

export function TentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* Tent */}
      <path d="M2 18 L11 4 L20 18 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
      {/* Stripes */}
      <path d="M6.5 18 L11 8 L15.5 18" fill="#fbbf24" />
      {/* Door */}
      <path d="M9 18 L11 12 L13 18" fill="#c2410c" />
      {/* Flag */}
      <line x1="11" y1="4" x2="11" y2="1" stroke="#5a8a6a" strokeWidth="1" />
      <polygon points="11,1 15,2.5 11,4" fill="#f87171" />
    </svg>
  );
}

export function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1 L10.5 6.5 L16 8 L10.5 9.5 L9 15 L7.5 9.5 L2 8 L7.5 6.5 Z" fill="#fbbf24" />
      <path d="M15 2 L15.5 4 L17 4.5 L15.5 5 L15 7 L14.5 5 L13 4.5 L14.5 4 Z" fill="#fbbf24" opacity="0.6" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="5" fill="#fbbf24" />
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 10 + Math.cos(rad) * 6.5;
        const y1 = 10 + Math.sin(rad) * 6.5;
        const x2 = 10 + Math.cos(rad) * 8.5;
        const y2 = 10 + Math.sin(rad) * 8.5;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M13 3 A7 7 0 1 0 13 15 A5.5 5.5 0 0 1 13 3Z" fill="#3a5c4a" />
    </svg>
  );
}

export function MusicNoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* First note */}
      <circle cx="6" cy="15" r="2.5" fill="#94a3b8" />
      <line x1="8.5" y1="15" x2="8.5" y2="4" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Second note */}
      <circle cx="14" cy="13" r="2.5" fill="#94a3b8" />
      <line x1="16.5" y1="13" x2="16.5" y2="3" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Beam */}
      <path d="M8.5 4 L8.5 6 L16.5 4 L16.5 3" fill="#94a3b8" />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* Speaker body */}
      <path d="M3 8 L6 8 L10 4 L10 16 L6 12 L3 12 Z" fill="#f87171" />
      {/* Sound waves */}
      <path d="M12 7 Q15 10 12 13" stroke="#f87171" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M14 5 Q18 10 14 15" stroke="#f87171" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function TrashCanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* Cookie jar body */}
      <rect x="5" y="7" width="12" height="12" rx="3" fill="#c4956a" />
      <rect x="6" y="8" width="10" height="10" rx="2.5" fill="#d9a97c" />
      {/* Lid */}
      <rect x="4" y="5.5" width="14" height="2.5" rx="1.2" fill="#c4956a" stroke="#a0713a" strokeWidth="0.5" />
      {/* Knob */}
      <rect x="8.5" y="3.5" width="5" height="2.5" rx="1.2" fill="#c4956a" stroke="#a0713a" strokeWidth="0.5" />
      {/* Face - eyes */}
      <circle cx="8.5" cy="13" r="1" fill="#6b4c2a" />
      <circle cx="13.5" cy="13" r="1" fill="#6b4c2a" />
      {/* Rosy cheeks */}
      <circle cx="7" cy="14.5" r="1" fill="#f4a6a0" opacity="0.5" />
      <circle cx="15" cy="14.5" r="1" fill="#f4a6a0" opacity="0.5" />
      {/* Smile */}
      <path d="M9 15.5 Q11 17.5 13 15.5" stroke="#6b4c2a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      {/* Confetti dots */}
      <circle cx="4" cy="8" r="0.8" fill="#f87171" />
      <circle cx="18" cy="9" r="0.8" fill="#fbbf24" />
      <circle cx="5" cy="12" r="0.6" fill="#4ade80" />
      <circle cx="17" cy="14" r="0.7" fill="#38bdf8" />
      <circle cx="16" cy="6" r="0.6" fill="#a78bfa" />
      <circle cx="6" cy="6" r="0.7" fill="#f97316" />
    </svg>
  );
}

export function SaveBoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      {/* Box body */}
      <rect x="3" y="8" width="12" height="8" rx="1" fill="#7aaa8a" stroke="#5a8a6a" strokeWidth="0.8" />
      {/* Lid */}
      <path d="M2 8 L5 4 L13 4 L16 8 Z" fill="#a8d4b8" stroke="#5a8a6a" strokeWidth="0.8" strokeLinejoin="round" />
      {/* Tape */}
      <rect x="7.5" y="3.5" width="3" height="12" rx="0.5" fill="#f7f0e8" opacity="0.4" />
    </svg>
  );
}

export function DownloadTrayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      {/* Tray */}
      <path d="M3 12 L3 15 Q3 16 4 16 L14 16 Q15 16 15 15 L15 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Arrow */}
      <line x1="9" y1="2" x2="9" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 8.5 L9 12 L12 8.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 14 L3 10 L12 2 L14 4 L5 13 Z" fill="white" stroke="white" strokeWidth="0.5" />
      <path d="M12 2 L14 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 14 L3 10" stroke="white" strokeWidth="1" />
    </svg>
  );
}
