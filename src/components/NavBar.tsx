import { Link, useLocation } from 'react-router-dom';
import { Brush, Grid2x2, LogIn, LogOut, User, Landmark, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { GrownUpCheckModal } from '@/components/studio/GrownUpCheckModal';
import { motion } from 'framer-motion';
import { SwatchboxLogo } from '@/components/SwatchboxLogo';
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
           style={{ backgroundColor: 'hsl(var(--toybox-bg))', borderBottom: '1.5px solid hsl(var(--toybox-border))' }}
         >
           {/* Desktop nav links */}
           <div className="hidden md:flex items-center gap-1.5">
             <Link
               to="/"
               className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                 isStudio ? 'ring-2 ring-[hsl(var(--toybox-wood))]/40' : ''
               }`}
               style={isStudio ? { backgroundColor: 'hsl(var(--toybox-card))' } : undefined}
             >
               <SwatchboxLogo height={32} />
             </Link>
             <div className="w-px h-8" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
             <Link
               to="/wall"
               data-nav="wall"
               className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                 isWall ? 'ring-2 ring-[hsl(var(--toybox-wood))]/40' : ''
               }`}
               style={isWall ? { backgroundColor: 'hsl(var(--toybox-card))' } : undefined}
             >
               <HouseIcon />
               <span className="text-sm font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>My Room</span>
             </Link>
             <div className="w-px h-8" style={{ backgroundColor: 'hsl(var(--toybox-border))' }} />
             <Link
               to="/gallery"
               data-nav="gallery"
               className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:scale-105 ${
                 isGallery ? 'ring-2 ring-[hsl(var(--toybox-wood))]/40' : ''
               }`}
               style={isGallery ? { backgroundColor: 'hsl(var(--toybox-card))' } : undefined}
             >
               <TentIcon />
               <span className="text-sm font-medium" style={{ color: 'hsl(var(--toybox-text))' }}>Show & Tell</span>
             </Link>
           </div>

           <div className="ml-auto flex items-center gap-2">
             <button
               onClick={toggle}
               className="flex items-center gap-0.5 px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
               style={{ backgroundColor: 'hsl(var(--toybox-card))', border: '1.5px solid hsl(var(--toybox-border))' }}
               title={dark ? 'Light mode' : 'Dark mode'}
             >
               <ToyMoonIcon />
               <ToySunIcon />
             </button>

             {user ? (
               <>
                 <span className="text-xs items-center gap-1 hidden sm:flex" style={{ color: 'hsl(var(--toybox-text))' }}>
                   <span className="text-sm">👤</span>
                   {user.email?.split('@')[0]}
                 </span>
                 <button
                   onClick={() => signOut()}
                   className="flex items-center gap-1 px-2 py-1 text-xs transition-colors"
                   style={{ color: 'hsl(var(--toybox-text))' }}
                 >
                   <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Bye!</span>
                 </button>
               </>
             ) : (
               <Link
                 to="/auth"
                 className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white hover:opacity-90 transition-colors"
                 style={{ backgroundColor: 'hsl(var(--toybox-orange))' }}
               >
                 ✨ Join
               </Link>
             )}

             {/* Mode toggle pill - far right */}
             <motion.button
               whileTap={{ scale: 0.93 }}
               onClick={handleToggleKidMode}
               className="rounded-full overflow-hidden transition-all hover:scale-105"
               title="Switch to Granny Mode"
             >
               <img src={kidGrannyToggle} alt="Kids → Granny" className="h-10 w-auto" />
             </motion.button>
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
           <SwatchboxLogo height={32} />
         </div>

         <div className="hidden md:flex items-center gap-1">
           <Link to="/" title="Open the creative studio" className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${isStudio ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
             <Brush className="w-4 h-4" /> Create
           </Link>
           <Link to="/wall" data-nav="wall" title="View and arrange your artwork" className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${isWall ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
             <Grid2x2 className="w-4 h-4" /> My Studio
           </Link>
           <Link to="/gallery" data-nav="gallery" title="Browse community artwork" className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${isGallery ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
             <Landmark className="w-4 h-4" /> Showcase
           </Link>
         </div>

         <div className="ml-auto flex items-center gap-2">
           <button onClick={toggle} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
             {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
           {user ? (
             <>
               <span className="text-xs text-muted-foreground items-center gap-1 hidden sm:flex min-w-[60px]">
                 <User className="w-3 h-3" /> {user.email?.split('@')[0]}
               </span>
               <button onClick={() => signOut()} title="Sign out" className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                 <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Sign Out</span>
               </button>
             </>
           ) : (
             <Link to="/auth" title="Sign in" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
               <LogIn className="w-3 h-3" /> Sign In
             </Link>
           )}
           {/* Mode toggle - far right */}
           <button
             onClick={handleToggleKidMode}
             title="Switch to Kids Mode"
             className="px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
           >
             → 🧒
           </button>
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
