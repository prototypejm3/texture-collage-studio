import { useState, useRef, useCallback, useEffect } from 'react';
import { textures } from '@/data/textures';
import { kidTextureNames } from '@/data/textures/kidNames';
import { TextureCategory, TextureSwatch, ElementShape } from '@/types/studio';
import { motion } from 'framer-motion';
import { Upload, X, Lock, Star, Grid3X3, Maximize, PenTool, RectangleHorizontal, Minus } from 'lucide-react';

function ShapeIcon({ shape }: { shape: ElementShape }) {
  const size = 14;
  switch (shape) {
    case 'soft-square':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <rect x="1" y="1" width="18" height="18" rx="3" fill="currentColor" opacity={0.8} />
        </svg>
      );
    case 'rectangle':
      return <RectangleHorizontal className="w-3.5 h-3.5" />;
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" fill="currentColor" opacity={0.8} />
        </svg>
      );
    case 'strip':
      return <Minus className="w-3.5 h-3.5" />;
    case 'torn-edge':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="0.5,0 4,1 7,0 10,1 13,0 16,1 19.5,0 20,4 19,7 20,10 19,13 20,16 19,20 16,19 13,20 10,19 7,20 4,19 0,20 1,16 0,13 1,10 0,7 1,4" fill="currentColor" opacity={0.8} />
        </svg>
      );
    case 'blob':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="7,0.5 12,0 16,1 19,4 20,8 20,13 18,17 14,19 10,20 6,19 3,17 1,13 0,9 1,5 3,2" fill="currentColor" opacity={0.8} />
        </svg>
      );
    default:
      return null;
  }
}

const shapes: { value: ElementShape; label: string; kidLabel: string }[] = [
  { value: 'soft-square', label: 'Soft Sq', kidLabel: 'Square' },
  { value: 'rectangle', label: 'Rect', kidLabel: 'Long' },
  { value: 'circle', label: 'Circle', kidLabel: 'Circle' },
  { value: 'strip', label: 'Strip', kidLabel: 'Thin' },
  { value: 'torn-edge', label: 'Torn', kidLabel: 'Ripped' },
  { value: 'blob', label: 'Blob', kidLabel: 'Blob' },
];

interface TextureGroup {
  label: string;
  kidLabel: string;
  categories: TextureCategory[];
}

const groups: TextureGroup[] = [
  { label: 'Velvet', categories: ['Royale', 'Banks', 'Prime', 'Kenley'] },
  { label: 'Soft', categories: ['Crave', 'Bentley', 'Lucky'] },
  { label: 'Linen', categories: ['Milo', 'Faithful', 'Leuven', 'Merit', 'Villa'] },
  { label: 'Durable', categories: ['Sunbrella', 'Key Largo'] },
  { label: 'Woven', categories: ['Cody', 'Bubbly', 'Synergy', 'Checker'] },
  { label: 'Textured', categories: ['Karina', 'Borough', 'Soul', 'Nepal', 'Sorrento'] },
  { label: 'Smooth', categories: ['Flat Silk', 'Tussah', 'Essence', 'Nico'] },
  { label: 'Cotton & Felt', categories: ['Taylor Felt', 'Bloke', 'Felt', 'Cotton', 'Yarn', 'Corduroy'] },
  { label: 'Leather', categories: ['Leather'] },
  { label: 'Hard', categories: ['Wood', 'Marble', 'Concrete'] },
  { label: 'Patterns', categories: ['Animal', 'Stripe', 'Grid', 'Ripple', 'Speckle', 'Tie-dye', 'Maze', 'Riviera', 'Kaplan', 'Skott'] },
  { label: 'Signature', categories: ['Alix', 'Corinne', 'Nicole', 'ShayShari', 'Suede Ace', 'Jayme', 'Byrd', 'JaymeLyn', 'Claude', 'Gemini', 'Chat', 'Bisous', 'Sunny Pup'] },
];

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

interface TextureLibraryProps {
  onDragStart: (textureId: string) => void;
  onTextureClick?: (textureId: string) => void;
  activeSectionId?: string | null;
  customTextures: TextureSwatch[];
  onUploadTexture: (file: File) => void;
  onRemoveCustomTexture: (id: string) => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
  // Background mode
  applyMode?: 'swatch' | 'background';
  onApplyModeChange?: (mode: 'swatch' | 'background') => void;
  backgroundTextureId?: string | null;
  // Shape/draw tools
  drawMode?: boolean;
  onToggleDrawMode?: () => void;
  nextShape?: ElementShape;
  onSetNextShape?: (shape: ElementShape) => void;
}

export function TextureLibrary({
  onDragStart, onTextureClick, activeSectionId,
  customTextures, onUploadTexture, onRemoveCustomTexture,
  isPremium, onRequestUpgrade,
  applyMode = 'swatch', onApplyModeChange, backgroundTextureId,
  drawMode, onToggleDrawMode, nextShape, onSetNextShape,
}: TextureLibraryProps) {
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  const [favIds, setFavIds] = useState<Set<string>>(loadFavs);

  // Sync kidMode to localStorage and broadcast to other components
  useEffect(() => {
    localStorage.setItem('kid-mode', String(kidMode));
    window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: kidMode }));
  }, [kidMode]);
  const [swatchView, setSwatchView] = useState<'swatch' | 'tiled'>('swatch');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFav = useCallback((id: string) => {
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavs(next);
      return next;
    });
  }, []);

  const allTextures = [...textures, ...customTextures];

  const activeCategories = activeGroup === 'All'
    ? null
    : activeGroup === 'Custom'
      ? ['Custom' as TextureCategory]
      : activeGroup === 'Favorites'
        ? null
        : groups.find(g => g.label === activeGroup)?.categories ?? null;

  let filtered = activeCategories
    ? allTextures.filter(t => activeCategories.includes(t.category))
    : activeGroup === 'Favorites'
      ? allTextures.filter(t => favIds.has(t.id))
      : allTextures;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      if (f.type.startsWith('image/')) onUploadTexture(f);
    });
    e.target.value = '';
  };

  const showCustomTab = customTextures.length > 0;

  return (
    <div className="h-full flex flex-col bg-card">

      <div className="px-2 py-1 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <h2 className="text-[10px] font-bold tracking-wide uppercase text-foreground">
              {kidMode ? 'Colors' : 'Textures'}
            </h2>
            {onApplyModeChange && (
              <div className="flex items-center gap-0.5 rounded bg-secondary/60 p-0.5 ml-1">
                <button
                  onClick={() => onApplyModeChange('swatch')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
                    applyMode === 'swatch' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/50 hover:text-muted-foreground'
                  }`}
                  title="Apply as swatch element"
                >
                  {kidMode ? 'Piece' : 'Swatch'}
                </button>
                <button
                  onClick={() => onApplyModeChange('background')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
                    applyMode === 'background' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/50 hover:text-muted-foreground'
                  }`}
                  title="Apply as canvas background"
                >
                  {kidMode ? 'Fill' : 'Background'}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setKidMode(!kidMode)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${kidMode ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30 scale-105' : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              title={kidMode ? 'Switch to classic names' : 'Kid-friendly names'}
            >
              🧒 Kids
            </button>
            <div className="flex items-center gap-0.5 rounded bg-secondary/60 p-0.5">
              <button
                onClick={() => setSwatchView('swatch')}
                className={`p-0.5 rounded transition-colors ${swatchView === 'swatch' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
                title="Swatch view"
              >
                <Maximize className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => setSwatchView('tiled')}
                className={`p-0.5 rounded transition-colors ${swatchView === 'tiled' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
                title="Tiled view"
              >
                <Grid3X3 className="w-2.5 h-2.5" />
              </button>
            </div>
            <button
              onClick={() => isPremium ? fileInputRef.current?.click() : onRequestUpgrade()}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded transition-colors ${
                isPremium
                  ? 'bg-secondary text-secondary-foreground hover:bg-accent'
                  : 'bg-secondary/50 text-muted-foreground/60 cursor-not-allowed'
              }`}
              title={isPremium ? 'Upload your own texture' : 'Premium feature'}
            >
              {isPremium ? <Upload className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />} {kidMode ? 'Add' : 'Upload'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {activeSectionId && (
          <div className="mb-1 px-1.5 py-1 rounded bg-primary/10 border border-primary/20">
            <p className="text-[9px] text-primary font-medium">
              {kidMode ? '👆 Tap a color to paint the piece!' : '👆 Tap a texture to fill the selected section.'}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveGroup('All')}
            className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
              activeGroup === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveGroup('Favorites')}
            className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors flex items-center gap-0.5 ${
              activeGroup === 'Favorites'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            <Star className="w-2.5 h-2.5" /> Favs
            {favIds.size > 0 && (
              <span className="text-[8px] ml-0.5 opacity-70">{favIds.size}</span>
            )}
          </button>
          {showCustomTab && (
            <button
              onClick={() => setActiveGroup('Custom')}
              className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                activeGroup === 'Custom'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              ✨ Mine
            </button>
          )}
          {groups.map(group => (
            <button
              key={group.label}
              onClick={() => setActiveGroup(group.label)}
              className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                activeGroup === group.label
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Shape & Draw tools */}
        {onToggleDrawMode && onSetNextShape && nextShape && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <button
              onClick={onToggleDrawMode}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors ${
                drawMode
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <PenTool className="w-3 h-3" />
              {kidMode ? '✏️ Draw' : 'Draw'}
            </button>
            {shapes.map(shape => (
              <button
                key={shape.value}
                onClick={() => onSetNextShape(shape.value)}
                className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                  nextShape === shape.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <ShapeIcon shape={shape.value} />
                {kidMode ? shape.kidLabel : shape.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto texture-panel p-2">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
          {filtered.map(tex => (
            <SwatchItem
              key={tex.id}
              tex={tex}
              isFav={favIds.has(tex.id)}
              onToggleFav={() => toggleFav(tex.id)}
              onDragStart={onDragStart}
              onTextureClick={onTextureClick}
              onRemoveCustomTexture={onRemoveCustomTexture}
              viewMode={swatchView}
              kidMode={kidMode}
              isActiveBackground={backgroundTextureId === tex.id}
            />
          ))}
        </div>

        {activeGroup === 'Favorites' && favIds.size === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">{kidMode ? 'No favorites yet' : 'No favorites yet'}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{kidMode ? 'Hover a color and click ★ to save it!' : 'Hover a texture and click ★ to favorite'}</p>
          </div>
        )}

        {activeGroup === 'Custom' && customTextures.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Upload className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">No custom textures yet</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Upload an image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SwatchItem({ tex, isFav, onToggleFav, onDragStart, onTextureClick, onRemoveCustomTexture, viewMode = 'swatch', kidMode = false, isActiveBackground = false }: {
  tex: TextureSwatch;
  isFav: boolean;
  onToggleFav: () => void;
  onDragStart: (id: string) => void;
  onTextureClick?: (id: string) => void;
  onRemoveCustomTexture: (id: string) => void;
  viewMode?: 'swatch' | 'tiled';
  kidMode?: boolean;
  isActiveBackground?: boolean;
}) {
  const isCustom = tex.id.startsWith('custom-');
  const isImage = isCustom || tex.cssBackground.startsWith('url(');
  const bgSize = viewMode === 'tiled'
    ? (isImage ? '60px 60px' : '40px 40px')
    : 'cover';
  const displayName = kidMode ? (kidTextureNames[tex.id] || tex.name) : tex.name;

  return (
    <motion.div
      draggable
      onDragStart={(e) => {
        (e as any).dataTransfer?.setData('textureId', tex.id);
        onDragStart(tex.id);
      }}
      onClick={() => onTextureClick?.(tex.id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-grab active:cursor-grabbing group relative"
    >
      <div
        className={`aspect-square rounded-lg overflow-hidden border shadow-sm ${isActiveBackground ? 'border-primary ring-2 ring-primary/40' : 'border-border/50'}`}
        style={{
          background: tex.cssBackground,
          backgroundSize: bgSize,
        }}
      />
      <p className="text-[10px] text-muted-foreground mt-1 truncate text-center">
        {displayName}
      </p>
      {/* Favorite star */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className={`absolute top-0.5 left-0.5 p-0.5 rounded-full transition-all ${
          isFav
            ? 'bg-primary/90 text-primary-foreground opacity-100'
            : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100'
        }`}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star className={`w-2.5 h-2.5 ${isFav ? 'fill-current' : ''}`} />
      </button>
      {isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveCustomTexture(tex.id);
          }}
          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </motion.div>
  );
}
