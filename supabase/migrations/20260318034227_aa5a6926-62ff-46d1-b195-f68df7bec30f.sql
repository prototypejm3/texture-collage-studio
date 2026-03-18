
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Public stencils table
CREATE TABLE public.stencils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '✨',
  view_box TEXT NOT NULL DEFAULT '0 0 480 480',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  fav_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stencils ENABLE ROW LEVEL SECURITY;

-- Anyone can read public stencils
CREATE POLICY "Anyone can read public stencils" ON public.stencils
  FOR SELECT USING (is_public = true);

-- Users can read their own stencils
CREATE POLICY "Users can read own stencils" ON public.stencils
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can insert their own stencils
CREATE POLICY "Users can insert own stencils" ON public.stencils
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update their own stencils
CREATE POLICY "Users can update own stencils" ON public.stencils
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can delete their own stencils
CREATE POLICY "Users can delete own stencils" ON public.stencils
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Favorites table
CREATE TABLE public.stencil_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stencil_id UUID NOT NULL REFERENCES public.stencils(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, stencil_id)
);

ALTER TABLE public.stencil_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites" ON public.stencil_favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.stencil_favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.stencil_favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Hidden stencils table
CREATE TABLE public.stencil_hidden (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stencil_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, stencil_id)
);

ALTER TABLE public.stencil_hidden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own hidden" ON public.stencil_hidden
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hidden" ON public.stencil_hidden
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hidden" ON public.stencil_hidden
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Function to increment/decrement fav count
CREATE OR REPLACE FUNCTION public.update_fav_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stencils SET fav_count = fav_count + 1 WHERE id = NEW.stencil_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stencils SET fav_count = fav_count - 1 WHERE id = OLD.stencil_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_fav_change
  AFTER INSERT OR DELETE ON public.stencil_favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_fav_count();
