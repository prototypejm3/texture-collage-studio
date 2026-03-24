import { SavedDesign, FrameStyle, DesignSize, DesignStatus, HangingStyle } from '@/types/wall';
import { HangingWrapper } from './HangingWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Copy, Trash2, FolderOpen, Pin, PinOff, Hammer, EyeOff, Eye, Maximize2, Minimize2, Square, Pencil, RotateCw, RotateCcw, X, Send, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { KidActionBubbles } from './KidActionBubbles';
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
  isDark?: boolean;
  size?: DesignSize;
}

const frameStyleList: { value: FrameStyle; label: string }[] = [
  { value: 'shadow-box', label: 'Shadow Box' },
  { value: 'gold', label: 'Gold' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'copper', label: 'Copper' },
  { value: 'silver', label: 'Silver' },
  { value: 'black', label: 'Black' },
  { value: 'minimal', label: 'Minimal' },
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
  { value: 'hook', label: 'Hook', emoji: '🪝' },
  { value: 'shelf', label: 'Shelf', emoji: '🪵' },
  { value: 'spotlight', label: 'Spotlight', emoji: '🔦' },
  { value: 'lighted-string', label: 'Lighted String', emoji: '💡' },
  { value: 'metal-wire', label: 'Metal Wire', emoji: '🔗' },
  { value: 'hemp', label: 'Hemp', emoji: '🪢' },
  { value: 'white-string', label: 'White String', emoji: '🤍' },
  { value: 'braided', label: 'Braided', emoji: '🪡' },
  { value: 'pink-yarn', label: 'Pink Yarn', emoji: '🧶' },
  { value: 'beaded', label: 'Beaded', emoji: '📿' },
  { value: 'silver-screw', label: 'Silver Screw', emoji: '🔩' },
  { value: 'red-tack', label: 'Red Tack', emoji: '📌' },
  { value: 'cork-tack', label: 'Cork Tack', emoji: '📍' },
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
  black: {
    outerBg: 'linear-gradient(145deg, hsl(0, 0%, 15%) 0%, hsl(0, 0%, 8%) 20%, hsl(0, 0%, 18%) 40%, hsl(0, 0%, 6%) 60%, hsl(0, 0%, 14%) 80%, hsl(0, 0%, 10%) 100%)',
    borderColor: 'hsl(0, 0%, 4%)',
    innerBg: 'linear-gradient(135deg, hsl(0, 0%, 12%) 0%, hsl(0, 0%, 16%) 50%, hsl(0, 0%, 12%) 100%)',
    matBg: 'hsl(0, 0%, 97%)',
    outerShadow: '0 6px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
    innerShadow: 'inset 0 2px 12px rgba(0,0,0,0.15)',
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
  onUpdate, onFrameStyleChange, onSizeChange, onSubmitToGallery, isPremium, isDark, size = 'medium',
}: WallCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [kidBubblesOpen, setKidBubblesOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [frameExpanded, setFrameExpanded] = useState(false);
  const [editName, setEditName] = useState(design.name);
  const [editDesc, setEditDesc] = useState(design.description || '');
  const [editArtist, setEditArtist] = useState(design.artist || '');
  const [editCuratorNote, setEditCuratorNote] = useState(design.curatorNote || '');
  const [editEdition, setEditEdition] = useState(design.edition || '');
  const [editMaterials, setEditMaterials] = useState(design.materials || '');
  const nameRef = useRef<HTMLInputElement>(null);

  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  const handleOpenEditPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(design.name);
    setEditDesc(design.description || '');
    setEditArtist(design.artist || '');
    setEditCuratorNote(design.curatorNote || '');
    setEditEdition(design.edition || '');
    setEditMaterials(design.materials || '');
    setEditPanelOpen(true);
  };

  const handleSaveEdit = () => {
    const trimmedName = editName.trim();
    if (trimmedName) {
      onUpdate(design.id, {
        name: trimmedName,
        description: editDesc.trim() || undefined,
        artist: editArtist.trim() || undefined,
        curatorNote: editCuratorNote.trim() || undefined,
        edition: editEdition.trim() || undefined,
        materials: editMaterials.trim() || undefined,
      });
    }
    setEditPanelOpen(false);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative ${design.hidden ? 'opacity-40' : ''} ${menuOpen || editPanelOpen ? 'z-[9990]' : ''}`}
    >
      <div
        className="transition-transform duration-300 ease-out group-hover:scale-[1.015]"
        style={{ transform: `rotate(${design.rotation || 0}deg)` }}
      >
        <HangingWrapper style={design.hangingStyle || 'floating'} isDark={isDark}>
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

      {/* Hero indicator */}
      {design.isHero && (
        <div className="absolute -top-1 left-6 w-5 h-5 bg-primary/90 rounded-full flex items-center justify-center shadow-sm z-10 text-[10px]">
          ⭐
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

      {/* Tap to show action bubbles (both modes) */}
      <div
        className={`absolute inset-0 z-10 cursor-pointer`}
        onClick={(e) => { e.stopPropagation(); setKidBubblesOpen(!kidBubblesOpen); }}
      />
      <KidActionBubbles
        design={design}
        isOpen={kidBubblesOpen}
        onClose={() => setKidBubblesOpen(false)}
        onSizeChange={onSizeChange}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onOpen={onOpen}
        onDuplicate={onDuplicate}
        onTogglePin={onTogglePin}
        onSubmitToGallery={onSubmitToGallery}
        mode={kidMode ? 'kid' : 'adult'}
      />

      {/* ── Edit Panel (opens on pencil click) — adult only ── */}
      <AnimatePresence>
        {!kidMode && editPanelOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setEditPanelOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 bottom-full mb-2 z-50 max-h-[min(70vh,40rem)] overflow-y-auto bg-popover border border-border rounded-xl shadow-xl p-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
...
              {/* Hanging Style */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Display</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {hangingOptions.map(h => (
                    <button
                      key={h.value}
                      onClick={() => onUpdate(design.id, { hangingStyle: h.value })}
                      className={`px-2 py-2 text-[11px] rounded-md transition-colors flex items-center justify-center gap-1 text-center min-h-9 ${
                        (design.hangingStyle || 'floating') === h.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <span className="text-[10px]">{h.emoji}</span>
                      <span className="leading-tight">{h.label}</span>
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

                {onSubmitToGallery && !design.gallerySubmissionId && (
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
