import { Link } from 'react-router-dom';
import { Frame, ArrowLeft, Sparkles, Palette, Grid2x2, Landmark, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/" className="p-1.5 rounded-md hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-1.5">
          <Frame className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold tracking-tight">Swatchbox Studio</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Swatchbox Studio ✨</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            A digital art space where you can create textured designs using swatches, patterns, and playful stencils.
          </p>
        </div>

        {/* Origin */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            It started from a real-world hobby — using leftover fabric samples to build shadow box frames — and evolved into a digital studio to explore, design, and share creations.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you're here to relax, experiment, or just play, Swatchbox Studio is designed to feel simple, tactile, and a little addictive.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Palette, label: 'Create designs using textures and stencils' },
            { icon: Sparkles, label: 'Explore different "vibes" and templates' },
            { icon: Grid2x2, label: 'Save your work to your Wall' },
            { icon: Landmark, label: 'Share creations in the Gallery (Show & Tell)' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
              <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Modes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Two Modes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="font-semibold text-sm">Kids Mode 🎨</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A playful, simple experience focused on fun and creativity.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-accent/30 border border-border space-y-2">
              <p className="font-semibold text-sm">Adult Mode 🧠</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A more design-forward space to build, curate, and explore.
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="text-center py-6 space-y-2">
          <Heart className="w-5 h-5 text-primary mx-auto" />
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Swatchbox Studio is about making creativity feel easy, hands-on, and enjoyable — no pressure, just play.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/" className="hover:text-foreground transition-colors">Back to Studio</Link>
        </div>
      </div>
    </div>
  );
}
