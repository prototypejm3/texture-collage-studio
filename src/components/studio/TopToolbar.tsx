import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FrameStyle, AmbientSound } from '@/types/wall';
import { Trash2, Download, Frame, Save, ChevronDown, Brush, Grid2x2, Landmark, LogIn, LogOut, User, Moon, Sun, Ear, Sparkles, Volume2, VolumeX, Undo2, Redo2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GrownUpCheckModal } from './GrownUpCheckModal';
import { AiWelcomeModal } from './AiWelcomeModal';
import logoImg from '@/assets/logo.png';

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

  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const currentFrameLabel = frameStyleList.find(f => f.id === wallFrameStyle)?.label || 'Gold';

  return (
    <>
    <div className={`flex items-center justify-between px-2 md:px-4 py-1 md:py-1.5 relative ${
      kidMode
        ? 'bg-gradient-to-r from-primary/5 via-background to-primary/5 border-b-2 border-primary/20'
        : 'bg-background border-b border-border'
    }`}>
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1.5">
          {kidMode ? (
            <img src={logoImg} alt="Swatchbox Studio" className="w-7 h-7 object-contain" />
          ) : (
            <img src={logoImg} alt="Swatchbox Studio" className="w-6 h-6 object-contain" />
          )}
          <span className={`font-bold tracking-tight text-foreground ${kidMode ? 'text-sm' : 'text-xs'}`}>
            Swatchbox Studio
          </span>
        </div>

        {/* Kid Mode Toggle — next to brand */}
        {kidMode ? (
          <button
            onClick={handleKidToggle}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #9B59B6)' }}
            title="Switch to Granny Mode"
          >
            🧒 Kids Mode → 🥦👵
          </button>
        ) : (
          <button
            onClick={handleKidToggle}
            title="Switch to Kids Mode"
            className="px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          >
            → 🧒
          </button>
        )}

        <div className="hidden md:flex items-center gap-1.5">
          {kidMode ? (
            <>
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  isStudio
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                }`}
              >
                <span className="text-sm">🖍️</span>
                Create
              </Link>
              <Link
                to="/wall"
                data-nav="wall"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  isWall
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                }`}
              >
                <span className="text-sm">🏠</span>
                My Room
              </Link>
              <Link
                to="/gallery"
                data-nav="gallery"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  isGallery
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                }`}
              >
                <span className="text-sm">🎪</span>
                Show & Tell
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isStudio ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Brush className="w-3 h-3" />
                Studio
              </Link>
              <Link
                to="/wall"
                data-nav="wall"
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isWall ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid2x2 className="w-3 h-3" />
                My Wall
              </Link>
              <Link
                to="/gallery"
                data-nav="gallery"
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  isGallery ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Landmark className="w-3 h-3" />
                Gallery
              </Link>
            </>
          )}
        </div>
      </div>

      <div />

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Kid Mode Toggle — only in adult mode (kid mode shows it on the left) */}
        {!kidMode && (
          <button
            onClick={handleKidToggle}
            className="p-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
            title="Kids Mode (off)"
          >
            <span className="text-sm leading-none">🧸</span>
          </button>
        )}

        {/* AI Toggle */}
        <button
          onClick={handleAiToggle}
          className={`p-1.5 rounded-md transition-colors ${
            aiEnabled
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
          title={aiEnabled ? 'AI Stencils (on)' : 'AI Stencils (off)'}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={toggle}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {onAmbientSoundChange && (
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`p-1.5 rounded-md transition-colors ${
                ambientSound && ambientSound !== 'none'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              title="Ambient sound"
            >
              <Ear className="w-4 h-4" />
            </button>
            {showSoundMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg py-0.5 min-w-[110px]">
                  <p className="px-2 py-0.5 text-[8px] text-muted-foreground uppercase tracking-widest">{kidMode ? 'Music' : 'Ambiance'}</p>
                  {(kidMode
                    ? ([['none', 'Off', '🔇'], ['gallery', 'Music Box', '🎵'], ['loft', 'Dance Party', '🕺'], ['home', 'Sleepy Time', '🌙']] as const)
                    : ([['none', 'Off', ''], ['gallery', 'Gallery', ''], ['loft', 'Lofi', ''], ['home', 'Chill', '']] as const)
                  ).map(([value, label, emoji]) => (
                    <button
                      key={value}
                      onClick={() => { onAmbientSoundChange(value as AmbientSound); setShowSoundMenu(false); }}
                      className={`w-full text-left px-2 py-1 text-[10px] hover:bg-secondary flex items-center gap-1.5 ${
                        ambientSound === value ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      <span>{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Kid Sound Effects toggle — only visible in kid mode */}
        {kidMode && onKidSoundsToggle && (
          <div className="relative">
            <button
              onClick={() => {
                if (kidSoundsEnabled) {
                  setShowSfxVolume(v => !v);
                } else {
                  onKidSoundsToggle(true);
                }
              }}
              onContextMenu={(e) => { e.preventDefault(); onKidSoundsToggle(!kidSoundsEnabled); }}
              className={`p-1.5 rounded-md transition-colors ${
                kidSoundsEnabled
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              title={kidSoundsEnabled ? 'Click: volume · Right-click: mute' : 'Enable sound effects'}
            >
              {kidSoundsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {showSfxVolume && kidSoundsEnabled && onKidSoundsVolume && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSfxVolume(false)} />
                <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[120px]">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">🔊 Volume</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round((kidSoundsVolume || 0.4) * 100)}
                    onChange={(e) => onKidSoundsVolume(Number(e.target.value) / 100)}
                    className="w-full h-1 accent-primary"
                  />
                  <p className="text-[8px] text-muted-foreground text-center mt-0.5">{Math.round((kidSoundsVolume || 0.4) * 100)}%</p>
                  <button
                    onClick={() => { onKidSoundsToggle(false); setShowSfxVolume(false); }}
                    className="w-full mt-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    🔇 Mute
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Undo/Redo */}
        {onUndo && onRedo && (
          <>
            <div className="w-px h-3 bg-border hidden sm:block" />
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="w-px h-3 bg-border hidden sm:block" />
        {user ? (
          <>
            <span className="text-[10px] text-muted-foreground items-center gap-0.5 hidden sm:flex">
              {kidMode ? <span className="text-sm">👤</span> : <User className="w-2.5 h-2.5" />}
              {user.email?.split('@')[0]}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-2.5 h-2.5" /> <span className="hidden sm:inline">{kidMode ? 'Bye!' : 'Out'}</span>
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className={`flex items-center gap-1 transition-colors ${
              kidMode
                ? 'px-3 py-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90'
                : 'px-2 py-1 text-[10px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {kidMode ? '✨ Join' : <><LogIn className="w-2.5 h-2.5" /> Sign In</>}
          </Link>
        )}
      </div>
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
