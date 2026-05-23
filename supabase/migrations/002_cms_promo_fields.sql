-- New Arrivals / promo banner fields on CMS singleton
ALTER TABLE public.cms_settings
  ADD COLUMN IF NOT EXISTS promo_image TEXT,
  ADD COLUMN IF NOT EXISTS promo_heading TEXT,
  ADD COLUMN IF NOT EXISTS promo_cta_text TEXT,
  ADD COLUMN IF NOT EXISTS promo_intro TEXT;

UPDATE public.cms_settings
SET
  promo_image = COALESCE(
    promo_image,
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop'
  ),
  promo_heading = COALESCE(promo_heading, 'New Arrivals / Series 02'),
  promo_cta_text = COALESCE(promo_cta_text, 'Explore the Series'),
  promo_intro = COALESCE(promo_intro, 'COLLECTION 2026')
WHERE id = 'global';
