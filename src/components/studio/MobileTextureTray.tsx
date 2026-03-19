import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { textures } from '@/data/textures';
import { kidTextureNames } from '@/data/textures/kidNames';
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

  // Responsive heights
  const heights: Record<TrayState, string | number> = {
    hidden: 0,
    peek: isMobile ? 110 : 100,
    expanded: isMobile ? '50vh' : '40vh',
  };

  const focusClass = focusMode && state !== 'hidden'
    ? 'opacity-20 hover:opacity-100 transition-opacity duration-300'
    : 'transition-opacity duration-300';

  if (state === 'hidden') {
    return (
      <button
        onClick={() => setState('peek')}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-popover/90 border border-border shadow-md text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm"
      >
        <ChevronDown className="w-3 h-3 inline mr-1" />
        Textures
      </button>
    );
  }

  return (
    <motion.div
      className={`absolute top-0 left-0 right-0 z-40 bg-popover/95 backdrop-blur-sm border-b border-border shadow-lg overflow-hidden ${focusClass}`}
      animate={{ height: heights[state] }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Textures</span>
            <button
              onClick={() => setFilter(f => f === 'all' ? 'favs' : 'all')}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] transition-colors ${
                filter === 'favs' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Star className="w-2.5 h-2.5" />
              {filter === 'favs' ? `Favs (${favIds.size})` : 'All'}
            </button>
            <button
              onClick={() => isPremium ? fileInputRef.current?.click() : onRequestUpgrade()}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              {isPremium ? <Upload className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={cycle} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              {state === 'expanded' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {activeSectionId && (
          <div className="mx-2 mt-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
            <p className="text-[9px] text-primary font-medium">👆 Tap a texture to apply to the selected section</p>
          </div>
        )}

        {/* Texture content */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5">
          {state === 'peek' ? (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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
            <div className={`grid gap-1.5 ${isMobile ? 'grid-cols-5' : 'grid-cols-8 md:grid-cols-10 lg:grid-cols-12'}`}>
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

        {/* Drag handle */}
        <button onClick={cycle} className="flex justify-center py-0.5 shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors">
          <GripHorizontal className="w-5 h-5" />
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
  const size = compact ? 'w-16 h-16' : 'aspect-square';

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
        className={`${size} rounded-lg border border-border/50 shadow-sm hover:shadow-md hover:scale-105 transition-all`}
        style={{ background: tex.cssBackground, backgroundSize: 'cover' }}
      />
      <p className={`text-muted-foreground mt-0.5 truncate text-center ${compact ? 'text-[8px] w-16' : 'text-[9px]'}`}>
        {tex.name}
      </p>
      {/* Fav star */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className={`absolute top-0.5 left-0.5 p-0.5 rounded-full transition-all ${
          isFav
            ? 'bg-primary/90 text-primary-foreground opacity-100'
            : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100'
        }`}
      >
        <Star className={`w-2 h-2 ${isFav ? 'fill-current' : ''}`} />
      </button>
      {isCustom && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(tex.id); }}
          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-2 h-2" />
        </button>
      )}
    </div>
  );
}
