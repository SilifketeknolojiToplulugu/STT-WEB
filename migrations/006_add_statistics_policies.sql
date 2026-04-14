-- Create a public statistics view for anonymous access
CREATE OR REPLACE VIEW public_statistics AS
SELECT 
  (SELECT COUNT(*) FROM members WHERE status = 'active') as total_members,
  (SELECT COUNT(*) FROM applications) as total_applications,
  (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications;

-- Enable RLS on the view
ALTER VIEW public_statistics SET (security_invoker = true);

-- Grant access to anonymous users for the statistics view
GRANT SELECT ON public_statistics TO anon, authenticated;

-- Create a function to get statistics (alternative approach)
CREATE OR REPLACE FUNCTION get_public_statistics()
RETURNS TABLE (
  total_members BIGINT,
  total_applications BIGINT,
  pending_applications BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM members WHERE status = 'active')::BIGINT,
    (SELECT COUNT(*) FROM applications)::BIGINT,
    (SELECT COUNT(*) FROM applications WHERE status = 'pending')::BIGINT;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION get_public_statistics() TO anon, authenticated;
