import { SavedDesign, FrameStyle, DesignSize } from '@/types/wall';
import { motion } from 'framer-motion';
import { MoreHorizontal, Copy, Trash2, FolderOpen, Pin, PinOff, Hammer, EyeOff, Eye, Maximize2, Minimize2, Square, Pencil, RotateCw, RotateCcw } from 'lucide-react';
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


/* ─── Metallic gradient configs ─── */
const metallicGradients: Record<string, {
  main: string;
  inner: string;
  borderTop: string;
  borderLeft: string;
  borderRight: string;
  borderBottom: string;
  matBg: string;
}> = {
  gold: {
    main: 'linear-gradient(145deg, hsl(43, 60%, 55%) 0%, hsl(38, 65%, 45%) 20%, hsl(43, 70%, 60%) 40%, hsl(38, 55%, 40%) 60%, hsl(43, 60%, 55%) 80%, hsl(40, 65%, 50%) 100%)',
    inner: 'linear-gradient(135deg, hsl(43, 55%, 50%) 0%, hsl(40, 60%, 58%) 50%, hsl(43, 55%, 50%) 100%)',
    borderTop: '2px solid hsl(43, 70%, 70%)',
    borderLeft: '2px solid hsl(43, 60%, 58%)',
    borderRight: '2px solid hsl(38, 55%, 38%)',
    borderBottom: '2px solid hsl(38, 50%, 35%)',
    matBg: 'hsl(40, 15%, 95%)',
  },
  chrome: {
    main: 'linear-gradient(145deg, hsl(210, 5%, 78%) 0%, hsl(210, 8%, 60%) 20%, hsl(210, 5%, 85%) 40%, hsl(210, 8%, 55%) 60%, hsl(210, 5%, 75%) 80%, hsl(210, 8%, 65%) 100%)',
    inner: 'linear-gradient(135deg, hsl(210, 5%, 70%) 0%, hsl(210, 8%, 80%) 50%, hsl(210, 5%, 70%) 100%)',
    borderTop: '2px solid hsl(210, 5%, 88%)',
    borderLeft: '2px solid hsl(210, 5%, 75%)',
    borderRight: '2px solid hsl(210, 8%, 50%)',
    borderBottom: '2px solid hsl(210, 8%, 45%)',
    matBg: 'hsl(210, 5%, 96%)',
  },
  copper: {
    main: 'linear-gradient(145deg, hsl(18, 55%, 55%) 0%, hsl(15, 60%, 42%) 20%, hsl(20, 50%, 58%) 40%, hsl(15, 55%, 38%) 60%, hsl(18, 55%, 52%) 80%, hsl(20, 60%, 48%) 100%)',
    inner: 'linear-gradient(135deg, hsl(18, 50%, 48%) 0%, hsl(20, 55%, 55%) 50%, hsl(18, 50%, 48%) 100%)',
    borderTop: '2px solid hsl(18, 55%, 65%)',
    borderLeft: '2px solid hsl(18, 50%, 55%)',
    borderRight: '2px solid hsl(15, 55%, 35%)',
    borderBottom: '2px solid hsl(15, 50%, 30%)',
    matBg: 'hsl(20, 15%, 95%)',
  },
  silver: {
    main: 'linear-gradient(145deg, hsl(220, 8%, 72%) 0%, hsl(220, 10%, 58%) 20%, hsl(220, 6%, 80%) 40%, hsl(220, 10%, 52%) 60%, hsl(220, 8%, 70%) 80%, hsl(220, 10%, 62%) 100%)',
    inner: 'linear-gradient(135deg, hsl(220, 6%, 65%) 0%, hsl(220, 8%, 75%) 50%, hsl(220, 6%, 65%) 100%)',
    borderTop: '2px solid hsl(220, 6%, 82%)',
    borderLeft: '2px solid hsl(220, 6%, 70%)',
    borderRight: '2px solid hsl(220, 10%, 48%)',
    borderBottom: '2px solid hsl(220, 10%, 42%)',
    matBg: 'hsl(220, 5%, 96%)',
  },
};

function MetallicFrame({ metal, children }: { metal: string; children: React.ReactNode }) {
  const g = metallicGradients[metal];
  if (!g) return <>{children}</>;

  return (
    <div
      className="p-[clamp(10px,2.5%,18px)] shadow-[0_6px_28px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]"
      style={{
        background: g.main,
        borderTop: g.borderTop,
        borderLeft: g.borderLeft,
        borderRight: g.borderRight,
        borderBottom: g.borderBottom,
      }}
    >
      <div
        className="p-[clamp(3px,0.8%,5px)]"
        style={{
          background: g.inner,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2), inset 0 -1px 3px rgba(255,255,255,0.15)',
        }}
      >
        <div style={{ backgroundColor: g.matBg }} className="p-[clamp(6px,1.5%,12px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

function FrameWrapper({ style, children }: { style: FrameStyle; children: React.ReactNode }) {
  // Metallic frames
  if (['gold', 'chrome', 'copper', 'silver'].includes(style)) {
    return <MetallicFrame metal={style}>{children}</MetallicFrame>;
  }


  switch (style) {
    case 'minimal':
      return (
        <div className="bg-[hsl(0,0%,98%)] p-[clamp(12px,3%,20px)] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="border border-[hsl(0,0%,20%)] border-opacity-80">
            <div className="bg-white p-[clamp(8px,2%,16px)]">
              {children}
            </div>
          </div>
        </div>
      );
    case 'shadow-box':
      return (
        <div className="bg-[hsl(0,0%,95%)] p-[clamp(6px,1.5%,10px)] shadow-[0_6px_30px_rgba(0,0,0,0.1),inset_0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="border-2 border-[hsl(0,0%,30%)]">
            <div className="bg-[hsl(0,0%,97%)] p-[clamp(10px,2.5%,18px)] shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]">
              {children}
            </div>
          </div>
        </div>
      );
    case 'wood':
      return (
        <div
          className="p-[clamp(8px,2%,14px)] shadow-[0_6px_24px_rgba(0,0,0,0.1)]"
          style={{
            background: 'linear-gradient(135deg, hsl(30, 40%, 65%) 0%, hsl(25, 35%, 55%) 30%, hsl(28, 38%, 60%) 70%, hsl(30, 40%, 65%) 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          <div className="bg-white p-[clamp(8px,2%,14px)]">
            {children}
          </div>
        </div>
      );
    case 'floating':
      return (
        <div className="relative">
          <div className="absolute inset-[6%] bg-[hsl(0,0%,85%)] rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)]" />
          <div className="relative bg-white p-[clamp(4px,1%,8px)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="border border-[hsl(0,0%,90%)]">
              {children}
            </div>
          </div>
        </div>
      );
    case 'polaroid':
      return (
        <div className="bg-white p-[clamp(8px,2%,14px)] pb-[clamp(36px,10%,56px)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] rotate-[0.5deg]">
          {children}
        </div>
      );
    case 'none':
    default:
      return (
        <div className="shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          {children}
        </div>
      );
  }
}

export function WallCard({ design, onOpen, onDuplicate, onDelete, onTogglePin, onToggleIRL, onToggleHide, onUpdate, onFrameStyleChange, onSizeChange, isPremium, size = 'medium' }: WallCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(design.name);
  const [editDesc, setEditDesc] = useState(design.description || '');
  const nameRef = useRef<HTMLInputElement>(null);

  const isMetallic = ['gold', 'chrome', 'copper', 'silver'].includes(design.frameStyle);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(design.name);
    setEditDesc(design.description || '');
    setEditing(true);
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const handleSaveEdit = () => {
    const trimmedName = editName.trim();
    if (trimmedName) {
      onUpdate(design.id, { name: trimmedName, description: editDesc.trim() || undefined });
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative ${design.hidden ? 'opacity-40' : ''}`}
      style={{ rotate: `${design.rotation || 0}deg` }}
    >
      <div
        className="cursor-pointer transition-transform duration-300 ease-out group-hover:scale-[1.015]"
        onClick={() => onOpen(design.id)}
      >
        <FrameWrapper style={design.frameStyle}>
          <div className={`${size === 'large' ? 'aspect-[4/3]' : 'aspect-square'} relative overflow-hidden`}>
            <img
              src={design.previewImage}
              alt={design.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </FrameWrapper>
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

      {/* Hover actions */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(design.id); }}
          className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          title="Open"
        >
          <FolderOpen className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(design.id); }}
          className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          title="Duplicate"
        >
          <Copy className="w-3 h-3" />
        </button>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            <MoreHorizontal className="w-3 h-3" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 bottom-full z-50 mb-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[150px] max-h-[70vh] overflow-y-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); onTogglePin(design.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground"
                >
                  {design.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                  {design.pinned ? 'Unpin' : 'Pin to top'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleIRL(design.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground"
                >
                  <Hammer className="w-3 h-3" />
                  {design.builtIRL ? 'Unmark IRL' : 'Built IRL'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleHide(design.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-foreground"
                >
                  {design.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {design.hidden ? 'Show' : 'Hide'}
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(design.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
                {isPremium && (
                  <>
                    <div className="border-t border-border my-1" />
                    <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Size</p>
                    {([['small', 'Small', Minimize2], ['medium', 'Medium', Square], ['large', 'Large', Maximize2]] as const).map(([val, label, Icon]) => (
                      <button
                        key={val}
                        onClick={(e) => { e.stopPropagation(); onSizeChange(design.id, val); setMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary flex items-center gap-2 ${(design.displaySize || 'medium') === val ? 'text-primary font-medium' : 'text-foreground'}`}
                      >
                        <Icon className="w-3 h-3" />
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-border my-1" />
                    <p className="px-3 py-1 text-[9px] text-muted-foreground uppercase tracking-widest">Frame</p>
                    {frameStyleList.map(fs => (
                      <button
                        key={fs.value}
                        onClick={(e) => { e.stopPropagation(); onFrameStyleChange(design.id, fs.value); setMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary ${design.frameStyle === fs.value ? 'text-primary font-medium' : 'text-foreground'}`}
                      >
                        {fs.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gallery label — name & description */}
      <div className="mt-3">
        {editing ? (
          <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={nameRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value.slice(0, 100))}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full bg-transparent text-xs font-medium text-foreground tracking-wide border-b border-muted-foreground/30 focus:border-primary outline-none pb-0.5 placeholder:text-muted-foreground/40"
              placeholder="Title"
            />
            <input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value.slice(0, 200))}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full bg-transparent text-[10px] text-muted-foreground/70 tracking-wider border-b border-muted-foreground/20 focus:border-primary outline-none pb-0.5 italic placeholder:text-muted-foreground/30"
              placeholder="Description"
            />
          </div>
        ) : (
          <div className="flex items-start gap-1 group/label cursor-pointer" onClick={handleStartEdit}>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground/80 tracking-wide truncate">{design.name}</p>
              {design.description ? (
                <p className="text-[10px] text-muted-foreground/60 tracking-wider mt-0.5 italic line-clamp-2">{design.description}</p>
              ) : design.vibeName ? (
                <p className="text-[10px] text-muted-foreground/50 tracking-wider mt-0.5">{design.vibeName}</p>
              ) : null}
            </div>
            <Pencil className="w-2.5 h-2.5 text-muted-foreground/30 group-hover/label:text-muted-foreground/60 transition-colors mt-0.5 shrink-0" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
