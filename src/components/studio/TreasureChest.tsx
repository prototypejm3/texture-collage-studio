import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { textures } from '@/data/textures';
import { kidTextureNames } from '@/data/textures/kidNames';
import { TextureSwatch } from '@/types/studio';
import { X, Plus } from 'lucide-react';
import { BoxItem } from './MaybeBox';

interface Props {
  items: BoxItem[];
  onRemoveItem: (id: string) => void;
  onDragOutItem: (item: BoxItem) => void;
  isHovered: boolean;
  customTextures?: TextureSwatch[];
}

export function TreasureChest({ items, onRemoveItem, onDragOutItem, isHovered, customTextures = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const allTextures = [...textures, ...customTextures];
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const prevCount = useRef(items.length);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Badge bounce on new item
  useEffect(() => {
    if (items.length > prevCount.current) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 300);
    }
    prevCount.current = items.length;
  }, [items.length]);

  // Sparkle burst on open
  const triggerSparkles = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const newSparkles = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: -Math.random() * 60 - 20,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 500);
  };

  const handleToggle = () => {
    if (!isOpen) triggerSparkles();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
      {/* Swatch grid when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-20 mb-1 p-3 max-w-[220px] max-h-[160px] overflow-y-auto"
            style={{
              background: '#78350f',
              borderRadius: '0 0 16px 16px',
              boxShadow: '0 8px 24px rgba(120, 53, 15, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-2">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M10 0L12 7.5L20 10L12 12.5L10 20L8 12.5L0 10L8 7.5Z" fill="#fbbf24" opacity="0.6"/>
                </svg>
                <p className="text-center text-[11px] font-medium" style={{ color: '#c4956a' }}>
                  Add your first color!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {items.map(item => {
                  const tex = allTextures.find(t => t.id === item.textureId);
                  return (
                    <div
                      key={item.id}
                      className="relative group cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('textureId', item.textureId);
                        e.dataTransfer.setData('fromBox', item.id);
                      }}
                      onDragEnd={(e) => {
                        if (e.dataTransfer.dropEffect !== 'none') onDragOutItem(item);
                      }}
                      onClick={() => onDragOutItem(item)}
                    >
                      {tex && (
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 8,
                            background: tex.cssBackground,
                            backgroundSize: tex.cssBackground.startsWith('url(') ? 'cover' : '20px 20px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          }}
                        />
                      )}
                      <p className="text-[10px] mt-0.5 truncate text-center" style={{ color: '#f5ede0', maxWidth: 52 }}>
                        {kidTextureNames[tex?.id || ''] || tex?.name || ''}
                      </p>
                      <button
                        data-box-item-remove
                        onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: '#ef4444', color: 'white' }}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The treasure chest */}
      <motion.div
        onClick={handleToggle}
        whileTap={{ scale: 0.96 }}
        className="relative cursor-pointer select-none"
        title="My Treasure Box"
        style={{ width: 220, height: isOpen ? 100 : 170 }}
      >
        {/* Sparkle burst */}
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.svg
              key={s.id}
              initial={{ opacity: 1, x: 110, y: 60, scale: 0.5 }}
              animate={{ opacity: 0, x: 110 + s.x, y: 60 + s.y, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute z-30 pointer-events-none"
              width="12" height="12" viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" r="5" fill="#fbbf24" />
            </motion.svg>
          ))}
        </AnimatePresence>

        {/* Sparkle accents */}
        <svg className="absolute z-10 pointer-events-none" style={{ left: -10, top: 10 }} width="16" height="16" viewBox="0 0 20 20">
          <path d="M10 0L12 7.5L20 10L12 12.5L10 20L8 12.5L0 10L8 7.5Z" fill="#fbbf24" opacity="0.7"/>
        </svg>
        <svg className="absolute z-10 pointer-events-none" style={{ right: -8, bottom: 30 }} width="12" height="12" viewBox="0 0 20 20">
          <path d="M10 0L12 7.5L20 10L12 12.5L10 20L8 12.5L0 10L8 7.5Z" fill="#fbbf24" opacity="0.8"/>
        </svg>
        <circle className="absolute z-10 pointer-events-none" style={{ left: 4, bottom: 50 }} />
        <svg className="absolute z-10 pointer-events-none" style={{ left: 6, bottom: 50 }} width="6" height="6" viewBox="0 0 6 6">
          <circle cx="3" cy="3" r="3" fill="#fbbf24" opacity="0.5"/>
        </svg>
        <svg className="absolute z-10 pointer-events-none" style={{ right: 2, top: 20 }} width="5" height="5" viewBox="0 0 6 6">
          <circle cx="3" cy="3" r="3" fill="#fbbf24" opacity="0.5"/>
        </svg>

        {/* Lid */}
        <motion.div
          animate={isOpen
            ? { rotate: -15, y: -5, x: -20 }
            : { rotate: 0, y: 0, x: 0 }
          }
          transition={isOpen
            ? { duration: 0.3, type: 'spring', stiffness: 300, damping: 15 }
            : { duration: 0.25, type: 'spring', stiffness: 400, damping: 20 }
          }
          className="absolute"
          style={{
            width: 220,
            height: 70,
            left: 0,
            top: 0,
            transformOrigin: 'bottom left',
            zIndex: isOpen ? 25 : 20,
          }}
        >
          <svg width="220" height="70" viewBox="0 0 220 70" className="absolute inset-0">
            {/* Domed lid */}
            <path d="M10,70 L10,35 Q10,10 55,5 Q110,-2 165,5 Q210,10 210,35 L210,70 Z" fill="#b45309" />
            {/* Curved plank lines */}
            <path d="M20,30 Q110,15 200,30" fill="none" stroke="#92400e" strokeWidth="3" opacity="0.5" />
            <path d="M15,48 Q110,35 205,48" fill="none" stroke="#92400e" strokeWidth="3" opacity="0.5" />
            {/* White highlight */}
            <ellipse cx="60" cy="25" rx="30" ry="12" fill="white" opacity="0.08" />
            {/* Left corner band */}
            <rect x="0" y="0" width="16" height="70" rx="4" fill="#374151" opacity="0.7" />
            {/* Right corner band */}
            <rect x="204" y="0" width="16" height="70" rx="4" fill="#374151" opacity="0.7" />
            {/* Iron band across lid */}
            <rect x="0" y="50" width="220" height="12" fill="#374151" opacity="0.45" />
            {/* Rivets on left band */}
            <circle cx="8" cy="12" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="8" cy="30" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="8" cy="48" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="8" cy="64" r="3.5" fill="#6b7280" opacity="0.8" />
            {/* Rivets on right band */}
            <circle cx="212" cy="12" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="212" cy="30" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="212" cy="48" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="212" cy="64" r="3.5" fill="#6b7280" opacity="0.8" />
            {/* Rivets on horizontal band */}
            <circle cx="44" cy="56" r="3" fill="#6b7280" opacity="0.8" />
            <circle cx="88" cy="56" r="3" fill="#6b7280" opacity="0.8" />
            <circle cx="132" cy="56" r="3" fill="#6b7280" opacity="0.8" />
            <circle cx="176" cy="56" r="3" fill="#6b7280" opacity="0.8" />
            {/* Gold lock plate on lid */}
            <rect x="92" y="48" width="36" height="22" rx="6" fill="#d97706" />
            <rect x="95" y="51" width="30" height="16" rx="4" fill="#f59e0b" />
            <circle cx="110" cy="58" r="4" fill="#92400e" />
            <rect x="107" y="60" width="6" height="7" rx="2" fill="#92400e" />
            <ellipse cx="104" cy="55" rx="5" ry="3" fill="white" opacity="0.3" transform="rotate(-20 104 55)" />
          </svg>

          {/* Count badge on lid */}
          {items.length > 0 && (
            <motion.div
              animate={badgeBounce ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute flex items-center justify-center rounded-full z-30"
              style={{
                width: 36,
                height: 36,
                top: -8,
                right: -8,
                background: '#f97316',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
              }}
            >
              <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{items.length}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Body */}
        <div
          className="absolute"
          style={{
            top: 70,
            left: 0,
            width: 220,
            height: 90,
            zIndex: 10,
          }}
        >
          <svg width="220" height="90" viewBox="0 0 220 90">
            {/* Body rect */}
            <rect x="0" y="0" width="220" height="90" rx="10" fill="#92400e" />
            {/* Wood plank lines */}
            <rect x="20" y="18" width="180" height="3" rx="1.5" fill="#78350f" opacity="0.5" />
            <rect x="20" y="38" width="180" height="3" rx="1.5" fill="#78350f" opacity="0.5" />
            <rect x="20" y="58" width="180" height="3" rx="1.5" fill="#78350f" opacity="0.5" />
            <rect x="20" y="78" width="180" height="3" rx="1.5" fill="#78350f" opacity="0.5" />
            {/* White sheen */}
            <rect x="6" y="4" width="24" height="82" rx="8" fill="white" opacity="0.05" />
            {/* Left corner band */}
            <rect x="0" y="0" width="16" height="90" rx="4" fill="#374151" opacity="0.7" />
            {/* Right corner band */}
            <rect x="204" y="0" width="16" height="90" rx="4" fill="#374151" opacity="0.7" />
            {/* Horizontal iron band */}
            <rect x="0" y="38" width="220" height="12" fill="#374151" opacity="0.45" />
            {/* Rivets on left */}
            <circle cx="8" cy="10" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="8" cy="30" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="8" cy="54" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="8" cy="74" r="3.5" fill="#6b7280" opacity="0.8" />
            {/* Rivets on right */}
            <circle cx="212" cy="10" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="212" cy="30" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="212" cy="54" r="3.5" fill="#6b7280" opacity="0.8" />
            <circle cx="212" cy="74" r="3.5" fill="#6b7280" opacity="0.8" />
            {/* Rivets on horizontal band */}
            <circle cx="44" cy="44" r="3" fill="#6b7280" opacity="0.8" />
            <circle cx="88" cy="44" r="3" fill="#6b7280" opacity="0.8" />
            <circle cx="132" cy="44" r="3" fill="#6b7280" opacity="0.8" />
            <circle cx="176" cy="44" r="3" fill="#6b7280" opacity="0.8" />
            {/* Gold clasp below lock */}
            <rect x="98" y="-3" width="24" height="6" rx="3" fill="#d97706" />
          </svg>

          {/* Inside preview swatches when open */}
          {isOpen && items.length > 0 && (
            <div
              className="absolute inset-x-[20px] top-[8px] bottom-[8px] flex flex-wrap gap-1.5 items-start content-start p-2 overflow-hidden"
              style={{ background: '#7f1d1d', borderRadius: 5, opacity: 0.8 }}
            >
              {items.slice(0, 8).map(item => {
                const tex = allTextures.find(t => t.id === item.textureId);
                return tex ? (
                  <div
                    key={item.id}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: tex.cssBackground,
                      backgroundSize: tex.cssBackground.startsWith('url(') ? 'cover' : '20px 20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    }}
                  />
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Shadow under chest */}
        <div className="absolute" style={{
          bottom: -6,
          left: 20,
          right: 20,
          height: 8,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
        }} />

        {/* Label below */}
        <div className="absolute text-center w-full" style={{ bottom: -24 }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: '#6b4c2a',
          }}>My Treasure Box</span>
        </div>
      </motion.div>
    </div>
  );
}
