-- Create lead_details table with all form fields
CREATE TABLE lead_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  
  -- Trip Details
  destinations TEXT[] NOT NULL DEFAULT '{}',
  trip_type TEXT[] NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 1,
  preferred_dates TEXT,
  adults INTEGER NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  budget DECIMAL,
  special_requirements TEXT,
  
  -- AI Analysis Results
  ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
  ai_score_explanation TEXT,
  ai_recommended_packages TEXT[],
  ai_recommended_activities TEXT[],
  ai_recommended_accommodations TEXT[],
  
  -- Follow-up Strategy from AI
  ai_follow_up_priority TEXT CHECK (ai_follow_up_priority IN ('high', 'medium', 'low')),
  ai_follow_up_approach TEXT,
  ai_follow_up_timeline TEXT,
  ai_follow_up_key_points TEXT[],
  
  -- System Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lead_details ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Authenticated users can view lead_details"
  ON lead_details FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert lead_details"
  ON lead_details FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update lead_details of assigned leads"
  ON lead_details FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_details.lead_id 
      AND (
        leads.assigned_to = auth.uid() 
        OR EXISTS (
          SELECT 1 FROM profiles 
          WHERE user_id = auth.uid() 
          AND role IN ('admin', 'manager')
        )
      )
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_lead_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_lead_details_timestamp
  BEFORE UPDATE ON lead_details
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_details_updated_at();

-- Create a view to combine leads and lead_details
CREATE VIEW lead_full_details AS
SELECT 
  l.*,
  ld.first_name,
  ld.last_name,
  ld.email,
  ld.phone,
  ld.country,
  ld.destinations,
  ld.trip_type,
  ld.duration,
  ld.preferred_dates,
  ld.adults,
  ld.children,
  ld.budget,
  ld.special_requirements,
  ld.ai_score,
  ld.ai_score_explanation,
  ld.ai_recommended_packages,
  ld.ai_recommended_activities,
  ld.ai_recommended_accommodations,
  ld.ai_follow_up_priority,
  ld.ai_follow_up_approach,
  ld.ai_follow_up_timeline,
  ld.ai_follow_up_key_points
FROM leads l
LEFT JOIN lead_details ld ON l.id = ld.lead_id;
