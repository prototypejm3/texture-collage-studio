import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Vibe } from '@/types/studio';

interface StencilRecord {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  view_box: string;
  sections: any[];
  is_public: boolean;
  fav_count: number;
  created_at: string;
}

export function useStencilSocial() {
  const { user } = useAuth();
  const [publicStencils, setPublicStencils] = useState<StencilRecord[]>([]);
  const [myStencils, setMyStencils] = useState<StencilRecord[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  // Fetch public stencils
  const fetchPublicStencils = useCallback(async () => {
    const { data } = await supabase
      .from('stencils')
      .select('*')
      .eq('is_public', true)
      .order('fav_count', { ascending: false });
    if (data) setPublicStencils(data as unknown as StencilRecord[]);
  }, []);

  // Fetch user's own stencils
  const fetchMyStencils = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('stencils')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setMyStencils(data as unknown as StencilRecord[]);
  }, [user]);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('stencil_favorites')
      .select('stencil_id')
      .eq('user_id', user.id);
    if (data) setFavoritedIds(new Set((data as unknown as { stencil_id: string }[]).map(f => f.stencil_id)));
  }, [user]);

  // Fetch user's hidden stencils
  const fetchHidden = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('stencil_hidden')
      .select('stencil_id')
      .eq('user_id', user.id);
    if (data) setHiddenIds(new Set((data as unknown as { stencil_id: string }[]).map(h => h.stencil_id)));
  }, [user]);

  useEffect(() => {
    fetchPublicStencils();
  }, [fetchPublicStencils]);

  useEffect(() => {
    if (user) {
      fetchMyStencils();
      fetchFavorites();
      fetchHidden();
    }
  }, [user, fetchMyStencils, fetchFavorites, fetchHidden]);

  // Save AI-generated stencil to DB
  const saveStencil = useCallback(async (vibe: Vibe, name: string, isPublic: boolean) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('stencils')
      .insert({
        user_id: user.id,
        name,
        emoji: vibe.emoji,
        view_box: vibe.viewBox,
        sections: vibe.sections as any,
        is_public: isPublic,
      })
      .select()
      .single();
    if (data) {
      await fetchMyStencils();
      if (isPublic) await fetchPublicStencils();
    }
    return data as unknown as StencilRecord | null;
  }, [user, fetchMyStencils, fetchPublicStencils]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (stencilId: string) => {
    if (!user) return;
    if (favoritedIds.has(stencilId)) {
      await supabase
        .from('stencil_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('stencil_id', stencilId);
      setFavoritedIds(prev => { const s = new Set(prev); s.delete(stencilId); return s; });
    } else {
      await supabase
        .from('stencil_favorites')
        .insert({ user_id: user.id, stencil_id: stencilId });
      setFavoritedIds(prev => new Set(prev).add(stencilId));
    }
    await fetchPublicStencils();
  }, [user, favoritedIds, fetchPublicStencils]);

  // Toggle hidden (works for both built-in string IDs and DB UUIDs)
  const toggleHidden = useCallback(async (stencilId: string) => {
    if (!user) return;
    if (hiddenIds.has(stencilId)) {
      await supabase
        .from('stencil_hidden')
        .delete()
        .eq('user_id', user.id)
        .eq('stencil_id', stencilId);
      setHiddenIds(prev => { const s = new Set(prev); s.delete(stencilId); return s; });
    } else {
      await supabase
        .from('stencil_hidden')
        .insert({ user_id: user.id, stencil_id: stencilId });
      setHiddenIds(prev => new Set(prev).add(stencilId));
    }
  }, [user, hiddenIds]);

  // Delete a stencil (own only)
  const deleteStencil = useCallback(async (stencilId: string) => {
    if (!user) return;
    await supabase.from('stencils').delete().eq('id', stencilId).eq('user_id', user.id);
    await fetchMyStencils();
    await fetchPublicStencils();
  }, [user, fetchMyStencils, fetchPublicStencils]);

  // Report a stencil as bad
  const reportStencil = useCallback(async (stencilId: string, reason: string = 'bad_quality') => {
    if (!user) return;
    await supabase.from('stencil_reports').insert({ user_id: user.id, stencil_id: stencilId, reason } as any);
  }, [user]);

  // Convert DB record to Vibe
  const recordToVibe = (record: StencilRecord): Vibe => ({
    id: record.id,
    name: record.name,
    emoji: record.emoji,
    description: '',
    viewBox: record.view_box,
    sections: record.sections as any,
    lightTextures: [],
    mediumTextures: [],
    darkTextures: [],
    accentTextures: [],
  });

  return {
    publicStencils,
    myStencils,
    favoritedIds,
    hiddenIds,
    saveStencil,
    toggleFavorite,
    toggleHidden,
    deleteStencil,
    reportStencil,
    recordToVibe,
    refetch: () => { fetchPublicStencils(); fetchMyStencils(); fetchFavorites(); },
  };
}
