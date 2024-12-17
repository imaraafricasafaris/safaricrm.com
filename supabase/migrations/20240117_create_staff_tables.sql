-- Create basic tables first without policies
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    availability_status TEXT DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints after table creation
ALTER TABLE public.staff 
    ADD CONSTRAINT staff_status_check 
    CHECK (status IN ('active', 'inactive', 'suspended'));

ALTER TABLE public.staff 
    ADD CONSTRAINT staff_availability_status_check 
    CHECK (availability_status IN ('available', 'on_leave', 'unavailable', 'busy'));

ALTER TABLE public.payments 
    ADD CONSTRAINT payments_status_check 
    CHECK (status IN ('pending', 'completed', 'failed'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON public.staff
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Add basic policies
CREATE POLICY "Enable read access for all authenticated users" ON public.staff
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON public.documents
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON public.payments
    FOR SELECT
    TO authenticated
    USING (true);

