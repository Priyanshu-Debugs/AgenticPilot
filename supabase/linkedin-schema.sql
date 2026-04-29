-- LinkedIn Automation Schema
-- Run this SQL against your Supabase project (SQL Editor or CLI)

-- ============================================================
-- Table: linkedin_connections
-- Stores OAuth tokens and profile info for connected LinkedIn accounts
-- ============================================================
create table if not exists linkedin_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  access_token text not null,
  linkedin_person_urn text not null,
  linkedin_name text,
  linkedin_email text,
  linkedin_picture text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Table: linkedin_posts
-- Stores all posts (draft, published, failed) for each user
-- ============================================================
create table if not exists linkedin_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  ai_generated boolean default false,
  tone text,
  scheduled_at timestamptz,
  published_at timestamptz,
  linkedin_post_id text,
  status text default 'draft',
  error_message text,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table linkedin_connections enable row level security;
alter table linkedin_posts enable row level security;

create policy "own connections" on linkedin_connections
  for all using (auth.uid() = user_id);

create policy "own posts" on linkedin_posts
  for all using (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-update updated_at on linkedin_connections
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger linkedin_connections_updated_at
  before update on linkedin_connections
  for each row execute function update_updated_at();
