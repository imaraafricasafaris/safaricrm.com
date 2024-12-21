-- Reset permissions
DO $$ 
BEGIN
    -- Revoke all permissions first
    EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA %I FROM anon, authenticated', 'public');
    
    -- Revoke schema usage
    EXECUTE format('REVOKE ALL ON SCHEMA %I FROM anon, authenticated', 'public');
    EXECUTE format('REVOKE ALL ON SCHEMA %I FROM anon, authenticated', 'auth');
END $$;

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Grant specific table permissions
GRANT SELECT ON TABLE auth.users TO anon, authenticated;
GRANT ALL ON TABLE public.companies TO authenticated;
GRANT SELECT, INSERT ON TABLE public.companies TO anon;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.companies (name, user_id)
    VALUES ('My Company', NEW.id);
    RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Disable RLS temporarily
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
