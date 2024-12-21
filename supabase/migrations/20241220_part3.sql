-- Part 3: Set up RLS policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_states ENABLE ROW LEVEL SECURITY;

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
