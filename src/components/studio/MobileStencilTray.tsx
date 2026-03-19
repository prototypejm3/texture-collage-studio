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
    peek: 28,
    expanded: isMobile ? '45vh' : '35vh',
  };

  const focusClass = props.focusMode && state !== 'hidden'
    ? 'opacity-20 hover:opacity-100 transition-opacity duration-300'
    : 'transition-opacity duration-300';

  if (state === 'hidden') {
    return (
      <button
        onClick={() => setState('peek')}
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 px-2.5 py-1 rounded-full bg-popover border border-border shadow-sm text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronUp className="w-2.5 h-2.5 inline mr-0.5" />
        Stencils
      </button>
    );
  }

  return (
    <motion.div
      className={`absolute bottom-0 left-0 right-0 z-40 bg-popover border-t border-border shadow-md rounded-t-lg overflow-hidden ${focusClass}`}
      animate={{ height: heights[state] }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      <div className="flex flex-col h-full">
        {/* Handle */}
        <button onClick={cycle} className="flex justify-center py-px shrink-0 text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors">
          <GripHorizontal className="w-4 h-4" />
        </button>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 py-0.5 shrink-0 border-b border-border/40">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Stencils</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={cycle} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
              {state === 'expanded' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
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
    </motion.div>
  );
}
