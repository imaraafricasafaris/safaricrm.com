-- Create module_states table if it doesn't exist
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
