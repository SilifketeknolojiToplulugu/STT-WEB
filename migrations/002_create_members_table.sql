-- Create members table for approved members
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Reference to application
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  -- Personal Information (copied from application)
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  school_work TEXT,
  
  -- Member Level
  level TEXT NOT NULL DEFAULT 'community' CHECK (level IN ('community', 'contributor', 'core')),
  
  -- Member Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
  
  -- Member Data
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Points/Contribution System
  total_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  
  -- Preferences
  interests JSONB DEFAULT '[]',
  meeting_preference TEXT,
  hardware_sharing TEXT,
  
  -- Admin Fields
  notes TEXT,
  assigned_by UUID,
  
  -- KVKK Compliance
  consent_kvkk BOOLEAN NOT NULL DEFAULT TRUE,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_members_level ON members(level);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_application_id ON members(application_id);
CREATE INDEX IF NOT EXISTS idx_members_total_points ON members(total_points);
CREATE INDEX IF NOT EXISTS idx_members_last_activity ON members(last_activity);

-- Add updated_at trigger
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
