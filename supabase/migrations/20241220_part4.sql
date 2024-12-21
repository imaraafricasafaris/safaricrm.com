    -- Part 4: Create trigger function and initial data
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
        INSERT INTO public.companies (name, user_id)
        VALUES (
            'My Company',
            NEW.id
        );
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create trigger for new users
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Insert initial data for existing users
    INSERT INTO public.companies (name, user_id)
    SELECT 
        CASE 
            WHEN email = 'sales@imaraafricasafaris.com' THEN 'Imara Africa Safaris'
            ELSE 'My Company'
        END as name,
        id as user_id
    FROM auth.users
    WHERE email IN ('lewismunuhe@gmail.com', 'sales@imaraafricasafaris.com')
    AND NOT EXISTS (
        SELECT 1 FROM public.companies WHERE companies.user_id = auth.users.id
    );
