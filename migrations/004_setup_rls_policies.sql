-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Applications RLS Policies
-- Only admins and edge functions can read applications
CREATE POLICY "Applications are not readable by users" ON applications
  FOR SELECT USING (false);

-- Only allow insert with KVKK consent
CREATE POLICY "Applications require KVKK consent" ON applications
  FOR INSERT WITH CHECK (consent_kvkk = true);

-- Only admins can update applications
CREATE POLICY "Only admins can update applications" ON applications
  FOR UPDATE USING (false);

-- Only admins can delete applications
CREATE POLICY "Only admins can delete applications" ON applications
  FOR DELETE USING (false);

-- Members RLS Policies
-- Users can only see their own member record
CREATE POLICY "Users can view own member record" ON members
  FOR SELECT USING (auth.uid()::text = id::text);

-- Only admins can insert members
CREATE POLICY "Only admins can insert members" ON members
  FOR INSERT WITH CHECK (false);

-- Only admins can update members
CREATE POLICY "Only admins can update members" ON members
  FOR UPDATE USING (false);

-- Only admins can delete members
CREATE POLICY "Only admins can delete members" ON members
  FOR DELETE USING (false);

-- Activities RLS Policies
-- Users can view their own activities
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.id = activities.member_id 
      AND members.id::text = auth.uid()::text
    )
  );

-- Only admins can insert activities
CREATE POLICY "Only admins can insert activities" ON activities
  FOR INSERT WITH CHECK (false);

-- Only admins can update activities
CREATE POLICY "Only admins can update activities" ON activities
  FOR UPDATE USING (false);

-- Only admins can delete activities
CREATE POLICY "Only admins can delete activities" ON activities
  FOR DELETE USING (false);

-- Create admin role function (to be used by edge functions)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- This will be used by edge functions with service role
  -- For now, return false for regular users
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON applications TO anon, authenticated;
GRANT SELECT ON members TO authenticated;
GRANT SELECT ON activities TO authenticated;
