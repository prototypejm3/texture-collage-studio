import { useState, useRef, useCallback, useEffect } from 'react';
import { textures } from '@/data/textures';
import { TextureSwatch } from '@/types/studio';
import { X } from 'lucide-react';

export interface BoxItem {
  id: string;
  textureId: string;
  vibeId?: string;
}

interface Props {
  items: BoxItem[];
  onRemoveItem: (id: string) => void;
  onDragOutItem: (item: BoxItem) => void;
  isHovered: boolean;
  customTextures?: TextureSwatch[];
}

let boxItemId = Date.now();
export function generateBoxItemId() {
  return `box-${boxItemId++}`;
}

export function MaybeBox({ items, onRemoveItem, onDragOutItem, isHovered, customTextures = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const allTextures = [...textures, ...customTextures];

  return (
    <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
      {/* Expanded tray above the box when open */}
      {isOpen && items.length > 0 && (
        <div
          className="mb-1.5 bg-amber-900/60 backdrop-blur-sm border border-amber-700/40 rounded-lg p-1.5 flex flex-wrap gap-1 max-w-[160px] max-h-[120px] overflow-y-auto shadow-inner"
          style={{ minWidth: 60 }}
        >
          {items.map(item => {
            const tex = allTextures.find(t => t.id === item.textureId);
            return (
              <div
                key={item.id}
                className="relative w-8 h-8 rounded cursor-grab active:cursor-grabbing group flex-shrink-0 hover:scale-110 transition-transform"
                title="Drag me back!"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('textureId', item.textureId);
                  e.dataTransfer.setData('fromBox', item.id);
                }}
                onDragEnd={(e) => {
                  // If it was dropped somewhere valid, remove from box
                  if (e.dataTransfer.dropEffect !== 'none') {
                    onDragOutItem(item);
                  }
                }}
                onClick={() => {
                  // Click to put back on desk
                  onDragOutItem(item);
                }}
              >
                {tex && (
                  <div
                    className="w-full h-full rounded"
                    style={{
                      background: tex.cssBackground,
                      backgroundSize: tex.cssBackground.startsWith('url(') ? 'cover' : '20px 20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* The box itself */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex flex-col items-center justify-end transition-all duration-200 select-none cursor-grab active:cursor-grabbing ${
          isHovered
            ? 'scale-110'
            : 'hover:scale-105'
        }`}
        style={{ width: 94, height: 73 }}
      >
        {/* Box body */}
        <div
          className={`relative w-full transition-colors duration-200 ${
            isHovered ? 'bg-amber-600' : 'bg-amber-800'
          }`}
          style={{
            height: 47,
            borderRadius: '0 0 6px 6px',
            boxShadow: isHovered
              ? '0 4px 16px rgba(180, 120, 40, 0.5), inset 0 -4px 8px rgba(0,0,0,0.15)'
              : '0 3px 8px rgba(0,0,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.15)',
            border: '2px solid rgba(0,0,0,0.15)',
            borderTop: 'none',
          }}
        >
          {/* Wood grain lines */}
          <div className="absolute inset-0 opacity-20" style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 9px)',
            borderRadius: '0 0 6px 6px',
          }} />
          {/* Items count badge */}
          {items.length > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-md z-10">
              {items.length}
            </div>
          )}
        </div>

        {/* Open flap (lid tilted back) */}
        <div
          className={`absolute transition-all duration-300 ${isHovered || isOpen ? '' : ''}`}
          style={{
            top: isHovered || isOpen ? -14 : -4,
            left: -2,
            width: 'calc(100% + 4px)',
            height: 18,
            background: isHovered ? 'linear-gradient(180deg, #c07830 0%, #a86828 100%)' : 'linear-gradient(180deg, #8B6020 0%, #7a5418 100%)',
            borderRadius: '4px 4px 0 0',
            border: '2px solid rgba(0,0,0,0.15)',
            borderBottom: 'none',
            transform: isHovered || isOpen ? 'rotateX(-45deg)' : 'rotateX(-15deg)',
            transformOrigin: 'bottom center',
            boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
          }}
        />

        {/* Label */}
        <span className="absolute bottom-1 text-[7px] font-bold text-amber-200/80 tracking-wider uppercase pointer-events-none">
          {isOpen ? '🖼️ My Frame' : '🖼️ My Frame'}
        </span>
      </button>
    </div>
  );
}
