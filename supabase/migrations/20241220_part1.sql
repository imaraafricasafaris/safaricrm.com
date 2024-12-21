-- Part 1: Drop existing tables and clean up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.module_states;
DROP TABLE IF EXISTS public.companies;
DROP VIEW IF EXISTS public.users;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users view
CREATE OR REPLACE VIEW public.users AS
SELECT 
    id,
    email,
    created_at
FROM auth.users;
