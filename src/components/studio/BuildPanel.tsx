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
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-border bg-secondary/30 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-foreground">{kidMode ? 'Shapes' : 'Stencils'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Reference Image upload — mirrors Textures' Upload button */}
          {!customTemplate ? (
            <>
              <button
                onClick={() => isPremium ? templateInputRef.current?.click() : onRequestUpgrade()}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded transition-colors ${
                  isPremium
                    ? 'bg-secondary text-secondary-foreground hover:bg-accent'
                    : 'bg-secondary/50 text-muted-foreground/60 cursor-not-allowed'
                }`}
                title={isPremium ? 'Upload reference image' : 'Premium feature'}
              >
                {isPremium ? <ImagePlus className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />} {kidMode ? 'Picture' : 'Reference'}
              </button>
              <input
                ref={templateInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith('image/')) onUploadTemplate(file);
                  e.target.value = '';
                }}
              />
            </>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-muted-foreground truncate max-w-[60px]" title={customTemplate.name}>
                📷 {customTemplate.name}
              </span>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={templateOpacity * 100}
                onChange={(e) => onTemplateOpacityChange(Number(e.target.value) / 100)}
                className="w-10 h-1 accent-primary"
              />
              <button onClick={onClearTemplate} className="p-0.5 rounded hover:bg-secondary transition-colors" title="Remove reference">
                <X className="w-2.5 h-2.5 text-muted-foreground" />
              </button>
            </div>
          )}
          {!stencilsPoppedOut && (
            <button
              onClick={onPopOutStencils}
              className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Pop out to floating panel"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

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
