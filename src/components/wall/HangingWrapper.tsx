import { HangingStyle } from '@/types/wall';

interface HangingWrapperProps {
  style: HangingStyle;
  children: React.ReactNode;
}

export function HangingWrapper({ style, children }: HangingWrapperProps) {
  if (style === 'floating') {
    return (
      <div className="relative">
        <div style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12)) drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}>
          {children}
        </div>
      </div>
    );
  }

  if (style === 'string') {
    return (
      <div className="relative pt-[60px]">
        {/* String from nail to frame corners */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-0 pointer-events-none">
          {/* Nail dot — metallic */}
          <div
            className="w-2 h-2 rounded-full mx-auto"
            style={{
              background: 'radial-gradient(circle at 35% 35%, hsl(0,0%,80%), hsl(0,0%,45%))',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
          {/* Wire lines — metallic gradient stroke */}
          <svg width="100" height="58" viewBox="0 0 100 58" className="block" style={{ marginTop: '-1px' }}>
            <defs>
              <linearGradient id="wire-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0,0%,72%)" />
                <stop offset="50%" stopColor="hsl(0,0%,50%)" />
                <stop offset="100%" stopColor="hsl(0,0%,65%)" />
              </linearGradient>
            </defs>
            <line x1="50" y1="2" x2="10" y2="56" stroke="url(#wire-grad)" strokeWidth="1" />
            <line x1="50" y1="2" x2="90" y2="56" stroke="url(#wire-grad)" strokeWidth="1" />
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

  if (style === 'spotlight') {
    return (
      <div className="relative">
        {/* Spotlight glow from above */}
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          style={{
            width: '120%',
            height: '60px',
            background: 'radial-gradient(ellipse at center, rgba(255,250,235,0.35) 0%, rgba(255,250,235,0.12) 40%, transparent 70%)',
          }}
        />
        {/* Directional light on artwork */}
        <div className="relative" style={{
          filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.18)) drop-shadow(0 4px 10px rgba(0,0,0,0.08))',
        }}>
          {children}
          {/* Light overlay on the piece */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,252,240,0.12) 0%, rgba(255,252,240,0.04) 40%, transparent 70%)',
            }}
          />
        </div>
        {/* Soft pool of light below */}
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

  if (style === 'hook') {
    return (
      <div className="relative">
        {/* Wall hook / nail */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[18px] z-10 pointer-events-none">
          {/* Hook shape */}
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

  if (style === 'shelf') {
    return (
      <div className="relative pb-3">
        <div className="relative" style={{
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
          transformOrigin: 'bottom center',
        }}>
          {children}
        </div>
        {/* Shelf ledge */}
        <div 
          className="relative -mt-[2px] mx-[-6px]"
          style={{
            height: '8px',
            background: 'linear-gradient(180deg, hsl(30,20%,55%) 0%, hsl(28,18%,45%) 60%, hsl(25,15%,38%) 100%)',
            borderRadius: '0 0 2px 2px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        />
        {/* Shelf bracket shadow */}
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

  // Fallback
  return <div>{children}</div>;
}
