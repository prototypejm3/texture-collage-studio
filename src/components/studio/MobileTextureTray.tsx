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
    peek: isMobile ? 72 : 68,
    expanded: isMobile ? '45vh' : '35vh',
  };

  const focusClass = focusMode && state !== 'hidden'
    ? 'opacity-20 hover:opacity-100 transition-opacity duration-300'
    : 'transition-opacity duration-300';

  if (state === 'hidden') {
    return (
      <button
        onClick={() => setState('peek')}
        className="absolute top-1.5 left-1/2 -translate-x-1/2 z-40 px-2.5 py-1 rounded-full bg-popover border border-border shadow-sm text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className="w-2.5 h-2.5 inline mr-0.5" />
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
        <div className="flex items-center justify-between px-2 py-1 shrink-0 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Textures</span>
            <button
              onClick={() => setFilter(f => f === 'all' ? 'favs' : 'all')}
              className={`flex items-center gap-0.5 px-1.5 py-px rounded-full text-[8px] transition-colors ${
                filter === 'favs' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Star className="w-2 h-2" />
              {filter === 'favs' ? `★ ${favIds.size}` : 'All'}
            </button>
            <button
              onClick={() => isPremium ? fileInputRef.current?.click() : onRequestUpgrade()}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              {isPremium ? <Upload className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={cycle} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
              {state === 'expanded' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {activeSectionId && (
          <div className="mx-2 mt-0.5 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
            <p className="text-[8px] text-primary font-medium">👆 Tap texture to apply</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1">
          {state === 'peek' ? (
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
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
                />
              ))}
            </div>
          ) : (
            <div className={`grid gap-1 ${isMobile ? 'grid-cols-6' : 'grid-cols-10 md:grid-cols-12 lg:grid-cols-16'}`}>
              {filtered.map(tex => (
                <SwatchButton
                  key={tex.id}
                  tex={tex}
                  isFav={favIds.has(tex.id)}
                  onToggleFav={() => toggleFav(tex.id)}
                  onClick={() => onTextureClick(tex.id)}
                  onDragStart={onDragStart}
                  onRemove={onRemoveCustomTexture}
                />
              ))}
            </div>
          )}
        </div>

        {/* Handle */}
        <button onClick={cycle} className="flex justify-center py-px shrink-0 text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors">
          <GripHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function SwatchButton({ tex, isFav, onToggleFav, onClick, onDragStart, onRemove, compact }: {
  tex: TextureSwatch;
  isFav: boolean;
  onToggleFav: () => void;
  onClick: () => void;
  onDragStart?: (id: string) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}) {
  const isCustom = tex.id.startsWith('custom-');
  const size = compact ? 'w-11 h-11' : 'aspect-square';

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
        className={`${size} rounded-md border border-border/40 shadow-sm hover:shadow hover:scale-105 transition-all`}
        style={{ background: tex.cssBackground, backgroundSize: 'cover' }}
      />
      <p className={`text-muted-foreground truncate text-center leading-tight ${compact ? 'text-[7px] w-11 mt-px' : 'text-[7px] mt-px'}`}>
        {tex.name}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className={`absolute top-px left-px p-px rounded-full transition-all ${
          isFav
            ? 'bg-primary/90 text-primary-foreground opacity-100'
            : 'bg-background/70 text-muted-foreground opacity-0 group-hover:opacity-100'
        }`}
      >
        <Star className={`w-1.5 h-1.5 ${isFav ? 'fill-current' : ''}`} />
      </button>
      {isCustom && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(tex.id); }}
          className="absolute top-px right-px p-px rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-1.5 h-1.5" />
        </button>
      )}
    </div>
  );
}
