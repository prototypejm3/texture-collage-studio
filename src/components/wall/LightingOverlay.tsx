import { LightingPreset } from '@/types/wall';

interface LightingOverlayProps {
  preset: LightingPreset;
}

const lightingStyles: Record<LightingPreset, React.CSSProperties | null> = {
  none: null,
  gallery: {
    background: 'linear-gradient(180deg, rgba(255,252,240,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.04) 100%)',
  },
  'golden-hour': {
    background: 'linear-gradient(135deg, rgba(255,200,100,0.12) 0%, rgba(255,180,80,0.06) 40%, rgba(200,150,100,0.04) 70%, rgba(180,120,60,0.08) 100%)',
  },
  dramatic: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 20%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.2) 100%)',
  },
  'soft-diffused': {
    background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)',
  },
};

export function LightingOverlay({ preset }: LightingOverlayProps) {
  const style = lightingStyles[preset];
  if (!style) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-[5] transition-opacity duration-700"
      style={style}
    />
  );
}
