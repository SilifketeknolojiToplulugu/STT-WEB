-- Create activities table for member activities and scoring
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Member reference
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'project_contribution', 
    'meeting_attendance', 
    'event_organization', 
    'mentoring', 
    'content_creation',
    'hardware_sharing',
    'community_help',
    'leadership',
    'other'
  )),
  
  title TEXT NOT NULL,
  description TEXT,
  
  -- Scoring
  points_awarded INTEGER NOT NULL DEFAULT 0,
  points_reason TEXT,
  
  -- Activity metadata
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_hours DECIMAL(4,2),
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'disputed'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activities_member_id ON activities(member_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_activities_points ON activities(points_awarded);
CREATE INDEX IF NOT EXISTS idx_activities_verified ON activities(verified);

-- Function to update member points when activity is added/updated
CREATE OR REPLACE FUNCTION update_member_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total points for the member
  UPDATE members 
  SET 
    total_points = (
      SELECT COALESCE(SUM(points_awarded), 0) 
      FROM activities 
      WHERE member_id = COALESCE(NEW.member_id, OLD.member_id)
        AND status = 'active'
    ),
    last_activity = NOW()
  WHERE id = COALESCE(NEW.member_id, OLD.member_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update member points
CREATE TRIGGER update_member_points_trigger
  AFTER INSERT OR UPDATE OR DELETE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_member_points();
