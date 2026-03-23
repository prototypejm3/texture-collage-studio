import { useIsMobile } from '@/hooks/use-mobile';
import { getLabels } from '@/lib/labels';

interface Props {
  kidMode: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function MobileCanvasActions({ kidMode, onUndo, onRedo, onReset, canUndo, canRedo }: Props) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  const labels = getLabels(kidMode);

  const btnStyle = kidMode
    ? {
        background: '#f7f0e8',
        border: '1.5px solid #e8ddd0',
        borderRadius: 20,
        height: 36,
        color: '#6b4c2a',
        fontSize: 12,
        fontWeight: 600 as const,
      }
    : {
        background: '#f0ebe3',
        border: '1px solid #e2ddd6',
        borderRadius: 20,
        height: 36,
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: 500 as const,
      };

  return (
    <div className="flex gap-2 px-3 py-1.5 md:hidden">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex-1 flex items-center justify-center gap-1.5 transition-transform active:scale-[0.94] disabled:opacity-35"
        style={btnStyle}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M10 2L4 8L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="flex-1 flex items-center justify-center gap-1.5 transition-transform active:scale-[0.94] disabled:opacity-35"
        style={btnStyle}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M6 2L12 8L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Redo
      </button>
      <button
        onClick={onReset}
        className="flex-1 flex items-center justify-center gap-1.5 transition-transform active:scale-[0.94]"
        style={btnStyle}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14C5.8 14 3.9 12.8 3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <polyline points="1,8 3,11 5.5,9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        {kidMode ? 'Start Over' : 'Reset'}
      </button>
    </div>
  );
}
