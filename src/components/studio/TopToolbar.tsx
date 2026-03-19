import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FrameSize, FrameColor } from '@/types/studio';
import { FrameStyle, AmbientSound } from '@/types/wall';
import { Trash2, Download, Frame, Save, ChevronDown, Brush, Grid2x2, Landmark, LogIn, LogOut, User, Moon, Sun, Volume2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  frameSize: FrameSize;
  frameColor: FrameColor;
  wallFrameStyle: FrameStyle;
  onFrameSizeChange: (size: FrameSize) => void;
  onFrameColorChange: (color: FrameColor) => void;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
  ambientSound?: AmbientSound;
  onAmbientSoundChange?: (sound: AmbientSound) => void;
  focusMode?: boolean;
  onToggleFocusMode?: () => void;
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
}: Props) {
  const [framePanelOpen, setFramePanelOpen] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { dark, toggle } = useTheme();

  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const currentFrameLabel = frameStyleList.find(f => f.id === wallFrameStyle)?.label || 'Gold';

  return (
    <div className="flex items-center justify-between px-3 md:px-5 py-2 md:py-2.5 bg-background border-b border-border relative">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2">
          <Frame className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-tight text-foreground">ShadowBox</span>
        </div>
        {/* Desktop nav only */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isStudio ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brush className="w-4 h-4" />
            Studio
          </Link>
          <Link
            to="/wall"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isWall ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid2x2 className="w-4 h-4" />
            My Wall
          </Link>
          <Link
            to="/gallery"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isGallery ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Gallery
          </Link>
        </div>
      </div>

      {/* Center spacer */}
      <div />

      {/* Right: Listen + Auth */}
      <div className="flex items-center gap-1.5">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Listen */}
        {onAmbientSoundChange && (
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                ambientSound && ambientSound !== 'none'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {ambientSound && ambientSound !== 'none'
                  ? { gallery: 'Gallery', loft: 'Lofi Beats', home: 'Chill' }[ambientSound] ?? 'Ambiance'
                  : 'Ambiance'}
              </span>
            </button>
            {showSoundMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[130px]">
                  <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Ambiance</p>
                  {([['none', 'Off', '🔇'], ['gallery', 'Gallery', '🏛'], ['loft', 'Lofi Beats', '🎵'], ['home', 'Chill', '🏠']] as const).map(([value, label, emoji]) => (
                    <button
                      key={value}
                      onClick={() => { onAmbientSoundChange(value as AmbientSound); setShowSoundMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${
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

        <div className="w-px h-4 bg-border hidden sm:block" />
        {user ? (
          <>
            <span className="text-xs text-muted-foreground items-center gap-1 hidden sm:flex">
              <User className="w-3 h-3" />
              {user.email?.split('@')[0]}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <LogIn className="w-3 h-3" /> Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
