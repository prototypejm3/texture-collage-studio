import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { textures } from '@/data/textures';
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

export function ButterCookiesTin({ items, onRemoveItem, onDragOutItem, isHovered, customTextures = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const allTextures = [...textures, ...customTextures];

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
            className="relative z-20 mb-2 p-3 rounded-2xl max-w-[200px] max-h-[160px] overflow-y-auto"
            style={{
              background: '#1e3a8a',
              boxShadow: '0 8px 24px rgba(30, 64, 175, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {items.length === 0 ? (
              <p className="text-center text-xs" style={{ color: '#93c5fd' }}>
                Your tin is empty — add some colors!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
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
                          className="w-10 h-10 rounded-lg"
                          style={{
                            background: tex.cssBackground,
                            backgroundSize: tex.cssBackground.startsWith('url(') ? 'cover' : '20px 20px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          }}
                        />
                      )}
                      <button
                        data-box-item-remove
                        onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }}
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: '#ef4444', color: 'white' }}
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The tin itself */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.12 }}
        className="relative cursor-pointer select-none"
        title="Swatch Tin"
        style={{ width: 176, height: isOpen ? 130 : 182 }}
      >
        {/* Lid */}
        <motion.div
          animate={isOpen
            ? { x: -34, y: -36, rotate: -12 }
            : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute"
          style={{
            width: 184,
            height: 52,
            left: -4,
            top: 0,
            transformOrigin: 'bottom left',
            zIndex: isOpen ? 0 : 20,
          }}
        >
          {/* Lid body */}
          <div className="absolute inset-0 rounded-3xl" style={{
            background: '#2563eb',
            boxShadow: '0 4px 12px rgba(30,64,175,0.3)',
          }}>
            {/* Lid rim */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl" style={{
              height: 12,
              background: '#1d4ed8',
            }} />
            {/* Wreath decoration */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 184 52">
              <ellipse cx="92" cy="24" rx="36" ry="14" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.5" />
              {/* Dots around wreath */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={92 + Math.cos(rad) * 38}
                    cy={24 + Math.sin(rad) * 15}
                    r="1.5"
                    fill="#93c5fd"
                    opacity="0.55"
                  />
                );
              })}
            </svg>
            {/* Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: 6 }}>
              <span style={{
                fontFamily: 'Georgia, serif',
                fontSize: 11,
                fontWeight: 700,
                color: '#bfdbfe',
                letterSpacing: 1,
              }}>BUTTER</span>
              <span style={{
                fontFamily: 'Georgia, serif',
                fontSize: 10,
                color: '#93c5fd',
                letterSpacing: 2,
              }}>COOKIES</span>
            </div>
          </div>

          {/* Count badge on lid */}
          {items.length > 0 && (
            <div
              className="absolute -top-2 -right-2 flex items-center justify-center rounded-full z-20"
              style={{
                width: 32,
                height: 32,
                background: '#f97316',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
              }}
            >
              <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{items.length}</span>
            </div>
          )}
        </motion.div>

        {/* Body */}
        <div
          className="absolute rounded-3xl"
          style={{
            top: 52,
            left: 0,
            width: 176,
            height: 130,
            background: '#1e40af',
            zIndex: 10,
            boxShadow: isHovered
              ? '0 8px 28px rgba(30, 64, 175, 0.4)'
              : '0 8px 24px rgba(30, 64, 175, 0.2)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          {/* White sheen */}
          <div className="absolute rounded-2xl" style={{
            top: 8,
            left: 6,
            width: 40,
            height: 110,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 20,
          }} />
          {/* Stripe details */}
          <div className="absolute" style={{
            top: 40,
            left: 20,
            right: 20,
            height: 3,
            background: 'rgba(29, 58, 158, 0.5)',
            borderRadius: 2,
          }} />
          <div className="absolute" style={{
            top: 52,
            left: 20,
            right: 20,
            height: 3,
            background: 'rgba(29, 58, 158, 0.5)',
            borderRadius: 2,
          }} />

          {/* Cookie illustrations */}
          <svg className="absolute" style={{ top: 60, left: 20 }} width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="22" fill="#fde68a" />
            <circle cx="25" cy="25" r="16" fill="#fbbf24" />
            <circle cx="18" cy="20" r="3" fill="#d97706" />
            <circle cx="30" cy="18" r="2.5" fill="#d97706" />
            <circle cx="24" cy="30" r="2.5" fill="#d97706" />
          </svg>
          <svg className="absolute" style={{ top: 65, right: 24 }} width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="#fde68a" />
            <circle cx="18" cy="18" r="11" fill="#fbbf24" />
            <circle cx="14" cy="15" r="2" fill="#d97706" />
            <circle cx="22" cy="14" r="2" fill="#d97706" />
            <circle cx="17" cy="22" r="2" fill="#d97706" />
          </svg>
          <svg className="absolute" style={{ bottom: -4, left: 8 }} width="28" height="20" viewBox="0 0 28 20">
            <circle cx="14" cy="14" r="14" fill="#fde68a" />
            <circle cx="14" cy="14" r="10" fill="#fbbf24" />
            <circle cx="10" cy="12" r="1.5" fill="#d97706" />
            <circle cx="17" cy="10" r="1.5" fill="#d97706" />
          </svg>
        </div>

        {/* Label below */}
        <div className="absolute text-center w-full" style={{ bottom: -20 }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#3d3530',
          }}>Swatch Tin</span>
        </div>
      </motion.div>
    </div>
  );
}
