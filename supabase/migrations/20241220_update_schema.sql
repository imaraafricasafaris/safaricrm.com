-- First add user_id to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'::text,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'::text,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update existing companies to link with users
WITH ranked_companies AS (
    SELECT c.id, u.id as user_id,
           ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY u.created_at) as rn
    FROM public.companies c
    CROSS JOIN auth.users u
    WHERE u.email IN ('lewismunuhe@gmail.com', 'sales@imaraafricasafaris.com')
    AND c.user_id IS NULL
)
UPDATE public.companies c
SET user_id = r.user_id
FROM ranked_companies r
WHERE c.id = r.id AND r.rn = 1;

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Companies are viewable by owner"
    ON public.companies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Companies are insertable by authenticated users"
    ON public.companies FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Companies are updatable by owner"
    ON public.companies FOR UPDATE
    USING (auth.uid() = user_id);

-- Create module_states table
CREATE TABLE IF NOT EXISTS public.module_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    module_id TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
    UNIQUE(company_id, module_id)
);

-- Enable RLS on module_states
ALTER TABLE public.module_states ENABLE ROW LEVEL SECURITY;

-- Module states policies
CREATE POLICY "Module states are viewable by company members"
    ON public.module_states FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = module_states.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Module states are insertable by company owner"
    ON public.module_states FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = module_states.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Module states are updatable by company owner"
    ON public.module_states FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = module_states.company_id
        AND companies.user_id = auth.uid()
    ));
