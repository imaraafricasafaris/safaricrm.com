-- Enhance existing leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_score INTEGER CHECK (lead_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS lead_temperature TEXT CHECK (lead_temperature IN ('hot', 'warm', 'cold')),
ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT CHECK (lifecycle_stage IN ('new', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
ADD COLUMN IF NOT EXISTS expected_value DECIMAL,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS probability INTEGER CHECK (probability BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS lost_reason TEXT,
ADD COLUMN IF NOT EXISTS win_reason TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMPTZ;

-- Create lead_contacts table for multiple contacts per lead
CREATE TABLE IF NOT EXISTS lead_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    job_title TEXT,
    is_primary BOOLEAN DEFAULT false,
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
    timezone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_requirements table for detailed trip requirements
CREATE TABLE IF NOT EXISTS lead_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    accommodation_preference TEXT CHECK (accommodation_preference IN ('luxury', 'comfort', 'mid_range', 'budget')),
    meal_preferences TEXT[],
    dietary_restrictions TEXT[],
    special_interests TEXT[],
    physical_fitness_level TEXT CHECK (physical_fitness_level IN ('high', 'medium', 'low')),
    preferred_activities TEXT[],
    excluded_activities TEXT[],
    travel_history TEXT[],
    budget_flexibility TEXT CHECK (budget_flexibility IN ('fixed', 'flexible', 'very_flexible')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_communication_preferences table
CREATE TABLE IF NOT EXISTS lead_communication_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    preferred_language TEXT DEFAULT 'English',
    preferred_contact_time TEXT CHECK (preferred_contact_time IN ('morning', 'afternoon', 'evening')),
    do_not_contact_days TEXT[],
    marketing_preferences JSONB,
    unsubscribed_channels TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_quotes table
CREATE TABLE IF NOT EXISTS lead_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    quote_number TEXT UNIQUE,
    status TEXT CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    total_amount DECIMAL,
    currency TEXT DEFAULT 'USD',
    validity_period INTEGER, -- days
    items JSONB,
    notes TEXT,
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_tasks table
CREATE TABLE IF NOT EXISTS lead_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    task_type TEXT CHECK (task_type IN ('follow_up', 'quote', 'document', 'meeting', 'other')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_documents table
CREATE TABLE IF NOT EXISTS lead_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('quote', 'itinerary', 'contract', 'invoice', 'other')),
    url TEXT NOT NULL,
    size INTEGER,
    mime_type TEXT,
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_custom_fields table for dynamic fields
CREATE TABLE IF NOT EXISTS lead_custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_type TEXT CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'array')),
    field_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_analytics table for tracking lead interactions
CREATE TABLE IF NOT EXISTS lead_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    source TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_automation_logs table
CREATE TABLE IF NOT EXISTS lead_automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    automation_type TEXT NOT NULL,
    status TEXT CHECK (status IN ('success', 'failed', 'pending')),
    details JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_lead_contacts_lead_id ON lead_contacts(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_assigned_to ON lead_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_due_date ON lead_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_lead_quotes_status ON lead_quotes(status);

-- Create a view for lead overview
CREATE OR REPLACE VIEW lead_overview AS
SELECT 
    l.*,
    lc.first_name,
    lc.last_name,
    lc.email as contact_email,
    lc.phone as contact_phone,
    lr.accommodation_preference,
    lr.meal_preferences,
    lr.special_interests,
    lcp.preferred_language,
    lcp.preferred_contact_time,
    (
        SELECT json_agg(json_build_object(
            'id', q.id,
            'quote_number', q.quote_number,
            'status', q.status,
            'total_amount', q.total_amount
        ))
        FROM lead_quotes q
        WHERE q.lead_id = l.id
    ) as quotes,
    (
        SELECT json_agg(json_build_object(
            'id', t.id,
            'title', t.title,
            'due_date', t.due_date,
            'status', t.status
        ))
        FROM lead_tasks t
        WHERE t.lead_id = l.id
    ) as tasks
FROM leads l
LEFT JOIN lead_contacts lc ON l.id = lc.lead_id AND lc.is_primary = true
LEFT JOIN lead_requirements lr ON l.id = lr.lead_id
LEFT JOIN lead_communication_preferences lcp ON l.id = lcp.lead_id;

-- Add RLS policies for new tables
ALTER TABLE lead_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_communication_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_automation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (example for lead_contacts)
CREATE POLICY "Users can view lead contacts" ON lead_contacts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert lead contacts" ON lead_contacts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update lead contacts" ON lead_contacts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = lead_contacts.lead_id 
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

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_lead_contacts_updated_at
    BEFORE UPDATE ON lead_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_requirements_updated_at
    BEFORE UPDATE ON lead_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- (Add similar triggers for other tables)
