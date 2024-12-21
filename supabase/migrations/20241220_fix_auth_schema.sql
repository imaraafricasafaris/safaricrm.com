-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Grant usage on auth schema
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

-- Ensure auth.users exists and has correct structure
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY,
    email text,
    encrypted_password text,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text,
    phone_confirmed_at timestamp with time zone,
    phone_change text,
    phone_change_token text,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_confirm_status smallint,
    banned_until timestamp with time zone,
    reauthentication_token text,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone
);

-- Grant permissions on auth.users
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO anon, authenticated;

-- Create auth.refresh_tokens if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id bigint NOT NULL PRIMARY KEY,
    token text,
    user_id uuid REFERENCES auth.users(id),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent text
);

-- Grant permissions on auth.refresh_tokens
GRANT ALL ON auth.refresh_tokens TO postgres, service_role;
GRANT SELECT ON auth.refresh_tokens TO anon, authenticated;

-- Create auth.instances if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.instances (
    id uuid NOT NULL PRIMARY KEY,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- Grant permissions on auth.instances
GRANT ALL ON auth.instances TO postgres, service_role;
GRANT SELECT ON auth.instances TO anon, authenticated;

-- Create sequence for refresh tokens if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Grant usage on sequences
GRANT USAGE ON SEQUENCE auth.refresh_tokens_id_seq TO postgres, service_role;

-- Ensure public.companies has correct structure
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    user_id uuid REFERENCES auth.users(id)
);

-- Grant permissions on public.companies
GRANT ALL ON public.companies TO authenticated;
GRANT SELECT, INSERT ON public.companies TO anon;

-- Create simple trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.companies (name, user_id)
    VALUES ('My Company', NEW.id);
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Temporarily disable RLS for testing
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
