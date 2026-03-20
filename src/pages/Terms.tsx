import { Link } from 'react-router-dom';
import { Frame, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Use of the App',
    content: `Swatchbox Studio is a creative tool provided for personal, non-commercial use.\n\nBy using the app, you agree to use it respectfully and not misuse or attempt to disrupt the experience.`,
  },
  {
    title: '2. Accounts & Access',
    content: `Some features may require a paid upgrade (Studio Premium).\n\n• Free users can access core creative tools\n• Premium users unlock additional features such as AI generation and expanded saving\n\nWe may update features and limits over time.`,
  },
  {
    title: '3. AI Features',
    content: `AI-generated features are limited and may have daily usage caps.\n\n• Premium users receive a set number of generations per day\n• Availability may vary depending on system usage\n\nWe do our best to keep things running smoothly, but AI features may occasionally be unavailable.`,
  },
  {
    title: '4. User Content',
    content: `You retain ownership of anything you create.\n\nBy sharing your creations in the Gallery:\n• You allow others to view your work\n• You allow Swatchbox Studio to display your work within the app\n\nPlease do not upload or create content that is offensive, explicit, harmful, or inappropriate.\n\nWe reserve the right to remove content if needed.`,
  },
  {
    title: '5. Kids Mode',
    content: `Swatchbox Studio includes a Kids Mode designed for younger users.\n\nThis space is meant to be safe, simple, and creative. Adult features may be limited or hidden in this mode.`,
  },
  {
    title: '6. Availability',
    content: `We may update, change, or temporarily pause features at any time.\n\nIf certain features (like AI tools) are unavailable, the rest of the app will still remain usable.`,
  },
  {
    title: '7. Payments',
    content: `Premium features may be offered as a one-time purchase or subscription.\n\nAll payments are handled securely through the platform provider.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `Swatchbox Studio is provided "as is."\n\nWe are not responsible for data loss, temporary outages, or unexpected bugs.\n\nThat said, we aim to provide a smooth and enjoyable experience.`,
  },
  {
    title: '9. Updates',
    content: `We may update these terms from time to time. Continued use of the app means you accept any updates.`,
  },
  {
    title: '10. Contact',
    content: `If you have feedback or ideas, we'd love to hear from you.\n\nSwatchbox Studio is built to evolve — and your input helps shape it 💛`,
  },
];

export default function Terms() {
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
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-muted-foreground">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground">{s.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Contact email */}
        <div className="text-center pt-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground">
            Email:{' '}
            <a href="mailto:Jk@luminarylogictalent.com" className="text-primary hover:underline">
              Jk@luminarylogictalent.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <span>·</span>
            <Link to="/" className="hover:text-foreground transition-colors">Back to Studio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
