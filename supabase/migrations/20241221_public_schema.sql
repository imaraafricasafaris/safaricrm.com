-- Reset public schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Create public tables
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE public.offices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    company_id uuid REFERENCES public.companies(id)
);

CREATE TABLE public.staff (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    email text,
    office_id uuid REFERENCES public.offices(id)
);

CREATE TABLE public.module_states (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    module_name text NOT NULL,
    is_enabled boolean DEFAULT true,
    company_id uuid REFERENCES public.companies(id)
);

-- Grant permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant limited permissions to anon and authenticated
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_states ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Companies are viewable by owner" ON public.companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies are insertable by authenticated users" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Offices are viewable by company members" ON public.offices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = offices.company_id
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Staff are viewable by company members" ON public.staff
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies c
            JOIN public.offices o ON o.company_id = c.id
            WHERE o.id = staff.office_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Module states are viewable by company members" ON public.module_states
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = module_states.company_id
            AND companies.user_id = auth.uid()
        )
    );

-- Create company creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.companies (name, user_id)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company'),
        NEW.id
    );
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();