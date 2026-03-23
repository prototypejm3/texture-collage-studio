import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  kidMode: boolean;
  ambientSound?: string;
  onAmbientSoundChange?: (sound: any) => void;
}

export function FloatingMusicButton({ kidMode, ambientSound, onAmbientSoundChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  if (!onAmbientSoundChange) return null;

  const accentColor = kidMode ? '#f97316' : '#5a8a6a';
  const isPlaying = ambientSound && ambientSound !== 'none';
  const trackName = kidMode ? 'Cozy Tunes' : 'Focus Flow';
  const soundLabels: Record<string, string> = { gallery: kidMode ? 'Music Box' : 'Gallery', loft: kidMode ? 'Dance Party' : 'Lofi', home: kidMode ? 'Sleepy Time' : 'Chill' };
  const currentLabel = ambientSound && ambientSound !== 'none' ? soundLabels[ambientSound] || trackName : trackName;

  return (
    <div className="fixed z-[55]" style={{ right: 16, bottom: 72 }}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-[44px] right-0 rounded-lg px-3 py-2 min-w-[120px]"
            style={{ backgroundColor: 'rgba(61,53,48,0.85)' }}
          >
            <p className="text-white text-[9px] font-medium mb-1.5" style={{ fontFamily: 'system-ui,sans-serif' }}>
              {isPlaying ? `♪ ${currentLabel}` : 'Music Off'}
            </p>
            <div className="flex flex-col gap-1">
              {(['none', 'gallery', 'loft', 'home'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onAmbientSoundChange(s)}
                  className="text-left text-[10px] px-2 py-1 rounded transition-colors"
                  style={{
                    color: ambientSound === s ? accentColor : 'white',
                    fontWeight: ambientSound === s ? 600 : 400,
                    backgroundColor: ambientSound === s ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  {s === 'none' ? 'Off' : soundLabels[s] || s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center rounded-full transition-transform active:scale-[0.94]"
        style={{
          width: 36, height: 36,
          backgroundColor: accentColor,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="5" cy="12" r="2.5" fill="white"/>
          <circle cx="12" cy="10" r="2.5" fill="white"/>
          <rect x="7" y="2" width="1.5" height="10" rx="0.5" fill="white"/>
          <rect x="7" y="2" width="7" height="4" rx="1" fill="white" opacity="0.6"/>
        </svg>
      </button>
    </div>
  );
}
