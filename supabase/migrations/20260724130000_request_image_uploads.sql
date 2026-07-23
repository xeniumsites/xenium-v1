-- Optional customer photo uploads attached to a request.
-- Stores the public Storage URLs of images the sender optionally attached on
-- the request form; these are shown in the admin notification email and the
-- admin order detail view.
alter table public.xenium_requests
  add column if not exists image_urls text[] not null default '{}';

-- Storage bucket for those optional uploads from the PUBLIC request form.
-- Public-read so the images render in the admin email; objects live under an
-- unguessable random-UUID prefix generated per submission.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'request-uploads',
  'request-uploads',
  true,
  10485760, -- 10 MB per file
  array['image/jpeg','image/jpg','image/png','image/webp','image/heic','image/heif','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public-form users are anonymous, so allow the anon role to upload into
-- (only) this bucket. No update/delete for anon.
drop policy if exists "request-uploads anon insert" on storage.objects;
create policy "request-uploads anon insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'request-uploads');

-- Reads work via the public URL because the bucket is public; this policy also
-- permits listing/select through the Storage API if ever needed.
drop policy if exists "request-uploads public read" on storage.objects;
create policy "request-uploads public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'request-uploads');
