import { Link, useLocation } from 'react-router-dom';
import { Brush, Grid2x2, Landmark } from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();
  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
            isStudio ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Brush className="w-5 h-5" />
          <span className="text-[10px] font-medium">Studio</span>
        </Link>
        <Link
          to="/wall"
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
            isWall ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Grid2x2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">My Wall</span>
        </Link>
        <Link
          to="/gallery"
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
            isGallery ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Landmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">Gallery</span>
        </Link>
      </div>
    </nav>
  );
}
