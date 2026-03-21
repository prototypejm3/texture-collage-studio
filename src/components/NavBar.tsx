import { Link, useLocation } from 'react-router-dom';
import { Brush, Grid2x2, LogIn, LogOut, User, Landmark, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { GrownUpCheckModal } from '@/components/studio/GrownUpCheckModal';
import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

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
        <nav className="h-14 border-b-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 flex items-center px-4 gap-4 flex-shrink-0">
          {/* Brand — bear is the mode toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleKidMode}
              className="relative group"
              title="Back to Granny Land?"
            >
              <img src={logoImg} alt="Swatchbox Studio" className="w-8 h-8 object-contain" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none z-50">
                Back to Granny Land? 👵
              </span>
            </motion.button>
            <span className="text-sm font-extrabold tracking-tight text-foreground">
              Swatchbox Studio
            </span>
          </div>

          {/* Desktop nav links — playful */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold rounded-full transition-all ${
                isStudio
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
              }`}
            >
              <span className="text-base">🖍️</span>
              Create
            </Link>
            <Link
              to="/wall"
              data-nav="wall"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold rounded-full transition-all ${
                isWall
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
              }`}
            >
              <span className="text-base">🏠</span>
              My Room
            </Link>
            <Link
              to="/gallery"
              data-nav="gallery"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold rounded-full transition-all ${
                isGallery
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
              }`}
            >
              <span className="text-base">🎪</span>
              Show & Tell
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                <span className="text-xs text-muted-foreground items-center gap-1 hidden sm:flex">
                  <span className="text-sm">👤</span>
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Bye!</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
          <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleKidMode}
              className="relative group"
              title="Time for Kids Mode?"
            >
              <img src={logoImg} alt="Swatchbox Studio" className="w-7 h-7 object-contain" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none z-50">
                Time for Kids Mode? 🧒
              </span>
            </motion.button>
            Swatchbox Studio
          </span>
        </div>

        {/* Desktop nav links — clean & minimal */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              isStudio ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Brush className="w-4 h-4" />
            Create
          </Link>
          <Link
            to="/wall"
            data-nav="wall"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              isWall ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Grid2x2 className="w-4 h-4" />
            My Wall
          </Link>
          <Link
            to="/gallery"
            data-nav="gallery"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              isGallery ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Gallery
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

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