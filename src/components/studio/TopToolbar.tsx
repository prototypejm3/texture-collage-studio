import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FrameSize, FrameColor } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { Trash2, Download, Frame, Save, ChevronDown, Palette, LayoutGrid, Ghost, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  frameSize: FrameSize;
  frameColor: FrameColor;
  wallFrameStyle: FrameStyle;
  onFrameSizeChange: (size: FrameSize) => void;
  onFrameColorChange: (color: FrameColor) => void;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveToWall?: () => void;
}

const frameStyleList: { id: FrameStyle; label: string }[] = [
  { id: 'gold', label: 'Gold' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'copper', label: 'Copper' },
  { id: 'silver', label: 'Silver' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'shadow-box', label: 'Shadow Box' },
  { id: 'wood', label: 'Wood' },
  { id: 'floating', label: 'Floating' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'none', label: 'None' },
];

export function TopToolbar({
  wallFrameStyle,
  onWallFrameStyleChange,
  onClear, onSave, onSaveToWall,
}: Props) {
  const [framePanelOpen, setFramePanelOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isCreate = location.pathname === '/' || location.pathname === '/create';
  const isWall = location.pathname === '/wall';
  const isGallery = location.pathname === '/gallery';

  const currentFrameLabel = frameStyleList.find(f => f.id === wallFrameStyle)?.label || 'Gold';

  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-background border-b border-border relative">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Frame className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-tight text-foreground">ShadowBox</span>
        </div>
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
      </div>

      {/* Center spacer */}
      <div />

      {/* Right: Auth */}
      <div className="flex items-center gap-1.5">
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
    </div>
  );
}
