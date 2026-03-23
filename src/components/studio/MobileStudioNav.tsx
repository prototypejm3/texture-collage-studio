import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Props {
  kidMode: boolean;
}

export function MobileStudioBottomNav({ kidMode }: Props) {
  const location = useLocation();
  const isStudio = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const activeColor = kidMode ? '#f97316' : '#5a8a6a';
  const inactiveColor = '#94a3b8';
  const bgColor = kidMode ? '#fdf6ee' : '#faf8f5';
  const borderColor = kidMode ? '#e8ddd0' : '#e2ddd6';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] md:hidden safe-area-bottom"
      style={{ backgroundColor: bgColor, borderTop: `1px solid ${borderColor}`, height: 48 }}
    >
      <div className="flex items-center justify-around h-full">
        {/* My Room / Workspace */}
        <Link
          to="/wall"
          className="flex flex-col items-center gap-0.5 px-4 py-1 transition-transform active:scale-[0.94]"
        >
          {kidMode ? (
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M10 2L2 9H4V16H8V12H12V16H16V9H18L10 2Z" fill={isWall ? activeColor : inactiveColor}/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20">
              <rect x="1" y="1" width="18" height="18" rx="2" stroke={isWall ? activeColor : inactiveColor} strokeWidth="2" fill="none"/>
              <rect x="1" y="1" width="5" height="5" rx="1" fill={isWall ? activeColor : inactiveColor}/>
              <rect x="14" y="1" width="5" height="5" rx="1" fill={isWall ? activeColor : inactiveColor}/>
              <rect x="1" y="14" width="5" height="5" rx="1" fill={isWall ? activeColor : inactiveColor}/>
              <rect x="14" y="14" width="5" height="5" rx="1" fill={isWall ? activeColor : inactiveColor}/>
            </svg>
          )}
          <span className="text-[9px] font-medium" style={{ color: isWall ? activeColor : inactiveColor }}>
            {kidMode ? 'My Room' : 'Workspace'}
          </span>
        </Link>

        {/* Gallery / Show & Tell */}
        <Link
          to="/gallery"
          className="flex flex-col items-center gap-0.5 px-4 py-1 transition-transform active:scale-[0.94]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="10,1 1,7 19,7" fill={isGallery ? activeColor : inactiveColor}/>
            <rect x="1" y="7" width="18" height="2" fill={isGallery ? activeColor : inactiveColor} opacity="0.7"/>
            <rect x="3" y="9" width="3" height="8" rx="0.5" fill={isGallery ? activeColor : inactiveColor}/>
            <rect x="8" y="9" width="3" height="8" rx="0.5" fill={isGallery ? activeColor : inactiveColor}/>
            <rect x="14" y="9" width="3" height="8" rx="0.5" fill={isGallery ? activeColor : inactiveColor}/>
          </svg>
          <span className="text-[9px] font-medium" style={{ color: isGallery ? activeColor : inactiveColor }}>
            {kidMode ? 'Show & Tell' : 'Gallery'}
          </span>
        </Link>

        {/* Profile */}
        <Link
          to="/auth"
          className="flex flex-col items-center gap-0.5 px-4 py-1 transition-transform active:scale-[0.94]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="7" r="4" fill={inactiveColor}/>
            <ellipse cx="10" cy="18" rx="7" ry="5" fill={inactiveColor}/>
          </svg>
          <span className="text-[9px] font-medium" style={{ color: inactiveColor }}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
