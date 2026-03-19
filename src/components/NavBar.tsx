import { Link, useLocation } from 'react-router-dom';
import { Brush, Grid2x2, LogIn, LogOut, User, Landmark, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

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

  return (
    <nav className="h-12 border-b border-border bg-background flex items-center px-4 gap-6 flex-shrink-0">
      <span className="text-sm font-bold tracking-tight text-foreground mr-4">
        ShadowBox
      </span>
      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-6">
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
  );
}
