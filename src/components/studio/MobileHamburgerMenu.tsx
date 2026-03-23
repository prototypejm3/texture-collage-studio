import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  kidMode: boolean;
  dark: boolean;
  onToggleTheme: () => void;
  ambientSound?: string;
  onAmbientSoundChange?: (sound: any) => void;
  kidSoundsEnabled?: boolean;
  onKidSoundsToggle?: (enabled: boolean) => void;
  onClear: () => void;
  onSave: () => void;
  aiEnabled?: boolean;
  onAiToggle?: () => void;
}

export function MobileHamburgerMenu({
  kidMode, dark, onToggleTheme, ambientSound, onAmbientSoundChange,
  kidSoundsEnabled, onKidSoundsToggle, onClear, onSave, aiEnabled, onAiToggle,
}: Props) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Close on route change
  useEffect(() => { setOpen(false); }, []);

  const accentColor = kidMode ? '#7aaa8a' : '#5a8a6a';
  const bgColor = kidMode ? 'hsl(var(--toybox-bg))' : '#faf8f5';
  const textColor = kidMode ? '#3a5c4a' : '#3d3530';
  const mutedColor = '#94a3b8';

  const MenuItem = ({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }) => (
    <button
      onClick={() => { onClick?.(); setOpen(false); }}
      className="w-full flex items-center gap-3 px-4 py-3 transition-transform active:scale-[0.94]"
      style={{ color: active ? accentColor : textColor }}
    >
      <span className="w-5 flex items-center justify-center">{icon}</span>
      <span className="text-[13px] font-medium" style={{ fontFamily: 'system-ui,sans-serif' }}>{label}</span>
    </button>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center justify-center w-8 h-8 gap-[5px] transition-transform active:scale-[0.94] md:hidden"
        title="Menu"
      >
        <span className="block w-5 h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />
        <span className="block w-5 h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />
        <span className="block w-5 h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />
      </button>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[101] w-[280px] shadow-xl overflow-y-auto"
              style={{ backgroundColor: bgColor }}
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-[14px] font-bold" style={{ color: textColor, fontFamily: 'system-ui,sans-serif' }}>
                  Menu
                </span>
                <button onClick={() => setOpen(false)} className="p-1 transition-transform active:scale-[0.94]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke={mutedColor} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="w-full h-px" style={{ backgroundColor: kidMode ? 'hsl(var(--toybox-border))' : '#e2ddd6' }} />

              {kidMode ? (
                <>
                  <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 2L2 9H4V16H8V12H12V12H16V9H18L10 2Z" fill="#7aaa8a"/></svg>}
                    label="My Room"
                    onClick={() => window.location.href = '/wall'}
                  />
                  <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 20 20"><polygon points="10,2 2,8 18,8" fill="#7aaa8a"/><rect x="4" y="8" width="12" height="8" fill="#a8d4b8"/></svg>}
                    label="Show & Tell"
                    onClick={() => window.location.href = '/gallery'}
                  />
                  {onAiToggle && (
                    <MenuItem
                      icon={<svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="#7aaa8a"/></svg>}
                      label={`AI Mode ${aiEnabled ? '(On)' : '(Off)'}`}
                      onClick={onAiToggle}
                      active={aiEnabled}
                    />
                  )}
                </>
              ) : (
                <>
                  <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="2" stroke="#5a8a6a" strokeWidth="2" fill="none"/><rect x="1" y="1" width="5" height="5" rx="1" fill="#7aaa8a"/><rect x="14" y="1" width="5" height="5" rx="1" fill="#7aaa8a"/><rect x="1" y="14" width="5" height="5" rx="1" fill="#7aaa8a"/><rect x="14" y="14" width="5" height="5" rx="1" fill="#7aaa8a"/></svg>}
                    label="Studio"
                    onClick={() => window.location.href = '/wall'}
                  />
                  <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 20 20"><polygon points="10,1 1,7 19,7" fill="#5a8a6a"/><rect x="1" y="7" width="18" height="2" fill="#3d6a4a"/><rect x="3" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/><rect x="8" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/><rect x="14" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/></svg>}
                    label="Showcase"
                    onClick={() => window.location.href = '/gallery'}
                  />
                  {onAiToggle && (
                    <MenuItem
                      icon={<svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="#5a8a6a"/></svg>}
                      label={`AI Mode ${aiEnabled ? '(On)' : '(Off)'}`}
                      onClick={onAiToggle}
                      active={aiEnabled}
                    />
                  )}
                </>
              )}

              <div className="w-full h-px my-1" style={{ backgroundColor: kidMode ? 'hsl(var(--toybox-border))' : '#e2ddd6' }} />

              {/* Dark/Light */}
              <MenuItem
                icon={dark
                  ? <svg width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4" fill="#fbbf24"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" fill="#5a4a3a"/><circle cx="10" cy="6" r="4" fill={bgColor}/></svg>
                }
                label={dark ? 'Light Mode' : 'Dark Mode'}
                onClick={onToggleTheme}
              />

              {/* Volume / Music */}
              {onAmbientSoundChange && (
                <MenuItem
                  icon={<svg width="14" height="14" viewBox="0 0 16 16"><polygon points="1,6 1,10 4,10 8,14 8,2 4,6" fill={mutedColor}/></svg>}
                  label={`Music: ${ambientSound === 'none' ? 'Off' : ambientSound || 'Off'}`}
                  onClick={() => {
                    const sounds = ['none', 'gallery', 'loft', 'home'] as const;
                    const idx = sounds.indexOf(ambientSound as any);
                    onAmbientSoundChange(sounds[(idx + 1) % sounds.length]);
                  }}
                />
              )}
              {onKidSoundsToggle && kidMode && (
                <MenuItem
                  icon={<svg width="14" height="14" viewBox="0 0 16 16"><polygon points="1,6 1,10 4,10 8,14 8,2 4,6" fill={mutedColor}/><path d="M10 5C11.5 6.5 11.5 9.5 10 11" stroke={mutedColor} strokeWidth="1.5" fill="none"/></svg>}
                  label={`Sound FX: ${kidSoundsEnabled ? 'On' : 'Off'}`}
                  onClick={() => onKidSoundsToggle(!kidSoundsEnabled)}
                />
              )}

              <div className="w-full h-px my-1" style={{ backgroundColor: kidMode ? 'hsl(var(--toybox-border))' : '#e2ddd6' }} />

              {/* Download */}
              <MenuItem
                icon={<svg width="14" height="14" viewBox="0 0 16 16"><rect x="2" y="12" width="12" height="2" rx="1" fill={accentColor}/><path d="M8 2V10" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/><polyline points="5,8 8,11 11,8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                label="Download"
                onClick={onSave}
              />

              <div className="w-full h-px my-1" style={{ backgroundColor: kidMode ? 'hsl(var(--toybox-border))' : '#e2ddd6' }} />

              {/* Auth */}
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="4" fill={mutedColor}/>
                      <ellipse cx="8" cy="14" rx="6" ry="4" fill={mutedColor}/>
                    </svg>
                    <span className="text-[13px] font-medium truncate" style={{ color: textColor, fontFamily: 'system-ui,sans-serif' }}>
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <MenuItem
                    icon={<LogOut className="w-4 h-4" style={{ color: mutedColor }} />}
                    label="Sign Out"
                    onClick={() => signOut()}
                  />
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="mx-4 my-2 flex items-center justify-center gap-1 px-3 py-2 rounded-[20px] text-white font-bold text-[13px] transition-transform active:scale-[0.94]"
                  style={{ backgroundColor: accentColor }}
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
