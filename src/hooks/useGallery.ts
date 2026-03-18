import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface GallerySubmission {
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

export function useGallery() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<GallerySubmission[]>([]);
  const [myShadows, setMyShadows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load approved gallery submissions
  const loadGallery = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubmissions(data as unknown as GallerySubmission[]);
    }
    setLoading(false);
  }, []);

  // Load user's shadows
  const loadMyShadows = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('gallery_shadows')
      .select('submission_id')
      .eq('user_id', user.id);

    if (data) {
      setMyShadows(new Set(data.map((d: any) => d.submission_id)));
    }
  }, [user]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    loadMyShadows();
  }, [loadMyShadows]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_submissions' }, () => {
        loadGallery();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadGallery]);

  const submitToGallery = useCallback(async (params: {
    name: string;
    description?: string;
    artist_name: string;
    preview_image: string;
    frame_style: string;
    display_size: string;
  }): Promise<string | null> => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'You need an account to submit to the gallery.', variant: 'destructive' });
      return null;
    }

    const { data, error } = await supabase
      .from('gallery_submissions')
      .insert({
        user_id: user.id,
        name: params.name,
        description: params.description || null,
        artist_name: params.artist_name,
        preview_image: params.preview_image,
        frame_style: params.frame_style,
        display_size: params.display_size,
        status: 'approved', // auto-approve for now
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Gallery submit error:', error);
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
      return null;
    }

    toast({ title: '🎨 Submitted to Gallery!', description: 'Your art is now visible in the public gallery.' });
    loadGallery();
    return (data as any).id;
  }, [user, loadGallery]);

  const toggleShadow = useCallback(async (submissionId: string) => {
    if (!user) {
      toast({ title: 'Sign in to leave a shadow', variant: 'destructive' });
      return;
    }

    const hasShadow = myShadows.has(submissionId);

    if (hasShadow) {
      await supabase
        .from('gallery_shadows')
        .delete()
        .eq('user_id', user.id)
        .eq('submission_id', submissionId);
      setMyShadows(prev => { const n = new Set(prev); n.delete(submissionId); return n; });
    } else {
      await supabase
        .from('gallery_shadows')
        .insert({ user_id: user.id, submission_id: submissionId } as any);
      setMyShadows(prev => new Set(prev).add(submissionId));
    }

    // Optimistic update
    setSubmissions(prev => prev.map(s =>
      s.id === submissionId
        ? { ...s, shadow_count: s.shadow_count + (hasShadow ? -1 : 1) }
        : s
    ));
  }, [user, myShadows]);

  return { submissions, myShadows, loading, submitToGallery, toggleShadow, loadGallery };
}
