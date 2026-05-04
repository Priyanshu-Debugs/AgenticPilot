-- X/Twitter Automation Schema
-- Run this SQL against your Supabase project (SQL Editor or CLI)

-- ============================================================
-- Table: twitter_connections
-- Stores OAuth tokens, user profile info, and X app credentials
-- ============================================================
create table if not exists twitter_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  client_id text not null,
  client_secret text not null,
  access_token text,
  refresh_token text,
  x_user_id text,
  x_username text,
  x_name text,
  x_profile_image text,
  expires_at timestamptz,
  code_verifier text,
  oauth_state text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Table: twitter_tweets
-- Stores all tweets (draft, published, failed) for each user
-- ============================================================
create table if not exists twitter_tweets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  ai_generated boolean default false,
  tone text,
  product_name text,
  product_description text,
  x_tweet_id text,
  status text default 'draft',
  error_message text,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table twitter_connections enable row level security;
alter table twitter_tweets enable row level security;

create policy "own twitter connections" on twitter_connections
  for all using (auth.uid() = user_id);

create policy "own twitter tweets" on twitter_tweets
  for all using (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-update updated_at on twitter_connections
-- Reuses the existing update_updated_at() function if it exists
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_proc where proname = 'update_updated_at'
  ) then
    create function update_updated_at()
    returns trigger as $func$
    begin
      new.updated_at = now();
      return new;
    end;
    $func$ language plpgsql;
  end if;
end;
$$;

create trigger twitter_connections_updated_at
  before update on twitter_connections
  for each row execute function update_updated_at();
