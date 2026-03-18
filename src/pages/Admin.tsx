import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NavBar } from '@/components/NavBar';
import { motion } from 'framer-motion';
import { Check, X, Loader2, Ghost, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  artist_name: string;
  preview_image: string;
  frame_style: string;
  display_size: string;
  shadow_count: number;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('gallery_submissions').select('*').order('created_at', { ascending: false });

    // We need to read all submissions regardless of status for admin
    // Since RLS only allows reading approved or own submissions,
    // we'll use a broader approach - admin sees all via service role in edge function
    // For now, let's query all statuses the user can see
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setSubmissions(data as unknown as Submission[]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleAction = useCallback(async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(prev => new Set(prev).add(id));
    const { error } = await supabase
      .from('gallery_submissions')
      .update({ status } as any)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: status === 'approved' ? '✅ Approved!' : '❌ Rejected',
        description: status === 'approved' ? 'Art is now live in the gallery.' : 'Submission has been rejected.',
      });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    }
    setProcessing(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Admin — Gallery Submissions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve art submissions for the public gallery.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1.5 ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {f === 'pending' && <Clock className="w-3 h-3" />}
                {f === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                {f === 'rejected' && <XCircle className="w-3 h-3" />}
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] rounded-full bg-destructive text-destructive-foreground font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20">
              <Ghost className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No {filter === 'all' ? '' : filter} submissions</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-background rounded-xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="flex items-stretch">
                    {/* Preview */}
                    <div className="w-32 h-32 shrink-0 bg-muted">
                      <img
                        src={sub.preview_image}
                        alt={sub.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{sub.name}</h3>
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                            sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            sub.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">by {sub.artist_name}</p>
                        {sub.description && (
                          <p className="text-[11px] text-muted-foreground/70 mt-1 italic line-clamp-2">{sub.description}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/50 mt-1">
                          {new Date(sub.created_at).toLocaleDateString()} · Frame: {sub.frame_style} · Size: {sub.display_size}
                        </p>
                      </div>

                      {/* Actions */}
                      {sub.status === 'pending' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleAction(sub.id, 'approved')}
                            disabled={processing.has(sub.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {processing.has(sub.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(sub.id, 'rejected')}
                            disabled={processing.has(sub.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                          >
                            {processing.has(sub.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                            Reject
                          </button>
                        </div>
                      )}

                      {sub.status !== 'pending' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleAction(sub.id, 'approved')}
                            disabled={processing.has(sub.id) || sub.status === 'approved'}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg bg-secondary text-secondary-foreground hover:bg-accent disabled:opacity-30 transition-colors"
                          >
                            <Check className="w-2.5 h-2.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(sub.id, 'rejected')}
                            disabled={processing.has(sub.id) || sub.status === 'rejected'}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg bg-secondary text-secondary-foreground hover:bg-accent disabled:opacity-30 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
