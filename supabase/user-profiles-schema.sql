-- User Profiles Schema
-- Run this SQL against your Supabase project (SQL Editor or CLI)

-- ============================================================
-- Table: user_profiles
-- Stores user profile data (plan, company, bio, etc.)
-- ============================================================
create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  avatar_url text,
  plan text default 'starter' check (plan in ('starter', 'professional', 'enterprise')),
  company text,
  company_name text,
  bio text,
  website text,
  location text,
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table user_profiles enable row level security;

create policy "own profile" on user_profiles
  for all using (auth.uid() = user_id);
