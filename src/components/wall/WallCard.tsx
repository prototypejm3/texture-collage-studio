import { SavedDesign, FrameStyle, DesignSize, DesignStatus, HangingStyle } from '@/types/wall';
import { HangingWrapper } from './HangingWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Copy, Trash2, FolderOpen, Pin, PinOff, Hammer, EyeOff, Eye, Maximize2, Minimize2, Square, Pencil, RotateCw, RotateCcw, X, Send, Check } from 'lucide-react';
import { useState, useRef } from 'react';

interface WallCardProps {
  design: SavedDesign;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleIRL: (id: string) => void;
  onToggleHide: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SavedDesign>) => void;
  onFrameStyleChange: (id: string, style: FrameStyle) => void;
  onSizeChange: (id: string, size: DesignSize) => void;
  onSubmitToGallery?: (id: string) => void;
  isPremium: boolean;
  size?: DesignSize;
}

const frameStyleList: { value: FrameStyle; label: string }[] = [
  { value: 'gold', label: 'Gold' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'copper', label: 'Copper' },
  { value: 'silver', label: 'Silver' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'shadow-box', label: 'Shadow Box' },
  { value: 'wood', label: 'Wood' },
  { value: 'floating', label: 'Floating' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'none', label: 'None' },
];

const sizeOptions: { value: DesignSize; label: string; icon: typeof Square }[] = [
  { value: 'small', label: 'Small', icon: Minimize2 },
  { value: 'medium', label: 'Medium', icon: Square },
  { value: 'large', label: 'Large', icon: Maximize2 },
];

const statusOptions: { value: DesignStatus; label: string }[] = [
  { value: 'display', label: 'Display' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'draft', label: 'Draft' },
];

const hangingOptions: { value: HangingStyle; label: string; emoji: string }[] = [
  { value: 'floating', label: 'Floating', emoji: '✨' },
  { value: 'string', label: 'String', emoji: '🧵' },
  { value: 'spotlight', label: 'Spotlight', emoji: '🔦' },
  { value: 'hook', label: 'Hook', emoji: '🪝' },
  { value: 'shelf', label: 'Shelf', emoji: '🪵' },
];

/* ─── Shadow box configs per frame style ─── */
const shadowBoxStyles: Record<string, {
  outerBg: string;
  borderColor: string;
  innerBg: string;
  matBg: string;
  outerShadow: string;
  innerShadow: string;
}> = {
  gold: {
    outerBg: 'linear-gradient(145deg, hsl(43, 60%, 55%) 0%, hsl(38, 65%, 45%) 20%, hsl(43, 70%, 60%) 40%, hsl(38, 55%, 40%) 60%, hsl(43, 60%, 55%) 80%, hsl(40, 65%, 50%) 100%)',
    borderColor: 'hsl(38, 55%, 38%)',
    innerBg: 'linear-gradient(135deg, hsl(43, 55%, 50%) 0%, hsl(40, 60%, 58%) 50%, hsl(43, 55%, 50%) 100%)',
    matBg: 'hsl(40, 15%, 95%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.12)',
  },
  chrome: {
    outerBg: 'linear-gradient(145deg, hsl(210, 5%, 78%) 0%, hsl(210, 8%, 60%) 20%, hsl(210, 5%, 85%) 40%, hsl(210, 8%, 55%) 60%, hsl(210, 5%, 75%) 80%, hsl(210, 8%, 65%) 100%)',
    borderColor: 'hsl(210, 8%, 50%)',
    innerBg: 'linear-gradient(135deg, hsl(210, 5%, 70%) 0%, hsl(210, 8%, 80%) 50%, hsl(210, 5%, 70%) 100%)',
    matBg: 'hsl(210, 5%, 96%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.1)',
  },
  copper: {
    outerBg: 'linear-gradient(145deg, hsl(18, 55%, 55%) 0%, hsl(15, 60%, 42%) 20%, hsl(20, 50%, 58%) 40%, hsl(15, 55%, 38%) 60%, hsl(18, 55%, 52%) 80%, hsl(20, 60%, 48%) 100%)',
    borderColor: 'hsl(15, 55%, 35%)',
    innerBg: 'linear-gradient(135deg, hsl(18, 50%, 48%) 0%, hsl(20, 55%, 55%) 50%, hsl(18, 50%, 48%) 100%)',
    matBg: 'hsl(20, 15%, 95%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.12)',
  },
  silver: {
    outerBg: 'linear-gradient(145deg, hsl(220, 8%, 72%) 0%, hsl(220, 10%, 58%) 20%, hsl(220, 6%, 80%) 40%, hsl(220, 10%, 52%) 60%, hsl(220, 8%, 70%) 80%, hsl(220, 10%, 62%) 100%)',
    borderColor: 'hsl(220, 10%, 48%)',
    innerBg: 'linear-gradient(135deg, hsl(220, 6%, 65%) 0%, hsl(220, 8%, 75%) 50%, hsl(220, 6%, 65%) 100%)',
    matBg: 'hsl(220, 5%, 96%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.35)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.1)',
  },
  wood: {
    outerBg: 'linear-gradient(145deg, hsl(30, 40%, 65%) 0%, hsl(25, 35%, 50%) 25%, hsl(28, 42%, 58%) 50%, hsl(22, 38%, 45%) 75%, hsl(30, 40%, 62%) 100%)',
    borderColor: 'hsl(25, 35%, 35%)',
    innerBg: 'linear-gradient(135deg, hsl(28, 35%, 52%) 0%, hsl(30, 40%, 60%) 50%, hsl(28, 35%, 52%) 100%)',
    matBg: 'hsl(30, 15%, 95%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.1)',
  },
  minimal: {
    outerBg: 'linear-gradient(145deg, hsl(0, 0%, 100%) 0%, hsl(0, 0%, 96%) 50%, hsl(0, 0%, 100%) 100%)',
    borderColor: 'hsl(0, 0%, 80%)',
    innerBg: 'hsl(0, 0%, 98%)',
    matBg: 'hsl(0, 0%, 100%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.05)',
  },
  'shadow-box': {
    outerBg: 'linear-gradient(145deg, hsl(0, 0%, 92%) 0%, hsl(0, 0%, 85%) 50%, hsl(0, 0%, 92%) 100%)',
    borderColor: 'hsl(0, 0%, 30%)',
    innerBg: 'hsl(0, 0%, 90%)',
    matBg: 'hsl(0, 0%, 97%)',
    outerShadow: '0 6px 30px rgba(0,0,0,0.1), inset 0 2px 8px rgba(0,0,0,0.06)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.08)',
  },
  floating: {
    outerBg: 'linear-gradient(145deg, hsl(0, 0%, 98%) 0%, hsl(0, 0%, 94%) 50%, hsl(0, 0%, 98%) 100%)',
    borderColor: 'hsl(0, 0%, 85%)',
    innerBg: 'hsl(0, 0%, 96%)',
    matBg: 'hsl(0, 0%, 100%)',
    outerShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.04)',
  },
  polaroid: {
    outerBg: 'hsl(0, 0%, 100%)',
    borderColor: 'hsl(0, 0%, 88%)',
    innerBg: 'hsl(0, 0%, 98%)',
    matBg: 'hsl(0, 0%, 100%)',
    outerShadow: '0 4px 20px rgba(0,0,0,0.1)',
    innerShadow: 'inset 0 1px 8px rgba(0,0,0,0.04)',
  },
};

function FrameWrapper({ style, children }: { style: FrameStyle; children: React.ReactNode }) {
  const config = shadowBoxStyles[style];
  if (!config) {
    // 'none' — no frame
    return <div className="shadow-[0_4px_16px_rgba(0,0,0,0.06)]">{children}</div>;
  }

  return (
    <div
      className="p-[clamp(8px,2%,14px)]"
      style={{
        background: config.outerBg,
        boxShadow: config.outerShadow,
      }}
    >
      <div
        className="p-[clamp(2px,0.5%,4px)]"
        style={{
          background: config.innerBg,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15), inset 0 -1px 3px rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="border-2"
          style={{ borderColor: config.borderColor }}
        >
          <div
            className="p-[clamp(8px,2%,14px)]"
            style={{
              backgroundColor: config.matBg,
              boxShadow: config.innerShadow,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WallCard({
  design, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onToggleHide,
  onUpdate, onFrameStyleChange, onSizeChange, onSubmitToGallery, isPremium, size = 'medium',
}: WallCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editName, setEditName] = useState(design.name);
  const [editDesc, setEditDesc] = useState(design.description || '');
  const [editArtist, setEditArtist] = useState(design.artist || '');
  const nameRef = useRef<HTMLInputElement>(null);

  const handleOpenEditPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(design.name);
    setEditDesc(design.description || '');
    setEditArtist(design.artist || '');
    setEditPanelOpen(true);
  };

  const handleSaveEdit = () => {
    const trimmedName = editName.trim();
    if (trimmedName) {
      onUpdate(design.id, {
        name: trimmedName,
        description: editDesc.trim() || undefined,
        artist: editArtist.trim() || undefined,
      });
    }
    setEditPanelOpen(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative ${design.hidden ? 'opacity-40' : ''}`}
    >
      <div
        className="cursor-pointer transition-transform duration-300 ease-out group-hover:scale-[1.015]"
        style={{ transform: `rotate(${design.rotation || 0}deg)` }}
        onClick={() => onOpen(design.id)}
      >
        <HangingWrapper style={design.hangingStyle || 'floating'}>
          <FrameWrapper style={design.frameStyle}>
            <div className={`${size === 'large' ? 'aspect-[4/3]' : 'aspect-square'} relative overflow-hidden`}>
              <img src={design.previewImage} alt={design.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </FrameWrapper>
        </HangingWrapper>
      </div>

      {/* Pinned indicator */}
      {design.pinned && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary/80 rounded-full flex items-center justify-center shadow-sm z-10">
          <Pin className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}

      {/* Built IRL badge */}
      {design.builtIRL && (
        <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 text-[9px] font-medium flex items-center gap-0.5 shadow-sm z-10">
          <Hammer className="w-2.5 h-2.5" /> IRL
        </div>
      )}

      {/* Hidden indicator */}
      {design.hidden && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <EyeOff className="w-5 h-5 text-muted-foreground/60" />
        </div>
      )}

      {/* Submitted badge */}
      {design.gallerySubmissionId && (
        <div className="absolute top-1 left-1 bg-primary/80 text-primary-foreground rounded-full px-1.5 py-0.5 text-[9px] font-medium flex items-center gap-0.5 shadow-sm z-10">
          🎨 Gallery
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button onClick={(e) => { e.stopPropagation(); onOpen(design.id); }} className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm" title="Open">
          <FolderOpen className="w-3 h-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(design.id); }} className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm" title="Duplicate">
          <Copy className="w-3 h-3" />
        </button>
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm">
            <MoreHorizontal className="w-3 h-3" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 bottom-full z-50 mb-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                <button onClick={(e) => { e.stopPropagation(); onTogglePin(design.id); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground">
                  {design.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                  {design.pinned ? 'Unpin' : 'Pin to top'}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleIRL(design.id); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground">
                  <Hammer className="w-3 h-3" />
                  {design.builtIRL ? 'Unmark IRL' : 'Built IRL'}
                </button>
                <div className="border-t border-border my-1" />
                <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Size</p>
                <div className="flex items-center gap-1 px-3 py-1.5">
                  {sizeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={(e) => { e.stopPropagation(); onSizeChange(design.id, opt.value); }}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors ${design.displaySize === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border my-1" />
                <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Frame</p>
                <div className="flex flex-wrap gap-1 px-3 py-1.5 max-h-[120px] overflow-y-auto">
                  {frameStyleList.map(f => (
                    <button
                      key={f.value}
                      onClick={(e) => { e.stopPropagation(); onFrameStyleChange(design.id, f.value); }}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors ${design.frameStyle === f.value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                {onSubmitToGallery && !design.gallerySubmissionId && (
                  <>
                    <div className="border-t border-border my-1" />
                    <button onClick={(e) => { e.stopPropagation(); onSubmitToGallery(design.id); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground">
                      <Send className="w-3 h-3" /> Submit to Gallery
                    </button>
                  </>
                )}
                <div className="border-t border-border my-1" />
                <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Rotate</p>
                <div className="flex items-center gap-1 px-3 py-1.5">
                  <button onClick={(e) => { e.stopPropagation(); onUpdate(design.id, { rotation: (design.rotation || 0) - 2 }); }} className="p-1 rounded hover:bg-secondary text-foreground" title="Rotate left">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] text-muted-foreground min-w-[32px] text-center">{design.rotation || 0}°</span>
                  <button onClick={(e) => { e.stopPropagation(); onUpdate(design.id, { rotation: (design.rotation || 0) + 2 }); }} className="p-1 rounded hover:bg-secondary text-foreground" title="Rotate right">
                    <RotateCw className="w-3 h-3" />
                  </button>
                  {(design.rotation || 0) !== 0 && (
                    <button onClick={(e) => { e.stopPropagation(); onUpdate(design.id, { rotation: 0 }); }} className="ml-1 text-[10px] text-muted-foreground hover:text-foreground">Reset</button>
                  )}
                </div>
                <div className="border-t border-border my-1" />
                <button onClick={(e) => { e.stopPropagation(); onDelete(design.id); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-destructive">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gallery label */}
      <div className="mt-3">
        <div className="flex items-start gap-1 group/label cursor-pointer" onClick={handleOpenEditPanel}>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground/80 tracking-wide truncate">{design.name}</p>
            {design.artist && (
              <p className="text-[10px] text-muted-foreground/50 tracking-wider">by {design.artist}</p>
            )}
            {design.description ? (
              <p className="text-[10px] text-muted-foreground/60 tracking-wider mt-0.5 italic line-clamp-2">{design.description}</p>
            ) : design.vibeName ? (
              <p className="text-[10px] text-muted-foreground/50 tracking-wider mt-0.5">{design.vibeName}</p>
            ) : null}
          </div>
          <Pencil className="w-2.5 h-2.5 text-muted-foreground/30 group-hover/label:text-muted-foreground/60 transition-colors mt-0.5 shrink-0" />
        </div>
      </div>

      {/* ── Edit Panel (opens on pencil click) ── */}
      <AnimatePresence>
        {editPanelOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setEditPanelOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-xl p-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Edit Design</span>
                <button onClick={() => setEditPanelOpen(false)} className="p-1 rounded-lg hover:bg-secondary">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Name</label>
                <input
                  ref={nameRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.slice(0, 100))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Title"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value.slice(0, 200))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Add a description…"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Artist</label>
                <input
                  value={editArtist}
                  onChange={(e) => setEditArtist(e.target.value.slice(0, 100))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Your name"
                />
              </div>

              {/* Size */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Size</label>
                <div className="flex gap-1">
                  {sizeOptions.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.value}
                        onClick={() => onSizeChange(design.id, s.value)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] rounded-md transition-colors ${
                          (design.displaySize || 'medium') === s.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
                <div className="flex gap-1">
                  {statusOptions.map(s => (
                    <button
                      key={s.value}
                      onClick={() => onUpdate(design.id, { status: s.value, hidden: s.value === 'hidden' })}
                      className={`px-2.5 py-1.5 text-[11px] rounded-md transition-colors ${
                        design.status === s.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Frame</label>
                <div className="flex gap-1 flex-wrap">
                  {frameStyleList.map(f => (
                    <button
                      key={f.value}
                      onClick={() => onFrameStyleChange(design.id, f.value)}
                      className={`px-2 py-1.5 text-[11px] rounded-md transition-colors ${
                        design.frameStyle === f.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hanging Style */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Display</label>
                <div className="flex gap-1 flex-wrap">
                  {hangingOptions.map(h => (
                    <button
                      key={h.value}
                      onClick={() => onUpdate(design.id, { hangingStyle: h.value })}
                      className={`px-2 py-1.5 text-[11px] rounded-md transition-colors flex items-center gap-1 ${
                        (design.hangingStyle || 'floating') === h.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <span className="text-[10px]">{h.emoji}</span> {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>

                {isPremium && onSubmitToGallery && !design.gallerySubmissionId && (
                  <button
                    onClick={() => {
                      handleSaveEdit();
                      onSubmitToGallery(design.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit to Gallery
                  </button>
                )}

                {!isPremium && !design.gallerySubmissionId && (
                  <span className="text-[10px] text-muted-foreground/50 ml-auto flex items-center gap-1">
                    🔒 Premium to submit
                  </span>
                )}

                {design.gallerySubmissionId && (
                  <span className="text-[10px] text-primary ml-auto flex items-center gap-1">
                    🎨 In Gallery
                  </span>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
