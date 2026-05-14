import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export type RoomTheme = 'art-desk' | 'sunny-day' | 'magic-night';

const STORAGE_KEY = 'kidsRoomTheme';

export function useRoomTheme() {
  const [theme, setTheme] = useState<RoomTheme>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as RoomTheme) || 'art-desk';
    } catch {
      return 'art-desk';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
    window.dispatchEvent(new CustomEvent('room-theme-change', { detail: theme }));
  }, [theme]);

  return [theme, setTheme] as const;
}

// Art Desk card SVG
function ArtDeskCard() {
  return (
    <svg width="120" height="143" viewBox="0 0 184 220" fill="none">
      <rect width="184" height="220" rx="20" fill="#d4a96a" />
      {/* Wood grain */}
      <rect x="10" y="50" width="164" height="3" rx="1.5" fill="#c4956a" opacity="0.4" />
      <rect x="10" y="100" width="164" height="3" rx="1.5" fill="#c4956a" opacity="0.4" />
      <rect x="10" y="150" width="164" height="3" rx="1.5" fill="#c4956a" opacity="0.4" />
      <rect x="10" y="195" width="164" height="3" rx="1.5" fill="#c4956a" opacity="0.4" />
      {/* Crayons top-left */}
      <rect x="12" y="20" width="6" height="40" rx="2" fill="#f87171" transform="rotate(-8 15 40)" />
      <rect x="22" y="18" width="6" height="42" rx="2" fill="#fbbf24" transform="rotate(-2 25 39)" />
      <rect x="32" y="22" width="6" height="38" rx="2" fill="#4ade80" transform="rotate(5 35 41)" />
      {/* Paint cup top-right */}
      <rect x="140" y="24" width="28" height="32" rx="4" fill="#94a3b8" />
      <rect x="143" y="16" width="3" height="18" rx="1.5" fill="#f87171" transform="rotate(-10 144 25)" />
      <rect x="151" y="14" width="3" height="20" rx="1.5" fill="#fbbf24" />
      <rect x="159" y="16" width="3" height="18" rx="1.5" fill="#4ade80" transform="rotate(8 160 25)" />
      {/* Mini canvas */}
      <rect x="42" y="65" width="100" height="90" rx="6" fill="white" stroke="#e8ddd0" strokeWidth="2" />
      {/* Paint splotches */}
      <circle cx="30" cy="190" r="12" fill="#f87171" opacity="0.65" />
      <circle cx="50" cy="195" r="8" fill="#fbbf24" opacity="0.6" />
      <circle cx="150" cy="188" r="10" fill="#4ade80" opacity="0.65" />
      <circle cx="140" cy="200" r="7" fill="#38bdf8" opacity="0.6" />
    </svg>
  );
}

// Sunny Day card SVG
function SunnyDayCard() {
  return (
    <svg width="120" height="143" viewBox="0 0 184 220" fill="none">
      {/* Sky */}
      <rect width="184" height="220" rx="20" fill="#bfdbfe" />
      {/* Grass */}
      <path d="M0 120 Q20 115 40 120 Q60 118 92 120 Q130 116 160 120 Q175 118 184 120 L184 220 Q184 220 184 220 L0 220 Z" fill="#86efac" />
      <rect x="0" y="200" width="184" height="20" rx="0" fill="#86efac" />
      {/* Clouds */}
      <ellipse cx="40" cy="40" rx="22" ry="14" fill="white" opacity="0.9" />
      <ellipse cx="55" cy="36" rx="16" ry="12" fill="white" opacity="0.9" />
      <ellipse cx="28" cy="38" rx="14" ry="10" fill="white" opacity="0.8" />
      {/* Sun */}
      <circle cx="150" cy="35" r="18" fill="#fbbf24" />
      <line x1="150" y1="10" x2="150" y2="4" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="170" y1="20" x2="175" y2="15" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="174" y1="38" x2="180" y2="38" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="130" y1="20" x2="125" y2="15" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mini canvas */}
      <rect x="42" y="65" width="100" height="90" rx="6" fill="white" opacity="0.85" stroke="#e8ddd0" strokeWidth="1.5" />
      {/* Daisies */}
      <circle cx="50" cy="175" r="4" fill="white" />
      <circle cx="44" cy="175" r="4" fill="white" />
      <circle cx="56" cy="175" r="4" fill="white" />
      <circle cx="50" cy="169" r="4" fill="white" />
      <circle cx="50" cy="181" r="4" fill="white" />
      <circle cx="50" cy="175" r="3" fill="#fbbf24" />
      {/* Tulip */}
      <rect x="120" y="178" width="2" height="16" rx="1" fill="#4ade80" />
      <ellipse cx="121" cy="175" rx="6" ry="8" fill="#f9a8d4" />
      {/* Another tulip */}
      <rect x="140" y="182" width="2" height="14" rx="1" fill="#4ade80" />
      <ellipse cx="141" cy="179" rx="5" ry="7" fill="#f9a8d4" />
      {/* Butterfly */}
      <ellipse cx="105" cy="140" rx="6" ry="4" fill="#f9a8d4" opacity="0.8" transform="rotate(-15 105 140)" />
      <ellipse cx="115" cy="140" rx="6" ry="4" fill="#a78bfa" opacity="0.8" transform="rotate(15 115 140)" />
      <rect x="109" y="138" width="2" height="6" rx="1" fill="#6b4c2a" />
      {/* Grass tufts */}
      <path d="M20 200 Q22 190 24 200" stroke="#4ade80" strokeWidth="2" fill="none" />
      <path d="M80 198 Q82 188 84 198" stroke="#4ade80" strokeWidth="2" fill="none" />
      <path d="M160 200 Q162 191 164 200" stroke="#4ade80" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Magic Night card SVG
function MagicNightCard() {
  return (
    <svg width="120" height="143" viewBox="0 0 184 220" fill="none">
      <rect width="184" height="220" rx="20" fill="#1e1b4b" />
      {/* Aurora streaks */}
      <path d="M0 100 Q50 80 92 105 Q140 130 184 95" stroke="#4ade80" strokeWidth="6" fill="none" opacity="0.2" />
      <path d="M0 115 Q60 90 100 115 Q150 140 184 110" stroke="#38bdf8" strokeWidth="5" fill="none" opacity="0.22" />
      <path d="M0 128 Q70 100 110 125 Q155 148 184 122" stroke="#a78bfa" strokeWidth="4" fill="none" opacity="0.2" />
      {/* Moon */}
      <circle cx="150" cy="35" r="20" fill="#fde68a" />
      <circle cx="158" cy="28" r="16" fill="#1e1b4b" />
      {/* Stars */}
      <circle cx="30" cy="25" r="1.5" fill="white" opacity="0.8" />
      <circle cx="70" cy="45" r="1" fill="white" opacity="0.6" />
      <circle cx="20" cy="70" r="1.2" fill="white" opacity="0.7" />
      <circle cx="110" cy="20" r="1" fill="white" opacity="0.6" />
      <circle cx="90" cy="60" r="1.5" fill="white" opacity="0.5" />
      <circle cx="160" cy="75" r="1.2" fill="white" opacity="0.7" />
      {/* Twinkling stars */}
      <path d="M50 55 L51.5 50 L53 55 L58 56.5 L53 58 L51.5 63 L50 58 L45 56.5 Z" fill="#fbbf24" opacity="0.8" />
      <path d="M130 170 L131 167 L132 170 L135 171 L132 172 L131 175 L130 172 L127 171 Z" fill="#fbbf24" opacity="0.7" />
      {/* Mini canvas */}
      <rect x="42" y="65" width="100" height="90" rx="6" fill="white" opacity="0.85" stroke="#a78bfa" strokeWidth="2" />
      {/* Fireflies */}
      <circle cx="35" cy="160" r="6" fill="#fbbf24" opacity="0.15" />
      <circle cx="35" cy="160" r="2" fill="#fbbf24" opacity="0.7" />
      <circle cx="145" cy="180" r="5" fill="#fbbf24" opacity="0.12" />
      <circle cx="145" cy="180" r="1.8" fill="#fbbf24" opacity="0.65" />
      <circle cx="80" cy="195" r="5" fill="#fbbf24" opacity="0.1" />
      <circle cx="80" cy="195" r="1.5" fill="#fbbf24" opacity="0.6" />
    </svg>
  );
}

interface RoomThemePickerProps {
  theme: RoomTheme;
  onThemeChange: (theme: RoomTheme) => void;
}

const themes: { id: RoomTheme; name: string; subtitle: string; nameColor: string; subtitleColor: string }[] = [
  { id: 'art-desk', name: 'Art Desk', subtitle: 'Default', nameColor: '#6b4c2a', subtitleColor: '#c4956a' },
  { id: 'sunny-day', name: 'Sunny Day', subtitle: 'Outdoors', nameColor: '#6b4c2a', subtitleColor: '#94a3b8' },
  { id: 'magic-night', name: 'Magic Night', subtitle: 'Enchanted', nameColor: '#fdf6ee', subtitleColor: '#a78bfa' },
];

const cardComponents: Record<RoomTheme, () => JSX.Element> = {
  'art-desk': ArtDeskCard,
  'sunny-day': SunnyDayCard,
  'magic-night': MagicNightCard,
};

export function RoomThemePicker({ theme, onThemeChange }: RoomThemePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold" style={{ color: '#6b4c2a' }}>Room Theme</span>
      <div className="flex gap-4 flex-wrap md:flex-nowrap">
        {themes.map(t => {
          const isSelected = theme === t.id;
          const CardSVG = cardComponents[t.id];
          return (
            <motion.button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-1.5 transition-all"
            >
              <div
                className="relative overflow-hidden transition-all"
                style={{
                  width: 120,
                  height: 143,
                  borderRadius: 20,
                  border: isSelected ? '3px solid #f97316' : '1.5px solid #e8ddd0',
                  boxShadow: isSelected ? '0 4px 16px rgba(249,115,22,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <CardSVG />
                {isSelected && (
                  <div
                    className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full"
                    style={{ width: 24, height: 24, backgroundColor: '#f97316' }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-[13px] font-bold" style={{ color: t.nameColor }}>{t.name}</span>
              <span className="text-[11px] -mt-1" style={{ color: t.subtitleColor }}>{t.subtitle}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
