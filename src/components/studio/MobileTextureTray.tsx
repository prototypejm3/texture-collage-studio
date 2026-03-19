import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { textures } from '@/data/textures';
import { kidTextureNames } from '@/data/textures/kidNames';
import { TextureSwatch } from '@/types/studio';
import { ChevronDown, ChevronUp, GripHorizontal, X, Upload, Lock, Star } from 'lucide-react';

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

interface MobileTextureTrayProps {
  onTextureClick: (textureId: string) => void;
  activeSectionId: string | null;
  customTextures: TextureSwatch[];
  onUploadTexture: (file: File) => void;
  onRemoveCustomTexture: (id: string) => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
}

type TrayState = 'hidden' | 'peek' | 'expanded';

export function MobileTextureTray({
  onTextureClick, activeSectionId, customTextures,
  onUploadTexture, onRemoveCustomTexture, isPremium, onRequestUpgrade,
}: MobileTextureTrayProps) {
  const [state, setState] = useState<TrayState>('peek');
  const [favIds, setFavIds] = useState<Set<string>>(loadFavs);
  const [filter, setFilter] = useState<'all' | 'favs'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    peek: 120,
    expanded: '55vh',
  };

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-40 bg-popover border-b border-border shadow-lg rounded-b-xl overflow-hidden"
      animate={{ height: heights[state] }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Content area */}
      <div className="flex flex-col h-full">
        {/* Mini toolbar */}
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
              {filter === 'favs' ? 'Favs' : 'All'}
            </button>
            <button
              onClick={() => isPremium ? fileInputRef.current?.click() : onRequestUpgrade()}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] bg-secondary text-muted-foreground"
            >
              {isPremium ? <Upload className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={cycle} className="p-1 text-muted-foreground">
              {state === 'expanded' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-1 text-muted-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {activeSectionId && state !== 'hidden' && (
          <div className="mx-2 mt-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
            <p className="text-[9px] text-primary font-medium">👆 Tap a texture to apply</p>
          </div>
        )}

        {/* Scrollable texture grid */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5">
          {state === 'peek' ? (
            /* Horizontal scroll in peek mode */
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filtered.slice(0, 30).map(tex => (
                <button
                  key={tex.id}
                  onClick={() => onTextureClick(tex.id)}
                  className="shrink-0 relative group"
                >
                  <div
                    className="w-16 h-16 rounded-lg border border-border/50 shadow-sm"
                    style={{ background: tex.cssBackground, backgroundSize: 'cover' }}
                  />
                  <p className="text-[8px] text-muted-foreground mt-0.5 truncate w-16 text-center">{tex.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(tex.id); }}
                    className={`absolute top-0.5 left-0.5 p-0.5 rounded-full transition-all ${
                      favIds.has(tex.id)
                        ? 'bg-primary/90 text-primary-foreground opacity-100'
                        : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-70'
                    }`}
                  >
                    <Star className={`w-2 h-2 ${favIds.has(tex.id) ? 'fill-current' : ''}`} />
                  </button>
                </button>
              ))}
            </div>
          ) : (
            /* Grid in expanded mode */
            <div className="grid grid-cols-5 gap-1.5">
              {filtered.map(tex => (
                <button
                  key={tex.id}
                  onClick={() => onTextureClick(tex.id)}
                  className="relative group"
                >
                  <div
                    className="aspect-square rounded-lg border border-border/50 shadow-sm"
                    style={{ background: tex.cssBackground, backgroundSize: 'cover' }}
                  />
                  <p className="text-[8px] text-muted-foreground mt-0.5 truncate text-center">{tex.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(tex.id); }}
                    className={`absolute top-0.5 left-0.5 p-0.5 rounded-full transition-all ${
                      favIds.has(tex.id)
                        ? 'bg-primary/90 text-primary-foreground opacity-100'
                        : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-70'
                    }`}
                  >
                    <Star className={`w-2 h-2 ${favIds.has(tex.id) ? 'fill-current' : ''}`} />
                  </button>
                  {tex.id.startsWith('custom-') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveCustomTexture(tex.id); }}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drag handle at bottom */}
        <button
          onClick={cycle}
          className="flex justify-center py-1 shrink-0 text-muted-foreground/40"
        >
          <GripHorizontal className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
