-- Admins table — links Supabase auth.users to admin role
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Each authenticated user can read only their own row (used by the frontend
-- to confirm whether the signed-in user has admin privileges).
DROP POLICY IF EXISTS "users_can_read_own_admin_row" ON public.admins;
CREATE POLICY "users_can_read_own_admin_row"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No insert/update/delete from clients — managed manually from the dashboard.
GRANT SELECT ON public.admins TO authenticated;
