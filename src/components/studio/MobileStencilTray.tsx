import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vibe } from '@/types/studio';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { RightSidebar } from './RightSidebar';
import { ChevronUp, ChevronDown, GripHorizontal, X, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type TrayState = 'hidden' | 'peek' | 'expanded';

interface StencilTrayProps {
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
  focusMode?: boolean;
}

export function StencilTray(props: StencilTrayProps) {
  const [state, setState] = useState<TrayState>('peek');
  const isMobile = useIsMobile();

  const cycle = () => {
    setState(s => s === 'hidden' ? 'peek' : s === 'peek' ? 'expanded' : 'peek');
  };

  const heights: Record<TrayState, string | number> = {
    hidden: 0,
    peek: 48,
    expanded: isMobile ? '50vh' : '40vh',
  };

  const focusClass = props.focusMode && state !== 'hidden'
    ? 'opacity-20 hover:opacity-100 transition-opacity duration-300'
    : 'transition-opacity duration-300';

  if (state === 'hidden') {
    return (
      <button
        onClick={() => setState('peek')}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-popover/90 border border-border shadow-md text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm"
      >
        <ChevronUp className="w-3 h-3 inline mr-1" />
        Stencils
      </button>
    );
  }

  return (
    <motion.div
      className={`absolute bottom-0 left-0 right-0 z-40 bg-popover/95 backdrop-blur-sm border-t border-border shadow-lg rounded-t-xl overflow-hidden ${focusClass}`}
      animate={{ height: heights[state] }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full">
        {/* Drag handle */}
        <button onClick={cycle} className="flex justify-center py-0.5 shrink-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors">
          <GripHorizontal className="w-5 h-5" />
        </button>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1 shrink-0 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Templates & Stencils</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={cycle} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              {state === 'expanded' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
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
    </motion.div>
  );
}
