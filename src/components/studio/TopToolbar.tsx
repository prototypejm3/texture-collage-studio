import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FrameStyle, AmbientSound } from '@/types/wall';
import { Trash2, Download, Frame, Save, ChevronDown, Brush, Grid2x2, Landmark, LogIn, LogOut, User, Moon, Sun, Ear, Sparkles, Volume2, VolumeX, Undo2, Redo2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GrownUpCheckModal } from './GrownUpCheckModal';
import { AiWelcomeModal } from './AiWelcomeModal';
import logoImg from '@/assets/logo.png';
import {
  KidCrownIcon, GrannyIcon, HouseIcon, TentIcon,
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

  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const currentFrameLabel = frameStyleList.find(f => f.id === wallFrameStyle)?.label || 'Gold';

  return (
    <>
    <div className={`flex items-center px-2 md:px-4 relative ${
      kidMode
        ? 'h-[64px] border-b border-[#e8ddd0]'
        : 'py-1 md:py-1.5 bg-background border-b border-border'
    }`}
    style={kidMode ? { backgroundColor: '#fdf6ee' } : undefined}
    >
      {/* Left: Mode toggle + Create + Nav */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Kid Mode Toggle */}
        {kidMode ? (
          <button
            onClick={handleKidToggle}
            className="flex items-center gap-0.5 px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #9B59B6)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}
            title="Switch to Granny Mode"
          >
            <KidCrownIcon />
            <span className="text-white text-xs font-bold mx-0.5">→</span>
            <GrannyIcon />
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

        {kidMode && (
          <>
            {/* Create button */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 ${
                isStudio ? 'ring-2 ring-white/40' : ''
              }`}
              style={{ backgroundColor: '#f97316' }}
            >
              <PencilIcon />
              Create
            </Link>

            {/* Divider */}
            <div className="w-px h-8 hidden md:block" style={{ backgroundColor: '#e8ddd0' }} />

            {/* My Room */}
            <Link
              to="/wall"
              data-nav="wall"
              className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isWall ? 'ring-2 ring-[#c4956a]/40' : ''
              }`}
              style={isWall ? { backgroundColor: '#f7f0e8' } : undefined}
            >
              <HouseIcon />
              <span className="text-sm font-medium" style={{ color: '#6b4c2a' }}>My Room</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-8 hidden md:block" style={{ backgroundColor: '#e8ddd0' }} />

            {/* Show & Tell */}
            <Link
              to="/gallery"
              data-nav="gallery"
              className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                isGallery ? 'ring-2 ring-[#c4956a]/40' : ''
              }`}
              style={isGallery ? { backgroundColor: '#f7f0e8' } : undefined}
            >
              <TentIcon />
              <span className="text-sm font-medium" style={{ color: '#6b4c2a' }}>Show & Tell</span>
            </Link>
          </>
        )}

        {!kidMode && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <img src={logoImg} alt="Swatchbox Studio" className="w-6 h-6 object-contain" />
              <span className="font-bold tracking-tight text-foreground text-xs">Swatchbox Studio</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Link to="/" title="Open the creative studio" className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${isStudio ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                <Brush className="w-4 h-4" /> Create
              </Link>
              <Link to="/wall" data-nav="wall" title="View and arrange your artwork" className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${isWall ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                <Grid2x2 className="w-4 h-4" /> My Wall
              </Link>
              <Link to="/gallery" data-nav="gallery" title="Browse community artwork" className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${isGallery ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                <Landmark className="w-4 h-4" /> Gallery
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* AI Toggle - Sparkle */}
        {kidMode ? (
          <button
            onClick={handleAiToggle}
            className={`p-1 rounded-lg transition-all hover:scale-110 active:scale-90 ${
              aiEnabled ? 'opacity-100' : 'opacity-40'
            }`}
            title={aiEnabled ? 'AI Stencils (on)' : 'AI Stencils (off)'}
          >
            <SparkleIcon />
          </button>
        ) : (
          <button
            onClick={handleAiToggle}
            className={`p-1.5 rounded-md transition-colors ${
              aiEnabled ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title={aiEnabled ? 'AI Stencils (on)' : 'AI Stencils (off)'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* Light/Dark Toggle */}
        {kidMode ? (
          <button
            onClick={toggle}
            className="flex items-center gap-0.5 px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: dark ? '#3a3020' : '#f7f0e8', border: '1.5px solid #e8ddd0' }}
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            <ToyMoonIcon />
            <ToySunIcon />
          </button>
        ) : (
          <button
            onClick={toggle}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* Music */}
        {onAmbientSoundChange && (
          <div className="relative">
            {kidMode ? (
              <button
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                className={`p-1 rounded-lg transition-all hover:scale-110 active:scale-90 ${
                  ambientSound && ambientSound !== 'none' ? 'opacity-100' : 'opacity-50'
                }`}
                title="Music"
              >
                <MusicNoteIcon />
              </button>
            ) : (
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
            )}
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

        {/* Sound FX - Kid mode only */}
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
              className="p-0.5 rounded-full transition-all hover:scale-110 active:scale-90"
              style={{ backgroundColor: kidSoundsEnabled ? '#fce4e4' : 'transparent' }}
              title={kidSoundsEnabled ? 'Click: volume · Right-click: mute' : 'Enable sound effects'}
            >
              <SpeakerIcon />
            </button>
            {showSfxVolume && kidSoundsEnabled && onKidSoundsVolume && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSfxVolume(false)} />
                <div className="absolute right-0 top-full z-50 mt-0.5 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[120px]">
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">🔊 Volume</p>
                  <input type="range" min={0} max={100} step={5}
                    value={Math.round((kidSoundsVolume || 0.4) * 100)}
                    onChange={(e) => onKidSoundsVolume(Number(e.target.value) / 100)}
                    className="w-full h-1 accent-primary" />
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

        {/* Divider */}
        <div className={kidMode ? 'w-px h-6 hidden sm:block' : 'w-px h-3 bg-border hidden sm:block'} style={kidMode ? { backgroundColor: '#e8ddd0' } : undefined} />

        {/* Start Over */}
        {kidMode ? (
          <button onClick={onClear} className="flex items-center gap-1 px-1.5 py-1 rounded-lg transition-all hover:scale-105 active:scale-95" title="Start Over">
            <TrashCanIcon />
            <span className="hidden sm:inline text-xs font-medium" style={{ color: '#6b4c2a' }}>Start Over</span>
          </button>
        ) : (
          <button onClick={onClear} className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Start Over">
            <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">Start Over</span>
          </button>
        )}

        {/* Save */}
        {onSaveToWall && (kidMode ? (
          <button onClick={onSaveToWall} className="flex items-center gap-1 px-1.5 py-1 rounded-lg transition-all hover:scale-105 active:scale-95" title="Save">
            <SaveBoxIcon />
            <span className="hidden sm:inline text-xs font-medium" style={{ color: '#6b4c2a' }}>Save</span>
          </button>
        ) : (
          <button onClick={onSaveToWall} className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-foreground hover:bg-secondary rounded-md transition-colors" title="Save">
            <Save className="w-3 h-3" /> <span className="hidden sm:inline">Save</span>
          </button>
        ))}

        {/* Download */}
        {kidMode ? (
          <button onClick={onSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: '#f97316' }} title="Download">
            <DownloadTrayIcon />
            <span className="hidden sm:inline">Download</span>
          </button>
        ) : (
          <button onClick={onSave} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" title="Download">
            <Download className="w-3 h-3" /> <span className="hidden sm:inline">Download</span>
          </button>
        )}

        {/* Undo/Redo */}
        {onUndo && onRedo && (
          <>
            <div className={kidMode ? 'w-px h-6 hidden sm:block' : 'w-px h-3 bg-border hidden sm:block'} style={kidMode ? { backgroundColor: '#e8ddd0' } : undefined} />
            <button onClick={onUndo} disabled={!canUndo} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none" title="Undo (Ctrl+Z)">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={onRedo} disabled={!canRedo} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none" title="Redo (Ctrl+Shift+Z)">
              <Redo2 className="w-4 h-4" />
            </button>
          </>
        )}

        {!kidMode && <div className="w-px h-3 bg-border hidden sm:block" />}
        {user ? (
          <>
            <span className="text-[10px] text-muted-foreground items-center gap-0.5 hidden sm:flex">
              {kidMode ? <span className="text-sm">👤</span> : <User className="w-2.5 h-2.5" />}
              {user.email?.split('@')[0]}
            </span>
            <button onClick={() => signOut()} className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-2.5 h-2.5" /> <span className="hidden sm:inline">{kidMode ? 'Bye!' : 'Out'}</span>
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className={`flex items-center gap-1 transition-colors ${
              kidMode
                ? 'px-3 py-1.5 text-xs font-bold rounded-full text-white hover:opacity-90'
                : 'px-2 py-1 text-[10px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            style={kidMode ? { backgroundColor: '#f97316' } : undefined}
          >
            {kidMode ? '✨ Join' : <><LogIn className="w-2.5 h-2.5" /> Sign In</>}
          </Link>
        )}
      </div>
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

        {/* Actions: Start Over, Save, Download */}
        <div className="w-px h-3 bg-border hidden sm:block" />
        <button
          onClick={onClear}
          className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          title="Start Over"
        >
          <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">{kidMode ? 'Start Over' : 'Start Over'}</span>
        </button>
        {onSaveToWall && (
          <button
            onClick={onSaveToWall}
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-foreground hover:bg-secondary rounded-md transition-colors"
            title="Save"
          >
            <Save className="w-3 h-3" /> <span className="hidden sm:inline">Save</span>
          </button>
        )}
        <button
          onClick={onSave}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title="Download"
        >
          <Download className="w-3 h-3" /> <span className="hidden sm:inline">Download</span>
        </button>

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
