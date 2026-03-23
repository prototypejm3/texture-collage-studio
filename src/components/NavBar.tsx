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

// ── Kid face SVG ──
function KidFace({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="10" cy="10" r="6" fill="#c4956a" />
      <circle cx="10" cy="10" r="3.5" fill="#dbb896" />
      <circle cx="30" cy="10" r="6" fill="#c4956a" />
      <circle cx="30" cy="10" r="3.5" fill="#dbb896" />
      <circle cx="20" cy="22" r="14" fill="#c4956a" />
      <circle cx="20" cy="24" r="10" fill="#dbb896" />
      <circle cx="15" cy="22" r="2" fill="#3d2b1f" />
      <circle cx="25" cy="22" r="2" fill="#3d2b1f" />
      <circle cx="15.7" cy="21.3" r="0.7" fill="white" />
      <circle cx="25.7" cy="21.3" r="0.7" fill="white" />
      <ellipse cx="20" cy="25" rx="2.5" ry="1.8" fill="#3d2b1f" />
      <path d="M17 27 Q20 30 23 27" fill="none" stroke="#3d2b1f" strokeWidth="1.2" strokeLinecap="round" />
      <polygon points="12,11 14,4 17,9 20,3 23,9 26,4 28,11" fill="#fbbf24" />
      <circle cx="15.5" cy="8" r="1" fill="#e05c5c" />
      <circle cx="20" cy="5.5" r="1" fill="#e05c5c" />
      <circle cx="24.5" cy="8" r="1" fill="#e05c5c" />
    </svg>
  );
}

// ── Granny face SVG ──
function GrannyFace({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="8" r="5" fill="#a0a0a0" />
      <circle cx="18" cy="6" r="1.2" fill="#fbbf24" />
      <circle cx="22" cy="6" r="1.2" fill="#fbbf24" />
      <circle cx="8" cy="18" r="4" fill="#a0a0a0" />
      <circle cx="32" cy="18" r="4" fill="#a0a0a0" />
      <circle cx="20" cy="22" r="13" fill="#dbb896" />
      <rect x="10" y="18" width="8" height="6" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="1.8" />
      <rect x="22" y="18" width="8" height="6" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="1.8" />
      <line x1="18" y1="21" x2="22" y2="21" stroke="#5a8a6a" strokeWidth="1.5" />
      <circle cx="14" cy="21" r="1.5" fill="#3d2b1f" />
      <circle cx="26" cy="21" r="1.5" fill="#3d2b1f" />
      <path d="M16 27 Q20 30 24 27" fill="none" stroke="#3d2b1f" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ── Mode toggle pill ──
function ModeTogglePill({ kidMode, onClick }: { kidMode: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="flex items-center rounded-full overflow-hidden flex-shrink-0 transition-all hover:scale-105"
      style={{
        backgroundColor: '#5a8a6a',
        width: 96,
        height: 44,
        padding: 3,
      }}
      title={kidMode ? 'Switch to Granny Mode' : 'Switch to Kids Mode'}
    >
      {/* Kid side */}
      <div
        className="flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          width: 38,
          height: 38,
          backgroundColor: kidMode ? '#dfe8df' : 'transparent',
          boxShadow: kidMode ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <KidFace size={kidMode ? 28 : 22} />
      </div>
      {/* Arrow — points toward the other mode */}
      <div className="flex-1 flex items-center justify-center">
        <svg width="14" height="10" viewBox="0 0 16 10" fill="none" style={{ transform: kidMode ? 'none' : 'scaleX(-1)' }}>
          <line x1="2" y1="5" x2="12" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <polyline points="10,2 13,5 10,8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
        </svg>
      </div>
      {/* Granny side */}
      <div
        className="flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          width: 38,
          height: 38,
          backgroundColor: !kidMode ? '#dfe8df' : 'transparent',
          boxShadow: !kidMode ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <GrannyFace size={!kidMode ? 28 : 22} />
      </div>
    </motion.button>
  );
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
              <ModeTogglePill kidMode={kidMode} onClick={handleToggleKidMode} />
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

  const pressStyle = 'transition-transform active:scale-[0.96]';

  // ── Granny Mode Nav ──
  return (
    <>
       <nav className="h-14 border-b border-border flex items-center px-4 gap-3 flex-shrink-0" style={{ backgroundColor: dark ? 'hsl(var(--background))' : '#faf8f5' }}>
         <div className="flex items-center gap-2.5">
           <Link to="/" className={`${pressStyle}`} title="Swatchbox Studio">
             <SwatchboxLogo height={32} />
           </Link>
         </div>

         <div className="hidden md:flex items-center gap-1">
            {/* Workspace */}
            <Link to="/"
              className={`${pressStyle} flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] font-bold text-[13px] ${
                isStudio ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              style={isStudio ? { backgroundColor: '#5a8a6a' } : undefined}
              title="Workspace"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" fill={isStudio ? 'white' : '#94a3b8'}/>
              </svg>
              Workspace
            </Link>

            <div className="w-px h-5 bg-border mx-0.5" />

            {/* Studio */}
            <Link to="/wall" data-nav="wall"
              className={`${pressStyle} flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] font-bold text-[13px] ${
                isWall ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              style={isWall ? { backgroundColor: '#5a8a6a' } : undefined}
              title="Studio"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="2" stroke={isWall ? 'white' : '#5a8a6a'} strokeWidth="2.5" fill="none"/>
                <rect x="1" y="1" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="14" y="1" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="1" y="14" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="14" y="14" width="5" height="5" rx="1" fill={isWall ? 'white' : '#7aaa8a'}/>
                <rect x="5" y="5" width="10" height="10" fill={isWall ? '#5a8a6a' : 'white'}/>
              </svg>
              Studio
            </Link>

           <div className="w-px h-5 bg-border mx-0.5" />

           {/* Showcase */}
           <Link to="/gallery" data-nav="gallery"
             className={`${pressStyle} flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] font-bold text-[13px] ${
               isGallery ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
             }`}
             style={isGallery ? { backgroundColor: '#5a8a6a' } : undefined}
             title="Showcase"
           >
             <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
               <polygon points="10,1 1,7 19,7" fill={isGallery ? 'white' : '#5a8a6a'}/>
               <rect x="1" y="7" width="18" height="2" fill={isGallery ? 'rgba(255,255,255,0.7)' : '#3d6a4a'}/>
               <rect x="3" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
               <rect x="7" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
               <rect x="11" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
               <rect x="15" y="9" width="3" height="8" rx="0.5" fill={isGallery ? 'rgba(255,255,255,0.8)' : '#7aaa8a'}/>
               <rect x="1" y="17" width="18" height="2" rx="0.5" fill={isGallery ? 'white' : '#5a8a6a'}/>
             </svg>
             Showcase
           </Link>
         </div>

         <div className="ml-auto flex items-center gap-2">
           {/* Light/Dark Toggle */}
           <button onClick={toggle}
             className={`${pressStyle} relative flex items-center rounded-[10px] overflow-hidden flex-shrink-0`}
             style={{ width: 36, height: 20, backgroundColor: dark ? '#4a5568' : '#3d3530' }}
             title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
           >
             <svg width="10" height="10" viewBox="0 0 12 12" className="absolute left-1.5 top-1/2 -translate-y-1/2">
               <circle cx="6" cy="6" r="5" fill="#5a4a3a"/>
               <circle cx="8" cy="4" r="4" fill="#faf8f5"/>
             </svg>
             <svg width="10" height="10" viewBox="0 0 12 12" className="absolute right-1.5 top-1/2 -translate-y-1/2">
               <circle cx="6" cy="6" r="3.5" fill="#fbbf24"/>
             </svg>
             <div className="absolute w-4 h-4 rounded-full bg-white/90 shadow-sm transition-all duration-200 top-0.5"
               style={{ left: dark ? 2 : 18 }}
             />
           </button>

           {user ? (
             <>
               <span className="items-center gap-1 hidden sm:flex min-w-[60px] text-foreground" style={{ fontSize: 12, fontFamily: 'system-ui,sans-serif' }}>
                 <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                   <circle cx="8" cy="5" r="4" fill="#94a3b8"/>
                   <ellipse cx="8" cy="14" rx="6" ry="4" fill="#94a3b8"/>
                 </svg>
                 <span className="truncate max-w-[80px]">{user.email?.split('@')[0]}</span>
               </span>
               <button onClick={() => signOut()} title="Sign out"
                 className={`${pressStyle} flex items-center gap-1 px-1.5 py-1 flex-shrink-0 text-muted-foreground`}
                 style={{ fontSize: 11, fontFamily: 'system-ui,sans-serif' }}
               >
                 <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Out</span>
               </button>
             </>
           ) : (
             <Link to="/auth" title="Sign in"
               className={`${pressStyle} flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-[20px] text-white`}
               style={{ backgroundColor: '#5a8a6a' }}
             >Sign In</Link>
           )}

            {/* Mode Toggle Pill — far right */}
            <ModeTogglePill kidMode={kidMode} onClick={handleToggleKidMode} />
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
