-- ═══════════════════════════════════════════════════════════
-- Stellar — Supabase Database Setup
-- Run this in your Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Profiles table
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  tag text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);


-- 2. Clips table
create table if not exists clips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null default 'Untitled Clip',
  game text default 'Unknown',
  duration text default '0:00',
  size text default '0 MB',
  visibility text default 'public' check (visibility in ('public', 'private')),
  file_url text,
  thumbnail_url text,
  gradient text,
  share_id text unique default encode(gen_random_bytes(6), 'hex'),
  likes int default 0,
  views int default 0,
  created_at timestamptz default now(),
  author_name text,
  author_tag text
);

alter table clips enable row level security;

-- Anyone can read public clips
create policy "Public clips are viewable by everyone"
  on clips for select using (visibility = 'public');

-- Users can read their own clips (including private)
create policy "Users can view own clips"
  on clips for select using (auth.uid() = user_id);

-- Users can insert their own clips
create policy "Users can insert own clips"
  on clips for insert with check (auth.uid() = user_id);

-- Users can update their own clips
create policy "Users can update own clips"
  on clips for update using (auth.uid() = user_id);

-- Users can delete their own clips
create policy "Users can delete own clips"
  on clips for delete using (auth.uid() = user_id);


-- 3. Storage bucket for clip files
insert into storage.buckets (id, name, public)
values ('clips', 'clips', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Auth users can upload clips"
  on storage.objects for insert
  with check (bucket_id = 'clips' and auth.role() = 'authenticated');

-- Allow users to delete their own uploads
create policy "Users can delete own clip files"
  on storage.objects for delete
  using (bucket_id = 'clips' and auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can read clip files (public bucket)
create policy "Public read for clip files"
  on storage.objects for select
  using (bucket_id = 'clips');
