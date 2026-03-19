import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vibe, FrameSize } from '@/types/studio';
import { FrameStyle } from '@/types/wall';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { RightSidebar } from './RightSidebar';
import { ChevronUp, ChevronDown, GripHorizontal, X, Sparkles } from 'lucide-react';

type TrayState = 'hidden' | 'peek' | 'expanded';

interface MobileStencilTrayProps {
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
}

export function MobileStencilTray(props: MobileStencilTrayProps) {
  const [state, setState] = useState<TrayState>('peek');

  const cycle = () => {
    setState(s => s === 'hidden' ? 'peek' : s === 'peek' ? 'expanded' : 'peek');
  };

  const heights: Record<TrayState, string | number> = {
    hidden: 0,
    peek: 52,
    expanded: '55vh',
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-40 bg-popover border-t border-border shadow-lg rounded-t-xl overflow-hidden"
      animate={{ height: heights[state] }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full">
        {/* Drag handle at top */}
        <button
          onClick={cycle}
          className="flex justify-center py-1 shrink-0 text-muted-foreground/40"
        >
          <GripHorizontal className="w-5 h-5" />
        </button>

        {/* Mini toolbar */}
        <div className="flex items-center justify-between px-3 py-1 shrink-0 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Templates & Stencils</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={cycle} className="p-1 text-muted-foreground">
              {state === 'expanded' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button onClick={() => setState('hidden')} className="p-1 text-muted-foreground">
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
