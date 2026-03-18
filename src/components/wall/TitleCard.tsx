import { SavedDesign } from '@/types/wall';

interface TitleCardProps {
  design: SavedDesign;
  isDark?: boolean;
}

export function TitleCard({ design, isDark }: TitleCardProps) {
  return (
    <div className={`mt-2 px-1 ${isDark ? 'text-background/60' : 'text-foreground/50'}`}>
      <div className="flex items-baseline gap-2">
        <p className="text-[10px] font-medium tracking-wide truncate">
          {design.name}
        </p>
        {design.isHero && (
          <span className="text-[8px] tracking-widest uppercase text-primary/60">★ Hero</span>
        )}
      </div>
      {design.artist && (
        <p className="text-[9px] tracking-wider opacity-60">{design.artist}</p>
      )}
      {design.vibeName && (
        <p className="text-[8px] tracking-wider opacity-40 italic mt-0.5">{design.vibeName}</p>
      )}
      <p className="text-[8px] tracking-wider opacity-30 mt-0.5">
        {new Date(design.createdAt).getFullYear()}
      </p>
    </div>
  );
}
