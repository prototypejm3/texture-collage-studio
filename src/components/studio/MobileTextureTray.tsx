import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { textures } from '@/data/textures';
import { TextureSwatch } from '@/types/studio';
import { ChevronDown, ChevronUp, GripHorizontal, X, Upload, Lock, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FAV_KEY = 'texture-favorites';
function loadFavs(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
function saveFavs(favs: Set<string>) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
}

interface TextureTrayProps {
  onDragStart?: (textureId: string) => void;
  onTextureClick: (textureId: string) => void;
  activeSectionId: string | null;
  customTextures: TextureSwatch[];
  onUploadTexture: (file: File) => void;
  onRemoveCustomTexture: (id: string) => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
  focusMode?: boolean;
}

type TrayState = 'hidden' | 'peek' | 'expanded';

export function TextureTray({
  onDragStart, onTextureClick, activeSectionId, customTextures,
  onUploadTexture, onRemoveCustomTexture, isPremium, onRequestUpgrade,
  focusMode = false,
}: TextureTrayProps) {
  const [state, setState] = useState<TrayState>('peek');
  const [favIds, setFavIds] = useState<Set<string>>(loadFavs);
  const [filter, setFilter] = useState<'all' | 'favs'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const toggleFav = useCallback((id: string) => {
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveFavs(next);
      return next;
    });
  }, []);

  const allTextures = [...textures, ...customTextures];
  const filtered = filter === 'favs'
    ? allTextures.filter(t => favIds.has(t.id))
    : allTextures;

  const cycle = () => {
    setState(s => s === 'hidden' ? 'peek' : s === 'peek' ? 'expanded' : 'peek');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      if (f.type.startsWith('image/')) onUploadTexture(f);
    });
    e.target.value = '';
  };

  const heights: Record<TrayState, string | number> = {
    hidden: 0,
    peek: isMobile ? 88 : 68,
    expanded: isMobile ? '50vh' : '35vh',
  };

  const focusClass = focusMode && state !== 'hidden'
    ? 'opacity-20 hover:opacity-100 transition-opacity duration-300'
    : 'transition-opacity duration-300';

  if (state === 'hidden') {
    return (
      <button
        onClick={() => setState('peek')}
        className="absolute top-1.5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full bg-popover border border-border shadow-sm text-xs font-medium text-muted-foreground active:scale-95 transition-transform"
      >
        <ChevronDown className="w-3 h-3 inline mr-1" />
        Textures
      </button>
    );
  }

  return (
    <motion.div
      className={`absolute top-0 left-0 right-0 z-40 bg-popover border-b border-border shadow-md overflow-hidden ${focusClass}`}
      animate={{ height: heights[state] }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Textures</span>
            <button
              onClick={() => setFilter(f => f === 'all' ? 'favs' : 'all')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] min-h-[32px] transition-colors ${
                filter === 'favs' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Star className="w-3 h-3" />
              {filter === 'favs' ? `★ ${favIds.size}` : 'All'}
            </button>
            <button
              onClick={() => isPremium ? fileInputRef.current?.click() : onRequestUpgrade()}
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded text-muted-foreground active:scale-90 transition-transform"
            >
              {isPremium ? <Upload className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={cycle} className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-muted-foreground active:scale-90 transition-transform">
              {state === 'expanded' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-muted-foreground active:scale-90 transition-transform">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {activeSectionId && (
          <div className="mx-2 mt-1 px-2 py-1 rounded bg-primary/10 border border-primary/20">
            <p className="text-[10px] text-primary font-medium">👆 Tap texture to fill shape</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5" style={{ WebkitOverflowScrolling: 'touch' }}>
          {state === 'peek' ? (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filtered.map(tex => (
                <SwatchButton
                  key={tex.id}
                  tex={tex}
                  isFav={favIds.has(tex.id)}
                  onToggleFav={() => toggleFav(tex.id)}
                  onClick={() => onTextureClick(tex.id)}
                  onDragStart={onDragStart}
                  onRemove={onRemoveCustomTexture}
                  compact
                  mobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <div className={`grid gap-1.5 ${isMobile ? 'grid-cols-5' : 'grid-cols-10 md:grid-cols-12 lg:grid-cols-16'}`}>
              {filtered.map(tex => (
                <SwatchButton
                  key={tex.id}
                  tex={tex}
                  isFav={favIds.has(tex.id)}
                  onToggleFav={() => toggleFav(tex.id)}
                  onClick={() => onTextureClick(tex.id)}
                  onDragStart={onDragStart}
                  onRemove={onRemoveCustomTexture}
                  mobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Handle */}
        <button onClick={cycle} className="flex justify-center py-1 shrink-0 text-muted-foreground/30 active:text-muted-foreground/60 transition-colors">
          <GripHorizontal className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function SwatchButton({ tex, isFav, onToggleFav, onClick, onDragStart, onRemove, compact, mobile }: {
  tex: TextureSwatch;
  isFav: boolean;
  onToggleFav: () => void;
  onClick: () => void;
  onDragStart?: (id: string) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
  mobile?: boolean;
}) {
  const isCustom = tex.id.startsWith('custom-');
  // Mobile: min 44px touch targets
  const size = compact
    ? (mobile ? 'w-14 h-14' : 'w-11 h-11')
    : 'aspect-square';

  return (
    <div
      className={`relative group ${compact ? 'shrink-0' : ''} cursor-grab active:cursor-grabbing`}
      draggable={!!onDragStart}
      onDragStart={(e) => {
        e.dataTransfer?.setData('textureId', tex.id);
        onDragStart?.(tex.id);
      }}
      onClick={onClick}
    >
      <div
        className={`${size} rounded-lg border border-border/40 shadow-sm active:scale-95 transition-transform`}
        style={{ background: tex.cssBackground, backgroundSize: 'cover', minWidth: mobile ? 44 : undefined, minHeight: mobile ? 44 : undefined }}
      />
      <p className={`text-muted-foreground truncate text-center leading-tight ${compact ? (mobile ? 'text-[8px] w-14 mt-0.5' : 'text-[7px] w-11 mt-px') : 'text-[8px] mt-0.5'}`}>
        {tex.name}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className={`absolute top-0.5 left-0.5 p-1 rounded-full transition-all min-w-[24px] min-h-[24px] flex items-center justify-center ${
          isFav
            ? 'bg-primary/90 text-primary-foreground opacity-100'
            : 'bg-background/70 text-muted-foreground opacity-0 group-hover:opacity-100'
        }`}
      >
        <Star className={`w-2.5 h-2.5 ${isFav ? 'fill-current' : ''}`} />
      </button>
      {isCustom && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(tex.id); }}
          className="absolute top-0.5 right-0.5 p-1 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity min-w-[24px] min-h-[24px] flex items-center justify-center"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}
