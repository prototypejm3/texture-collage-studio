import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { CanvasElement, FrameSize, FrameColor, Vibe, VibeFills, TextureSwatch, SectionTransform, SectionTransforms, ElementShape, MaterialEffects, defaultEffects } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { CanvasElementComponent } from './CanvasElement';
import { KidSwatchBubbles } from './KidSwatchBubbles';
import { VibeOutline } from './VibeOutline';
import { DrawOverlay } from './DrawOverlay';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { textures } from '@/data/textures';
import { ShapeIcon } from './TextureLibrary';
import { MaybeBox, BoxItem, generateBoxItemId } from './MaybeBox';
import { ButterCookiesTin } from './ButterCookiesTin';
import { TreasureChest } from './TreasureChest';
import { TrashCanIcon, TrashCanIconAnimated } from './ToyboxIcons';
import { KidToolBox } from './KidToolBox';
import { getLabels } from '@/lib/labels';
import { useLanguage } from '@/hooks/useLanguage';
import { BoxId } from '@/hooks/useActiveBox';
import { RoomThemeBackground } from './RoomThemeBackground';
import { RoomTheme } from './RoomThemePicker';
import concreteFloor from '@/assets/concrete-floor.jpg';
import kidTable from '@/assets/kid-table.jpg';
import kidArtFrame from '@/assets/kid-art-frame.png';

export type TableSurface = 'birch' | 'oak' | 'walnut';

const surfaceImages: Record<TableSurface, string> = {
  'birch': '/walls/wood-birch-wall.png',
  'oak': '/walls/wood-oak-wall.png',
  'walnut': '/walls/wood-walnut-wall.png',
};

export interface TableElement {
  id: string;
  textureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  clipPathD?: string;
  vibeId?: string;
  shape?: ElementShape;
  effects?: MaterialEffects;
}

interface Props {
  easelMode: boolean;
  onToggleEasel: () => void;
  elements: CanvasElement[];
  selectedId: string | null;
  frameSize: FrameSize;
  frameColor: FrameColor;
  wallFrameStyle: FrameStyle;
  activeVibe: Vibe | null;
  vibeFills: VibeFills;
  selectedSectionId: string | null;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  customTextures?: TextureSwatch[];
  backgroundTextureId: string | null;
  sectionTransforms: SectionTransforms;
  tableElements: TableElement[];
  tableSurface: TableSurface;
  workstationName: string;
  onWorkstationNameChange: (name: string) => void;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDrop: (textureId: string, x: number, y: number) => void;
  onSelectSection: (sectionId: string) => void;
  onDropInSection: (sectionId: string, textureId: string) => void;
  onDropAsSwatch: (textureId: string, x: number, y: number) => void;
  onDetachSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onUpdateSectionTransform: (sectionId: string, updates: Partial<SectionTransform>) => void;
  onDeleteElement: (id: string) => void;
  onMoveToTable: (id: string, x: number, y: number) => void;
  onTableDrop: (textureId: string, x: number, y: number) => void;
  onTableElementUpdate: (id: string, updates: Partial<TableElement>) => void;
  onTableElementDelete: (id: string) => void;
  onStencilTableDrop?: (vibeId: string, x: number, y: number) => void;
  onSelectTableElement?: (id: string | null) => void;
  selectedTableElementId?: string | null;
  onDuplicateStencilSection?: (vibeId: string, sectionId: string, parentElement: TableElement) => void;
  onDetachStencilSection?: (vibeId: string, sectionId: string, parentElement: TableElement) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  onWallFrameStyleChange?: (style: FrameStyle) => void;
  isPremium?: boolean;
  onRequestUpgrade?: () => void;
  drawMode?: boolean;
  crayonMode?: boolean;
  onFinishDraw?: (pathD: string) => void;
  onCancelDraw?: () => void;
  onFillBackground?: (textureId: string) => void;
  onBoxSave?: () => void;
  onToolSound?: (tool: string) => void;
  // Kid toolbox on desk
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateEffects?: (id: string, effects: Partial<MaterialEffects>) => void;
  onDuplicateElement?: (id: string) => void;
  // Kid tool boxes on table
  activeBox?: BoxId;
  onToggleBox?: (id: BoxId) => void;
  onKidTutorialColor?: () => void;
  onKidTutorialFrame?: () => void;
  onKidTutorialBox?: () => void;
}

const frameSizeMap: Record<FrameSize, { w: number; h: number }> = {
  '8x8': { w: 380, h: 380 },
  '12x12': { w: 480, h: 480 },
  '16x16': { w: 560, h: 560 },
  'gallery': { w: 600, h: 420 },
};

const KID_TOOLBOX_SIZE = 118;
const KID_TOOLBOX_GAP = 8;
const KID_TOOLBOX_MARGIN = 12;
// Reserve room for bottom toolbar (Start Over / Save / Undo / Redo) and tutorial bubble
const KID_TOOLBOX_BOTTOM_RESERVE = 96;

// Solid color fallbacks for basic frame options
const wallFrameStyles: Record<FrameStyle, { bg: string; border: string; shadow: string; innerBg: string; padding: number; borderRadius: number }> = {
  gold: { bg: 'linear-gradient(135deg, hsl(43, 74%, 60%), hsl(43, 74%, 45%), hsl(43, 74%, 65%))', border: '3px solid hsl(43, 60%, 40%)', shadow: 'hsla(43, 50%, 30%, 0.3)', innerBg: 'hsl(40, 20%, 97%)', padding: 8, borderRadius: 2 },
  chrome: { bg: 'linear-gradient(135deg, hsl(0, 0%, 85%), hsl(0, 0%, 70%), hsl(0, 0%, 90%))', border: '3px solid hsl(0, 0%, 60%)', shadow: 'hsla(0, 0%, 0%, 0.2)', innerBg: 'hsl(0, 0%, 97%)', padding: 6, borderRadius: 1 },
  copper: { bg: 'linear-gradient(135deg, hsl(20, 60%, 55%), hsl(20, 50%, 40%), hsl(20, 60%, 60%))', border: '3px solid hsl(20, 50%, 35%)', shadow: 'hsla(20, 40%, 25%, 0.3)', innerBg: 'hsl(30, 15%, 96%)', padding: 8, borderRadius: 2 },
  silver: { bg: 'linear-gradient(135deg, hsl(0, 0%, 80%), hsl(0, 0%, 65%), hsl(0, 0%, 82%))', border: '3px solid hsl(0, 0%, 55%)', shadow: 'hsla(0, 0%, 0%, 0.15)', innerBg: 'hsl(0, 0%, 97%)', padding: 7, borderRadius: 2 },
  minimal: { bg: 'hsl(0, 0%, 98%)', border: '2px solid hsl(0, 0%, 88%)', shadow: 'hsla(0, 0%, 0%, 0.08)', innerBg: 'hsl(0, 0%, 99%)', padding: 4, borderRadius: 0 },
  'shadow-box': { bg: 'hsl(0, 0%, 96%)', border: '2px solid hsl(0, 0%, 85%)', shadow: 'hsla(0, 0%, 0%, 0.25)', innerBg: 'hsl(0, 0%, 99%)', padding: 12, borderRadius: 2 },
  wood: { bg: 'linear-gradient(180deg, hsl(30, 40%, 45%), hsl(25, 35%, 35%), hsl(30, 40%, 42%))', border: '4px solid hsl(25, 35%, 30%)', shadow: 'hsla(25, 30%, 20%, 0.3)', innerBg: 'hsl(40, 20%, 97%)', padding: 10, borderRadius: 1 },
  floating: { bg: 'transparent', border: 'none', shadow: 'hsla(0, 0%, 0%, 0.2)', innerBg: 'hsl(0, 0%, 100%)', padding: 0, borderRadius: 0 },
  polaroid: { bg: 'hsl(0, 0%, 98%)', border: '2px solid hsl(0, 0%, 90%)', shadow: 'hsla(0, 0%, 0%, 0.12)', innerBg: 'hsl(0, 0%, 99%)', padding: 6, borderRadius: 2 },
  black: { bg: 'linear-gradient(135deg, hsl(0, 0%, 15%), hsl(0, 0%, 8%), hsl(0, 0%, 18%))', border: '3px solid hsl(0, 0%, 5%)', shadow: 'hsla(0, 0%, 0%, 0.3)', innerBg: 'hsl(0, 0%, 99%)', padding: 8, borderRadius: 2 },
  none: { bg: 'transparent', border: 'none', shadow: 'hsla(0, 0%, 0%, 0)', innerBg: 'hsl(40, 20%, 97%)', padding: 0, borderRadius: 0 },
  rainbow: { bg: 'linear-gradient(135deg, hsl(0,80%,65%), hsl(40,90%,60%), hsl(60,90%,60%), hsl(120,60%,50%), hsl(200,80%,55%), hsl(270,70%,60%))', border: '3px solid hsl(270,50%,50%)', shadow: 'hsla(270, 50%, 30%, 0.3)', innerBg: 'hsl(0, 0%, 99%)', padding: 8, borderRadius: 4 },
};

export function Canvas({
  easelMode, onToggleEasel,
  elements, selectedId, frameSize, frameColor, wallFrameStyle,
  activeVibe, vibeFills, selectedSectionId,
  customTemplate, templateOpacity,
  backgroundTextureId, sectionTransforms,
  tableElements, tableSurface,
  workstationName, onWorkstationNameChange,
  onSelect, onUpdate, onDrop,
  onSelectSection, onDropInSection, onDropAsSwatch, onDetachSection,
  onDeleteSection, onDuplicateSection, onUpdateSectionTransform,
  onDeleteElement, onMoveToTable, onTableDrop, onTableElementUpdate, onTableElementDelete,
  canvasRef,
  onWallFrameStyleChange, isPremium = false, onRequestUpgrade,
  customTextures = [],
  drawMode = false, crayonMode = false, onFinishDraw, onCancelDraw, onFillBackground, onBoxSave, onToolSound,
  onStencilTableDrop,
  onSelectTableElement,
  selectedTableElementId,
  onDuplicateStencilSection,
  onDetachStencilSection,
  onUpdateElement,
  onUpdateEffects,
  onDuplicateElement,
  activeBox,
  onToggleBox,
  onKidTutorialColor,
  onKidTutorialFrame,
  onKidTutorialBox,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const selectedTableId = selectedTableElementId ?? null;
  const setSelectedTableId = useCallback((id: string | null) => {
    onSelectTableElement?.(id);
  }, [onSelectTableElement]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string; isTable: boolean } | null>(null);
  const [trashHover, setTrashHover] = useState(false);
  const [trashLidOpen, setTrashLidOpen] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);
  const [boxItems, setBoxItems] = useState<BoxItem[]>(() => {
    try { const raw = localStorage.getItem('kid-maybe-box'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const [boxHover, setBoxHover] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxPos, setBoxPos] = useState(() => {
    try { const raw = localStorage.getItem('kid-box-pos'); return raw ? JSON.parse(raw) : { x: 44, y: -1 }; } catch { return { x: 44, y: -1 }; }
  });
  const boxDragStart = useRef({ mx: 0, my: 0, bx: 0, by: 0 });
  const [isBoxDragging, setIsBoxDragging] = useState(false);
  const adultBoxRef = useRef<HTMLDivElement>(null);
  const [adultBoxPos, setAdultBoxPos] = useState(() => {
    try { const raw = localStorage.getItem('adult-box-pos'); return raw ? JSON.parse(raw) : { x: 16, y: -1 }; } catch { return { x: 16, y: -1 }; }
  });
  const adultBoxDragStart = useRef({ mx: 0, my: 0, bx: 0, by: 0 });
  const [isAdultBoxDragging, setIsAdultBoxDragging] = useState(false);
  const [easelBtnPos, setEaselBtnPos] = useState<{ x: number; y: number }>(() => {
    try { const raw = localStorage.getItem('kid-easel-btn-pos-v2'); return raw ? JSON.parse(raw) : { x: -1, y: -1 }; } catch { return { x: -1, y: -1 }; }
  });
  // Kid tool-boxes (Colors/Frame/Shapes/Letters) — each individually draggable
  type ToolboxId = 'textures' | 'tools' | 'stencils' | 'letters';
  const [toolboxPositions, setToolboxPositions] = useState<Partial<Record<ToolboxId, { x: number; y: number }>>>(() => {
    try {
      const raw = localStorage.getItem('kid-toolbox-positions-v1');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem('kid-toolbox-positions-v1', JSON.stringify(toolboxPositions)); } catch {}
  }, [toolboxPositions]);
  const draggingBoxId = useRef<ToolboxId | null>(null);
  const boxDragOffset = useRef({ mx: 0, my: 0, bx: 0, by: 0 });
  const boxDragMoved = useRef(false);
  const [isAnyBoxDragging, setIsAnyBoxDragging] = useState(false);
  const getSafeToolboxPosition = useCallback((next: { x: number; y: number }) => {
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return next;

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
    const clampPos = (pos: { x: number; y: number }) => ({
      x: clamp(pos.x, KID_TOOLBOX_MARGIN, container.width - KID_TOOLBOX_SIZE - KID_TOOLBOX_MARGIN),
      y: clamp(pos.y, KID_TOOLBOX_MARGIN, container.height - KID_TOOLBOX_SIZE - KID_TOOLBOX_BOTTOM_RESERVE),
    });

    const safe = clampPos(next);
    const artwork = artworkRef.current?.getBoundingClientRect();
    if (!artwork) return safe;

    const blocked = {
      left: artwork.left - container.left - KID_TOOLBOX_MARGIN,
      right: artwork.right - container.left + KID_TOOLBOX_MARGIN,
      top: artwork.top - container.top - KID_TOOLBOX_MARGIN,
      bottom: artwork.bottom - container.top + KID_TOOLBOX_MARGIN,
    };
    const overlapsArtwork = (pos: { x: number; y: number }) => (
      pos.x < blocked.right &&
      pos.x + KID_TOOLBOX_SIZE > blocked.left &&
      pos.y < blocked.bottom &&
      pos.y + KID_TOOLBOX_SIZE > blocked.top
    );

    if (!overlapsArtwork(safe)) return safe;

    const candidates = [
      { x: blocked.left - KID_TOOLBOX_SIZE, y: safe.y },
      { x: blocked.right, y: safe.y },
      { x: safe.x, y: blocked.top - KID_TOOLBOX_SIZE },
      { x: safe.x, y: blocked.bottom },
    ]
      .map(clampPos)
      .filter(pos => !overlapsArtwork(pos));

    return candidates.sort((a, b) => (
      Math.hypot(a.x - next.x, a.y - next.y) - Math.hypot(b.x - next.x, b.y - next.y)
    ))[0] ?? safe;
  }, []);
  const getDefaultToolboxPosition = useCallback((index: number, total: number) => {
    const container = containerRef.current?.getBoundingClientRect();
    const artwork = artworkRef.current?.getBoundingClientRect();
    if (!container || !artwork) {
      const totalW = total * KID_TOOLBOX_SIZE + (total - 1) * KID_TOOLBOX_GAP;
      return getSafeToolboxPosition({
        x: Math.max(KID_TOOLBOX_MARGIN, ((container?.width ?? 800) - totalW) / 2) + index * (KID_TOOLBOX_SIZE + KID_TOOLBOX_GAP),
        y: Math.max(KID_TOOLBOX_MARGIN, (container?.height ?? 600) - KID_TOOLBOX_SIZE - KID_TOOLBOX_MARGIN),
      });
    }

    const leftCount = Math.ceil(total / 2);
    const isLeft = index < leftCount;
    const sideIndex = isLeft ? index : index - leftCount;
    const sideCount = isLeft ? leftCount : total - leftCount;
    const artLeft = artwork.left - container.left;
    const artRight = artwork.right - container.left;
    const artMiddleY = (artwork.top + artwork.bottom) / 2 - container.top;
    const groupH = sideCount * KID_TOOLBOX_SIZE + (sideCount - 1) * KID_TOOLBOX_GAP;

    return getSafeToolboxPosition({
      x: isLeft ? artLeft - KID_TOOLBOX_SIZE - KID_TOOLBOX_GAP * 2 : artRight + KID_TOOLBOX_GAP * 2,
      y: artMiddleY - groupH / 2 + sideIndex * (KID_TOOLBOX_SIZE + KID_TOOLBOX_GAP),
    });
  }, [getSafeToolboxPosition]);
  useEffect(() => {
    if (!isAnyBoxDragging) return;
    const onMove = (e: PointerEvent) => {
      const id = draggingBoxId.current;
      if (!id) return;
      const dx = e.clientX - boxDragOffset.current.mx;
      const dy = e.clientY - boxDragOffset.current.my;
      if (!boxDragMoved.current && Math.hypot(dx, dy) < 5) return;
      boxDragMoved.current = true;
      setToolboxPositions(prev => ({
        ...prev,
        [id]: getSafeToolboxPosition({ x: boxDragOffset.current.bx + dx, y: boxDragOffset.current.by + dy }),
      }));
    };
    const onUp = () => { draggingBoxId.current = null; setIsAnyBoxDragging(false); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [isAnyBoxDragging, getSafeToolboxPosition]);


  // Persist box items & position
  useEffect(() => {
    try { localStorage.setItem('kid-maybe-box', JSON.stringify(boxItems)); } catch {}
  }, [boxItems]);
  useEffect(() => {
    try { localStorage.setItem('kid-box-pos', JSON.stringify(boxPos)); } catch {}
  }, [boxPos]);

  // Kid mode — synced from TextureLibrary
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  // Room theme for kids mode
  const [roomTheme, setRoomTheme] = useState<RoomTheme>(() => {
    try { return (localStorage.getItem('kidsRoomTheme') as RoomTheme) || 'art-desk'; } catch { return 'art-desk'; }
  });
  useEffect(() => {
    const handler = (e: Event) => setRoomTheme((e as CustomEvent).detail as RoomTheme);
    window.addEventListener('room-theme-change', handler);
    return () => window.removeEventListener('room-theme-change', handler);
  }, []);

  // Kid canvas style: rainbow or plain
  const [kidCanvasStyle, setKidCanvasStyle] = useState<'rainbow' | 'plain'>(() => {
    try { return (localStorage.getItem('kid-canvas-style') as 'rainbow' | 'plain') || 'rainbow'; } catch { return 'rainbow'; }
  });
  useEffect(() => {
    try { localStorage.setItem('kid-canvas-style', kidCanvasStyle); } catch {}
  }, [kidCanvasStyle]);

  const isOverBox = useCallback((clientX: number, clientY: number) => {
    if (kidMode) {
      if (!boxRef.current) return false;
      const rect = boxRef.current.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    } else {
      if (!adultBoxRef.current) return false;
      const rect = adultBoxRef.current.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }
  }, [kidMode]);

  // Check if a mouse position is over the trash zone
  const isOverTrash = useCallback((clientX: number, clientY: number) => {
    if (!trashRef.current || !kidMode) return false;
    const rect = trashRef.current.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }, [kidMode]);

  // Keyboard delete for selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (selectedId) {
          e.preventDefault();
          onDeleteElement(selectedId);
          onSelect(null);
        } else if (selectedTableId) {
          e.preventDefault();
          onTableElementDelete(selectedTableId);
          setSelectedTableId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedTableId, onDeleteElement, onTableElementDelete, onSelect]);

  // Trash & Maybe Box zones: handle element on pointer up (mouse + touch)
  useEffect(() => {
    const handlePointerUp = (e: PointerEvent) => {
      // Check Box (both kid and adult mode)
      if (isOverBox(e.clientX, e.clientY)) {
        if (selectedTableId) {
          const tel = tableElements.find(t => t.id === selectedTableId);
          if (tel) {
            setBoxItems(prev => [...prev, { id: generateBoxItemId(), textureId: tel.textureId, vibeId: tel.vibeId }]);
            onTableElementDelete(selectedTableId);
            setSelectedTableId(null);
            onBoxSave?.();
          }
        } else if (selectedId) {
          const el = elements.find(e => e.id === selectedId);
          if (el) {
            setBoxItems(prev => [...prev, { id: generateBoxItemId(), textureId: el.textureId }]);
            onDeleteElement(selectedId);
            onSelect(null);
            onBoxSave?.();
          }
        }
        setBoxHover(false);
        setTrashHover(false);
        return;
      }
      // Check Trash (kid mode only)
      if (kidMode && isOverTrash(e.clientX, e.clientY)) {
        if (selectedTableId) {
          onTableElementDelete(selectedTableId);
          setSelectedTableId(null);
        } else if (selectedId) {
          onDeleteElement(selectedId);
          onSelect(null);
        }
      }
      setTrashHover(false);
      setBoxHover(false);
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pressure > 0 && (selectedId || selectedTableId)) {
        if (kidMode) setTrashHover(isOverTrash(e.clientX, e.clientY));
        setBoxHover(isOverBox(e.clientX, e.clientY));
      }
    };
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [kidMode, selectedId, selectedTableId, isOverTrash, isOverBox, onDeleteElement, onTableElementDelete, onSelect, elements, tableElements]);

  // Box dragging
  useEffect(() => {
    if (!isBoxDragging) return;
    const handleMove = (e: PointerEvent) => {
      const dx = e.clientX - boxDragStart.current.mx;
      const dy = e.clientY - boxDragStart.current.my;
      setBoxPos({ x: boxDragStart.current.bx + dx, y: boxDragStart.current.by + dy });
    };
    const handleUp = () => setIsBoxDragging(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isBoxDragging]);

  // Adult box dragging
  useEffect(() => {
    if (!isAdultBoxDragging) return;
    const handleMove = (e: PointerEvent) => {
      const dx = e.clientX - adultBoxDragStart.current.mx;
      const dy = e.clientY - adultBoxDragStart.current.my;
      setAdultBoxPos({ x: adultBoxDragStart.current.bx + dx, y: adultBoxDragStart.current.by + dy });
    };
    const handleUp = () => {
      setIsAdultBoxDragging(false);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isAdultBoxDragging]);

  // Persist adult box position
  useEffect(() => {
    localStorage.setItem('adult-box-pos', JSON.stringify(adultBoxPos));
  }, [adultBoxPos]);





  const baseSize = frameSizeMap[frameSize];

  // Dynamically size canvas to fit container, capped at base size
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Default easel button position to top center once we know container size
  useEffect(() => {
    if (easelBtnPos.x === -1 && containerSize.width > 0) {
      setEaselBtnPos({ x: containerSize.width / 2 - 70, y: 8 });
    }
  }, [containerSize, easelBtnPos.x]);

  const isMobileCanvas = containerSize.width > 0 && containerSize.width < 768;
  
  const canvasSize = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return baseSize;
    const aspect = baseSize.w / baseSize.h;
    // Mobile desk mode: shrink canvas so it fits on the desk surface
    const isMobileDesk = isMobileCanvas && !easelMode;
    const widthFraction = isMobileDesk ? 0.58 : isMobileCanvas ? 0.88 : easelMode ? 0.48 : 0.72;
    const heightFraction = isMobileDesk ? 0.42 : isMobileCanvas ? 0.64 : easelMode ? 0.65 : 0.88;
    const maxW = Math.min(containerSize.width * widthFraction, baseSize.w);
    const maxH = Math.min(containerSize.height * heightFraction, baseSize.h);
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    return { w: Math.round(Math.max(w, 160)), h: Math.round(Math.max(h, 160)) };
  }, [containerSize, baseSize, isMobileCanvas, easelMode]);

  const { w, h } = canvasSize;

  const allTextures = useMemo(() => [...textures, ...customTextures], [customTextures]);

  // Resolve background texture image
  const bgTextureUrl = useMemo(() => {
    if (!backgroundTextureId) return null;
    if (backgroundTextureId === 'rainbow-bg') {
      return 'linear-gradient(135deg, hsl(0,80%,70%), hsl(40,90%,65%), hsl(60,90%,65%), hsl(120,60%,55%), hsl(200,80%,60%), hsl(270,70%,65%))';
    }
    const tex = allTextures.find(t => t.id === backgroundTextureId);
    return tex?.cssBackground || null;
  }, [backgroundTextureId, allTextures]);

  // Resolve frame styling from wallFrameStyle
  const frameStyle = useMemo(() => {
    const style = wallFrameStyles[wallFrameStyle] || wallFrameStyles.gold;
    return style;
  }, [wallFrameStyle]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const textureId = e.dataTransfer.getData('textureId');
    if (!textureId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    onDrop(textureId, x, y);
  }, [onDrop, canvasRef]);

  const handleTableDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleTableDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 40;
    const y = e.clientY - rect.top - 40;

    // Check for stencil (vibe) drag
    const vibeId = e.dataTransfer.getData('vibeId');
    if (vibeId && onStencilTableDrop) {
      onStencilTableDrop(vibeId, x, y);
      return;
    }

    // Texture drag
    const textureId = e.dataTransfer.getData('textureId');
    if (textureId) {
      onTableDrop(textureId, x, y);
    }
  }, [onTableDrop, onStencilTableDrop]);

  // selectedTableId moved above
  // easelMode is now a prop
  const [showFramePicker, setShowFramePicker] = useState(false);

  const framePickerOptions: { id: FrameStyle; label: string }[] = [
    { id: 'shadow-box', label: 'Shadow' },
    { id: 'floating', label: 'Float' },
    { id: 'polaroid', label: 'Polaroid' },
  ];

  const frameColorOptions: { id: FrameStyle; color: string; label: string; free?: boolean }[] = [
    { id: 'gold', color: 'linear-gradient(145deg, hsl(43,74%,60%), hsl(43,74%,45%))', label: 'Gold' },
    { id: 'chrome', color: 'linear-gradient(145deg, hsl(0,0%,85%), hsl(0,0%,70%))', label: 'Chrome' },
    { id: 'copper', color: 'linear-gradient(145deg, hsl(20,60%,55%), hsl(20,50%,40%))', label: 'Copper' },
    { id: 'silver', color: 'linear-gradient(145deg, hsl(220,8%,72%), hsl(220,10%,58%))', label: 'Silver' },
    { id: 'black', color: 'linear-gradient(145deg, hsl(0,0%,18%), hsl(0,0%,8%))', label: 'Black', free: true },
    { id: 'minimal', color: 'linear-gradient(145deg, hsl(0,0%,98%), hsl(0,0%,92%))', label: 'White', free: true },
    { id: 'wood', color: 'linear-gradient(145deg, hsl(30,40%,55%), hsl(25,35%,38%))', label: 'Wood' },
    { id: 'none', color: 'transparent', label: 'None', free: true },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-0 relative overflow-hidden"
      style={{
        background: '#8B8B8B',
        ...(easelMode ? { perspective: '1200px' } : {}),
      }}
      onDragOver={handleTableDragOver}
      onDrop={handleTableDrop}
      onClick={() => { onSelect(null); setSelectedTableId(null); }}
    >
      {/* Background — concrete floor (normal) or kid table / themed (kids mode) */}
      {kidMode && roomTheme !== 'art-desk' ? (
        <RoomThemeBackground theme={roomTheme} width={containerSize.width} height={containerSize.height} />
      ) : (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url(${kidMode ? kidTable : concreteFloor})`,
          backgroundSize: kidMode ? 'cover' : '512px 512px',
          backgroundRepeat: kidMode ? 'no-repeat' : 'repeat',
          backgroundPosition: 'center',
        }} />
      )}

      {/* Wood desk surface — rectangular desk with rounded corners and concrete border */}
      {!easelMode && (() => {
        const isNarrow = containerSize.width > 0 && containerSize.width < 768;
        const deskInsetX = kidMode ? (isNarrow ? 16 : 56) : (isNarrow ? 12 : 28);
        const deskInsetY = kidMode ? (isNarrow ? 56 : 56) : (isNarrow ? 48 : 28);
        return (
        <>
          {/* Desk shadow on floor */}
          <div className="absolute pointer-events-none" style={{
            left: deskInsetX,
            right: deskInsetX,
            top: deskInsetY,
            bottom: deskInsetY,
            borderRadius: 16,
            boxShadow: '0 12px 60px rgba(0,0,0,0.45), 0 4px 20px rgba(0,0,0,0.25)',
          }} />
          {/* Desk wood surface */}
          <div className="absolute pointer-events-none" style={{
            left: deskInsetX,
            right: deskInsetX,
            top: deskInsetY,
            bottom: deskInsetY,
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {/* Wood grain texture */}
            <div style={{
              position: 'absolute',
              backgroundImage: `url(${surfaceImages[tableSurface]})`,
              backgroundSize: '400px auto',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
              transform: 'rotate(90deg)',
              transformOrigin: 'center',
              width: '300%',
              height: '300%',
              left: '-100%',
              top: '-100%',
            }} />
            {/* Subtle inner shadow for depth/beveled edge */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.15), inset 0 -2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }} />
            {/* Desk edge bevel */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              border: '2px solid rgba(0,0,0,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              pointerEvents: 'none',
            }} />
          </div>
        </>
        );
      })()}

      {/* Easel mode — full wood background */}
      {easelMode && (
        <div className="absolute pointer-events-none" style={{
          backgroundImage: `url(${surfaceImages[tableSurface]})`,
          backgroundSize: '400px auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          width: '300%',
          height: '300%',
          left: '-100%',
          top: '-100%',
        }} />
      )}
      {/* Table elements (swatches on the wood table) */}
      {tableElements.map(tel => {
        const tex = tel.vibeId ? null : allTextures.find(t => t.id === tel.textureId);
        if (!tex && !tel.vibeId) return null;
        return (
          <TableSwatch
            key={tel.id}
            element={tel}
            texture={tex || null}
            isSelected={selectedTableId === tel.id}
            onSelect={() => { setSelectedTableId(tel.id); onSelect(null); }}
            onUpdate={(updates) => onTableElementUpdate(tel.id, updates)}
            onDelete={() => onTableElementDelete(tel.id)}
            onDuplicateSection={onDuplicateStencilSection}
            onDetachSection={onDetachStencilSection}
          />
        );
      })}

      {/* Kid Mode Trash Zone */}
      {kidMode && (
        <div
          ref={trashRef}
          className={`absolute z-30 flex flex-col items-center justify-center rounded-full transition-all duration-200 cursor-default select-none ${
            trashHover
              ? 'bg-destructive/30 border-destructive scale-110 shadow-lg'
              : 'bg-muted/40 border-border/60 hover:bg-muted/60'
          } border-2 border-dashed`}
          style={{
            width: 102,
            height: 102,
            bottom: easelMode ? 16 : 44,
            right: easelMode ? 16 : 44,
          }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setTrashHover(true); }}
          onDragLeave={() => setTrashHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTrashHover(false);
            setTrashLidOpen(true);
            setTimeout(() => setTrashLidOpen(false), 600);
            if (selectedId) {
              onDeleteElement(selectedId);
              onSelect(null);
            } else if (selectedTableId) {
              onTableElementDelete(selectedTableId);
              setSelectedTableId(null);
            }
          }}
        >
          <TrashCanIconAnimated lidOpen={trashHover || trashLidOpen} />
          <span className={`text-[10px] font-bold mt-0.5 ${trashHover ? 'text-destructive' : 'text-muted-foreground'}`}>Toss</span>
          {!trashHover && (
            <span className="text-[7px] text-muted-foreground/50 mt-0.5">Drag here</span>
          )}
        </div>
      )}

      {/* Kid Mode Maybe Box — visible in both desk and easel mode */}
      {kidMode && (
        <div
          ref={boxRef}
          data-kid-box
          className="absolute z-30"
          style={{
            ...(isMobileCanvas
              ? { left: 8, top: 8, transform: 'scale(0.4)', transformOrigin: 'top left' }
              : {
                  left: boxPos.x,
                  ...(boxPos.y < 0 ? { bottom: 44 } : { top: boxPos.y }),
                }),
          }}
          onMouseDown={(e) => {
            // Allow drag from anywhere on the box — only skip tiny remove buttons inside items
            if ((e.target as HTMLElement).closest('[data-box-item-remove]')) return;
            e.stopPropagation();
            e.preventDefault();
            setIsBoxDragging(true);
            const currentTop = boxRef.current ? boxRef.current.getBoundingClientRect().top - (containerRef.current?.getBoundingClientRect().top || 0) : 0;
            boxDragStart.current = { mx: e.clientX, my: e.clientY, bx: boxPos.x, by: currentTop };
          }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setBoxHover(true); }}
          onDragLeave={() => setBoxHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setBoxHover(false);
            const fromBox = e.dataTransfer.getData('fromBox');
            if (fromBox) return;
            const textureId = e.dataTransfer.getData('textureId');
            if (textureId) {
              setBoxItems(prev => [...prev, { id: generateBoxItemId(), textureId }]);
              onBoxSave?.();
            }
          }}
        >
          <TreasureChest
            items={boxItems}
            onRemoveItem={(id) => setBoxItems(prev => prev.filter(i => i.id !== id))}
            onDragOutItem={(item) => {
              setBoxItems(prev => prev.filter(i => i.id !== item.id));
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                onTableDrop(item.textureId, boxPos.x + 100, boxPos.y < 0 ? rect.height - 160 : boxPos.y);
              }
            }}
            isHovered={boxHover}
            customTextures={customTextures}
          />
        </div>
      )}

      {/* Adult Mode Butter Cookies Tin — draggable */}
      {!kidMode && (
        <div
          ref={adultBoxRef}
          className="absolute z-30 cursor-grab active:cursor-grabbing"
          style={{
            ...(isMobileCanvas
              ? { left: 8, top: 8, transform: 'scale(0.4)', transformOrigin: 'top left' }
              : {
                  left: adultBoxPos.x,
                  ...(adultBoxPos.y < 0 ? { bottom: 44 } : { top: adultBoxPos.y }),
                }),
          }}
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest('[data-box-item-remove]')) return;
            e.stopPropagation();
            e.preventDefault();
            setIsAdultBoxDragging(true);
            const currentTop = adultBoxRef.current ? adultBoxRef.current.getBoundingClientRect().top - (containerRef.current?.getBoundingClientRect().top || 0) : 0;
            adultBoxDragStart.current = { mx: e.clientX, my: e.clientY, bx: adultBoxPos.x, by: currentTop };
          }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setBoxHover(true); }}
          onDragLeave={() => setBoxHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setBoxHover(false);
            const fromBox = e.dataTransfer.getData('fromBox');
            if (fromBox) return;
            const textureId = e.dataTransfer.getData('textureId');
            if (textureId) {
              setBoxItems(prev => [...prev, { id: generateBoxItemId(), textureId }]);
              onBoxSave?.();
            }
          }}
        >
          <ButterCookiesTin
            items={boxItems}
            onRemoveItem={(id) => setBoxItems(prev => prev.filter(i => i.id !== id))}
            onDragOutItem={(item) => {
              setBoxItems(prev => prev.filter(i => i.id !== item.id));
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                onTableDrop(item.textureId, rect.width / 2, rect.height / 2);
              }
            }}
            isHovered={boxHover}
            customTextures={customTextures}
          />
        </div>
      )}




      <div ref={artworkRef} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative' as const,
        zIndex: 2,
        ...(easelMode ? {
          transform: 'rotateX(8deg)',
          transformStyle: 'preserve-3d' as const,
          marginBottom: 20,
        } : {
          marginBottom: 20,
        }),
      }}>

      {/* Legs poking above frame */}
      {easelMode && (
        <div className="pointer-events-none" style={{
          position: 'relative',
          width: w + 100,
          height: 90,
          marginBottom: -6,
          zIndex: 6,
        }}>
          {/* Left front leg */}
          <div style={{ position: 'absolute', width: 8, height: 140, background: '#D8B48A', borderRadius: '3px 3px 0 0', bottom: 0, left: '28%', transform: 'rotate(-5deg)', transformOrigin: 'bottom center' }} />
          {/* Right front leg */}
          <div style={{ position: 'absolute', width: 8, height: 140, background: '#D8B48A', borderRadius: '3px 3px 0 0', bottom: 0, right: '28%', transform: 'rotate(5deg)', transformOrigin: 'bottom center' }} />
          {/* Back support (center, tallest) */}
          <div style={{ position: 'absolute', width: 6, height: 150, background: '#C69C6D', borderRadius: '2px 2px 0 0', bottom: 0, left: '50%', marginLeft: -3 }} />
          {/* Top junction block */}
          <div style={{ position: 'absolute', width: 22, height: 8, background: '#B8885A', borderRadius: 3, top: 0, left: '50%', marginLeft: -11 }} />
        </div>
      )}

      {/* Frame — kid mode uses art frame image overlay instead of border */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget && onWallFrameStyleChange) {
            e.stopPropagation();
            setShowFramePicker(prev => !prev);
          }
        }}
        style={{
          padding: `${frameStyle.padding}px`,
          ...(wallFrameStyle === 'polaroid' ? { paddingBottom: '48px' } : {}),
          background: frameStyle.bg,
          borderRadius: `${frameStyle.borderRadius}px`,
          border: frameStyle.border,
          boxShadow: wallFrameStyle === 'floating'
            ? `0 12px 40px -8px ${frameStyle.shadow}`
            : `inset 0 2px 8px ${frameStyle.shadow}, 0 8px 32px -8px ${frameStyle.shadow}, 0 2px 8px ${frameStyle.shadow}`,
          zIndex: 10,
          position: 'relative' as const,
          cursor: onWallFrameStyleChange ? 'pointer' : undefined,
        }}
      >
        {/* Frame style picker popover */}
        {showFramePicker && onWallFrameStyleChange && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowFramePicker(false); }} />
            <div
              className="absolute z-50 bg-popover border border-border rounded-lg shadow-xl p-2.5"
              style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Style pills */}
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground mr-1">Frame</span>
                {framePickerOptions.map(f => {
                  const isShadowColor = frameColorOptions.some(c => c.id === wallFrameStyle);
                  const isActive = f.id === 'shadow-box' ? isShadowColor : wallFrameStyle === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        onWallFrameStyleChange(f.id);
                        if (f.id !== 'shadow-box') setShowFramePicker(false);
                      }}
                      className={`px-1.5 py-0.5 text-[9px] rounded-md transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
              {/* Color circles */}
              <div className="flex items-center gap-1.5">
                {frameColorOptions.map(cf => {
                  const locked = !cf.free && !isPremium;
                  return (
                    <button
                      key={cf.id}
                      onClick={() => {
                        if (locked) { onRequestUpgrade?.(); return; }
                        onWallFrameStyleChange(cf.id);
                        setShowFramePicker(false);
                      }}
                      className={`relative w-5 h-5 rounded-full transition-all flex-shrink-0 ${
                        wallFrameStyle === cf.id ? 'ring-1.5 ring-primary ring-offset-1 ring-offset-popover scale-110' : 'hover:scale-110'
                      } ${cf.id === 'none' ? 'border border-border border-dashed' : 'border border-border/40'} ${
                        locked ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      style={{ background: cf.color }}
                      title={locked ? 'Premium' : cf.label}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
        {/* Inner canvas */}
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={(e) => { e.stopPropagation(); handleDrop(e); }}
          className="relative overflow-hidden"
          style={{
            width: w,
            height: h,
            background: bgTextureUrl || frameStyle.innerBg,
            backgroundSize: bgTextureUrl ? 'cover' : undefined,
            boxShadow: `inset 0 1px 4px ${frameStyle.shadow}`,
          }}
        >
          {/* Custom template background reference */}
          {customTemplate && (
            <div
              className="absolute inset-0 pointer-events-none bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: `url(${customTemplate.dataUrl})`,
                opacity: templateOpacity,
                zIndex: 1,
              }}
            />
          )}

          {/* Free-placed elements (always rendered, even in vibe mode) */}
          <div className="absolute inset-0" style={{ zIndex: 20, pointerEvents: 'none' }}>
            {elements.map(el => (
              <CanvasElementComponent
                key={el.id}
                element={el}
                isSelected={el.id === selectedId}
                onSelect={() => onSelect(el.id)}
                onUpdate={(updates) => onUpdate(el.id, updates)}
                onDelete={() => onDeleteElement(el.id)}
                onMoveToTable={(mouseX, mouseY) => {
                  // Convert mouse position to table-relative coords
                  if (containerRef.current) {
                    const tableRect = containerRef.current.getBoundingClientRect();
                    onMoveToTable(el.id, mouseX - tableRect.left - 40, mouseY - tableRect.top - 40);
                  }
                }}
                canvasRef={canvasRef}
                customTextures={customTextures}
                kidMode={kidMode}
              />
            ))}
          </div>

          {/* Kid mode: action bubbles around selected swatch */}
          {kidMode && selectedId && elements.find(e => e.id === selectedId) && onUpdateElement && onUpdateEffects && onDuplicateElement && (
            <KidSwatchBubbles
              element={elements.find(e => e.id === selectedId)!}
              isOpen={true}
              onClose={() => onSelect(null)}
              onUpdate={(updates) => onUpdateElement(selectedId!, updates)}
              onUpdateEffects={(effects) => onUpdateEffects(selectedId!, effects)}
              onDuplicate={() => onDuplicateElement(selectedId!)}
              onDelete={() => { onDeleteElement(selectedId!); onSelect(null); }}
            />
          )}

          {/* Vibe outline overlay */}
          {activeVibe && (
            <VibeOutline
              vibe={activeVibe}
              fills={vibeFills}
              selectedSectionId={selectedSectionId}
              canvasWidth={w}
              canvasHeight={h}
              sectionTransforms={sectionTransforms}
              onSelectSection={onSelectSection}
              onDropInSection={onDropInSection}
              onFillBackground={onFillBackground}
              onDropAsSwatch={onDropAsSwatch}
              onDetachSection={onDetachSection}
              onDeleteSection={onDeleteSection}
              onDuplicateSection={onDuplicateSection}
              onUpdateSectionTransform={onUpdateSectionTransform}
              customTextures={customTextures}
            />
          )}

          {/* Freehand draw overlay */}
          {drawMode && onFinishDraw && onCancelDraw && (
            <DrawOverlay
              canvasWidth={w}
              canvasHeight={h}
              onFinishDraw={onFinishDraw}
              onCancel={onCancelDraw}
              crayonMode={crayonMode}
              canUndo={elements.length > 0}
              onUndoLast={() => {
                // Delete the most recently added element
                const lastEl = elements[elements.length - 1];
                if (lastEl) onDeleteElement(lastEl.id);
              }}
            />
          )}
        </div>
      </div>

      {/* Contact shadow where canvas meets shelf */}
      {easelMode && (
        <div style={{ width: w + 20, height: 3, background: 'rgba(0,0,0,0.12)', borderRadius: '0 0 2px 2px', marginTop: -1, zIndex: 11 }} />
      )}

      {/* Shelf / horizontal ledge — canvas rests on this */}
      {easelMode && (
        <div className="pointer-events-none" style={{
          width: w + 60,
          zIndex: 11,
          marginTop: 0,
        }}>
          <div style={{ width: '100%', height: 10, background: '#D8B48A', borderRadius: 2, boxShadow: '0 3px 8px rgba(0,0,0,0.12)' }} />
          <div style={{ width: '100%', height: 5, background: '#C69C6D', borderRadius: '0 0 3px 3px' }} />
        </div>
      )}
      </div>

      {/* Easel/Desk toggle — draggable on the floor */}
      {onToggleEasel && kidMode && (() => {
        const btnKey = 'kid-easel-btn-pos-v2';
        return (
          <div
            className="absolute z-20 cursor-grab active:cursor-grabbing"
            style={{
              left: easelBtnPos.x,
              top: easelBtnPos.y,
              touchAction: 'none',
              userSelect: 'none',
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;
              const origX = easelBtnPos.x;
              const origY = easelBtnPos.y;
              let moved = false;

              const onMove = (ev: PointerEvent) => {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
                if (!containerRef.current) return;
                const r = containerRef.current.getBoundingClientRect();
                const nx = Math.max(0, Math.min(r.width - 140, origX + dx));
                const ny = Math.max(0, Math.min(r.height - 44, origY + dy));
                setEaselBtnPos({ x: nx, y: ny });
              };
              const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                if (!moved) onToggleEasel();
                try { localStorage.setItem(btnKey, JSON.stringify(easelBtnPos)); } catch {}
              };
              window.addEventListener('pointermove', onMove);
              window.addEventListener('pointerup', onUp);
            }}
          >
            <div className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold shadow-lg border border-border/30 bg-popover text-foreground pointer-events-none select-none">
              {kidMode ? (easelMode ? '🪑' : '🧍') : (easelMode ? '🖥️' : '🧍')}
              <span>{kidMode ? (easelMode ? 'Sit Down' : 'Stand Up') : (easelMode ? 'Exit Canvas' : 'Stand Up')}</span>
            </div>
          </div>
        );
      })()}

      {/* Kid Tool Boxes on the table — each individually draggable */}
      {kidMode && onToggleBox && (() => {
        const lbl = getLabels(true, lang);
        const boxes: Array<{ id: ToolboxId; label: string; variant: 'colors'|'frame'|'shapes'|'letters'; onToggle: () => void }> = [
          { id: 'textures', label: lbl.colors, variant: 'colors', onToggle: () => { onToggleBox('textures'); onKidTutorialColor?.(); } },
          { id: 'tools', label: lbl.frame, variant: 'frame', onToggle: () => { onToggleBox('tools'); onKidTutorialFrame?.(); } },
          { id: 'stencils', label: lbl.shapes, variant: 'shapes', onToggle: () => onToggleBox('stencils') },
          { id: 'letters', label: lbl.letters, variant: 'letters', onToggle: () => onToggleBox('letters') },
        ];
        return (
          <>
            {boxes.map((b, i) => {
              const rawPos = toolboxPositions[b.id] ?? getDefaultToolboxPosition(i, boxes.length);
              const pos = getSafeToolboxPosition(rawPos);
              return (
                <div
                  key={b.id}
                  className="absolute z-[25] cursor-grab active:cursor-grabbing"
                  style={{ left: pos.x, top: pos.y, touchAction: 'none', userSelect: 'none' }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    draggingBoxId.current = b.id;
                    boxDragMoved.current = false;
                    boxDragOffset.current = { mx: e.clientX, my: e.clientY, bx: pos.x, by: pos.y };
                    setIsAnyBoxDragging(true);
                  }}
                  onClickCapture={(e) => {
                    if (boxDragMoved.current) {
                      e.stopPropagation();
                      e.preventDefault();
                      boxDragMoved.current = false;
                    }
                  }}
                >
                  <KidToolBox
                    id={b.id}
                    label={b.label}
                    variant={b.variant}
                    isOpen={activeBox === b.id}
                    onToggle={b.onToggle}
                  />
                </div>
              );
            })}
          </>
        );
      })()}

      {/* Desk Nameplate — on the wood, angled outward toward user */}
      {!easelMode && kidMode && (
        <div
          className="absolute z-20"
          style={{
            top: 38,
            left: 40,
            perspective: '400px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ width: 200 }}>
            {/* Shadow cast on desk */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: 4,
              right: 4,
              height: 14,
              background: 'rgba(0,0,0,0.18)',
              borderRadius: '50%',
              filter: 'blur(10px)',
              pointerEvents: 'none',
            }} />

            {/* Nameplate body — tilted outward toward the viewer */}
            <div style={{
              transform: 'rotateX(-15deg)',
              transformOrigin: 'bottom center',
            }}>
              {/* Front face */}
              <div style={{
                background: 'linear-gradient(180deg, #2A2A2A 0%, #1F1F1F 100%)',
                padding: '9px 16px 7px',
                borderRadius: '2px 2px 0 0',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.4), 0 -2px 8px rgba(0,0,0,0.15)',
                position: 'relative',
              }}>
                {/* Top edge shine */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px 2px 0 0',
                }} />
                {/* Editable name + "'s Desk" */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  gap: 0,
                }}>
                  <input
                    type="text"
                    value={workstationName}
                    onChange={(e) => onWorkstationNameChange(e.target.value)}
                    className="bg-transparent outline-none border-none text-center"
                    style={{
                      color: '#EAEAEA',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      fontFamily: "'Inter', 'system-ui', sans-serif",
                      width: workstationName.length > 0 ? `${Math.max(workstationName.length * 7, 40)}px` : '60px',
                      maxWidth: 120,
                      padding: 0,
                      margin: 0,
                    }}
                    placeholder="Your Name"
                  />
                  <span style={{
                    color: 'rgba(234,234,234,0.45)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    fontFamily: "'Inter', 'system-ui', sans-serif",
                  }}>'s {kidMode ? 'Art Table' : 'Workspace'}</span>
                </div>
              </div>

              {/* Base strip */}
              <div style={{
                background: '#2A2A2A',
                height: 5,
                borderRadius: '0 0 2px 2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }} />
            </div>

            {/* Thickness edge visible from the tilt */}
            <div style={{
              height: 3,
              background: '#181818',
              borderRadius: '0 0 2px 2px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              marginTop: -1,
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Table Swatch Component ──
import { X, Copy, Scissors } from 'lucide-react';
import { vibes } from '@/data/vibes';
import { letterStencils, numberSymbolStencils } from '@/data/letterStencils';

const allStencilVibes = [...vibes, ...letterStencils, ...numberSymbolStencils];

interface TableSwatchProps {
  element: TableElement;
  texture: TextureSwatch | null;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TableElement>) => void;
  onDelete: () => void;
  onDuplicateSection?: (vibeId: string, sectionId: string, parentElement: TableElement) => void;
  onDetachSection?: (vibeId: string, sectionId: string, parentElement: TableElement) => void;
}

function TableSwatch({ element, texture, isSelected, onSelect, onUpdate, onDelete, onDuplicateSection, onDetachSection }: TableSwatchProps) {
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: element.x, elY: element.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [element.x, element.y, onSelect]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    onUpdate({ x: dragStart.current.elX + dx, y: dragStart.current.elY + dy });
  }, [isDragging, onUpdate]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // If this is a stencil element, render SVG outline with clickable sections
  const vibe = element.vibeId ? allStencilVibes.find(v => v.id === element.vibeId) : null;

  if (vibe) {
    // Single detached section piece
    const isDetachedPiece = !!element.clipPathD;
    const sectionsToRender = isDetachedPiece
      ? vibe.sections.filter(s => s.path === element.clipPathD)
      : vibe.sections;

    return (
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={(e) => { e.stopPropagation(); onSelect(); setSelectedSection(null); }}
        className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2 rounded' : ''} active:scale-[0.98] transition-transform`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          touchAction: 'none',
          transform: `rotate(${element.rotation}deg)`,
          zIndex: 5,
          filter: 'drop-shadow(0 3px 6px hsla(220, 20%, 12%, 0.25))',
        }}
      >
        {isSelected && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2.5 -right-2.5 z-50 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            title="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <svg viewBox={vibe.viewBox} className="w-full h-full">
          {sectionsToRender.map(section => (
            <path
              key={section.id}
              d={section.path}
              fill={section.tone === 'dark' ? 'hsl(220, 20%, 25%)' : section.tone === 'light' ? 'hsl(40, 20%, 90%)' : section.tone === 'accent' ? 'hsl(24, 60%, 50%)' : 'hsl(220, 15%, 55%)'}
              stroke={!isDetachedPiece && selectedSection === section.id ? 'hsl(var(--primary))' : 'hsl(220, 15%, 40%)'}
              strokeWidth={!isDetachedPiece && selectedSection === section.id ? 3 : 1.5}
              opacity={!isDetachedPiece && selectedSection && selectedSection !== section.id ? 0.5 : 0.85}
              className="cursor-pointer transition-opacity"
              onClick={(e) => {
                if (isDetachedPiece) return;
                e.stopPropagation();
                onSelect();
                setSelectedSection(prev => prev === section.id ? null : section.id);
              }}
            />
          ))}
        </svg>

        {/* Section action toolbar — only for full stencils, not detached pieces */}
        {!isDetachedPiece && isSelected && selectedSection && (
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-popover border border-border rounded-md shadow-lg p-0.5 z-50"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { if (onDuplicateSection && element.vibeId) onDuplicateSection(element.vibeId, selectedSection, element); }}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Duplicate section"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={() => { if (onDetachSection && element.vibeId) onDetachSection(element.vibeId, selectedSection, element); setSelectedSection(null); }}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Cut / detach section"
            >
              <Scissors className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Regular texture swatch
  const clipStyle = element.clipPathD
    ? `path('${element.clipPathD}')`
    : 'polygon(3% 1%, 48% 0%, 97% 2%, 99% 48%, 98% 97%, 52% 99%, 2% 98%, 0% 52%)';

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''} active:scale-[0.98] transition-transform`}
      style={{
        left: element.x,
        top: element.y,
        touchAction: 'none',
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: 5,
        filter: 'drop-shadow(0 4px 8px hsla(220, 20%, 12%, 0.3))',
        clipPath: clipStyle,
      }}
    >
      {isSelected && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute -top-2.5 -right-2.5 z-50 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          style={{ clipPath: 'none' }}
          title="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      {texture && (
        <div
          className="w-full h-full"
          style={{
            background: texture.cssBackground,
            backgroundSize: texture.cssBackground.startsWith('url(') ? 'cover' : '40px 40px',
          }}
        />
      )}
    </div>
  );
}
