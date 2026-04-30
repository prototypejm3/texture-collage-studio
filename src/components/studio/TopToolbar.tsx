import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FrameStyle, AmbientSound } from '@/types/wall';
import { Trash2, Download, Frame, Save, ChevronDown, Brush, Grid2x2, Landmark, LogIn, LogOut, User, Moon, Sun, Ear, Sparkles, Volume2, VolumeX, Undo2, Redo2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GrownUpCheckModal } from './GrownUpCheckModal';
import { AiWelcomeModal } from './AiWelcomeModal';
import { SwatchboxLogo } from '@/components/SwatchboxLogo';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileHamburgerMenu } from './MobileHamburgerMenu';
import kidGrannyToggle from '@/assets/kid-granny-toggle.png';
import { LanguagePill } from './LanguagePill';
import { getLabels } from '@/lib/labels';
import { useLanguage } from '@/hooks/useLanguage';
import {
  HouseIcon, TentIcon,
  SparkleIcon, SunIcon as ToySunIcon, MoonIcon as ToyMoonIcon, MusicNoteIcon,
  SpeakerIcon, TrashCanIcon, SaveBoxIcon, DownloadTrayIcon, PencilIcon,
} from './ToyboxIcons';

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

interface Props {
  wallFrameStyle: FrameStyle;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
  ambientSound?: AmbientSound;
  onAmbientSoundChange?: (sound: AmbientSound) => void;
  focusMode?: boolean;
  onToggleFocusMode?: () => void;
  // Kid sound settings
  kidSoundsEnabled?: boolean;
  kidSoundsVolume?: number;
  onKidSoundsToggle?: (enabled: boolean) => void;
  onKidSoundsVolume?: (vol: number) => void;
  // Undo/Redo
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const frameStyleList: { id: FrameStyle; label: string }[] = [
  { id: 'gold', label: 'Gold' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'copper', label: 'Copper' },
  { id: 'silver', label: 'Silver' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'shadow-box', label: 'Shadow Box' },
  { id: 'wood', label: 'Wood' },
  { id: 'floating', label: 'Floating' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'none', label: 'None' },
];

export function TopToolbar({
  wallFrameStyle,
  onWallFrameStyleChange,
  onClear, onSave, onSaveToWall,
  ambientSound, onAmbientSoundChange,
  focusMode, onToggleFocusMode,
  kidSoundsEnabled, kidSoundsVolume, onKidSoundsToggle, onKidSoundsVolume,
  onUndo, onRedo, canUndo, canRedo,
}: Props) {
  const [framePanelOpen, setFramePanelOpen] = useState(false);
  const [showSfxVolume, setShowSfxVolume] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showGrownUpCheck, setShowGrownUpCheck] = useState(false);
  const [showAiWelcome, setShowAiWelcome] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { dark, toggle } = useTheme();

  // Kid mode state
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  // i18n
  const { lang } = useLanguage();
  const labels = getLabels(kidMode, lang);

  // AI stencil toggle (on by default)
  const [aiEnabled, setAiEnabled] = useState(() => {
    try { return localStorage.getItem('ai-stencil-enabled') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setAiEnabled((e as CustomEvent).detail);
    window.addEventListener('ai-enabled-change', handler);
    return () => window.removeEventListener('ai-enabled-change', handler);
  }, []);

  // Show AI welcome modal on first login
  useEffect(() => {
    if (user && !localStorage.getItem('ai-welcome-shown')) {
      setShowAiWelcome(true);
    }
  }, [user]);

  const handleAiToggle = () => {
    const next = !aiEnabled;
    localStorage.setItem('ai-stencil-enabled', String(next));
    setAiEnabled(next);
    window.dispatchEvent(new CustomEvent('ai-enabled-change', { detail: next }));
  };

  const handleAiWelcomeClose = (enabled: boolean) => {
    localStorage.setItem('ai-welcome-shown', 'true');
    localStorage.setItem('ai-stencil-enabled', String(enabled));
    setAiEnabled(enabled);
    setShowAiWelcome(false);
    window.dispatchEvent(new CustomEvent('ai-enabled-change', { detail: enabled }));
  };

  const handleKidToggle = () => {
    if (kidMode) {
      // Trying to turn OFF → show grown-up check
      setShowGrownUpCheck(true);
    } else {
      // Turn ON kid mode
      localStorage.setItem('kid-mode', 'true');
      setKidMode(true);
      window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: true }));
    }
  };

  const handleGrownUpSuccess = () => {
    setShowGrownUpCheck(false);
    localStorage.setItem('kid-mode', 'false');
    setKidMode(false);
    window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: false }));
  };

  const isMobile = useIsMobile();
  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const currentFrameLabel = frameStyleList.find(f => f.id === wallFrameStyle)?.label || 'Gold';

  // ── Mode toggle pill — shows only current mode with switch label ──
  const ModeTogglePillKid = ({ onClick }: { onClick: () => void }) => (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full overflow-hidden flex-shrink-0 transition-all hover:scale-105 px-3"
      style={{ backgroundColor: kidMode ? '#f97316' : '#5a8a6a', height: 38 }}
      title={kidMode ? 'Switch to Granny Mode' : 'Switch to Kid Mode'}
    >
      {kidMode ? (
        <>
          <svg width={22} height={22} viewBox="0 0 40 40">
            <circle cx="10" cy="10" r="6" fill="#c4956a" />
            <circle cx="10" cy="10" r="3.5" fill="#dbb896" />
            <circle cx="30" cy="10" r="6" fill="#c4956a" />
            <circle cx="30" cy="10" r="3.5" fill="#dbb896" />
            <circle cx="20" cy="22" r="14" fill="#c4956a" />
            <circle cx="20" cy="24" r="10" fill="#dbb896" />
            <circle cx="15" cy="22" r="2" fill="#3d2b1f" />
            <circle cx="25" cy="22" r="2" fill="#3d2b1f" />
            <ellipse cx="20" cy="25" rx="2.5" ry="1.8" fill="#3d2b1f" />
            <polygon points="12,11 14,4 17,9 20,3 23,9 26,4 28,11" fill="#fbbf24" />
          </svg>
          <span className="text-white font-bold text-xs whitespace-nowrap">{labels.kidMode}</span>
        </>
      ) : (
        <>
          <svg width={22} height={22} viewBox="0 0 40 40">
            <circle cx="20" cy="8" r="5" fill="#ddd" />
            <circle cx="18" cy="6" r="1.2" fill="#fbbf24" />
            <circle cx="22" cy="6" r="1.2" fill="#fbbf24" />
            <circle cx="8" cy="18" r="4" fill="#ddd" />
            <circle cx="32" cy="18" r="4" fill="#ddd" />
            <circle cx="20" cy="22" r="13" fill="#dbb896" />
            <rect x="10" y="18" width="8" height="6" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="1.8" />
            <rect x="22" y="18" width="8" height="6" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="1.8" />
            <line x1="18" y1="21" x2="22" y2="21" stroke="#5a8a6a" strokeWidth="1.5" />
            <circle cx="14" cy="21" r="1.5" fill="#3d2b1f" />
            <circle cx="26" cy="21" r="1.5" fill="#3d2b1f" />
            <path d="M16 27 Q20 30 24 27" fill="none" stroke="#3d2b1f" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-white font-bold text-xs whitespace-nowrap">{labels.grannyMode}</span>
        </>
      )}
    </motion.button>
  );

  // ── Adult Mode SVG Icons ──
  const NavDivider = () => <div className="w-px h-10 flex-shrink-0 bg-border" />;

  const pressStyle = "transition-transform duration-150 ease-out active:scale-[0.96]";

  // Shared mobile hamburger props
  const mobileMenuProps = {
    kidMode, dark, onToggleTheme: toggle,
    ambientSound: ambientSound as string | undefined,
    onAmbientSoundChange,
    kidSoundsEnabled, onKidSoundsToggle,
    onClear, onSave,
    aiEnabled, onAiToggle: handleAiToggle,
  };

  return (
    <>
    <div className={`flex items-center px-2 md:px-4 relative ${
      kidMode
        ? 'h-[56px] md:h-[64px] border-b bg-[hsl(var(--toybox-bg))] border-[hsl(var(--toybox-border))]'
        : 'h-[56px] border-b border-border bg-popover'
    }`}
    >
      {kidMode && isMobile ? (
        /* ── Kid Mode MOBILE Nav ── */
        <>
          <div className="flex items-center gap-1.5">
            <Link to="/" className="transition-transform active:scale-[0.94]">
              <SwatchboxLogo height={28} />
            </Link>
            <LanguagePill kidMode={kidMode} />
            <ModeTogglePillKid onClick={handleKidToggle} />
            <Link to="/"
              className="flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-white font-bold text-[11px] transition-transform active:scale-[0.94]"
              style={{ backgroundColor: '#f97316' }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" fill="white"/>
              </svg>
              Workspace
            </Link>
          </div>
          <div className="flex-1" />
          <MobileHamburgerMenu {...mobileMenuProps} />
        </>
      ) : kidMode ? (
        /* ── Kid Mode DESKTOP Nav ── */
        <>
          <div className="flex items-center gap-1.5 md:gap-3">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                isStudio ? 'ring-2 ring-[hsl(var(--toybox-wood))]/40' : ''
              }`}
              style={isStudio ? { backgroundColor: 'hsl(var(--toybox-card))' } : undefined}
            >
              <SwatchboxLogo height={32} />
            </Link>
            <div className="w-px h-8 hidden md:block" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
            <Link to="/wall" data-nav="wall"
              className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isWall ? 'ring-2 ring-[hsl(var(--toybox-wood))]/40' : ''
              }`}
              style={isWall ? { backgroundColor: 'hsl(var(--toybox-card))' } : undefined}
            >
              <HouseIcon />
              <span className="text-sm font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>My Room</span>
            </Link>
            <div className="w-px h-8 hidden md:block" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
            <Link to="/gallery" data-nav="gallery"
              className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isGallery ? 'ring-2 ring-[hsl(var(--toybox-wood))]/40' : ''
              }`}
              style={isGallery ? { backgroundColor: 'hsl(var(--toybox-card))' } : undefined}
            >
              <TentIcon />
              <span className="text-sm font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>Show & Tell</span>
            </Link>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button onClick={toggle}
              className="flex items-center gap-0.5 px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'hsl(var(--toybox-card))', border: '1.5px solid hsl(var(--toybox-border))' }}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              <ToyMoonIcon /><ToySunIcon />
            </button>
            {onAmbientSoundChange && (
              <div className="relative">
                <button onClick={() => setShowSoundMenu(!showSoundMenu)}
                  className={`p-1 rounded-lg transition-all hover:scale-110 active:scale-90 ${ambientSound && ambientSound !== 'none' ? 'opacity-100' : 'opacity-50'}`}
                  title="Music"
                ><MusicNoteIcon /></button>
                {showSoundMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)} />
                    <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg py-0.5 min-w-[120px]">
                      <p className="px-2 py-0.5 text-[8px] text-muted-foreground uppercase tracking-widest">Music</p>
                      {([['none', 'Off', '🔇'], ['gallery', 'Music Box', '🎵'], ['loft', 'Dance Party', '🕺'], ['home', 'Sleepy Time', '🌙']] as const).map(([value, label, emoji]) => (
                        <button key={value}
                          onClick={() => { onAmbientSoundChange(value as any); setShowSoundMenu(false); }}
                          className={`w-full text-left px-2 py-1 text-[10px] hover:bg-secondary flex items-center gap-1.5 ${ambientSound === value ? 'text-primary font-medium' : 'text-foreground'}`}
                        ><span>{emoji}</span> {label}</button>
                      ))}
                      {/* Volume control */}
                      {onKidSoundsToggle && (
                        <div className="border-t border-border mt-0.5 pt-1 px-2 pb-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">🔊 Volume</p>
                            <button onClick={() => { onKidSoundsToggle(!kidSoundsEnabled); }}
                              className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">
                              {kidSoundsEnabled ? '🔇 Mute' : '🔊 On'}
                            </button>
                          </div>
                          {kidSoundsEnabled && onKidSoundsVolume && (
                            <>
                              <input type="range" min={0} max={100} step={5} value={Math.round((kidSoundsVolume || 0.4) * 100)}
                                onChange={(e) => onKidSoundsVolume(Number(e.target.value) / 100)} className="w-full h-1 accent-primary" />
                              <p className="text-[8px] text-muted-foreground text-center mt-0.5">{Math.round((kidSoundsVolume || 0.4) * 100)}%</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="w-px h-6 hidden sm:block" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
            {onUndo && onRedo && (
              <>
                <button onClick={onUndo} disabled={!canUndo} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none" title="Undo (Ctrl+Z)">
                  <Undo2 className="w-4 h-4" />
                </button>
                <button onClick={onRedo} disabled={!canRedo} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none" title="Redo (Ctrl+Y)">
                  <Redo2 className="w-4 h-4" />
                </button>
              </>
            )}
             {/* Mode toggle — same style as granny mode */}
             <LanguagePill kidMode={kidMode} />
             <ModeTogglePillKid onClick={handleKidToggle} />
          </div>
        </>
      ) : !kidMode && isMobile ? (
        /* ── Adult Mode MOBILE Nav ── */
        <>
          <div className="flex items-center gap-1.5">
            <Link to="/" className="transition-transform active:scale-[0.94]" title="Swatchbox Studio">
              <svg width="90" height="30" viewBox="0 0 360 120">
                <rect x="0" y="0" width="360" height="120" rx="24" fill="#fdf6ee" stroke="#e8ddd0" strokeWidth="1.5"/>
                <rect x="12" y="16" width="88" height="88" rx="16" fill="#c4956a"/>
                <rect x="22" y="26" width="68" height="68" rx="10" fill="#f5ede0"/>
                <circle cx="56" cy="58" r="22" fill="#c4956a"/>
                <circle cx="40" cy="42" r="10" fill="#c4956a"/>
                <circle cx="40" cy="42" r="6" fill="#d9a97c"/>
                <circle cx="72" cy="42" r="10" fill="#c4956a"/>
                <circle cx="72" cy="42" r="6" fill="#d9a97c"/>
                <text x="116" y="52" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="#3d3530">Swatchbox</text>
                <text x="116" y="80" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="#3d3530">Studio</text>
                <circle cx="116" cy="100" r="6" fill="#f87171"/>
                <circle cx="134" cy="100" r="6" fill="#fbbf24"/>
                <circle cx="152" cy="100" r="6" fill="#4ade80"/>
                <circle cx="170" cy="100" r="6" fill="#38bdf8"/>
                <circle cx="188" cy="100" r="6" fill="#a78bfa"/>
                <circle cx="206" cy="100" r="6" fill="#f97316"/>
              </svg>
            </Link>
            <Link to="/"
              className="flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-white font-bold text-[11px] transition-transform active:scale-[0.94]"
              style={{ backgroundColor: '#5a8a6a' }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" fill="white"/>
              </svg>
              Workspace
            </Link>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <MobileHamburgerMenu {...mobileMenuProps} />
            <LanguagePill kidMode={kidMode} />
            <ModeTogglePillKid onClick={handleKidToggle} />
          </div>
        </>
      ) : (
        /* ── Adult Mode DESKTOP Nav ── */
        <>
          {/* LEFT SIDE: Logo → Create → divider → Workspace → Gallery → AI Mode → divider → Dark/Light → Music → Volume */}
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <Link to="/" className={`${pressStyle} text-foreground`} title="Swatchbox Studio">
              <svg width="120" height="40" viewBox="0 0 360 120">
                <rect x="0" y="0" width="360" height="120" rx="24" fill={dark ? 'hsl(220,30%,20%)' : '#fdf6ee'} stroke={dark ? 'hsl(220,25%,30%)' : '#e8ddd0'} strokeWidth="1.5"/>
                <rect x="12" y="16" width="88" height="88" rx="16" fill="#c4956a"/>
                <line x1="24" y1="16" x2="21" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.35"/>
                <line x1="36" y1="16" x2="33" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.25"/>
                <line x1="48" y1="16" x2="45" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.35"/>
                <line x1="60" y1="16" x2="57" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.25"/>
                <line x1="72" y1="16" x2="69" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.35"/>
                <line x1="84" y1="16" x2="81" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.25"/>
                <rect x="22" y="26" width="68" height="68" rx="10" fill={dark ? '#3a3228' : '#f5ede0'}/>
                <ellipse cx="56" cy="86" rx="24" ry="18" fill="#c4956a"/>
                <ellipse cx="56" cy="88" rx="14" ry="13" fill="#d9a97c"/>
                <circle cx="56" cy="58" r="22" fill="#c4956a"/>
                <ellipse cx="50" cy="50" rx="8" ry="5" fill="#d9a97c" opacity="0.45"/>
                <circle cx="40" cy="42" r="10" fill="#c4956a"/>
                <circle cx="40" cy="42" r="6" fill="#d9a97c"/>
                <circle cx="72" cy="42" r="10" fill="#c4956a"/>
                <circle cx="72" cy="42" r="6" fill="#d9a97c"/>
                <circle cx="18" cy="22" r="4" fill="#b07d52"/>
                <circle cx="94" cy="22" r="4" fill="#b07d52"/>
                <circle cx="18" cy="98" r="4" fill="#b07d52"/>
                <circle cx="94" cy="98" r="4" fill="#b07d52"/>
                <text x="116" y="52" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="currentColor">Swatchbox</text>
                <text x="116" y="80" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="currentColor">Studio</text>
                <circle cx="116" cy="100" r="6" fill="#f87171"/>
                <circle cx="134" cy="100" r="6" fill="#fbbf24"/>
                <circle cx="152" cy="100" r="6" fill="#4ade80"/>
                <circle cx="170" cy="100" r="6" fill="#38bdf8"/>
                <circle cx="188" cy="100" r="6" fill="#a78bfa"/>
                <circle cx="206" cy="100" r="6" fill="#f97316"/>
              </svg>
            </Link>

            {/* Workspace */}
            <Link to="/"
              className={`${pressStyle} hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] font-bold text-[13px] ${
                isStudio ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              style={isStudio ? { backgroundColor: '#5a8a6a' } : undefined}
              title="Workspace"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" fill={isStudio ? 'white' : '#94a3b8'}/>
              </svg>
              Workspace
            </Link>

            <div className="w-px h-5 bg-border mx-0.5" />

            {/* Studio */}
            <Link to="/wall" data-nav="wall"
              className={`${pressStyle} hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] font-bold text-[13px] ${
                isWall ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              style={isWall ? { backgroundColor: '#5a8a6a' } : undefined}
              title="Studio"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="2" stroke={isWall ? 'white' : '#5a8a6a'} strokeWidth="2.5" fill="none"/>
                <rect x="1" y="1" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="14" y="1" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="1" y="14" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="14" y="14" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="5" y="5" width="10" height="10" fill={isWall ? '#5a8a6a' : 'white'}/>
              </svg>
              Studio
            </Link>

            <div className="w-px h-5 bg-border mx-0.5" />

            {/* Showcase */}
            <Link to="/gallery" data-nav="gallery"
              className={`${pressStyle} hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] font-bold text-[13px] ${
                isGallery ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              style={isGallery ? { backgroundColor: '#5a8a6a' } : undefined}
              title="Showcase"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <polygon points="10,1 1,7 19,7" fill={isGallery ? 'white' : '#5a8a6a'}/>
                <rect x="1" y="7" width="18" height="2" fill={isGallery ? 'rgba(255,255,255,0.7)' : '#3d6a4a'}/>
                <rect x="3" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
                <rect x="7" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
                <rect x="11" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
                <rect x="15" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
                <rect x="1" y="17" width="18" height="2" rx="0.5" fill={isGallery ? 'white' : '#5a8a6a'}/>
              </svg>
              Showcase
            </Link>

            {/* AI Mode */}
            <button onClick={handleAiToggle}
              className={`${pressStyle} hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-md`}
              style={{ backgroundColor: aiEnabled ? 'rgba(90,138,106,0.12)' : 'transparent' }}
              title={aiEnabled ? 'AI Stencils (on)' : 'AI Stencils (off)'}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" fill="#5a8a6a"/>
                <circle cx="12" cy="3" r="1" fill="#5a8a6a" opacity="0.5"/>
              </svg>
              <span className="text-foreground" style={{ fontSize: 11, fontWeight: 500, fontFamily: 'system-ui,sans-serif' }}>AI</span>
            </button>

            <NavDivider />

            {/* Light/Dark Toggle */}
            <button onClick={toggle}
              className={`${pressStyle} relative flex items-center rounded-[10px] overflow-hidden flex-shrink-0`}
              style={{ width: 36, height: 20, backgroundColor: dark ? '#4a5568' : '#3d3530' }}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" className="absolute left-1.5 top-1/2 -translate-y-1/2">
                <circle cx="6" cy="6" r="5" fill="#5a4a3a"/>
                <circle cx="8" cy="4" r="4" fill="#faf8f5"/>
              </svg>
              <svg width="10" height="10" viewBox="0 0 12 12" className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <circle cx="6" cy="6" r="3.5" fill="#fbbf24"/>
              </svg>
              <div className="absolute w-4 h-4 rounded-full bg-white/90 shadow-sm transition-all duration-200 top-0.5"
                style={{ left: dark ? 2 : 18 }}
              />
            </button>

            {/* Music */}
            {onAmbientSoundChange && (
              <div className="relative">
                <button onClick={() => setShowSoundMenu(!showSoundMenu)}
                  className={pressStyle}
                  title="Ambient sound"
                >
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <circle cx="5" cy="12" r="2.5" fill="#5a8a6a"/>
                    <rect x="7" y="3" width="1.5" height="9.5" rx="0.5" fill="#5a8a6a"/>
                    <path d="M7.5 3C7.5 3 10 2 13 3.5V7C10 5.5 7.5 6.5 7.5 6.5" fill="#5a8a6a" opacity="0.7"/>
                  </svg>
                </button>
                {showSoundMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)} />
                    <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg py-0.5 min-w-[110px]">
                      <p className="px-2 py-0.5 text-[8px] text-muted-foreground uppercase tracking-widest">Ambiance</p>
                      {([['none', 'Off'], ['gallery', 'Gallery'], ['loft', 'Lofi'], ['home', 'Chill']] as const).map(([value, label]) => (
                        <button key={value}
                          onClick={() => { onAmbientSoundChange(value as any); setShowSoundMenu(false); }}
                          className={`w-full text-left px-2 py-1 text-[10px] hover:bg-secondary ${ambientSound === value ? 'font-medium text-primary' : 'text-foreground'}`}
                        >{label}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* RIGHT SIDE: Username → Out → Toggle */}
          <div className="flex items-center gap-2">
            {/* Auth */}
            {user ? (
              <>
                <span className="items-center gap-1 hidden sm:flex min-w-[60px] text-foreground" style={{ fontSize: 12, fontFamily: 'system-ui,sans-serif' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <circle cx="8" cy="5" r="4" fill="#94a3b8"/>
                    <ellipse cx="8" cy="14" rx="6" ry="4" fill="#94a3b8"/>
                  </svg>
                  <span className="truncate max-w-[80px]">{user.email?.split('@')[0]}</span>
                </span>
                <button onClick={() => signOut()} title="Sign out"
                  className={`${pressStyle} flex items-center gap-1 px-1.5 py-1 flex-shrink-0 text-muted-foreground`}
                  style={{ fontSize: 11, fontFamily: 'system-ui,sans-serif' }}
                >
                  <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Out</span>
                </button>
              </>
            ) : (
              <Link to="/auth" title="Sign in"
                className={`${pressStyle} flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-[20px] text-white`}
                style={{ backgroundColor: '#5a8a6a' }}
              >Sign In</Link>
            )}

            {/* Mode Toggle Pill — far right */}
            <LanguagePill kidMode={kidMode} />
            <ModeTogglePillKid onClick={handleKidToggle} />
          </div>
        </>
      )}
    </div>

    <GrownUpCheckModal
      isOpen={showGrownUpCheck}
      onClose={() => setShowGrownUpCheck(false)}
      onSuccess={handleGrownUpSuccess}
    />
    <AiWelcomeModal
      isOpen={showAiWelcome}
      onClose={handleAiWelcomeClose}
    />
    </>
  );
}
