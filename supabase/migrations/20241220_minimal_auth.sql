-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remove RLS temporarily to debug
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Companies are viewable by owner" ON public.companies;
DROP POLICY IF EXISTS "Companies are insertable by authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Companies are updatable by owner" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.companies;
DROP POLICY IF EXISTS "Enable read access for users" ON public.companies;

-- Create a simpler trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.companies (name, user_id)
  VALUES (
    'My Company',
    NEW.id
  );
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.companies TO anon, authenticated;
GRANT ALL ON public.module_states TO anon, authenticated;

-- Insert test data for existing users if needed
INSERT INTO public.companies (name, user_id)
SELECT 
    CASE 
        WHEN email = 'sales@imaraafricasafaris.com' THEN 'Imara Africa Safaris'
        ELSE 'My Company'
    END,
    id
FROM auth.users
WHERE email IN ('lewismunuhe@gmail.com', 'sales@imaraafricasafaris.com')
AND NOT EXISTS (
    SELECT 1 FROM public.companies WHERE companies.user_id = auth.users.id
);
