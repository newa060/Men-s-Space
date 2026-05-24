-- Store location fields on CMS singleton
ALTER TABLE public.cms_settings
  ADD COLUMN IF NOT EXISTS store_location TEXT,
  ADD COLUMN IF NOT EXISTS store_location_url TEXT;

UPDATE public.cms_settings
SET
  store_location     = COALESCE(store_location, ''),
  store_location_url = COALESCE(store_location_url, '')
WHERE id = 'global';
