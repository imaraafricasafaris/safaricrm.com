-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON public.documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON public.documents(created_by);

-- Enable RLS
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
