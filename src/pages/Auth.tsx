import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Frame, Mail, Lock, User, Palette, Brush } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'pick-mode'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        setError(error.message);
      } else {
        setStep('pick-mode');
      }
    }
    setLoading(false);
  };

  const handlePickMode = (isKid: boolean) => {
    localStorage.setItem('kid-mode', String(isKid));
    window.dispatchEvent(new CustomEvent('kid-mode-change', { detail: isKid }));
    navigate('/');
  };

  if (step === 'pick-mode') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Frame className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Welcome!
            </h1>
          </div>

          <div className="bg-popover border border-border rounded-2xl p-6 shadow-lg text-center">
            <p className="text-sm text-muted-foreground mb-6">Who's creating today?</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePickMode(true)}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-secondary/30 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-3xl">🧒</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Kids Mode</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Simple & fun</p>
                </div>
              </button>

              <button
                onClick={() => handlePickMode(false)}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-secondary/30 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-3xl">👵</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Adult Mode</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Full controls</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-4">You can switch anytime in the studio</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Frame className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Swatchbox Studio
          </h1>
        </div>

        <div className="bg-popover border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex mb-6 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Display name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10"
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
            {success && <p className="text-xs text-primary">{success}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
