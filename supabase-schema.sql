-- Generation Sessions Table
-- Run this in Supabase SQL Editor to create the table for tracking user generations

CREATE TABLE IF NOT EXISTS generation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  fingerprint TEXT, -- Browser fingerprint for additional tracking
  pet_name TEXT,
  breed TEXT,
  pet_type TEXT,
  photo_url TEXT,
  selected_styles TEXT[] NOT NULL DEFAULT '{}', -- Array of selected styles
  generated_styles TEXT[] NOT NULL DEFAULT '{}', -- Array of styles already generated
  free_generations_used INTEGER DEFAULT 0,
  paid_generations_count INTEGER DEFAULT 0,
  purchase_made BOOLEAN DEFAULT FALSE,
  purchase_bonus_generations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Index for fast IP lookups
CREATE INDEX IF NOT EXISTS idx_generation_sessions_ip ON generation_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_generation_sessions_fingerprint ON generation_sessions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_generation_sessions_expires ON generation_sessions(expires_at);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_generation_sessions_updated_at ON generation_sessions;
CREATE TRIGGER update_generation_sessions_updated_at 
  BEFORE UPDATE ON generation_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE generation_sessions ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to do everything
CREATE POLICY "Service role can do everything" ON generation_sessions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');











