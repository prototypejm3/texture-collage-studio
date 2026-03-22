import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStudio } from '@/hooks/useStudio';
import { useCustomTextures } from '@/hooks/useCustomTextures';
import { useCustomTemplate } from '@/hooks/useCustomTemplate';
import { useWall } from '@/hooks/useWall';
import { useUserTier } from '@/hooks/useUserTier';
import { Canvas, TableSurface, TableElement } from '@/components/studio/Canvas';
import { TopToolbar } from '@/components/studio/TopToolbar';
import { BottomBar } from '@/components/studio/BottomBar';
import { BuildPanel } from '@/components/studio/BuildPanel';
import { TextureLibrary } from '@/components/studio/TextureLibrary';
import { PaywallModal } from '@/components/wall/PaywallModal';
import { FloatingToolbar } from '@/components/studio/FloatingToolbar';
import { GenerateVibeModal } from '@/components/studio/GenerateVibeModal';
import { AmbientSoundPlayer } from '@/components/wall/AmbientSound';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { useKidOnboarding, KidOnboardingOverlay } from '@/components/studio/KidOnboarding';
import { vibes } from '@/data/vibes';
import { letterStencils, numberSymbolStencils } from '@/data/letterStencils';

const allStencilVibesForDesk = [...vibes, ...letterStencils, ...numberSymbolStencils];
import { useGenerateVibe } from '@/hooks/useGenerateVibe';
import { Vibe, StencilMode } from '@/types/studio';
import { Monitor, X, Save, Download } from 'lucide-react';
import { AmbientSound as AmbientSoundType } from '@/types/wall';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useKidSounds } from '@/hooks/useKidSounds';
import { useKidCelebration } from '@/hooks/useKidCelebration';
import { CelebrationOverlay } from '@/components/studio/CelebrationToast';
import { useKidTutorial } from '@/hooks/useKidTutorial';
import { useVoiceEncouragement } from '@/hooks/useVoiceEncouragement';
import { GhostHand, TutorialReplayButton } from '@/components/studio/GhostHand';
import { TextureTray } from '@/components/studio/MobileTextureTray';
import { StencilTray } from '@/components/studio/MobileStencilTray';
import { useActiveBox } from '@/hooks/useActiveBox';
import { BoxButton } from '@/components/studio/BoxButton';
import { ExpandableDrawer } from '@/components/studio/ExpandableDrawer';
import { TextPanel } from '@/components/studio/TextPanel';


                  {/* Content */}
                  <div className="overflow-y-auto overflow-x-visible" style={{
                    maxHeight: isMobile ? 'calc(45vh - 28px)' : 336,
                    background: sounds.kidMode ? 'hsl(var(--popover))' : '#f5ede0',
                    borderRadius: sounds.kidMode ? undefined : '0 0 16px 16px',
                  }}>
                    {activeBox === 'textures' && (
                      <TextureLibrary
                        onDragStart={handleDragStartLib}
                        onTextureClick={handleTextureClick}
                        activeSectionId={studio.selectedSectionId}
                        customTextures={customTextures}
                        onUploadTexture={handleUploadTexture}
                        onRemoveCustomTexture={removeCustomTexture}
                        isPremium={isPremium}
                        onRequestUpgrade={() => setShowPaywall(true)}
                        applyMode={textureApplyMode}
                        onApplyModeChange={setTextureApplyMode}
                        backgroundTextureId={studio.backgroundTextureId}
                        drawMode={studio.drawMode}
                        onToggleDrawMode={() => { studio.setCrayonMode(false); studio.setDrawMode(!studio.drawMode); }}
                        nextShape={studio.nextShape}
                        onSetNextShape={(shape) => { studio.setNextShape(shape); sounds.playShapeSelect(shape); }}
                        crayonMode={studio.crayonMode}
                        crayonTextureId={studio.crayonTextureId}
                        onToggleCrayonMode={() => {
                          const next = !studio.crayonMode;
                          studio.setCrayonMode(next);
                          if (next) {
                            studio.setDrawMode(false);
                          } else {
                            studio.setDrawMode(false);
                            studio.setCrayonTextureId(null);
                          }
                        }}
                        onSetCrayonTexture={(id) => { studio.setCrayonTextureId(id); studio.setDrawMode(true); }}
                      />
                    )}

                    {activeBox === 'tools' && (
                      <div className="p-3">
                        <BottomBar
                          wallFrameStyle={studio.wallFrameStyle}
                          onWallFrameStyleChange={studio.setWallFrameStyle}
                          onClear={handleClearAll}
                          onSave={handleExport}
                          onSaveToWall={handleSaveToWall}
                          isPremium={isPremium}
                          onRequestUpgrade={() => setShowPaywall(true)}
                          tableSurface={tableSurface}
                          onTableSurfaceChange={setTableSurface}
                          easelMode={easelMode}
                          onToggleEasel={() => setEaselMode(prev => !prev)}
                          backgroundTextureId={studio.backgroundTextureId}
                          onBackgroundChange={(id) => studio.setBackgroundTextureId(id)}
                        />
                      </div>
                    )}

                    {activeBox === 'stencils' && (
                      <div>
                        <BuildPanel
                          isPremium={isPremium}
                          onRequestUpgrade={() => setShowPaywall(true)}
                          activeVibeId={studio.activeVibe?.id ?? null}
                          onSelectVibe={handleSelectVibe}
                          onShuffleVibeFills={studio.shuffleVibeFills}
                          onPlaceStencil={studio.placeStencil}
                          onGenerateMood={handleGenerateMood}
                          isGeneratingMood={vibeGen.isGenerating}
                          customTemplate={customTemplate}
                          templateOpacity={templateOpacity}
                          onUploadTemplate={handleUploadTemplate}
                          onClearTemplate={clearTemplate}
                          onTemplateOpacityChange={setTemplateOpacity}
                          stencilsPoppedOut={false}
                          onPopOutStencils={() => {}}
                        />
                      </div>
                    )}

                    {activeBox === 'text' && (
                      <TextPanel
                        onAddText={(text, opts) => {
                          studio.addTextElement(text, 150, 150, opts);
                          closeBox();
                        }}
                        selectedElement={studio.selectedId ? studio.elements.find(e => e.id === studio.selectedId) : null}
                        onUpdateElement={(id, updates) => studio.updateElement(id, updates)}
                      />
                    )}

                    {activeBox === 'toolbox' && studio.elements.length > 0 && (
                      <div className="p-3">
                        <FloatingToolbar
                          element={studio.selectedId ? (studio.elements.find(e => e.id === studio.selectedId) || studio.elements[studio.elements.length - 1]) : studio.elements[studio.elements.length - 1]}
                          onUpdate={(updates) => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) { studio.updateElement(targetId, updates); kidOnboarding.notifyMove(); }
                          }}
                          onUpdateEffects={(effects) => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) { studio.updateEffects(targetId, effects); kidOnboarding.notifyToolUse(); }
                          }}
                          onDuplicate={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) studio.duplicateElement(targetId);
                          }}
                          onDelete={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) { studio.deleteElement(targetId); sounds.playDelete(); sounds.trackAction(); }
                          }}
                          onUndo={studio.undo}
                          onRedo={studio.redo}
                          canUndo={studio.canUndo}
                          canRedo={studio.canRedo}
                          elementCount={studio.elements.length}
                          onBringForward={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) studio.bringForward(targetId);
                          }}
                          onSendBackward={() => {
                            const targetId = studio.selectedId || studio.elements[studio.elements.length - 1]?.id;
                            if (targetId) studio.sendBackward(targetId);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── BOX BUTTONS ── */}
        <div className="relative shrink-0 flex justify-center py-3 overflow-visible" data-box-btn>
          {sounds.kidMode ? (
            /* Kid mode: wooden tray */
            <div
              className="relative flex items-center justify-center gap-3 px-5 py-3"
              style={{
                background: 'linear-gradient(180deg, #a0724a 0%, #8B5E3C 40%, #7a5018 100%)',
                borderRadius: '0 0 10px 10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -4px 8px rgba(0,0,0,0.2)',
                border: '2px solid rgba(0,0,0,0.15)',
                borderTop: 'none',
              }}
            >
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.08) 12px, rgba(255,255,255,0.08) 13px)',
                borderRadius: '0 0 10px 10px',
              }} />
              <div
                className="absolute pointer-events-none"
                style={{
                  top: -14, left: -2, width: 'calc(100% + 4px)', height: 18,
                  background: 'linear-gradient(180deg, #c07830 0%, #a86828 100%)',
                  borderRadius: '6px 6px 0 0',
                  border: '2px solid rgba(0,0,0,0.12)', borderBottom: 'none',
                  transform: 'rotateX(-20deg)', transformOrigin: 'bottom center',
                  boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
                }}
              />
              <BoxButton id="mybox" icon="📦" label="Keep It!" isActive={activeBox === 'mybox'}
                onClick={() => { toggleBox('mybox'); kidTutorial.triggerBox(); }} kidMode={true} />
              <BoxButton id="textures" icon="🎨" label="Colors" isActive={activeBox === 'textures'}
                onClick={() => { toggleBox('textures'); kidTutorial.triggerColor(); }} kidMode={true} />
              <BoxButton id="tools" icon="🖼️" label="Frame" isActive={activeBox === 'tools'}
                onClick={() => { toggleBox('tools'); kidTutorial.triggerFrame(); }} kidMode={true} />
              <BoxButton id="stencils" icon="🧸" label="Shapes" isActive={activeBox === 'stencils'}
                onClick={() => toggleBox('stencils')} kidMode={true} />
            </div>
          ) : (
            /* Adult mode: tools left/center, save/download right */
            <div className="flex items-center justify-between w-full px-4 py-2">
              <div className="flex items-center gap-6">
                <BoxButton id="textures" icon="" label="Swatches" isActive={activeBox === 'textures'}
                  onClick={() => toggleBox('textures')} kidMode={false} />
                <BoxButton id="tools" icon="" label="Display" isActive={activeBox === 'tools'}
                  onClick={() => toggleBox('tools')} kidMode={false} />
                <BoxButton id="stencils" icon="" label="Stencils" isActive={activeBox === 'stencils'}
                  onClick={() => toggleBox('stencils')} kidMode={false} />
                <BoxButton id="text" icon="" label="Text" isActive={activeBox === 'text'}
                  onClick={() => toggleBox('text')} kidMode={false} />
                {studio.elements.length > 0 && (
                  <BoxButton id="toolbox" icon="" label="Tool Box" isActive={activeBox === 'toolbox'}
                    onClick={() => toggleBox('toolbox')} kidMode={false} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSaveToWall} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AmbientSoundPlayer sound={ambientSound} showControl={ambientSound !== 'none'} />

      <GenerateVibeModal
        isOpen={showVibeModal}
        isGenerating={vibeGen.isGenerating}
        generatedVibe={vibeGen.generatedVibe}
        onClose={() => { setShowVibeModal(false); vibeGen.setGeneratedVibe(null); }}
        onGenerate={(prompt) => vibeGen.generateVibe(prompt)}
        onApply={() => {
          if (vibeGen.generatedVibe) {
            const vibe = vibeGen.toVibe(vibeGen.generatedVibe);
            studio.selectVibe(vibe);
            if (vibeGen.generatedVibe.frameChoice) {
              const fc = vibeGen.generatedVibe.frameChoice as any;
              const validFrameStyles = ['gold', 'chrome', 'copper', 'silver', 'minimal', 'shadow-box', 'wood', 'floating', 'polaroid', 'none', 'rainbow'];
              if (validFrameStyles.includes(fc)) {
                studio.setWallFrameStyle(fc);
              }
            }
          }
          setShowVibeModal(false);
          vibeGen.setGeneratedVibe(null);
        }}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => { setShowPaywall(false); setPendingSave(null); }}
        onReplace={handleReplace}
        onUnlock={handleUnlock}
      />

      <svg className="svg-filters" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="wrinkle-light">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" />
          </filter>
          <filter id="wrinkle-medium">
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="6" />
          </filter>
          <filter id="wrinkle-heavy">
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
          </filter>
        </defs>
      </svg>
      <OnboardingTutorial page="studio" />
      {sounds.kidMode && <CelebrationOverlay toasts={celebration.toasts} />}
      {sounds.kidMode && <GhostHand hint={kidTutorial.activeHint} />}
      {sounds.kidMode && <TutorialReplayButton onReplay={kidTutorial.resetAll} />}
      <KidOnboardingOverlay
        step={kidOnboarding.step}
        active={kidOnboarding.active}
        onSkip={kidOnboarding.skip}
        onAdvance={kidOnboarding.advanceTo}
      />
    </div>
  );
};

export default Index;
