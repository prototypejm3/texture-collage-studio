import { useState, useRef } from 'react';
import { textures } from '@/data/textures';
import { TextureCategory, TextureSwatch } from '@/types/studio';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const categories: TextureCategory[] = [
  'Boucle', 'Linen', 'Velvet', 'Leather', 'Suede', 'Silk',
  'Denim', 'Corduroy', 'Tweed', 'Felt', 'Yarn',
  'Marble', 'Wood', 'Terrazzo', 'Concrete', 'Sand', 'Stone', 'Cork',
  'Abstract', 'Stripe', 'Plaid', 'Grid', 'Speckle', 'Herringbone',
];

interface TextureLibraryProps {
  onDragStart: (textureId: string) => void;
  onTextureClick?: (textureId: string) => void;
  activeSectionId?: string | null;
  customTextures: TextureSwatch[];
  onUploadTexture: (file: File) => void;
  onRemoveCustomTexture: (id: string) => void;
}

export function TextureLibrary({
  onDragStart, onTextureClick, activeSectionId,
  customTextures, onUploadTexture, onRemoveCustomTexture,
}: TextureLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<TextureCategory | 'All' | 'Custom'>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTextures = [...textures, ...customTextures];
  const filtered = activeCategory === 'All'
    ? allTextures
    : allTextures.filter(t => t.category === activeCategory);

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
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Textures
          </h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            title="Upload your own texture"
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Section fill hint */}
        {activeSectionId && (
          <div className="mb-3 px-2 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-[10px] text-primary font-medium">
              👆 Click a texture to fill the selected section
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              activeCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            All
          </button>
          {showCustomTab && (
            <button
              onClick={() => setActiveCategory('Custom')}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                activeCategory === 'Custom'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              ✨ My Textures
            </button>
          )}
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto texture-panel p-3">
        <div className="grid grid-cols-3 gap-2">
          {filtered.map(tex => {
            const isCustom = tex.id.startsWith('custom-');
            return (
              <motion.div
                key={tex.id}
                draggable
                onDragStart={(e) => {
                  (e as any).dataTransfer?.setData('textureId', tex.id);
                  onDragStart(tex.id);
                }}
                onClick={() => onTextureClick?.(tex.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-grab active:cursor-grabbing group relative ${
                  activeSectionId ? 'cursor-pointer' : ''
                }`}
              >
                <div
                  className="aspect-square rounded-lg overflow-hidden border border-border/50 shadow-sm"
                  style={{ background: tex.cssBackground, backgroundSize: isCustom ? 'cover' : '40px 40px' }}
                />
                <p className="text-[10px] text-muted-foreground mt-1 truncate text-center">
                  {tex.name}
                </p>
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
          })}
        </div>

        {/* Empty state for custom tab */}
        {activeCategory === 'Custom' && customTextures.length === 0 && (
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
