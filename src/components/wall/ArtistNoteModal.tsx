import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface ArtistNoteModalProps {
  isOpen: boolean;
  designName: string;
  onSubmit: (note: string) => void;
  onClose: () => void;
}

export function ArtistNoteModal({ isOpen, designName, onSubmit, onClose }: ArtistNoteModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.92 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-[340px] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scroll shape */}
          <div className="relative">
            {/* Top curl */}
            <div
              className="h-6 rounded-t-2xl"
              style={{
                background: 'linear-gradient(180deg, hsl(32 45% 72%) 0%, hsl(34 38% 78%) 60%, hsl(36 30% 84%) 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}
            />

            {/* Parchment body */}
            <div
              className="px-7 py-6"
              style={{
                background: 'linear-gradient(180deg, hsl(36 30% 84%) 0%, hsl(38 32% 88%) 20%, hsl(40 28% 91%) 80%, hsl(36 30% 84%) 100%)',
                backgroundImage: `
                  linear-gradient(180deg, hsl(36 30% 84%) 0%, hsl(38 32% 88%) 20%, hsl(40 28% 91%) 80%, hsl(36 30% 84%) 100%),
                  url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4a97d' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-8 right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" style={{ color: 'hsl(32 30% 40%)' }} />
              </button>

              {/* Title */}
              <p
                className="text-center text-[10px] uppercase tracking-[0.2em] mb-1"
                style={{ color: 'hsl(32 30% 50%)', fontWeight: 600 }}
              >
                Gallery Submission
              </p>
              <p
                className="text-center text-sm font-semibold mb-4 truncate"
                style={{ color: 'hsl(32 20% 25%)', fontFamily: 'Georgia, serif' }}
              >
                "{designName}"
              </p>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'hsl(32 30% 70%)' }} />
                <span className="text-xs" style={{ color: 'hsl(32 30% 55%)' }}>📜</span>
                <div className="flex-1 h-px" style={{ background: 'hsl(32 30% 70%)' }} />
              </div>

              {/* Label */}
              <label
                className="block text-[10px] uppercase tracking-[0.15em] mb-2"
                style={{ color: 'hsl(32 30% 45%)', fontWeight: 600 }}
              >
                Note from the Artist
              </label>

              {/* Textarea */}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 280))}
                placeholder="Share the story behind your piece…"
                rows={4}
                className="w-full rounded-lg px-3 py-2.5 text-xs leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                style={{
                  background: 'hsl(40 30% 95%)',
                  border: '1px solid hsl(32 25% 75%)',
                  color: 'hsl(32 20% 20%)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                }}
                autoFocus
              />
              <p className="text-right text-[9px] mt-1" style={{ color: 'hsl(32 25% 60%)' }}>
                {note.length}/280
              </p>

              {/* Submit button */}
              <button
                onClick={() => {
                  onSubmit(note.trim());
                  setNote('');
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, hsl(32 60% 45%), hsl(28 55% 40%))',
                  color: 'hsl(40 30% 95%)',
                  boxShadow: '0 2px 8px rgba(139,90,43,0.3)',
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Submit to Gallery
              </button>

              <p
                className="text-center text-[9px] mt-2.5 leading-relaxed"
                style={{ color: 'hsl(32 25% 55%)' }}
              >
                Your piece will be reviewed before appearing in the gallery
              </p>
            </div>

            {/* Bottom curl */}
            <div
              className="h-6 rounded-b-2xl"
              style={{
                background: 'linear-gradient(0deg, hsl(32 45% 72%) 0%, hsl(34 38% 78%) 60%, hsl(36 30% 84%) 100%)',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
