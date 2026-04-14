-- Create applications table for membership applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  school_work TEXT NOT NULL,
  
  -- Interests (stored as JSON array)
  interests JSONB NOT NULL DEFAULT '[]',
  
  -- Portfolio/Example
  portfolio_example TEXT NOT NULL,
  
  -- Motivation
  motivation TEXT NOT NULL,
  weekly_hours TEXT NOT NULL,
  meeting_preference TEXT NOT NULL,
  
  -- Hardware
  computer_type TEXT NOT NULL,
  additional_hardware JSONB NOT NULL DEFAULT '[]',
  hardware_sharing TEXT NOT NULL,
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  level TEXT NOT NULL DEFAULT 'community' CHECK (level IN ('community', 'contributor', 'core')),
  
  -- KVKK Consent
  consent_kvkk BOOLEAN NOT NULL DEFAULT FALSE,
  consent_date TIMESTAMP WITH TIME ZONE,
  
  -- Admin Notes
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Scoring (calculated by edge function)
  score INTEGER DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_level ON applications(level);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_score ON applications(score);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
