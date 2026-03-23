import { useRef, useState, useEffect } from 'react';
import { Vibe } from '@/types/studio';
import { CustomTemplate } from '@/hooks/useCustomTemplate';
import { RightSidebar } from './RightSidebar';
import { Sparkles, ExternalLink, ImagePlus, Lock, X } from 'lucide-react';

interface BuildPanelProps {
  isPremium: boolean;
  onRequestUpgrade: () => void;
  activeVibeId: string | null;
  onSelectVibe: (vibe: Vibe) => void;
  onShuffleVibeFills: () => void;
  onPlaceStencil: () => void;
  onGenerateMood: (prompt: string) => void;
  isGeneratingMood: boolean;
  customTemplate: CustomTemplate | null;
  templateOpacity: number;
  onUploadTemplate: (file: File) => void;
  onClearTemplate: () => void;
  onTemplateOpacityChange: (val: number) => void;
  stencilsPoppedOut: boolean;
  onPopOutStencils: () => void;
}

export function BuildPanel({
  isPremium, onRequestUpgrade,
  activeVibeId, onSelectVibe, onShuffleVibeFills, onPlaceStencil,
  onGenerateMood, isGeneratingMood,
  customTemplate, templateOpacity, onUploadTemplate, onClearTemplate, onTemplateOpacityChange,
  stencilsPoppedOut, onPopOutStencils,
}: BuildPanelProps) {
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  return (
    <div className="flex flex-col h-full bg-popover">
      {/* Pop-out button only when needed */}

      <div className="flex-1 overflow-y-auto">
        {!stencilsPoppedOut ? (
          <div className="stencils-compact">
            <RightSidebar
              activeVibeId={activeVibeId}
              isPremium={isPremium}
              onSelectVibe={onSelectVibe}
              onShuffleVibeFills={onShuffleVibeFills}
              onPlaceStencil={onPlaceStencil}
              onRequestUpgrade={onRequestUpgrade}
              onGenerateMood={onGenerateMood}
              isGeneratingMood={isGeneratingMood}
              customTemplate={customTemplate}
              templateOpacity={templateOpacity}
              onUploadTemplate={onUploadTemplate}
              onClearTemplate={onClearTemplate}
              onTemplateOpacityChange={onTemplateOpacityChange}
              compact
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs p-4 text-center">
            Stencils are in the floating panel. Click the pop-out button to bring them back.
          </div>
        )}
      </div>
    </div>
  );
}
