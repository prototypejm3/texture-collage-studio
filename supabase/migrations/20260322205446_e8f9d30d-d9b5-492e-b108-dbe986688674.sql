ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS monthly_credits integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS monthly_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS purchased_credits integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_reset_at timestamp with time zone NOT NULL DEFAULT now();