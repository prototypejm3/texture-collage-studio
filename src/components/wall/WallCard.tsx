import { SavedDesign, FrameStyle } from '@/types/wall';
import { motion } from 'framer-motion';
import { MoreHorizontal, Copy, Trash2, FolderOpen, Pin, PinOff, Hammer } from 'lucide-react';
import { useState } from 'react';

interface WallCardProps {
  design: SavedDesign;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleIRL: (id: string) => void;
  onFrameStyleChange: (id: string, style: FrameStyle) => void;
  isPremium: boolean;
}

function getFrameClasses(style: FrameStyle): string {
  switch (style) {
    case 'thin': return 'border-2 border-border';
    case 'shadow-box': return 'border-4 border-card shadow-lg';
    case 'polaroid': return 'border-4 border-white border-b-[40px] shadow-md';
    default: return '';
  }
}

export function WallCard({ design, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onFrameStyleChange, isPremium }: WallCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const dateStr = new Date(design.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative"
    >
      <div
        className={`rounded-lg overflow-hidden bg-card cursor-pointer transition-shadow hover:shadow-xl ${getFrameClasses(design.frameStyle)}`}
        onClick={() => onOpen(design.id)}
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={design.previewImage}
            alt={design.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {design.pinned && (
            <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground rounded-full p-1">
              <Pin className="w-3 h-3" />
            </div>
          )}
          {design.builtIRL && (
            <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-[10px] font-medium flex items-center gap-1">
              <Hammer className="w-3 h-3" /> Built IRL
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(design.id); }}
              className="p-2 rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"
              title="Open"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(design.id); }}
              className="p-2 rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(design.id); }}
              className="p-2 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{design.name}</p>
          <div className="flex items-center gap-2">
            {design.vibeName && (
              <span className="text-[10px] text-primary font-medium">{design.vibeName}</span>
            )}
            <span className="text-[10px] text-muted-foreground">{dateStr}</span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                <button
                  onClick={() => { onTogglePin(design.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2"
                >
                  {design.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                  {design.pinned ? 'Unpin' : 'Pin to top'}
                </button>
                <button
                  onClick={() => { onToggleIRL(design.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2"
                >
                  <Hammer className="w-3 h-3" />
                  {design.builtIRL ? 'Unmark IRL' : 'Mark as Built IRL'}
                </button>
                {isPremium && (
                  <>
                    <div className="border-t border-border my-1" />
                    <p className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wide">Frame</p>
                    {(['none', 'thin', 'shadow-box', 'polaroid'] as FrameStyle[]).map(fs => (
                      <button
                        key={fs}
                        onClick={() => { onFrameStyleChange(design.id, fs); setMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${design.frameStyle === fs ? 'text-primary font-medium' : ''}`}
                      >
                        {fs === 'none' ? 'No Frame' : fs === 'thin' ? 'Thin Frame' : fs === 'shadow-box' ? 'Shadow Box' : 'Polaroid'}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
