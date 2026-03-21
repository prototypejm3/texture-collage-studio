import { Link, useLocation } from 'react-router-dom';
import { Brush, Grid2x2, Landmark, Scissors, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MobileBottomNavProps {
  onOpenBuild?: () => void;
  onOpenContext?: () => void;
  buildOpen?: boolean;
  contextOpen?: boolean;
}

export function MobileBottomNav({ onOpenBuild, onOpenContext, buildOpen, contextOpen }: MobileBottomNavProps) {
  const location = useLocation();
  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  // ── Kid Mode Mobile Nav ──
  if (kidMode) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-background to-background border-t-2 border-primary/20 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {isStudio && onOpenBuild ? (
            <>
              <button
                onClick={onOpenBuild}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  buildOpen ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-xl">🧰</span>
                <span className="text-[10px] font-bold">Stuff</span>
              </button>
              <Link
                to="/"
                className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-primary"
              >
                <span className="text-xl">🖍️</span>
                <span className="text-[10px] font-bold">Create</span>
              </Link>
              <button
                onClick={onOpenContext}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  contextOpen ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-xl">✨</span>
                <span className="text-[10px] font-bold">Magic</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  isStudio ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-xl">🖍️</span>
                <span className="text-[10px] font-bold">Create</span>
              </Link>
              <Link
                to="/wall"
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  isWall ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-xl">🏠</span>
                <span className="text-[10px] font-bold">My Room</span>
              </Link>
              <Link
                to="/gallery"
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                  isGallery ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className="text-xl">🎪</span>
                <span className="text-[10px] font-bold">Show & Tell</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    );
  }

  // ── Adult Mode Mobile Nav ──
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {isStudio && onOpenBuild ? (
          <>
            <button
              onClick={onOpenBuild}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                buildOpen ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Scissors className="w-5 h-5" />
              <span className="text-[10px] font-medium">Build</span>
            </button>
            <Link
              to="/"
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-primary"
            >
              <Brush className="w-5 h-5" />
              <span className="text-[10px] font-medium">Create</span>
            </Link>
            <button
              onClick={onOpenContext}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                contextOpen ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[10px] font-medium">Context</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                isStudio ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Brush className="w-5 h-5" />
              <span className="text-[10px] font-medium">Create</span>
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
              <span className="text-[10px] font-medium">Show & Tell</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}