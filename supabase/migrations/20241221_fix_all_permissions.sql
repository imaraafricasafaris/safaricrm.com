-- Reset all permissions first
DO $$ 
BEGIN
    -- Revoke all permissions
    EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON SCHEMA %I FROM anon, authenticated', 'auth');
END $$;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to recreate with correct structure
DROP TABLE IF EXISTS public.module_states CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.offices CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- Create tables with correct structure
CREATE TABLE public.companies (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    user_id uuid REFERENCES auth.users(id)
);

CREATE TABLE public.offices (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    company_id uuid REFERENCES public.companies(id)
);

CREATE TABLE public.staff (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    email text,
    office_id uuid REFERENCES public.offices(id)
);

CREATE TABLE public.module_states (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    module_name text NOT NULL,
    is_enabled boolean DEFAULT true,
    company_id uuid REFERENCES public.companies(id)
);

-- Grant table permissions
GRANT ALL ON public.companies TO authenticated;
GRANT SELECT, INSERT ON public.companies TO anon;

GRANT ALL ON public.offices TO authenticated;
GRANT SELECT ON public.offices TO anon;

GRANT ALL ON public.staff TO authenticated;
GRANT SELECT ON public.staff TO anon;

GRANT ALL ON public.module_states TO authenticated;
GRANT SELECT ON public.module_states TO anon;

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

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_states ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Companies are viewable by owner" ON public.companies;
DROP POLICY IF EXISTS "Companies are insertable by authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Offices are viewable by company members" ON public.offices;
DROP POLICY IF EXISTS "Staff are viewable by company members" ON public.staff;
DROP POLICY IF EXISTS "Module states are viewable by company members" ON public.module_states;

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

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert default module states for existing companies
INSERT INTO public.module_states (module_name, company_id)
SELECT 'dashboard', companies.id
FROM public.companies
WHERE NOT EXISTS (
    SELECT 1 FROM public.module_states
    WHERE module_states.company_id = companies.id
    AND module_states.module_name = 'dashboard'
);
