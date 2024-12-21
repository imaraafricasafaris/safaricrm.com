-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Grant necessary permissions to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Grant access to auth.users for the service_role
GRANT ALL ON auth.users TO service_role;

-- Grant access to the UUID extension
GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO anon, authenticated;

-- Ensure public.companies table has proper permissions
GRANT SELECT, INSERT ON public.companies TO anon, authenticated;

-- Create or replace the handle_new_user function with proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS but add policies to allow signup
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.companies;
DROP POLICY IF EXISTS "Enable read access for users" ON public.companies;

-- Allow insert during signup
CREATE POLICY "Enable insert for authentication" ON public.companies
    FOR INSERT WITH CHECK (true);  -- Allow all inserts initially

-- Allow viewing own data
CREATE POLICY "Enable read access for users" ON public.companies
    FOR SELECT USING (
        auth.uid() = user_id
    );
