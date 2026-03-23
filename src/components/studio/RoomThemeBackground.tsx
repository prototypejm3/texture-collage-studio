import { RoomTheme } from './RoomThemePicker';

interface Props {
  theme: RoomTheme;
  width: number;
  height: number;
}

export function RoomThemeBackground({ theme, width, height }: Props) {
  if (theme === 'art-desk' || width === 0) return null;

  if (theme === 'sunny-day') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* Sky gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #bfdbfe 0%, #dbeafe 45%, #86efac 45%, #86efac 100%)',
        }} />
        {/* Sun */}
        <svg className="absolute" style={{ top: 20, right: 40, width: 80, height: 80 }}>
          <circle cx="40" cy="40" r="28" fill="#fbbf24" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const r = (a * Math.PI) / 180;
            return (
              <line key={a}
                x1={40 + Math.cos(r) * 32} y1={40 + Math.sin(r) * 32}
                x2={40 + Math.cos(r) * 38} y2={40 + Math.sin(r) * 38}
                stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* Clouds */}
        <svg className="absolute" style={{ top: 30, left: 40, width: 120, height: 50 }}>
          <ellipse cx="50" cy="30" rx="35" ry="18" fill="white" opacity="0.85" />
          <ellipse cx="70" cy="24" rx="25" ry="16" fill="white" opacity="0.9" />
          <ellipse cx="35" cy="28" rx="20" ry="14" fill="white" opacity="0.8" />
        </svg>
        <svg className="absolute sunny-cloud-drift" style={{ top: 60, left: '45%', width: 90, height: 40 }}>
          <ellipse cx="40" cy="20" rx="28" ry="14" fill="white" opacity="0.7" />
          <ellipse cx="55" cy="17" rx="20" ry="12" fill="white" opacity="0.75" />
        </svg>
        {/* Flowers along bottom */}
        <svg className="absolute" style={{ bottom: 8, left: 40, width: 60, height: 40 }}>
          {/* Daisy */}
          <circle cx="20" cy="15" r="5" fill="white" />
          <circle cx="14" cy="15" r="5" fill="white" />
          <circle cx="26" cy="15" r="5" fill="white" />
          <circle cx="20" cy="9" r="5" fill="white" />
          <circle cx="20" cy="21" r="5" fill="white" />
          <circle cx="20" cy="15" r="3.5" fill="#fbbf24" />
          <rect x="19" y="22" width="2" height="14" rx="1" fill="#4ade80" />
        </svg>
        <svg className="absolute" style={{ bottom: 12, right: 60, width: 30, height: 40 }}>
          {/* Tulip */}
          <rect x="13" y="16" width="3" height="20" rx="1.5" fill="#4ade80" />
          <ellipse cx="14.5" cy="13" rx="8" ry="10" fill="#f9a8d4" />
        </svg>
        <svg className="absolute" style={{ bottom: 16, right: 120, width: 26, height: 36 }}>
          <rect x="11" y="14" width="3" height="18" rx="1.5" fill="#4ade80" />
          <ellipse cx="12.5" cy="11" rx="7" ry="9" fill="#f9a8d4" />
        </svg>
        {/* Butterfly — animated */}
        <svg className="absolute sunny-butterfly" style={{ top: '35%', left: '30%', width: 30, height: 20 }}>
          <ellipse cx="10" cy="10" rx="7" ry="5" fill="#f9a8d4" opacity="0.85" />
          <ellipse cx="20" cy="10" rx="7" ry="5" fill="#a78bfa" opacity="0.85" />
          <rect x="14" y="8" width="2" height="7" rx="1" fill="#6b4c2a" />
        </svg>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .sunny-cloud-drift {
              animation: cloudDrift 20s ease-in-out infinite alternate;
            }
            .sunny-butterfly {
              animation: butterflyFloat 8s ease-in-out infinite alternate;
            }
          }
          @keyframes cloudDrift {
            0% { transform: translateX(0); }
            100% { transform: translateX(60px); }
          }
          @keyframes butterflyFloat {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(30px, -10px) rotate(5deg); }
            50% { transform: translate(80px, 5px) rotate(-3deg); }
            75% { transform: translate(120px, -8px) rotate(4deg); }
            100% { transform: translate(160px, 0) rotate(0deg); }
          }
        `}</style>
      </div>
    );
  }

  if (theme === 'magic-night') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* Deep indigo base */}
        <div className="absolute inset-0" style={{ backgroundColor: '#1e1b4b' }} />
        {/* Stars */}
        <svg className="absolute inset-0" width="100%" height="100%">
          {/* Scattered stars */}
          {[
            [8, 6], [22, 12], [45, 5], [65, 15], [80, 8], [92, 18],
            [15, 30], [35, 25], [55, 35], [75, 28], [88, 40],
            [10, 55], [30, 50], [70, 55], [85, 60], [50, 48],
          ].map(([x, y], i) => (
            <circle key={i} cx={`${x}%`} cy={`${y}%`} r={1 + (i % 3) * 0.5} fill="white" opacity={0.4 + (i % 4) * 0.15} />
          ))}
          {/* Twinkling four-point stars */}
          <path d="M120 180 L122 172 L124 180 L132 182 L124 184 L122 192 L120 184 L112 182 Z" fill="#fbbf24" opacity="0.75" className="night-twinkle" />
          <path d="M280 100 L281.5 95 L283 100 L288 101.5 L283 103 L281.5 108 L280 103 L275 101.5 Z" fill="#fbbf24" opacity="0.65" className="night-twinkle-2" />
        </svg>
        {/* Moon */}
        <svg className="absolute" style={{ top: 16, right: 30, width: 60, height: 60 }}>
          <circle cx="30" cy="30" r="24" fill="#fde68a" />
          <circle cx="38" cy="22" r="20" fill="#1e1b4b" />
        </svg>
        {/* Aurora streaks */}
        <svg className="absolute night-aurora" style={{ top: '40%', left: 0, width: '100%', height: '30%' }}>
          <path d="M0 40 Q25% 10 50% 45 Q75% 80 100% 30" stroke="#4ade80" strokeWidth="8" fill="none" opacity="0.15" />
          <path d="M0 55 Q30% 20 55% 55 Q80% 85 100% 45" stroke="#38bdf8" strokeWidth="6" fill="none" opacity="0.18" />
          <path d="M0 68 Q35% 30 60% 65 Q85% 90 100% 55" stroke="#a78bfa" strokeWidth="5" fill="none" opacity="0.15" />
        </svg>
        {/* Fireflies */}
        {[
          { x: '15%', y: '65%', size: 8, dotSize: 2.5 },
          { x: '70%', y: '72%', size: 7, dotSize: 2 },
          { x: '45%', y: '80%', size: 6, dotSize: 2 },
          { x: '85%', y: '58%', size: 7, dotSize: 2.2 },
          { x: '30%', y: '75%', size: 6, dotSize: 1.8 },
        ].map((f, i) => (
          <div
            key={i}
            className={`absolute night-firefly night-firefly-${i}`}
            style={{ left: f.x, top: f.y, width: f.size * 2, height: f.size * 2 }}
          >
            <svg width={f.size * 2} height={f.size * 2}>
              <circle cx={f.size} cy={f.size} r={f.size} fill="#fbbf24" opacity="0.12" />
              <circle cx={f.size} cy={f.size} r={f.dotSize} fill="#fbbf24" opacity="0.7" />
            </svg>
          </div>
        ))}
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .night-twinkle {
              animation: twinkle 3s ease-in-out infinite alternate;
            }
            .night-twinkle-2 {
              animation: twinkle 4s ease-in-out 1s infinite alternate;
            }
            .night-aurora {
              animation: auroraShift 15s ease-in-out infinite alternate;
            }
            .night-firefly-0 { animation: fireflyPulse 4s ease-in-out infinite; }
            .night-firefly-1 { animation: fireflyPulse 5s ease-in-out 1s infinite; }
            .night-firefly-2 { animation: fireflyPulse 3.5s ease-in-out 0.5s infinite; }
            .night-firefly-3 { animation: fireflyPulse 4.5s ease-in-out 2s infinite; }
            .night-firefly-4 { animation: fireflyPulse 3s ease-in-out 1.5s infinite; }
          }
          @keyframes twinkle {
            0% { opacity: 0.4; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes auroraShift {
            0% { transform: translateX(0) scaleY(1); }
            50% { transform: translateX(20px) scaleY(1.1); }
            100% { transform: translateX(-15px) scaleY(0.95); }
          }
          @keyframes fireflyPulse {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-6px); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
