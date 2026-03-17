import { useState } from 'react';
import { textures } from '@/data/textures';
import { TextureCategory } from '@/types/studio';
import { motion } from 'framer-motion';

const categories: TextureCategory[] = [
  'Boucle', 'Linen', 'Velvet', 'Leather', 'Suede',
  'Marble', 'Wood', 'Terrazzo', 'Abstract',
];

interface TextureLibraryProps {
  onDragStart: (textureId: string) => void;
  onTextureClick?: (textureId: string) => void;
  activeSectionId?: string | null;
}

export function TextureLibrary({ onDragStart, onTextureClick, activeSectionId }: TextureLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<TextureCategory | 'All'>('All');

  const filtered = activeCategory === 'All'
    ? textures
    : textures.filter(t => t.category === activeCategory);

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-3">
          Textures
        </h2>

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
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map(tex => (
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
              className={`cursor-grab active:cursor-grabbing group ${
                activeSectionId ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className="aspect-square rounded-lg overflow-hidden border border-border/50 shadow-sm"
                style={{ background: tex.cssBackground, backgroundSize: '40px 40px' }}
              />
              <p className="text-[10px] text-muted-foreground mt-1 truncate text-center">
                {tex.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
