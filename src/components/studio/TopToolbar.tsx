import { useRef, useState, useEffect } from 'react';
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
            <button
              onClick={handleKidToggle}
              className="transition-all active:scale-[0.94] rounded-full overflow-hidden ring-2 ring-blue-500"
              title="Switch to Granny Mode"
            >
              <img src={kidGrannyToggle} alt="Kids → Granny" className="h-6 w-auto" />
            </button>
            <Link to="/"
              className="flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-white font-bold text-[11px] transition-transform active:scale-[0.94]"
              style={{ backgroundColor: '#f97316' }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" fill="white"/>
              </svg>
              Create
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
                    <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg py-0.5 min-w-[110px]">
                      <p className="px-2 py-0.5 text-[8px] text-muted-foreground uppercase tracking-widest">Music</p>
                      {([['none', 'Off', '🔇'], ['gallery', 'Music Box', '🎵'], ['loft', 'Dance Party', '🕺'], ['home', 'Sleepy Time', '🌙']] as const).map(([value, label, emoji]) => (
                        <button key={value}
                          onClick={() => { onAmbientSoundChange(value as any); setShowSoundMenu(false); }}
                          className={`w-full text-left px-2 py-1 text-[10px] hover:bg-secondary flex items-center gap-1.5 ${ambientSound === value ? 'text-primary font-medium' : 'text-foreground'}`}
                        ><span>{emoji}</span> {label}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {onKidSoundsToggle && (
              <div className="relative">
                <button
                  onClick={() => { if (kidSoundsEnabled) setShowSfxVolume(v => !v); else onKidSoundsToggle(true); }}
                  onContextMenu={(e) => { e.preventDefault(); onKidSoundsToggle(!kidSoundsEnabled); }}
                  className="p-0.5 rounded-full transition-all hover:scale-110 active:scale-90"
                  style={{ backgroundColor: kidSoundsEnabled ? 'hsl(var(--toybox-sfx-bg))' : 'transparent' }}
                  title={kidSoundsEnabled ? 'Click: volume · Right-click: mute' : 'Enable sound effects'}
                ><SpeakerIcon /></button>
                {showSfxVolume && kidSoundsEnabled && onKidSoundsVolume && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSfxVolume(false)} />
                    <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[120px]">
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">🔊 Volume</p>
                      <input type="range" min={0} max={100} step={5} value={Math.round((kidSoundsVolume || 0.4) * 100)}
                        onChange={(e) => onKidSoundsVolume(Number(e.target.value) / 100)} className="w-full h-1 accent-primary" />
                      <p className="text-[8px] text-muted-foreground text-center mt-0.5">{Math.round((kidSoundsVolume || 0.4) * 100)}%</p>
                      <button onClick={() => { onKidSoundsToggle(false); setShowSfxVolume(false); }}
                        className="w-full mt-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors">🔇 Mute</button>
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
             {/* Mode toggle replaces user info in kid mode */}
             <button
               onClick={handleKidToggle}
               className="transition-all hover:scale-105 active:scale-95 rounded-full overflow-hidden ring-[3px] ring-blue-500"
               title="Switch to Granny Mode"
             >
               <img src={kidGrannyToggle} alt="Kids → Granny" className="h-10 w-auto" />
             </button>
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
              Create
            </Link>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <MobileHamburgerMenu {...mobileMenuProps} />
            <button
              onClick={handleKidToggle}
              className={`${pressStyle} flex items-center rounded-3xl overflow-hidden flex-shrink-0`}
              style={{ backgroundColor: dark ? 'hsl(var(--secondary))' : '#f0ebe3', border: `1px solid ${dark ? 'hsl(var(--border))' : '#e2ddd6'}`, width: 48, height: 22 }}
              title="Switch to Kids Mode"
            >
              <div className="flex items-center justify-center w-1/2 h-full">
                <svg width="12" height="12" viewBox="0 0 28 28">
                  <circle cx="14" cy="16" r="10" fill="white"/>
                  <circle cx="10" cy="14" r="1.5" fill="#5a4a3a"/>
                  <circle cx="18" cy="14" r="1.5" fill="#5a4a3a"/>
                  <path d="M11 18 Q14 21 17 18" fill="none" stroke="#5a4a3a" strokeWidth="1.2" strokeLinecap="round"/>
                  <polygon points="8,8 14,3 20,8" fill="#fbbf24"/>
                  <circle cx="11" cy="7" r="1" fill="#e05c5c"/>
                  <circle cx="17" cy="7" r="1" fill="#e05c5c"/>
                </svg>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center justify-center w-1/2 h-full">
                <svg width="12" height="12" viewBox="0 0 28 28">
                  <circle cx="14" cy="16" r="10" fill="#f5dfc8"/>
                  <ellipse cx="14" cy="7" rx="10" ry="5" fill="#c4c4c4"/>
                  <circle cx="14" cy="4" r="4" fill="#b0b0b0"/>
                  <circle cx="10" cy="15" r="3.5" fill="none" stroke="#5a8a6a" strokeWidth="1.5"/>
                  <circle cx="18" cy="15" r="3.5" fill="none" stroke="#5a8a6a" strokeWidth="1.5"/>
                  <circle cx="10" cy="15" r="1" fill="#5a4a3a"/>
                  <circle cx="18" cy="15" r="1" fill="#5a4a3a"/>
                  <path d="M12 19 Q14 21 16 19" fill="none" stroke="#5a4a3a" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
            </button>
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

            {/* Create */}
            <Link to="/"
              className={`${pressStyle} hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] text-white font-bold text-[13px]`}
              style={{ backgroundColor: '#5a8a6a' }}
              title="Create"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" fill="white"/>
              </svg>
              Create
            </Link>

            <NavDivider />

            {/* Workspace */}
            <Link to="/wall" data-nav="wall"
              className={`${pressStyle} hidden md:flex items-center gap-1.5 px-1.5 py-1`}
              title="Workspace"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="2" stroke="#5a8a6a" strokeWidth="2.5" fill="none"/>
                <rect x="1" y="1" width="5" height="5" rx="1" fill="#7aaa8a"/>
                <rect x="14" y="1" width="5" height="5" rx="1" fill="#7aaa8a"/>
                <rect x="1" y="14" width="5" height="5" rx="1" fill="#7aaa8a"/>
                <rect x="14" y="14" width="5" height="5" rx="1" fill="#7aaa8a"/>
                <rect x="5" y="5" width="10" height="10" fill="white"/>
              </svg>
              <span className="text-foreground" style={{ fontSize: 12, fontWeight: 500, fontFamily: 'system-ui,sans-serif' }}>Workspace</span>
            </Link>

            {/* Gallery */}
            <Link to="/gallery" data-nav="gallery"
              className={`${pressStyle} hidden md:flex items-center gap-1.5 px-1.5 py-1`}
              title="Gallery"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <polygon points="10,1 1,7 19,7" fill="#5a8a6a"/>
                <rect x="1" y="7" width="18" height="2" fill="#3d6a4a"/>
                <rect x="3" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/>
                <rect x="7" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/>
                <rect x="11" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/>
                <rect x="15" y="9" width="3" height="8" rx="0.5" fill="#7aaa8a"/>
                <rect x="1" y="17" width="18" height="2" rx="0.5" fill="#5a8a6a"/>
              </svg>
              <span className="text-foreground" style={{ fontSize: 12, fontWeight: 500, fontFamily: 'system-ui,sans-serif' }}>Gallery</span>
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
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <polygon points="1,6 1,10 4,10 8,14 8,2 4,6" fill="#94a3b8"/>
                    <path d="M10 5C11.5 6.5 11.5 9.5 10 11" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <path d="M12 3C14.5 5.5 14.5 10.5 12 13" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
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
            <button
              onClick={handleKidToggle}
              className={`${pressStyle} flex items-center rounded-3xl overflow-hidden flex-shrink-0`}
              style={{ backgroundColor: dark ? 'hsl(var(--secondary))' : '#f0ebe3', border: `1px solid ${dark ? 'hsl(var(--border))' : '#e2ddd6'}`, width: 68, height: 32 }}
              title="Switch to Kids Mode"
            >
              {/* Kid face */}
              <div className="flex items-center justify-center w-1/2 h-full">
                <svg width="18" height="18" viewBox="0 0 28 28">
                  <circle cx="14" cy="16" r="10" fill="white"/>
                  <circle cx="10" cy="14" r="1.5" fill="#5a4a3a"/>
                  <circle cx="18" cy="14" r="1.5" fill="#5a4a3a"/>
                  <path d="M11 18 Q14 21 17 18" fill="none" stroke="#5a4a3a" strokeWidth="1.2" strokeLinecap="round"/>
                  <polygon points="8,8 14,3 20,8" fill="#fbbf24"/>
                  <circle cx="11" cy="7" r="1" fill="#e05c5c"/>
                  <circle cx="17" cy="7" r="1" fill="#e05c5c"/>
                </svg>
              </div>
              {/* Divider */}
              <div className="w-px h-5 bg-border" />
              {/* Grandma face */}
              <div className="flex items-center justify-center w-1/2 h-full">
                <svg width="18" height="18" viewBox="0 0 28 28">
                  <circle cx="14" cy="16" r="10" fill="#f5dfc8"/>
                  <ellipse cx="14" cy="7" rx="10" ry="5" fill="#c4c4c4"/>
                  <circle cx="14" cy="4" r="4" fill="#b0b0b0"/>
                  <circle cx="10" cy="15" r="3.5" fill="none" stroke="#5a8a6a" strokeWidth="1.5"/>
                  <circle cx="18" cy="15" r="3.5" fill="none" stroke="#5a8a6a" strokeWidth="1.5"/>
                  <circle cx="10" cy="15" r="1" fill="#5a4a3a"/>
                  <circle cx="18" cy="15" r="1" fill="#5a4a3a"/>
                  <path d="M12 19 Q14 21 16 19" fill="none" stroke="#5a4a3a" strokeWidth="1" strokeLinecap="round"/>
                  <circle cx="7" cy="17" r="2" fill="#f9a8d4" opacity="0.4"/>
                  <circle cx="21" cy="17" r="2" fill="#f9a8d4" opacity="0.4"/>
                </svg>
              </div>
            </button>
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
