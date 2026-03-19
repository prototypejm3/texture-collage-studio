import { NavBar } from '@/components/NavBar';
import { useGallery } from '@/hooks/useGallery';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Loader2, Ghost } from 'lucide-react';
import { FrameStyle } from '@/types/wall';

// Reuse the metallic frame styles inline
const metallicGradients: Record<string, { main: string; inner: string; matBg: string }> = {
  gold: {
    main: 'linear-gradient(145deg, hsl(43, 60%, 55%) 0%, hsl(38, 65%, 45%) 20%, hsl(43, 70%, 60%) 40%, hsl(38, 55%, 40%) 60%, hsl(43, 60%, 55%) 80%)',
    inner: 'linear-gradient(135deg, hsl(43, 55%, 50%) 0%, hsl(40, 60%, 58%) 50%, hsl(43, 55%, 50%) 100%)',
    matBg: 'hsl(40, 15%, 95%)',
  },
  chrome: {
    main: 'linear-gradient(145deg, hsl(210, 5%, 78%) 0%, hsl(210, 8%, 60%) 20%, hsl(210, 5%, 85%) 40%, hsl(210, 8%, 55%) 60%)',
    inner: 'linear-gradient(135deg, hsl(210, 5%, 70%) 0%, hsl(210, 8%, 80%) 50%, hsl(210, 5%, 70%) 100%)',
    matBg: 'hsl(210, 5%, 96%)',
  },
  copper: {
    main: 'linear-gradient(145deg, hsl(18, 55%, 55%) 0%, hsl(15, 60%, 42%) 20%, hsl(20, 50%, 58%) 40%, hsl(15, 55%, 38%) 60%)',
    inner: 'linear-gradient(135deg, hsl(18, 50%, 48%) 0%, hsl(20, 55%, 55%) 50%, hsl(18, 50%, 48%) 100%)',
    matBg: 'hsl(20, 15%, 95%)',
  },
  silver: {
    main: 'linear-gradient(145deg, hsl(220, 8%, 72%) 0%, hsl(220, 10%, 58%) 20%, hsl(220, 6%, 80%) 40%, hsl(220, 10%, 52%) 60%)',
    inner: 'linear-gradient(135deg, hsl(220, 6%, 65%) 0%, hsl(220, 8%, 75%) 50%, hsl(220, 6%, 65%) 100%)',
    matBg: 'hsl(220, 5%, 96%)',
  },
};

function GalleryFrame({ style, children }: { style: string; children: React.ReactNode }) {
  const metal = metallicGradients[style];
  if (metal) {
    return (
      <div className="p-[clamp(8px,2%,14px)] shadow-lg" style={{ background: metal.main }}>
        <div className="p-[clamp(2px,0.5%,4px)]" style={{ background: metal.inner }}>
          <div style={{ backgroundColor: metal.matBg }} className="p-[clamp(4px,1%,8px)]">
            {children}
          </div>
        </div>
      </div>
    );
  }
  if (style === 'wood') {
    return (
      <div className="p-[clamp(6px,1.5%,10px)] shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(30, 40%, 65%), hsl(25, 35%, 55%), hsl(28, 38%, 60%))' }}>
        <div className="bg-white p-[clamp(4px,1%,8px)]">{children}</div>
      </div>
    );
  }
  if (style === 'shadow-box') {
    return (
      <div className="bg-[hsl(0,0%,95%)] p-[clamp(4px,1%,8px)] shadow-lg border-2 border-[hsl(0,0%,30%)]">
        <div className="bg-[hsl(0,0%,97%)] p-[clamp(6px,1.5%,10px)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]">
          {children}
        </div>
      </div>
    );
  }
  return <div className="shadow-md">{children}</div>;
}

const Gallery = () => {
  const { submissions, myShadows, loading, toggleShadow } = useGallery();
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-20 md:pb-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Art Gallery
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Community shadow box art — leave a shadow to show your appreciation
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20">
              <Ghost className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No art in the gallery yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Submit your first piece from My Wall!</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-5 space-y-5">
              {submissions.map((sub, i) => {
                const hasShadow = myShadows.has(sub.id);
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="break-inside-avoid"
                  >
                    <div className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-3">
                        <GalleryFrame style={sub.frame_style}>
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={sub.preview_image}
                              alt={sub.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </GalleryFrame>
                      </div>

                      <div className="px-4 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{sub.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">by {sub.artist_name}</p>
                            {sub.description && (
                              <p className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-2 italic">{sub.description}</p>
                            )}
                          </div>

                          <button
                            onClick={() => toggleShadow(sub.id)}
                            disabled={!user}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors shrink-0 ${
                              hasShadow
                                ? 'bg-primary/10 text-primary'
                                : 'bg-secondary text-muted-foreground hover:bg-accent'
                            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={user ? (hasShadow ? 'Remove shadow' : 'Leave a shadow') : 'Sign in to leave a shadow'}
                          >
                            <Ghost className={`w-3.5 h-3.5 ${hasShadow ? 'fill-primary' : ''}`} />
                            {sub.shadow_count}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
