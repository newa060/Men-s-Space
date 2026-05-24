-- Store identity fields on CMS singleton
ALTER TABLE public.cms_settings
  ADD COLUMN IF NOT EXISTS store_name TEXT,
  ADD COLUMN IF NOT EXISTS store_tagline TEXT,
  ADD COLUMN IF NOT EXISTS store_email TEXT,
  ADD COLUMN IF NOT EXISTS store_phone TEXT,
  ADD COLUMN IF NOT EXISTS store_instagram TEXT,
  ADD COLUMN IF NOT EXISTS store_twitter TEXT,
  ADD COLUMN IF NOT EXISTS store_facebook TEXT;

UPDATE public.cms_settings
SET
  store_name    = COALESCE(store_name, 'Aesthete Studio'),
  store_tagline = COALESCE(store_tagline, 'Architectural Forms in Fashion'),
  store_email   = COALESCE(store_email, ''),
  store_phone   = COALESCE(store_phone, ''),
  store_instagram = COALESCE(store_instagram, ''),
  store_twitter   = COALESCE(store_twitter, ''),
  store_facebook  = COALESCE(store_facebook, '')
WHERE id = 'global';
