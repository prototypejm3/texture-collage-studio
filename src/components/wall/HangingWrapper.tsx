import { HangingStyle } from '@/types/wall';
import { useMemo } from 'react';

interface HangingWrapperProps {
  style: HangingStyle;
  children: React.ReactNode;
  isDark?: boolean;
}

let instanceCounter = 0;

// ── String rendering helpers ──

interface StringConfig {
  color: string;
  colorMid: string;
  colorBot: string;
  strokeWidth: number;
  dashArray?: string;
  glow?: string;
  texture?: 'smooth' | 'rough' | 'braided' | 'beaded';
}

function getStringConfig(style: HangingStyle, isDark?: boolean): StringConfig | null {
  switch (style) {
    case 'string':
      return isDark
        ? { color: 'hsl(0,0%,75%)', colorMid: 'hsl(0,0%,58%)', colorBot: 'hsl(0,0%,70%)', strokeWidth: 1 }
        : { color: 'hsl(0,0%,15%)', colorMid: 'hsl(0,0%,5%)', colorBot: 'hsl(0,0%,20%)', strokeWidth: 1 };
    case 'lighted-string':
      return { color: 'hsl(45,80%,65%)', colorMid: 'hsl(40,70%,55%)', colorBot: 'hsl(45,80%,60%)', strokeWidth: 1.2, glow: 'drop-shadow(0 0 4px rgba(255,220,100,0.6))' };
    case 'metal-wire':
      return { color: 'hsl(210,5%,70%)', colorMid: 'hsl(210,8%,55%)', colorBot: 'hsl(210,5%,65%)', strokeWidth: 1.5, texture: 'smooth' };
    case 'hemp':
      return { color: 'hsl(35,30%,55%)', colorMid: 'hsl(32,25%,42%)', colorBot: 'hsl(35,28%,50%)', strokeWidth: 2.5, texture: 'rough', dashArray: '3 1' };
    case 'white-string':
      return { color: 'hsl(0,0%,95%)', colorMid: 'hsl(0,0%,88%)', colorBot: 'hsl(0,0%,92%)', strokeWidth: 1.2 };
    case 'braided':
      return { color: 'hsl(30,20%,50%)', colorMid: 'hsl(28,18%,38%)', colorBot: 'hsl(30,20%,45%)', strokeWidth: 3, texture: 'braided' };
    case 'pink-yarn':
      return { color: 'hsl(340,60%,70%)', colorMid: 'hsl(338,55%,60%)', colorBot: 'hsl(340,58%,65%)', strokeWidth: 2.5, texture: 'rough', dashArray: '4 1.5' };
    case 'beaded':
      return { color: 'hsl(0,0%,30%)', colorMid: 'hsl(0,0%,20%)', colorBot: 'hsl(0,0%,25%)', strokeWidth: 1, texture: 'beaded' };
    default:
      return null;
  }
}

function getNailConfig(style: HangingStyle): { bg: string; size: number; shadow: string; shape: 'circle' | 'tack' } | null {
  switch (style) {
    case 'silver-screw':
      return {
        bg: 'radial-gradient(circle at 35% 35%, hsl(210,5%,85%), hsl(210,8%,60%))',
        size: 8,
        shadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 -1px 1px rgba(0,0,0,0.15)',
        shape: 'circle',
      };
    case 'red-tack':
      return {
        bg: 'radial-gradient(circle at 35% 35%, hsl(0,75%,60%), hsl(0,70%,42%))',
        size: 10,
        shadow: '0 2px 4px rgba(0,0,0,0.3)',
        shape: 'tack',
      };
    case 'cork-tack':
      return {
        bg: 'radial-gradient(circle at 40% 35%, hsl(35,40%,65%), hsl(32,35%,48%))',
        size: 10,
        shadow: '0 1px 4px rgba(0,0,0,0.25)',
        shape: 'tack',
      };
    default:
      return null;
  }
}

// ── Beaded string SVG path with circles ──
function BeadedPath({ x1, y1, x2, y2, gradId }: { x1: number; y1: number; x2: number; y2: number; gradId: string }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const beadCount = Math.floor(len / 6);
  const beads = [];
  for (let i = 1; i <= beadCount; i++) {
    const t = i / (beadCount + 1);
    beads.push(
      <circle
        key={i}
        cx={x1 + dx * t}
        cy={y1 + dy * t}
        r={2}
        fill={`url(#${gradId})`}
        stroke="none"
      />
    );
  }
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${gradId})`} strokeWidth="0.5" />
      {beads}
    </>
  );
}

// ── Lighted string with bulb dots ──
function LightedDots({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const bulbCount = Math.max(2, Math.floor(len / 12));
  const bulbs = [];
  for (let i = 1; i <= bulbCount; i++) {
    const t = i / (bulbCount + 1);
    bulbs.push(
      <circle
        key={i}
        cx={x1 + dx * t}
        cy={y1 + dy * t}
        r={1.8}
        fill="hsl(45,90%,75%)"
        style={{ filter: 'drop-shadow(0 0 3px rgba(255,220,100,0.8))' }}
      />
    );
  }
  return <>{bulbs}</>;
}

export function HangingWrapper({ style, children, isDark }: HangingWrapperProps) {
  const gradId = useMemo(() => `wire-grad-${++instanceCounter}`, []);

  const nailBg = isDark
    ? 'radial-gradient(circle at 35% 35%, hsl(0,0%,85%), hsl(0,0%,60%))'
    : 'radial-gradient(circle at 35% 35%, hsl(0,0%,30%), hsl(0,0%,10%))';

  // ── Floating ──
  if (style === 'floating') {
    return (
      <div className="relative">
        <div style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12)) drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}>
          {children}
        </div>
      </div>
    );
  }

  // ── Nail / Tack styles ──
  const nailConfig = getNailConfig(style);
  if (nailConfig) {
    return (
      <div className="relative">
        {/* Nail/tack at top center */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[6px] z-10 pointer-events-none">
          {nailConfig.shape === 'tack' ? (
            // Tack pin — flat round head
            <div
              className="rounded-full"
              style={{
                width: nailConfig.size,
                height: nailConfig.size,
                background: nailConfig.bg,
                boxShadow: nailConfig.shadow,
              }}
            />
          ) : (
            // Screw — circle with cross
            <div className="relative">
              <div
                className="rounded-full"
                style={{
                  width: nailConfig.size,
                  height: nailConfig.size,
                  background: nailConfig.bg,
                  boxShadow: nailConfig.shadow,
                }}
              />
              {/* Phillips cross */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute" style={{ width: '60%', height: 1, background: 'rgba(0,0,0,0.25)', borderRadius: 1 }} />
                <div className="absolute" style={{ width: 1, height: '60%', background: 'rgba(0,0,0,0.25)', borderRadius: 1 }} />
              </div>
            </div>
          )}
        </div>
        <div className="relative" style={{
          filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.1)) drop-shadow(0 2px 6px rgba(0,0,0,0.06))',
        }}>
          {children}
        </div>
      </div>
    );
  }

  // ── String-based styles ──
  const stringConfig = getStringConfig(style, isDark);
  if (stringConfig) {
    return (
      <div className="relative pt-[60px]">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-0 pointer-events-none">
          {/* Nail dot */}
          <div
            className="w-2 h-2 rounded-full mx-auto"
            style={{
              background: nailBg,
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
          {/* Wire / string lines */}
          <svg
            width="100"
            height="58"
            viewBox="0 0 100 58"
            className="block"
            style={{
              marginTop: '-1px',
              filter: stringConfig.glow,
            }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stringConfig.color} />
                <stop offset="50%" stopColor={stringConfig.colorMid} />
                <stop offset="100%" stopColor={stringConfig.colorBot} />
              </linearGradient>
            </defs>
            {stringConfig.texture === 'beaded' ? (
              <>
                <BeadedPath x1={50} y1={2} x2={10} y2={56} gradId={gradId} />
                <BeadedPath x1={50} y1={2} x2={90} y2={56} gradId={gradId} />
              </>
            ) : stringConfig.texture === 'braided' ? (
              <>
                {/* Three intertwined strands */}
                <line x1={50} y1={2} x2={10} y2={56} stroke={`url(#${gradId})`} strokeWidth={stringConfig.strokeWidth} />
                <line x1={49} y1={2} x2={9} y2={56} stroke={`url(#${gradId})`} strokeWidth={stringConfig.strokeWidth * 0.6} opacity={0.5} />
                <line x1={51} y1={2} x2={11} y2={56} stroke={`url(#${gradId})`} strokeWidth={stringConfig.strokeWidth * 0.6} opacity={0.5} />
                <line x1={50} y1={2} x2={90} y2={56} stroke={`url(#${gradId})`} strokeWidth={stringConfig.strokeWidth} />
                <line x1={49} y1={2} x2={89} y2={56} stroke={`url(#${gradId})`} strokeWidth={stringConfig.strokeWidth * 0.6} opacity={0.5} />
                <line x1={51} y1={2} x2={91} y2={56} stroke={`url(#${gradId})`} strokeWidth={stringConfig.strokeWidth * 0.6} opacity={0.5} />
              </>
            ) : (
              <>
                <line
                  x1={50} y1={2} x2={10} y2={56}
                  stroke={`url(#${gradId})`}
                  strokeWidth={stringConfig.strokeWidth}
                  strokeDasharray={stringConfig.dashArray}
                  strokeLinecap="round"
                />
                <line
                  x1={50} y1={2} x2={90} y2={56}
                  stroke={`url(#${gradId})`}
                  strokeWidth={stringConfig.strokeWidth}
                  strokeDasharray={stringConfig.dashArray}
                  strokeLinecap="round"
                />
              </>
            )}
            {/* Lighted string bulbs */}
            {style === 'lighted-string' && (
              <>
                <LightedDots x1={50} y1={2} x2={10} y2={56} />
                <LightedDots x1={50} y1={2} x2={90} y2={56} />
              </>
            )}
          </svg>
        </div>
        <div className="relative" style={{
          transform: 'rotate(-0.5deg)',
          filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.1)) drop-shadow(0 2px 6px rgba(0,0,0,0.06))',
        }}>
          {children}
        </div>
      </div>
    );
  }

  // ── Spotlight ──
  if (style === 'spotlight') {
    return (
      <div className="relative">
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          style={{
            width: '120%',
            height: '60px',
            background: 'radial-gradient(ellipse at center, rgba(255,250,235,0.35) 0%, rgba(255,250,235,0.12) 40%, transparent 70%)',
          }}
        />
        <div className="relative" style={{
          filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.18)) drop-shadow(0 4px 10px rgba(0,0,0,0.08))',
        }}>
          {children}
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,252,240,0.12) 0%, rgba(255,252,240,0.04) 40%, transparent 70%)',
            }}
          />
        </div>
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '90%',
            height: '12px',
            background: 'radial-gradient(ellipse at center, rgba(255,250,235,0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  // ── Hook ──
  if (style === 'hook') {
    return (
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[18px] z-10 pointer-events-none">
          <div className="relative">
            <div className="w-1 h-3 bg-foreground/30 mx-auto rounded-t-full" />
            <div
              className="w-3 h-1.5 rounded-b-full mx-auto -mt-px"
              style={{
                background: 'linear-gradient(180deg, hsl(0,0%,50%) 0%, hsl(0,0%,40%) 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>
        <div className="relative" style={{
          transform: 'rotate(0.8deg)',
          filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.1)) drop-shadow(0 2px 6px rgba(0,0,0,0.06))',
        }}>
          {children}
        </div>
      </div>
    );
  }

  // ── Shelf ──
  if (style === 'shelf') {
    return (
      <div className="relative pb-3">
        <div className="relative" style={{
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
          transformOrigin: 'bottom center',
        }}>
          {children}
        </div>
        <div
          className="relative -mt-[2px] mx-[-6px]"
          style={{
            height: '8px',
            background: 'linear-gradient(180deg, hsl(30,20%,55%) 0%, hsl(28,18%,45%) 60%, hsl(25,15%,38%) 100%)',
            borderRadius: '0 0 2px 2px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            bottom: '0px',
            width: '95%',
            height: '8px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  return <div>{children}</div>;
}
