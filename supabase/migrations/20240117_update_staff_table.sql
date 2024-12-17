-- Drop existing staff table if it exists
drop table if exists public.staff;

-- Create staff table with additional columns
create table public.staff (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    first_name text not null,
    last_name text not null,
    email text not null unique,
    phone text,
    role text not null check (role in ('admin', 'manager', 'agent', 'driver', 'guide', 'finance', 'support')),
    status text not null default 'active' check (status in ('active', 'inactive', 'pending')),
    availability_status text not null default 'available' check (availability_status in ('available', 'on_leave', 'unavailable', 'busy')),
    avatar_url text,
    branch text,
    office_id uuid,
    department text,
    position text,
    hire_date date,
    salary numeric(10,2),
    permissions jsonb default '{
        "leads": false,
        "safaris": false,
        "vehicles": false,
        "reports": false,
        "settings": false,
        "finance": false,
        "staff": false,
        "clients": false
    }'::jsonb,
    emergency_contact jsonb default '{
        "name": "",
        "relationship": "",
        "phone": ""
    }'::jsonb,
    address jsonb default '{
        "street": "",
        "city": "",
        "state": "",
        "country": "",
        "postal_code": ""
    }'::jsonb,
    documents jsonb default '[]'::jsonb,
    last_login timestamp with time zone,
    last_activity timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trigger to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger staff_updated_at
    before update on public.staff
    for each row
    execute procedure public.handle_updated_at();

-- Create RLS policies
alter table public.staff enable row level security;

create policy "Staff members can be viewed by authenticated users"
    on public.staff for select
    to authenticated
    using (true);

create policy "Staff members can be inserted by admins"
    on public.staff for insert
    to authenticated
    with check (auth.jwt() ->> 'email' in (
        select email from public.staff where role = 'admin'
    ));

create policy "Staff members can be updated by admins"
    on public.staff for update
    to authenticated
    using (auth.jwt() ->> 'email' in (
        select email from public.staff where role = 'admin'
    ));

create policy "Staff members can be deleted by admins"
    on public.staff for delete
    to authenticated
    using (auth.jwt() ->> 'email' in (
        select email from public.staff where role = 'admin'
    ));
