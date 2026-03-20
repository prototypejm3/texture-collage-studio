import { SavedDesign } from '@/types/wall';
import { motion } from 'framer-motion';

interface TitleCardProps {
  design: SavedDesign;
  isDark?: boolean;
  placement?: 'below' | 'right';
}

export function TitleCard({ design, isDark, placement = 'below' }: TitleCardProps) {
  const textBase = 'text-terracotta';
  const textTitle = 'text-terracotta-foreground font-bold';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`${placement === 'right' ? 'pl-4' : 'mt-2 px-0.5'} select-none`}
    >
      <div className="space-y-[3px] text-left max-w-[220px]">
        {/* Title — slightly stronger */}
        <p
          className={`text-[11px] font-normal tracking-[0.04em] leading-snug ${textTitle}`}
          style={{ fontStyle: 'normal' }}
        >
          {design.name}
        </p>

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
          <p className={`text-[8px] tracking-[0.06em] leading-snug ${textBase} opacity-60 flex items-center gap-1`}>
            ✦ Stencil by {design.stencilCreator}
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
