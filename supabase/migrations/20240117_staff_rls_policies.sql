-- Enable RLS on staff table
alter table public.staff enable row level security;

-- Create policies for staff table
create policy "Enable read access for authenticated users"
on public.staff
for select
using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users"
on public.staff
for insert
with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users"
on public.staff
for update using (
    auth.role() = 'authenticated' 
    and (
        -- Allow users to update their own record
        auth.uid() = user_id
        -- Or allow users with admin role to update any record
        or exists (
            select 1 
            from public.staff 
            where user_id = auth.uid() 
            and role = 'admin'
        )
    )
);

create policy "Enable delete access for admin users"
on public.staff
for delete using (
    exists (
        select 1 
        from public.staff 
        where user_id = auth.uid() 
        and role = 'admin'
    )
);

-- Grant necessary permissions to authenticated users
grant usage on schema public to authenticated;
grant all on public.staff to authenticated;

-- Create function to get current user's role
create or replace function public.get_user_role()
returns text
language sql
security definer
as $$
  select role::text
  from public.staff
  where user_id = auth.uid()
  limit 1;
$$;
