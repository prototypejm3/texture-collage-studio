import { SavedDesign } from '@/types/wall';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface TitleCardProps {
  design: SavedDesign;
  isDark?: boolean;
  placement?: 'below' | 'right';
  onUpdateName?: (id: string, name: string) => void;
}

export function TitleCard({ design, isDark, placement = 'below', onUpdateName }: TitleCardProps) {
  const textBase = isDark ? 'text-background/80' : 'text-foreground font-bold';
  const textTitle = isDark ? 'text-background font-bold' : 'text-foreground font-bold';

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(design.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== design.name && onUpdateName) {
      onUpdateName(design.id, trimmed);
    } else {
      setEditValue(design.name);
    }
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`${placement === 'right' ? 'pl-4' : 'mt-2 px-0.5'} select-none`}
    >
      <div className="space-y-[3px] text-left max-w-[220px]">
        {/* Title — editable on click */}
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditValue(design.name); setEditing(false); } }}
            className={`text-[11px] font-normal tracking-[0.04em] leading-snug ${textTitle} bg-transparent border-b border-primary/40 outline-none w-full`}
            style={{ fontStyle: 'normal' }}
            maxLength={40}
          />
        ) : (
          <p
            className={`text-[11px] font-normal tracking-[0.04em] leading-snug ${textTitle} cursor-text hover:opacity-70 transition-opacity`}
            style={{ fontStyle: 'normal' }}
            onClick={() => { setEditValue(design.name); setEditing(true); }}
            title="Click to edit name"
          >
            {design.name}
          </p>
        )}

        {/* Artist */}
        {design.artist && (
          <p className={`text-[10px] font-semibold tracking-[0.05em] leading-snug ${textBase}`}>
            {design.artist}
          </p>
        )}

        {/* Year + vibeName as material/medium line */}
        <p className={`text-[9px] font-medium tracking-[0.06em] leading-snug ${textBase} opacity-80`}>
          {[
            new Date(design.createdAt).getFullYear(),
            design.materials,
            design.vibeName,
          ].filter(Boolean).join(' · ')}
        </p>

        {/* Stencil creator credit */}
        {design.stencilCreator && (
          <p className={`text-[8px] tracking-[0.06em] leading-snug ${textBase} opacity-60`}>
            @{design.stencilCreator}
          </p>
        )}

        {/* Curator note */}
        {design.curatorNote && (
          <p
            className={`text-[9px] tracking-[0.04em] leading-relaxed italic mt-1.5 ${textBase} opacity-70`}
          >
            {design.curatorNote}
          </p>
        )}

        {/* Edition */}
        {design.edition && (
          <p className={`text-[8px] tracking-[0.08em] uppercase mt-1 ${textBase} opacity-60`}>
            {design.edition}
          </p>
        )}
      </div>
    </motion.div>
  );
}
