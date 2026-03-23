import { useState, useRef, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { textures } from '@/data/textures';
import { kidTextureNames } from '@/data/textures/kidNames';
import { kidColorOrder } from '@/data/textures/kidColorOrder';
import { TextureCategory, TextureSwatch, ElementShape } from '@/types/studio';
import { motion } from 'framer-motion';
import { Upload, X, Lock, Star, Grid3X3, Maximize, PenTool, RectangleHorizontal, Minus } from 'lucide-react';
import { GrownUpCheckModal } from './GrownUpCheckModal';

export function ShapeIcon({ shape }: { shape: ElementShape }) {
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

// Adult mode: 12 detailed groups
const adultGroups: TextureGroup[] = [
  { label: 'Velvet', kidLabel: '', categories: ['Royale', 'Banks', 'Prime', 'Kenley'] },
  { label: 'Soft', kidLabel: '', categories: ['Crave', 'Bentley', 'Lucky'] },
  { label: 'Linen', kidLabel: '', categories: ['Milo', 'Faithful', 'Leuven', 'Merit', 'Villa'] },
  
  { label: 'Woven', kidLabel: '', categories: ['Cody', 'Bubbly', 'Synergy', 'Checker'] },
  { label: 'Textured', kidLabel: '', categories: ['Karina', 'Borough', 'Soul', 'Nepal', 'Sorrento', 'Sunbrella', 'Key Largo'] },
  { label: 'Smooth', kidLabel: '', categories: ['Flat Silk', 'Tussah', 'Essence', 'Nico'] },
  { label: 'Cotton & Felt', kidLabel: '', categories: ['Taylor Felt', 'Bloke', 'Felt', 'Cotton', 'Yarn', 'Corduroy'] },
  { label: 'Leather', kidLabel: '', categories: ['Leather'] },
  { label: 'Hard', kidLabel: '', categories: ['Wood', 'Marble', 'Concrete'] },
  { label: 'Patterns', kidLabel: '', categories: ['Animal', 'Stripe', 'Grid', 'Ripple', 'Speckle', 'Tie-dye', 'Maze', 'Riviera', 'Kaplan', 'Skott'] },
  { label: 'Signature', kidLabel: '', categories: ['Alix', 'Corinne', 'Nicole', 'ShayShari', 'Suede Ace', 'Jayme', 'Byrd', 'JaymeLyn', 'Claude', 'Gemini', 'Chat', 'Bisous', 'Sunny Pup'] },
];

// Kid mode: 6 simplified mega-groups
const kidGroups: TextureGroup[] = [
  { label: 'Soft', kidLabel: '🧸 Soft & Cozy', categories: ['Royale', 'Banks', 'Prime', 'Kenley', 'Crave', 'Bentley', 'Lucky', 'Taylor Felt', 'Bloke', 'Felt', 'Cotton', 'Yarn', 'Corduroy'] },
  { label: 'Smooth', kidLabel: '✨ Smooth', categories: ['Flat Silk', 'Tussah', 'Essence', 'Nico', 'Milo', 'Faithful', 'Leuven', 'Merit', 'Villa'] },
  { label: 'Bumpy', kidLabel: '🪨 Bumpy', categories: ['Karina', 'Borough', 'Soul', 'Nepal', 'Sorrento', 'Cody', 'Bubbly', 'Synergy', 'Checker', 'Sunbrella', 'Key Largo'] },
  { label: 'Tough', kidLabel: '🛡️ Tough', categories: ['Leather', 'Wood', 'Marble', 'Concrete'] },
  { label: 'Patterns', kidLabel: '🌈 Patterns', categories: ['Animal', 'Stripe', 'Grid', 'Ripple', 'Speckle', 'Tie-dye', 'Maze', 'Riviera', 'Kaplan', 'Skott'] },
  { label: 'Special', kidLabel: '⭐ Special', categories: ['Alix', 'Corinne', 'Nicole', 'ShayShari', 'Suede Ace', 'Jayme', 'Byrd', 'JaymeLyn', 'Claude', 'Gemini', 'Chat', 'Bisous', 'Sunny Pup'] },
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
  // Crayon mode
  crayonMode?: boolean;
  crayonTextureId?: string | null;
  onToggleCrayonMode?: () => void;
  onSetCrayonTexture?: (textureId: string) => void;
}

export function TextureLibrary({
  onDragStart, onTextureClick, activeSectionId,
  customTextures, onUploadTexture, onRemoveCustomTexture,
  isPremium, onRequestUpgrade,
  applyMode = 'swatch', onApplyModeChange, backgroundTextureId,
  drawMode, onToggleDrawMode, nextShape, onSetNextShape,
  crayonMode, crayonTextureId, onToggleCrayonMode, onSetCrayonTexture,
}: TextureLibraryProps) {
  const isMobile = useIsMobile();
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  const [favIds, setFavIds] = useState<Set<string>>(loadFavs);
  const [showShapeSelector, setShowShapeSelector] = useState(false);

  // Sync kidMode to localStorage and broadcast to other components
  useEffect(() => {
    localStorage.setItem('kid-mode', String(kidMode));
    window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: kidMode }));
  }, [kidMode]);
  const [swatchView, setSwatchView] = useState<'swatch' | 'tiled'>('swatch');
  const [showGrownUpCheck, setShowGrownUpCheck] = useState(false);
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
        : (kidMode ? kidGroups : adultGroups).find(g => g.label === activeGroup)?.categories ?? null;

  let filtered = activeCategories
    ? allTextures.filter(t => activeCategories.includes(t.category))
    : activeGroup === 'Favorites'
      ? allTextures.filter(t => favIds.has(t.id))
      : allTextures;

  // In kid mode, sort by color rainbow order
  if (kidMode && activeGroup !== 'Favorites') {
    filtered = [...filtered].sort((a, b) => {
      const oa = kidColorOrder[a.id] ?? 999;
      const ob = kidColorOrder[b.id] ?? 999;
      return oa - ob;
    });
  }

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
    <div className="h-full flex bg-card relative">
      {/* Adult mode: shape selector panel slides out to the left */}
      {!kidMode && showShapeSelector && onSetNextShape && nextShape && (
        <div
          className="absolute right-full top-0 mr-2 z-50 bg-popover border border-border rounded-lg shadow-lg p-3 w-48"
          style={{ minHeight: 120 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wide text-foreground">Elements</h3>
            <button onClick={() => setShowShapeSelector(false)} className="p-0.5 rounded hover:bg-accent text-muted-foreground">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {shapes.map(shape => (
              <button
                key={shape.value}
                onClick={() => onSetNextShape(shape.value)}
                className={`flex items-center gap-2 px-2 py-1.5 text-[11px] rounded-lg transition-colors ${
                  nextShape === shape.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <ShapeIcon shape={shape.value} />
                {shape.label}
              </button>
            ))}
          </div>
          {onToggleDrawMode && (
            <div className="mt-2 pt-2 border-t border-border flex flex-col gap-1">
              <button
                onClick={onToggleDrawMode}
                className={`flex items-center gap-2 px-2 py-1.5 text-[11px] rounded-lg transition-colors ${
                  drawMode && !crayonMode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <PenTool className="w-3 h-3" />
                Freehand
              </button>
              {onToggleCrayonMode && (
                <button
                  onClick={onToggleCrayonMode}
                  className={`flex items-center gap-2 px-2 py-1.5 text-[11px] rounded-lg transition-colors ${
                    crayonMode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  🧵 Sew
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <div className="h-full flex flex-col flex-1 min-w-0">

      <div className="px-2 py-1 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <h2 className={`font-bold tracking-wide uppercase text-foreground ${kidMode ? 'text-xs' : 'text-[10px]'}`}>
              {kidMode ? 'Colors' : 'Textures'}
            </h2>
            {onApplyModeChange && (
              <div className="flex items-center gap-0.5 rounded bg-secondary/60 p-0.5 ml-1">
                <button
                  onClick={() => onApplyModeChange('swatch')}
                  className={`px-1.5 py-0.5 rounded font-medium transition-colors ${kidMode ? 'text-[11px]' : 'text-[9px]'} ${
                    applyMode === 'swatch' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/50 hover:text-muted-foreground'
                  }`}
                  title="Apply as swatch element"
                >
                  {kidMode ? '🧩 Piece' : 'Swatch'}
                </button>
                <button
                  onClick={() => onApplyModeChange('background')}
                  className={`px-1.5 py-0.5 rounded font-medium transition-colors ${kidMode ? 'text-[11px]' : 'text-[9px]'} ${
                    applyMode === 'background' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/50 hover:text-muted-foreground'
                  }`}
                  title="Apply as canvas background"
                >
                  {kidMode ? '🎨 Fill' : 'Background'}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
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
            <p className={`${kidMode ? 'text-[11px]' : 'text-[9px]'} text-primary font-medium`}>
              {kidMode ? '👆 Tap a color to paint the piece!' : '👆 Tap a texture to fill the selected section.'}
            </p>
          </div>
        )}

        {/* Shape selector — top row for both modes */}
        {onSetNextShape && nextShape && (
          <div className="flex items-center gap-1 flex-wrap">
            {onToggleDrawMode && (
              <button
                onClick={onToggleDrawMode}
                className={`flex items-center gap-1 px-2 py-0.5 ${kidMode ? 'text-[12px]' : 'text-[10px]'} font-medium rounded-full transition-colors ${
                  drawMode && !crayonMode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <PenTool className="w-3 h-3" />
                {kidMode ? 'Draw' : ''}
              </button>
            )}
            {onToggleCrayonMode && (
              <button
                onClick={onToggleCrayonMode}
                className={`flex items-center gap-1 px-2 py-0.5 ${kidMode ? 'text-[12px]' : 'text-[10px]'} font-semibold rounded-full transition-colors ${
                  crayonMode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {kidMode ? '🖍️ Crayon' : '🧵 Sew'}
              </button>
            )}
            {crayonMode && crayonTextureId && (
              <span className="flex items-center gap-1 text-[11px] text-primary font-medium">
                ← pick a color below!
              </span>
            )}
            {shapes.map(shape => (
              <button
                key={shape.value}
                onClick={() => onSetNextShape(shape.value)}
                className={`flex items-center gap-1 px-1.5 py-0.5 ${kidMode ? 'text-[12px] font-semibold' : 'text-[10px]'} rounded-full transition-colors ${
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

        {/* Crayon mode hint */}
        {crayonMode && !crayonTextureId && (
          <div className="mt-1 px-1.5 py-1 rounded bg-primary/10 border border-primary/20">
            <p className={`${kidMode ? 'text-[11px]' : 'text-[9px]'} text-primary font-medium`}>
              {kidMode ? '🖍️' : '🖊️'} {kidMode ? 'Pick a color to draw with!' : 'Select a texture, then draw with it as a pen.'}
            </p>
          </div>
        )}
      </div>

      {/* Category filter tabs — below header (adult mode only) */}
      {!kidMode && (
      <div className="px-2 py-1 border-b border-border flex flex-wrap gap-1">
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
          <Star className="w-2.5 h-2.5" /> My Collection
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
        {adultGroups.map(group => (
            <button
              key={group.label}
              onClick={() => setActiveGroup(group.label)}
              className={`px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${activeGroup === group.label
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {group.label}
            </button>
        ))}
      </div>
      )}

      {/* Texture grid */}
      <div className="flex-1 overflow-y-auto texture-panel p-2">
        <div className={`grid ${kidMode ? 'grid-cols-6 gap-1' : 'grid-cols-8 gap-0.5'}`}>
          {filtered.map(tex => (
            <SwatchItem
              key={tex.id}
              tex={tex}
              isFav={favIds.has(tex.id)}
              onToggleFav={() => toggleFav(tex.id)}
              onDragStart={onDragStart}
              onTextureClick={(id) => {
                if (!kidMode && onSetNextShape) setShowShapeSelector(true);
                onTextureClick?.(id);
              }}
              onRemoveCustomTexture={onRemoveCustomTexture}
              viewMode={swatchView}
              kidMode={kidMode}
              isActiveBackground={backgroundTextureId === tex.id}
              activeShape={nextShape}
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

      <GrownUpCheckModal
        isOpen={showGrownUpCheck}
        onClose={() => setShowGrownUpCheck(false)}
        onSuccess={() => {
          setShowGrownUpCheck(false);
          setKidMode(false);
        }}
      />
      </div>{/* end flex-col wrapper */}
    </div>
  );
}

// Kid emoji helper — precise per-name mapping for best visual match
const kidEmojiMap: Record<string, string> = {
  // Velvet / Royale
  'Cotton Candy': '🍭', 'Stormy Cloud': '🌧️', 'Dinosaur Green': '🦕', 'Frog Belly': '🐸',
  'Cinnamon Swirl': '🍩', 'Mermaid Tail': '🧜‍♀️', 'Rocket Blue': '🚀', 'Elephant Ear': '🐘',
  'Tree Fort': '🌳', 'Grape Juice': '🍇', 'Sandcastle': '🏖️', 'Turtle Shell': '🐢',
  // Banks
  'Teddy Bear': '🧸', 'Cherry Jam': '🍒', 'Cookie Dough': '🍪', 'Goldfish': '🐟',
  // Bentley
  'Lemonade': '🍋', 'Midnight Sky': '🌙', 'Robot Silver': '🤖',
  // Cody
  'Blueberry Ice': '🫐', 'Peanut Butter': '🥜', 'Ocean Wave': '🌊',
  // Sunbrella
  'Foggy Morning': '🌫️', 'Swimming Pool': '🏊', 'Unicorn Purple': '🦄',
  'Lily Pad': '🐸', 'Snowflake': '❄️', 'Marshmallow': '☁️',
  // Bubbly
  'Pickle Green': '🥒', 'Gingerbread': '🏠', 'Cream Puff': '🧁',
  // Karina
  'Cloud Puff': '☁️', 'Mermaid Scale': '🧜‍♀️',
  // Crave
  'Bubblegum': '🫧', 'Hot Cocoa': '☕', 'Milk Chocolate': '🍫', 'Ginger Snap': '🍪',
  'Raspberry': '🫐', 'Fern Leaf': '🌿', 'Volcano Rock': '🌋', 'Caramel Swirl': '🍯',
  // Flat Silk
  'Banana Cream': '🍌', 'Golden Star': '⭐', 'Chipmunk': '🐿️', 'Fairy Wing': '🧚',
  'Starry Night': '🌌',
  // Checker
  'Checkerboard': '♟️', 'Berry Waffle': '🧇',
  // Singles
  'Fluffy Cloud': '☁️', 'Parrot Feather': '🦜', 'Sea Glass': '🪸',
  'Pine Tree': '🌲', 'Fairy Dust': '✨', 'Beach Sand': '🏖️',
  'Caterpillar': '🐛', 'Snowball': '⛄', 'Mermaid Green': '🧜‍♀️',
  'Bunny Gray': '🐰', 'Silver Coin': '🪙', 'Dove Feather': '🕊️', 'Sky Blue': '🩵',
  'Pickle Jar': '🥒', 'Ink Splash': '🖋️', 'Sandy Toes': '👣', 'Brownie': '🟫',
  'Seashell': '🐚', 'Rainy Day': '🌧️', 'Cotton Ball': '☁️',
  'Crystal Blue': '💎', 'Peach Gummy': '🍑', 'Feather Soft': '🪶',
  'River Rock': '🪨', 'Peacock Feather': '🦚', 'Silk Ribbon': '🎀', 'Pillow White': '🤍',
  // Leather
  'Honey Bear': '🍯', 'Dark Chocolate': '🍫', 'Cinnamon Toast': '🥐',
  'Maple Syrup': '🍁', 'Cocoa Bean': '🫘', 'Graham Cracker': '🧇',
  // Wood
  'Treehouse': '🏡', 'Acorn': '🌰', 'Birch Bark': '🪵',
  // Marble
  'Ice Cream Swirl': '🍦', 'Licorice': '🖤', 'Strawberry Milk': '🍓', 'Mint Chip': '🍨',
  // Concrete
  'Sidewalk': '🛤️', 'Moon Rock': '🌕', 'Fossil': '🦴',
  // Stripe
  'Zebra Stripe': '🦓', 'Candy Stripe': '🍭', 'Rainbow Weave': '🌈',
  // Grid
  'Blueberry Waffle': '🧇', 'Vanilla Waffle': '🧇', 'Tic-Tac-Toe': '⭕', 'Window Frost': '🪟',
  // Animal
  'Cheetah Spots': '🐆', 'Snow Leopard': '❄️', 'Cow Spots': '🐄', 'Zebra Stripes': '🦓',
  // Ripple
  'Vanilla Pudding': '🍮', 'Blackberry Jam': '🫐', 'Paper Bag': '📦',
  'Waffle Cone': '🍦', 'Treasure Map': '🗺️',
  // Speckle
  'Robin Egg': '🥚', 'Cookies & Cream': '🍪',
  // Tie-dye
  'Pink Swirl': '🌀', 'Cinnamon Roll': '🍩', 'Rainbow Swirl': '🌈',
  // Maze
  'Maze Game': '🧩',
  // Felt
  'Sandy Beach': '🏖️', 'Chocolate Milk': '🥛', 'Turtle Green': '🐢', 'Deep Ocean': '🐋',
  // Cotton
  'Coconut Flake': '🥥', 'Oatmeal Cookie': '🍪',
  // Yarn
  'Vanilla Ice Cream': '🍦', 'Cinnamon Sugar': '🍩', 'Pencil Lead': '✏️',
  // Corduroy
  'Sandy Lines': '〰️', 'Chocolate Bar': '🍫', 'Caterpillar Lines': '🐛',
  'Whale Blue': '🐳', "S'more": '🔥', 'Leaf Pile': '🍂',
  'Nighttime': '🌙', 'Sand Dollar': '🐚', 'Teddy Paw': '🐾',
  'Herb Garden': '🌱', 'Deep Space': '🪐',
  // Signature
  'Rose Petal': '🌹', 'Pink Lollipop': '🍭', 'Hot Pink': '💗',
  'Orange Candy': '🍊', 'Plum Pudding': '🍑', 'Grape Popsicle': '🍇',
  'Clay Pot': '🏺', 'Berry Blast': '🫐', 'Sage Leaf': '🌿', 'Sand Dune': '🏜️',
  'Midnight Blue': '🌃', 'Forest Floor': '🌲', 'Cherry Cola': '🥤',
  'Starry Painting': '🖼️', 'Army Camo': '🪖', 'Tiger Stripe': '🐅',
  'Beach Day': '🏄', 'Sparkle Dots': '✨', 'Bird Feather': '🪶',
  'Fairy Garden': '🧚', 'Magic Swirl': '🔮', 'Twin Stars': '⭐',
  'Happy Chat': '💬', 'Blueberry Kiss': '💋', 'Sunny Puppy': '🐶',
};

function getKidTextureEmoji(id: string, name: string): string {
  if (kidEmojiMap[name]) return kidEmojiMap[name];
  // Fallback by category
  if (id.includes('leather')) return '🧤';
  if (id.includes('wood')) return '🪵';
  if (id.includes('marble') || id.includes('concrete')) return '🪨';
  if (id.includes('cord-')) return '〰️';
  return '🎨';
}

function getSwatchClipPath(shape?: ElementShape): string | undefined {
  switch (shape) {
    case 'circle': return '50%';
    default: return undefined;
  }
}

function getSwatchBorderRadius(shape?: ElementShape): string {
  switch (shape) {
    case 'circle': return '50%';
    case 'blob': return '42% 58% 62% 38% / 45% 55% 45% 55%';
    case 'torn-edge': return '8% 12% 6% 14% / 10% 8% 12% 6%';
    case 'soft-square': return '0.5rem';
    case 'rectangle': return '0.375rem';
    case 'strip': return '0.375rem';
    default: return '0.5rem';
  }
}

function getSwatchAspect(shape?: ElementShape): string {
  switch (shape) {
    case 'strip': return '3/1';
    case 'rectangle': return '3/2';
    default: return '1/1';
  }
}

function SwatchItem({ tex, isFav, onToggleFav, onDragStart, onTextureClick, onRemoveCustomTexture, viewMode = 'swatch', kidMode = false, isActiveBackground = false, activeShape }: {
  tex: TextureSwatch;
  isFav: boolean;
  onToggleFav: () => void;
  onDragStart: (id: string) => void;
  onTextureClick?: (id: string) => void;
  onRemoveCustomTexture: (id: string) => void;
  viewMode?: 'swatch' | 'tiled';
  kidMode?: boolean;
  isActiveBackground?: boolean;
  activeShape?: ElementShape;
}) {
  const isCustom = tex.id.startsWith('custom-');
  const isImage = isCustom || tex.cssBackground.startsWith('url(');
  const bgSize = viewMode === 'tiled'
    ? (isImage ? '60px 60px' : '40px 40px')
    : 'cover';
  const kidName = kidTextureNames[tex.id] || tex.name;
  const kidEmoji = getKidTextureEmoji(tex.id, kidName);
  const displayName = kidMode ? `${kidEmoji} ${kidName}` : tex.name;

  const borderRadius = getSwatchBorderRadius(activeShape);
  const aspectRatio = getSwatchAspect(activeShape);

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
        className={`overflow-hidden border shadow-sm transition-all duration-200 ${isActiveBackground ? 'border-primary ring-2 ring-primary/40' : 'border-border/50'}`}
        style={{
          background: tex.cssBackground,
          backgroundSize: bgSize,
          borderRadius,
          aspectRatio,
        }}
      />
      <p className="text-[8px] text-muted-foreground mt-0.5 truncate text-center leading-tight">
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
