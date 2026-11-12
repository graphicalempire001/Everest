-- Run this whole file once in Supabase: SQL Editor > New query > paste > Run.

-- 1. Gallery table
create table if not exists public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  caption     text,
  alt         text not null,
  category    text not null default 'Gallery',
  media_type  text not null default 'image' check (media_type in ('image','video')),
  image_path  text not null,      -- WebP in storage (for videos: the WebP poster)
  video_path  text,               -- video file in storage (videos only)
  width       int,
  height      int,
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 2. Who is an admin
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.gallery_items enable row level security;
alter table public.admins        enable row level security;

create policy "admins can see own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

create policy "public reads published items" on public.gallery_items
  for select using (published = true);

create policy "admins read everything" on public.gallery_items
  for select to authenticated using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins insert" on public.gallery_items
  for insert to authenticated with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins update" on public.gallery_items
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins delete" on public.gallery_items
  for delete to authenticated using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 3. Public storage bucket (50 MB per file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('gallery', 'gallery', true, 52428800)
on conflict (id) do nothing;

create policy "anyone can view gallery files" on storage.objects
  for select using (bucket_id = 'gallery');

create policy "admins upload gallery files" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins update gallery files" on storage.objects
  for update to authenticated using (bucket_id = 'gallery' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins delete gallery files" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 4. Make yourself admin: first create your user in Authentication > Users (Add user, with email + password),
--    then replace the email below and run this line.
-- insert into public.admins (user_id) select id from auth.users where email = 'YOUR-EMAIL@example.com';
