import { Link, useLocation } from 'react-router-dom';
import { Palette, LayoutGrid } from 'lucide-react';

export function NavBar() {
  const location = useLocation();
  const isCreate = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';

  return (
    <nav className="h-12 border-b border-border bg-card flex items-center px-4 gap-6 flex-shrink-0">
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
    </nav>
  );
}
