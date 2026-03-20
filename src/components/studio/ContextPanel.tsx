import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasElement, MaterialEffects, Vibe } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { FloatingToolbar } from './FloatingToolbar';
import { RightSidebar } from './RightSidebar';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { Sparkles, Frame, Image, Layers } from 'lucide-react';

type ContextMode = 'templates' | 'element' | 'frame' | 'canvas';

interface ContextPanelProps {
  // Selection state
  selectedElement: CanvasElement | null;
  selectedId: string | null;
  activeVibe: Vibe | null;
  // Element actions
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateEffects: (id: string, effects: Partial<MaterialEffects>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  // Frame props
  frameSize: FrameSize;
  wallFrameStyle: FrameStyle;
  onFrameSizeChange: (size: FrameSize) => void;
  onWallFrameStyleChange: (style: FrameStyle) => void;
  // Stencil/template props
  activeVibeId: string | null;
  isPremium: boolean;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onRequestUpgrade: () => void;
  onGenerateMood: (prompt: string) => void;
  isGeneratingMood: boolean;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
  // Canvas background
  backgroundTextureId: string | null;
}

// Frame sizes kept internally for potential future use

const frameStyleList: { id: FrameStyle; label: string }[] = [
  { id: 'gold', label: 'Gold' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'copper', label: 'Copper' },
  { id: 'silver', label: 'Silver' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'shadow-box', label: 'Shadow Box' },
  { id: 'wood', label: 'Wood' },
  { id: 'floating', label: 'Floating' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'black', label: 'Black' },
  { id: 'none', label: 'None' },
];

function getContextMode(selectedElement: CanvasElement | null, activeVibe: Vibe | null): ContextMode {
  if (selectedElement) return 'element';
  return 'templates';
}

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export function ContextPanel(props: ContextPanelProps) {
  const mode = getContextMode(props.selectedElement, props.activeVibe);

  const modeLabel = {
    templates: { icon: Sparkles, label: 'Templates & Stencils' },
    element: { icon: Layers, label: 'Element Properties' },
    frame: { icon: Frame, label: 'Frame Settings' },
    canvas: { icon: Image, label: 'Canvas Settings' },
  }[mode];

  return (
    <div className="flex flex-col h-full bg-popover">
      {/* Mode indicator header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/30 shrink-0">
        <modeLabel.icon className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">{modeLabel.label}</span>
      </div>

      {/* Animated content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 overflow-y-auto"
          >
            {mode === 'element' && props.selectedElement && props.selectedId && (
              <div className="flex flex-col">
                <FloatingToolbar
                  element={props.selectedElement}
                  onUpdate={(updates) => props.onUpdateElement(props.selectedId!, updates)}
                  onUpdateEffects={(effects) => props.onUpdateEffects(props.selectedId!, effects)}
                  onDuplicate={() => props.onDuplicateElement(props.selectedId!)}
                  onDelete={() => props.onDeleteElement(props.selectedId!)}
                />

                {/* Frame controls inline */}
                <div className="px-3 py-3 border-t border-border">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Canvas Size</p>
                  <div className="flex gap-1">
                    {frameSizes.map(s => (
                      <button
                        key={s}
                        onClick={() => props.onFrameSizeChange(s)}
                        className={`px-2.5 py-1 text-[10px] rounded-md transition-colors ${
                          props.frameSize === s
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-3 py-3 border-t border-border">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Frame Style</p>
                  <div className="flex flex-wrap gap-1">
                    {frameStyleList.map(f => (
                      <button
                        key={f.id}
                        onClick={() => props.onWallFrameStyleChange(f.id)}
                        className={`px-2 py-1 text-[10px] rounded-md transition-colors ${
                          props.wallFrameStyle === f.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === 'templates' && (
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
