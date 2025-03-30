-- Create weekly_streaks table to track daily streak data
create table if not exists public.weekly_streaks (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    streak_date date not null,
    has_streak boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, streak_date)
);

-- Add RLS policies
alter table public.weekly_streaks enable row level security;

-- Allow users to read their own streak data
create policy "Users can read their own streak data"
    on public.weekly_streaks for select
    using (auth.uid() = user_id);

-- Allow users to insert their own streak data
create policy "Users can insert their own streak data"
    on public.weekly_streaks for insert
    with check (auth.uid() = user_id);

-- Allow users to update their own streak data
create policy "Users can update their own streak data"
    on public.weekly_streaks for update
    using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
    returns trigger
    language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create trigger to automatically update updated_at
create trigger handle_weekly_streaks_updated_at
    before update on public.weekly_streaks
    for each row
    execute function public.handle_updated_at();