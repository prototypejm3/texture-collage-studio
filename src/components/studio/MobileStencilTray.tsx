import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Vibe } from '@/types/studio';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { RightSidebar } from './RightSidebar';
import { GripHorizontal, X, Sparkles, Minimize2, Maximize2, ArrowLeftToLine } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StencilTrayProps {
  activeVibeId: string | null;
  isPremium: boolean;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onPlaceStencil: () => void;
  onRequestUpgrade: () => void;
  onGenerateMood: (prompt: string) => void;
  isGeneratingMood: boolean;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
  focusMode?: boolean;
  onDockBack?: () => void;
}

export function StencilTray(props: StencilTrayProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const focusClass = props.focusMode && isOpen
    ? 'opacity-20 hover:opacity-100 transition-opacity duration-300'
    : 'transition-opacity duration-300';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-2 right-2 z-40 px-2.5 py-1 rounded-full bg-popover border border-border shadow-sm text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
        Stencils
      </button>
    );
  }

  const panelWidth = isMobile ? '85vw' : isExpanded ? 420 : 300;
  const panelHeight = isMobile ? '50vh' : isExpanded ? 400 : 260;

  return (
    <div
      className={`absolute z-40 ${focusClass}`}
      style={{
        right: isMobile ? undefined : 16,
        bottom: isMobile ? 0 : 16,
        left: isMobile ? 0 : undefined,
        transform: isMobile ? undefined : `translate(${pos.x}px, ${pos.y}px)`,
        width: panelWidth,
        height: panelHeight,
      }}
    >
      <div className="flex flex-col h-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Drag handle + toolbar */}
        <div
          className="flex items-center justify-between px-2 py-1 shrink-0 border-b border-border/40 bg-secondary/30 select-none"
          onPointerDown={!isMobile ? handlePointerDown : undefined}
          onPointerMove={!isMobile ? handlePointerMove : undefined}
          onPointerUp={!isMobile ? handlePointerUp : undefined}
          style={{ cursor: isMobile ? undefined : isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          <div className="flex items-center gap-1">
            {!isMobile && <GripHorizontal className="w-3 h-3 text-muted-foreground/40" />}
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Stencils</span>
          </div>
          <div className="flex items-center gap-0.5">
            {!isMobile && props.onDockBack && (
              <button
                onClick={() => { props.onDockBack?.(); setIsOpen(false); }}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                title="Dock back to sidebar"
              >
                <ArrowLeftToLine className="w-3 h-3" />
              </button>
            )}
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(e => !e)}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                title={isExpanded ? 'Shrink' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <RightSidebar
            activeVibeId={props.activeVibeId}
            isPremium={props.isPremium}
            onSelectVibe={props.onSelectVibe}
            onShuffleVibeFills={props.onShuffleVibeFills}
            onRequestUpgrade={props.onRequestUpgrade}
            onGenerateMood={props.onGenerateMood}
            isGeneratingMood={props.isGeneratingMood}
            customTemplate={props.customTemplate}
            templateOpacity={props.templateOpacity}
            onUploadTemplate={props.onUploadTemplate}
            onClearTemplate={props.onClearTemplate}
            onTemplateOpacityChange={props.onTemplateOpacityChange}
          />
        </div>
      </div>
    </div>
  );
}
