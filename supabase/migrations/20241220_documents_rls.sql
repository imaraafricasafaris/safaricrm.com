-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Documents are viewable by company members"
    ON public.documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = documents.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Documents are insertable by company members"
    ON public.documents FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = documents.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Documents are updatable by company members"
    ON public.documents FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = documents.company_id
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Documents are deletable by company members"
    ON public.documents FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = documents.company_id
        AND companies.user_id = auth.uid()
    ));
