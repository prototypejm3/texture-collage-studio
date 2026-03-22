import { motion, AnimatePresence } from 'framer-motion';
import type { HintType } from '@/hooks/useKidTutorial';

interface Props {
  hint: HintType;
}

const HINT_CONFIG: Record<string, { text: string; emoji: string }> = {
  intro: { text: 'Drag things here!', emoji: '👆' },
  drag: { text: 'Try it!', emoji: '👆' },
  box: { text: 'Save it for later!', emoji: '📦' },
  color: { text: 'Tap to change!', emoji: '🎨' },
  trash: { text: 'All done!', emoji: '🗑️' },
};

export function GhostHand({ hint }: Props) {
  if (!hint || !HINT_CONFIG[hint]) return null;
  const { text, emoji } = HINT_CONFIG[hint];

  return (
    <AnimatePresence>
      <motion.div
        key={hint}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="fixed z-[300] pointer-events-none flex flex-col items-center gap-2"
        style={{ bottom: '30%', left: '50%', transform: 'translateX(-50%)' }}
      >
        {/* Ghost hand animation */}
        <motion.div
          animate={{
            y: [0, -20, 0, -20, 0],
            x: hint === 'drag' ? [0, 40, 40, 0, 0] : [0, 0, 0, 0, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: 1,
            ease: 'easeInOut',
          }}
          className="text-4xl opacity-70 drop-shadow-lg"
        >
          {emoji}
        </motion.div>

        {/* Hint text */}
        {text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-popover/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-2 shadow-xl"
          >
            <span className="text-sm font-semibold" style={{ color: '#6b4c2a' }}>
              {text}
            </span>
          </motion.div>
        )}

        {/* Sparkle */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-lg"
        >
          ✨
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Small "?" replay button for parents */
export function TutorialReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <button
      onClick={onReplay}
      className="fixed bottom-4 right-4 z-[250] w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
      title="Replay tutorials"
    >
      ?
    </button>
  );
}
