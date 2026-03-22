import { Link, useLocation } from 'react-router-dom';
import { Brush, Grid2x2, LogIn, LogOut, User, Landmark, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { GrownUpCheckModal } from '@/components/studio/GrownUpCheckModal';
import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';
import kidGrannyToggle from '@/assets/kid-granny-toggle.png';
import {
  HouseIcon, TentIcon,
  SunIcon as ToySunIcon, MoonIcon as ToyMoonIcon,
} from '@/components/studio/ToyboxIcons';

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

export function NavBar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { dark, toggle } = useTheme();
  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  const [showGrownUpCheck, setShowGrownUpCheck] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  const handleToggleKidMode = () => {
    if (kidMode) {
      setShowGrownUpCheck(true);
    } else {
      setKidMode(true);
      localStorage.setItem('kid-mode', 'true');
      window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: true }));
    }
  };

  // ── Kid Mode Nav ──
  if (kidMode) {
    return (
      <>
        <nav
          className="h-16 flex items-center px-4 gap-3 flex-shrink-0"
          style={{ backgroundColor: '#fdf6ee', borderBottom: '1.5px solid #e8ddd0' }}
        >
          {/* Mode toggle pill */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleToggleKidMode}
            className="flex items-center gap-0.5 px-2 py-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #9B59B6)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}
            title="Switch to Granny Mode"
          >
            <KidCrownIcon />
            <span className="text-white text-xs font-bold mx-0.5">→</span>
            <GrannyIcon />
          </motion.button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1.5">
            <div className="w-px h-8" style={{ backgroundColor: '#e8ddd0' }} />
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                isStudio ? 'ring-2 ring-[#c4956a]/40' : ''
              }`}
              style={isStudio ? { backgroundColor: '#f7f0e8' } : undefined}
            >
              <HouseIcon />
              <span className="text-sm font-medium" style={{ color: '#6b4c2a' }}>Create</span>
            </Link>
            <div className="w-px h-8" style={{ backgroundColor: '#e8ddd0' }} />
            <Link
              to="/wall"
              data-nav="wall"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                isWall ? 'ring-2 ring-[#c4956a]/40' : ''
              }`}
              style={isWall ? { backgroundColor: '#f7f0e8' } : undefined}
            >
              <HouseIcon />
              <span className="text-sm font-medium" style={{ color: '#6b4c2a' }}>My Room</span>
            </Link>
            <div className="w-px h-8" style={{ backgroundColor: '#e8ddd0' }} />
            <Link
              to="/gallery"
              data-nav="gallery"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                isGallery ? 'ring-2 ring-[#c4956a]/40' : ''
              }`}
              style={isGallery ? { backgroundColor: '#f7f0e8' } : undefined}
            >
              <TentIcon />
              <span className="text-sm font-medium" style={{ color: '#6b4c2a' }}>Show & Tell</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex items-center gap-0.5 px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: dark ? '#3a3020' : '#f7f0e8', border: '1.5px solid #e8ddd0' }}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              <ToyMoonIcon />
              <ToySunIcon />
            </button>

            {user ? (
              <>
                <span className="text-xs items-center gap-1 hidden sm:flex" style={{ color: '#6b4c2a' }}>
                  <span className="text-sm">👤</span>
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 px-2 py-1 text-xs transition-colors"
                  style={{ color: '#6b4c2a' }}
                >
                  <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Bye!</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#f97316' }}
              >
                ✨ Join
              </Link>
            )}
          </div>
        </nav>
        <GrownUpCheckModal
          isOpen={showGrownUpCheck}
          onClose={() => setShowGrownUpCheck(false)}
          onSuccess={() => {
            setShowGrownUpCheck(false);
            setKidMode(false);
            localStorage.setItem('kid-mode', 'false');
            window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: false }));
          }}
        />
      </>
    );
  }

  // ── Granny Mode Nav ──
  return (
    <>
      <nav className="h-12 border-b border-border bg-background flex items-center px-4 gap-6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="Swatchbox Studio" className="w-7 h-7 object-contain" />
          <span className="text-sm font-bold tracking-tight text-foreground">
            Swatchbox Studio
          </span>
          <button
            onClick={handleToggleKidMode}
            title="Switch to Kids Mode"
            className="px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          >
            → 🧒
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1">
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

        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggle} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <>
              <span className="text-xs text-muted-foreground items-center gap-1 hidden sm:flex">
                <User className="w-3 h-3" /> {user.email?.split('@')[0]}
              </span>
              <button onClick={() => signOut()} title="Sign out" className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <Link to="/auth" title="Sign in" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <LogIn className="w-3 h-3" /> Sign In
            </Link>
          )}
        </div>
      </nav>
      <GrownUpCheckModal
        isOpen={showGrownUpCheck}
        onClose={() => setShowGrownUpCheck(false)}
        onSuccess={() => {
          setShowGrownUpCheck(false);
          setKidMode(false);
          localStorage.setItem('kid-mode', 'false');
          window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: false }));
        }}
      />
    </>
  );
}
