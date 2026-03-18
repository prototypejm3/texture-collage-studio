import { Link, useLocation } from 'react-router-dom';
import { Palette, LayoutGrid, LogIn, LogOut, User, Ghost } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function NavBar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isCreate = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  return (
    <nav className="h-12 border-b border-border bg-background flex items-center px-4 gap-6 flex-shrink-0">
      <span className="text-sm font-bold tracking-tight text-foreground mr-4">
        ShadowBox
      </span>
      <Link
        to="/"
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isCreate ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Palette className="w-4 h-4" />
        Create
      </Link>
      <Link
        to="/wall"
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isWall ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        My Wall
      </Link>
      <Link
        to="/gallery"
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isGallery ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Ghost className="w-4 h-4" />
        Gallery
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {user ? (
          <>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" />
              {user.email?.split('@')[0]}
            </span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3 h-3" /> Sign Out
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
