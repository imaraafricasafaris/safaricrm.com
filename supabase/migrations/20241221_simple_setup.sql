-- Reset public schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Basic setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Create tables
CREATE TABLE public.companies (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE public.offices (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    company_id uuid REFERENCES public.companies(id)
);

CREATE TABLE public.staff (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    email text,
    office_id uuid REFERENCES public.offices(id)
);

CREATE TABLE public.module_states (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    module_name text NOT NULL,
    is_enabled boolean DEFAULT true,
    company_id uuid REFERENCES public.companies(id)
);

-- Grant access
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_states ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own company" ON public.companies
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view company offices" ON public.offices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = offices.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view company staff" ON public.staff
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies c
            JOIN public.offices o ON o.company_id = c.id
            WHERE o.id = staff.office_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view company modules" ON public.module_states
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = module_states.company_id
            AND companies.user_id = auth.uid()
        )
    );

-- Create trigger function
CREATE OR REPLACE FUNCTION public.create_company_for_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.companies (name, user_id)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company'),
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
