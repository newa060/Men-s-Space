-- Create initial DB schema for AESTHETE Men's Space e-commerce

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (RBAC roles: 'customer', 'admin')
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb, -- array of {name, hex}
  materials TEXT,
  waterproof TEXT,
  breathability TEXT,
  hardware TEXT,
  seams TEXT,
  is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
  series TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  items_count INTEGER NOT NULL DEFAULT 0,
  items_summary TEXT, -- e.g., "Carrara Monolith x1, Brutalist Oak Plinth x1"
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL,
  color TEXT,
  image TEXT
);

-- 5. Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  postcode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CMS Settings Table (Singleton)
CREATE TABLE IF NOT EXISTS public.cms_settings (
  id TEXT PRIMARY KEY DEFAULT 'global' CHECK (id = 'global'),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  hero_cta_text TEXT NOT NULL,
  featured_category TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Feedback Items Table
CREATE TABLE IF NOT EXISTS public.feedback_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  location TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Gallery Items Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  cloudinary_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at tracking
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cms_settings_updated_at BEFORE UPDATE ON public.cms_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new auth.users signup and automatically create public.profiles row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT := 'customer';
BEGIN
  -- Simple check: if metadata says admin, or it's the very first user, or email matches admin pattern, set admin role
  IF new.email = 'admin@aesthete.com' OR coalesce(new.raw_user_meta_data->>'role', 'customer') = 'admin' THEN
    assigned_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies:

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access on profiles" ON public.profiles TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products Policies
CREATE POLICY "Anyone can view Active products" ON public.products FOR SELECT USING (status = 'Active' OR EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));
CREATE POLICY "Admins have full write access on products" ON public.products TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders Policies
CREATE POLICY "Customers can view their own orders" ON public.orders FOR SELECT TO authenticated USING (customer_id = auth.uid());
CREATE POLICY "Customers can create their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Admins can manage all orders" ON public.orders TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order Items Policies
CREATE POLICY "Customers can view their own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);
CREATE POLICY "Customers can insert their own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);
CREATE POLICY "Admins can manage all order items" ON public.order_items TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Addresses Policies
CREATE POLICY "Users can manage their own addresses" ON public.addresses TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- CMS Settings Policies
CREATE POLICY "CMS is publicly viewable" ON public.cms_settings FOR SELECT USING (true);
CREATE POLICY "Admins can edit CMS settings" ON public.cms_settings TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Feedback Policies
CREATE POLICY "Approved feedback is publicly viewable" ON public.feedback_items FOR SELECT USING (approved = true OR EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));
CREATE POLICY "Anyone can submit feedback" ON public.feedback_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can edit feedback items" ON public.feedback_items TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Gallery Policies
CREATE POLICY "Gallery is viewable by everyone" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery items" ON public.gallery_items TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- SEED DATA ───────────────────────────────────────────────────────────

-- Singleton CMS Settings
INSERT INTO public.cms_settings (id, hero_title, hero_subtitle, hero_image, hero_cta_text, featured_category)
VALUES (
  'global',
  'Architectural Forms',
  'A dialogue between human structure and sartorial precision. Collection 04 is now available.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBga5lcdNTZo5qWObfMmw_RL3ZwUJtQp_vG9UficR9a_WYSqzsoM3FkgcXjOx82IytbLGbcK72QerzF5Ince2lrPNcUUzGEMXs9SSriYR26pfPLsI9dzJjz3DOrvGmj28_gJ23g7xOcCrMqTbfU8SlatF2I1fmA134UU9on7OKs_SdNhYINdOOO3g5JMlqk5Pxpik_5FRN77rU_4Hr_KhJnyX3F96SSsLQtEwSh5zGTrTqAY7N9w3TwaBn0ZsZ-nNmGmd2Adj_J5THD',
  'Shop Collection',
  'Architecture'
) ON CONFLICT (id) DO NOTHING;

-- Feedback Items Seed
INSERT INTO public.feedback_items (id, text, author, location, approved) VALUES
('fb-1', 'Aesthete represents more than apparel. It’s a deliberate study of form, function, and the silence of exceptional design.', 'Elena Vorski', 'Architectural Critic', true),
('fb-2', 'The silhouette of the trench coat is unmatched. Pure architectural bliss.', 'Anonymous', 'London', true),
('fb-3', 'Obsessed with the monochromatic palette. It makes getting ready every morning an exercise in effortless luxury.', 'Verified Buyer', 'Tokyo', true),
('fb-4', 'Beautiful layout, stunning materials. Their Carrara Monolith feels like a sculptural centerpiece.', 'Marcus Vance', 'Berlin', false)
ON CONFLICT (id) DO NOTHING;

-- Gallery Slide Seed
INSERT INTO public.gallery_items (id, title, image_url, sort_order) VALUES
('g-1', 'Concrete Study 01', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCRza8SyWDjM8Z6rfUc0uu9Lx_tvZudo6A_50JtEn2m4VFogGAhbcbX5wRcK-s3QJeOTyNWRwZ19OWmpHin275qsTGARqqShf7IO2TZBed4BLBRRPFDYg5C6l8PzYew1DIXC1oVU1w2-v-w7JKUNoUGv3s8SABkUb9MGrpj7SVCfN1rMenAJ6c9AghQxEl0fMZR8JKG3WI5cvLFS9YbdPokYbiSjnQSmpcwL08P8ccYEhukQGA9VFJ_rKgeyTINosOzxoY_VXHOdZA', 0),
('g-2', 'Raw Silk Detail', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo0FPqj-UsM-qhu96rxn5suXidLzzqFBwyKaGWHOjZpxaKGZAAN5Aa-YzM2mNw4baIbYzEp8t6d_Rs6qUHOtRmYqbKOmbnKUX7NLAizJZQdeIxQlf9nq1FWvIC98Goi7_f_SqN6cZiyn3GOY1ISCJAa_woqcFGpSJr3noZh0mNr3tm_a_A6joaWe9LPfeTDRnVDl87Bu4BZxpRS3nNT6WhjPntSxxZ5zJtANbK1tf86-JMzFqrkjg_HFWQv4sJXjRJUZ8ZSsXceSxP', 1)
ON CONFLICT (id) DO NOTHING;

-- Products Seed
INSERT INTO public.products (id, name, slug, sku, price, stock, category, status, image, description, sizes, images, colors, materials, waterproof, breathability, hardware, seams, is_new_arrival, series) VALUES
(
  'prod-1',
  'Carrara Monolith',
  'carrara-monolith',
  'ART-CH-001',
  12400,
  12,
  'Architecture',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNVuRwR-HDXuwncIMmkOYzlw6uHIkLQm__rl7GOA-bB-qIwAYdcQE58MjtPDWnua2Ih5PViCli_e4wHbJnlYniFt4rZ62ChCfy2PglhBgS4ag0D_TM4_BgfIAOy1rHDQ3WtetxXlVSEek59BrueM3Oq-J4USYYC96igJoak67jxcLUWpsZqIz0Ylqg4C889Q7NtWUWJUWPbWQRVCRNproHnGIOhLD41VtBXwAvtC0_zoPA1hI3ApgirEmE1MWQ2PKTWmP6NBpgtFCo',
  'A minimalist high-fashion studio photograph of a sculptural marble chair set against a stark, architectural concrete backdrop.',
  '{"OS"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  false,
  NULL
),
(
  'prod-2',
  'Obsidian Velvet Panel',
  'obsidian-velvet-panel',
  'TEX-VL-402',
  850,
  0,
  'Textiles',
  'Archived',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDQmsDgUnSWZWiQ2ymITJU2T1J3VC1WO1ze-6craHb4b_QOHroEKDVNfq4whtxDd3rp_q6ilrmHV7Osv8C1DlxW1VRNktyFvtuSQiJqOzGXt-hEy6jSx0fbu-8AbyI0txWcoStYYaAvq5mluYbNfOSjKeVZk6h1LGoWJbvgCNqo9chsK9499kkdwM9h2unupzjHhkE-Od3GCR4b8Mhbc6t5AgYGsql-O8BKzl6cqgWzdtD-lhqPm2VpN-dbE8sulLKL72jlwkFyZC4-',
  'A macro photograph of premium velvet upholstery fabric featuring a complex, geometric weave pattern in deep obsidian and midnight blue.',
  '{"S", "M", "L"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  false,
  NULL
),
(
  'prod-3',
  'Brutalist Oak Plinth',
  'brutalist-oak-plinth',
  'FUR-WD-089',
  3200,
  4,
  'Furniture',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCp6QZIiVQRbMggm-lmpw7svtnVkfPggJxGRSiFo65K3y4_f84eKpYLP-6AQrmDjib3fIwNIj-PYi2tT03gVbMtcCnRs2y4Gf1l8mthPGQR-dHY5aqwDknnkJD27z5AzbtIVA39YgIlfdp1JwI_u3aX_dEFkYegK2W0t0B3blu0O7krkp4cZtmx3cs0i7UknRwJCw4A61kvlI7y7Gk4U5cJ8-A8yN-N17jMySDHwd2hI-SxnQeeG7Bh45rj2hEraLjj7tNagS-i6NKM',
  'An interior shot of a Brutalist-inspired living space with a focus on a raw oak side table.',
  '{"OS"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  false,
  NULL
),
(
  'prod-4',
  'Lucent Glass Divider',
  'lucent-glass-divider',
  'ART-GL-112',
  5100,
  24,
  'Architecture',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEExuJ64esSmbamVGgCA4t4CmOzka0zAab_r6fxE7Wl7WvTd_wCd0FYP0QZum5jc83gQZ6jUqnadPoJI1DmkScp9rHWewOKfNHt_GaO9hhhJviBslXcM5eM9PITnjr0MS-V46q8CzV4wzZHv2q6eDYbuo0ineE_T_fkNzn8vbRCPu5r1voj2--402mbaK5C7YOeHkwbTvpa_SzC5kXlp62E0EffQ_92fqaq9HeSMwdKTeNyTgQUtExnURRr36gkMJvcHAOr-HMjCkF',
  'A minimalist architectural installation featuring suspended translucent glass panels in a darkened gallery.',
  '{"OS"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  false,
  NULL
),
(
  'structural-wool-coat',
  'Structural Wool Coat',
  'structural-wool-coat',
  'APP-WC-002',
  1090,
  15,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBNTiPV-94sOcCV_ZNissk31ncdN23HhehqmCWT8-FQ9ITtuZ3kdB0pD9N0PXXGVaEX_EIzmeyjUC5exi5h2aw3rE-HfiHFKIzp71GbIWjsnAVXBixywaMgWLfxZiQim5ROHDjmCy-Qs5DOHUrz8AmFXqE-x4kqrP6Nr62IWNxEx8tf1luJjCKnvwft0BTid4PD2r7PGqjkHcbpbq03O7lMrnTthhPpi0VVHRpY6EF1yd_jZ-pZg5fnu6SKMgNKHUt47F6n_D0x3fqZ',
  'Featuring a custom structured wool weave, this coat defines class and performance. Its sharp collar line and architectural cut are designed to hang perfectly in any pose.',
  '{"S", "M", "L", "XL"}',
  '{"https://lh3.googleusercontent.com/aida-public/AB6AXuBNTiPV-94sOcCV_ZNissk31ncdN23HhehqmCWT8-FQ9ITtuZ3kdB0pD9N0PXXGVaEX_EIzmeyjUC5exi5h2aw3rE-HfiHFKIzp71GbIWjsnAVXBixywaMgWLfxZiQim5ROHDjmCy-Qs5DOHUrz8AmFXqE-x4kqrP6Nr62IWNxEx8tf1luJjCKnvwft0BTid4PD2r7PGqjkHcbpbq03O7lMrnTthhPpi0VVHRpY6EF1yd_jZ-pZg5fnu6SKMgNKHUt47F6n_D0x3fqZ"}',
  '[{"name": "Black", "hex": "#000000"}, {"name": "Ash", "hex": "#8e8e8e"}]'::jsonb,
  '100% Virgin Melton Wool',
  'Water-resistant',
  'Natural Breathability',
  'Horn Buttons',
  'Felled Tailoring Seams',
  false,
  NULL
),
(
  'monolith-parka',
  'Monolith Parka',
  'monolith-parka',
  'APP-PR-001',
  1250,
  8,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_Ct1FuIuegBipTc_zn4OdzDzFfm3pU_wd41IEOmbpdJSF-QO_0GDIEF1gJq4d0j8hZseSVpVd5ACa_0eRHDaoYdVHJu7N6mXRz8QIri6hl01rqi7VJPf25KTcmIrlcTdP3jHYRqKnhX1AY_XIRUFNkFPCi_fNxJe-KWF9MgqkLpp0Y0079rsGJgXFerVzCkfDAWAv7CUxwXQv1Z_RcFcwlDWce4jRalgFOou3yjfrXosXfCx2ySplccUTomuVni7URqgkaFrytdXs',
  'The Monolith Parka is a study in brutalist silhouette and environmental resilience. Constructed with laser-cut precision, its structural panels create a sharp, protective volume that maintains its geometric integrity regardless of movement.',
  '{"S", "M", "L", "XL"}',
  '{"https://lh3.googleusercontent.com/aida-public/AB6AXuB_Ct1FuIuegBipTc_zn4OdzDzFfm3pU_wd41IEOmbpdJSF-QO_0GDIEF1gJq4d0j8hZseSVpVd5ACa_0eRHDaoYdVHJu7N6mXRz8QIri6hl01rqi7VJPf25KTcmIrlcTdP3jHYRqKnhX1AY_XIRUFNkFPCi_fNxJe-KWF9MgqkLpp0Y0079rsGJgXFerVzCkfDAWAv7CUxwXQv1Z_RcFcwlDWce4jRalgFOou3yjfrXosXfCx2ySplccUTomuVni7URqgkaFrytdXs", "https://lh3.googleusercontent.com/aida-public/AB6AXuDsRayMEAab_Rvn-ZKJoYxJ4KuZfFdaKvCP0BRRWI3YSGJp5QpzF6BwaQbojgaINUicOizRH8HwsuQ5xdYMxF1n7Kk4WccnG4u7QoI7azo1lPdEV6FOhi6n3qbOCF9n6N26EFSRbl4C_6oazhBr6gxnNRvKod6JULuI4yHLtqMmncDhJ5yb957vZix3owp5wDEx1xW6Y3rmdh7Qq9YTgcIJlAUicfJBSUuD_Ng5l9vSMzHkDAU77I_CuU_XBUGn6txSNeherfVfMdIG", "https://lh3.googleusercontent.com/aida-public/AB6AXuCkL8zb_7llZX0kn_yyCNctXTsACdI1urlFOj_paqU4W7vzTHyFiIe8Lf4E3eEFJp1ZzgX2jE-sBY_yjx1alf9324oxXZK7HTnWVNB2tNBd1wgqOzKrl14jVqdtebhvjiUeeZHNRnFdhi-xC9hlvMnQrLR6BEnQ3VymANAbYBeX2Uu8bXF_qq3e0twttRcTGy-m2pKxXis3Y4bsvmYfgkWSUxWo6O9DlcDpWJ1Jyf93qkNt2WCX49pLLxJS34YKgCHi2-RXu9X247MN"}',
  '[{"name": "Charcoal", "hex": "#1b1b1b"}, {"name": "Slate", "hex": "#4c4c4c"}]'::jsonb,
  '3L Graphene Shell',
  '20,000mm',
  '15,000g/m²',
  'Matte Cobalt YKK',
  'Ultrasonic Welded',
  false,
  NULL
),
(
  'architectural-blazer',
  'Architectural Blazer',
  'architectural-blazer',
  'APP-BZ-003',
  950,
  12,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCg8ZtOU_uiqG2KZwNs6txbcik_jozZZ-B16Kh8qXgdDLRUcp5-VBhIrJ9DWGQ_ma7w3qFycT8vp-_HpHLaLskpQw4bUfGzAh6YP0vTMFE1xyl17Xdp2gIyOMy0z3RX22KFKnUiQ1MEUtb-45vR0FUFV0OJ0yMe9KeXHlb5rzY1vrHr4I36tfbG5sSp1Zok1Pk0gpinLIsLtSMJrp4BgMYGhnpCpIqmG7ZXeqfDACbzPmmp7JtfP-Gcfz04WL4aUZX8Mjmbr5fjFGLQ',
  'An unstructured double-breasted jacket made from organic heavy linen blend. Form fits to follow straight geometric outlines.',
  '{"S", "M", "L"}',
  '{"https://lh3.googleusercontent.com/aida-public/AB6AXuCg8ZtOU_uiqG2KZwNs6txbcik_jozZZ-B16Kh8qXgdDLRUcp5-VBhIrJ9DWGQ_ma7w3qFycT8vp-_HpHLaLskpQw4bUfGzAh6YP0vTMFE1xyl17Xdp2gIyOMy0z3RX22KFKnUiQ1MEUtb-45vR0FUFV0OJ0yMe9KeXHlb5rzY1vrHr4I36tfbG5sSp1Zok1Pk0gpinLIsLtSMJrp4BgMYGhnpCpIqmG7ZXeqfDACbzPmmp7JtfP-Gcfz04WL4aUZX8Mjmbr5fjFGLQ"}',
  '[{"name": "White", "hex": "#ffffff"}]'::jsonb,
  'Heavy Linen Blend',
  'None',
  'High',
  'Tonal Buttons',
  'Clean finished seams',
  false,
  NULL
),
(
  'void-biker-jacket',
  'Void Biker Jacket',
  'void-biker-jacket',
  'APP-BJ-004',
  2100,
  5,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDczKpOmR2DnBjmU33JPt2zX9CzXzMeaHymVMFYqHCuVBBmzuM1IX_PzCLIVG1oeADnjhgJpAJxK9sebeUvg2aOrRVjhS2ve0p25P_7Cpk2awhObH3KP7dwvEEhZNiY3Zs_WJtiNAhEtUvPsoQV_Udk2YBRJEzyC9CaHqTp45WeGc04z9Oa58OVzbTz0NRc3d8Rqq1OtveLUOKseNtpzwWBbH7DD5Q_DQSORMe6gGf4MeIjLitQSrfNAYlYiGIfjwblRA-DQOcNnP6B',
  'Modern motorcycle style jacket in robust cowhide, designed with clean matte finishes and zero unnecessary lines.',
  '{"S", "M", "L"}',
  '{"https://lh3.googleusercontent.com/aida-public/AB6AXuDczKpOmR2DnBjmU33JPt2zX9CzXzMeaHymVMFYqHCuVBBmzuM1IX_PzCLIVG1oeADnjhgJpAJxK9sebeUvg2aOrRVjhS2ve0p25P_7Cpk2awhObH3KP7dwvEEhZNiY3Zs_WJtiNAhEtUvPsoQV_Udk2YBRJEzyC9CaHqTp45WeGc04z9Oa58OVzbTz0NRc3d8Rqq1OtveLUOKseNtpzwWBbH7DD5Q_DQSORMe6gGf4MeIjLitQSrfNAYlYiGIfjwblRA-DQOcNnP6B"}',
  '[{"name": "Black", "hex": "#000000"}]'::jsonb,
  '100% Full-grain Cowhide Leather',
  'Water-resistant coating',
  'Moderate',
  'Matte Black Steel Zippers',
  'Reinforced double stitched seams',
  false,
  NULL
),
(
  'translucent-shell',
  'Translucent Shell',
  'translucent-shell',
  'APP-TS-005',
  780,
  20,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCePAGW5LfgIWxsQhog7lJXCYoR3ltubazkI1JIyDKEOqfDBH3BC-tizBiz0yq845DKDGVOLu3Oc76rZ8TwXxrI1s8kXVI2530ssZxAkvnSere06c6VJnELpVwwMvb0zpEJbWRWgVmzTf24abqg7CzyX9mpKftf4sVC1pYfN_lrjT0xZFPGHhL1RKscoWXuu0WfYi_RteT8er8e2G3KW8hSibS2IBPYGd4noghfhE5fkUw8GNaOB-dHdV__g-E0X_FY-Qoyc8KnycTU',
  'Semi-transparent water-resistant layer, ultra-lightweight and packable, displaying underlying garment layouts.',
  '{"S", "M", "L"}',
  '{"https://lh3.googleusercontent.com/aida-public/AB6AXuCePAGW5LfgIWxsQhog7lJXCYoR3ltubazkI1JIyDKEOqfDBH3BC-tizBiz0yq845DKDGVOLu3Oc76rZ8TwXxrI1s8kXVI2530ssZxAkvnSere06c6VJnELpVwwMvb0zpEJbWRWgVmzTf24abqg7CzyX9mpKftf4sVC1pYfN_lrjT0xZFPGHhL1RKscoWXuu0WfYi_RteT8er8e2G3KW8hSibS2IBPYGd4noghfhE5fkUw8GNaOB-dHdV__g-E0X_FY-Qoyc8KnycTU"}',
  '[{"name": "Frost", "hex": "#e2e8f0"}]'::jsonb,
  '100% Dyneema Composite Fabric',
  '10,000mm',
  '25,000g/m²',
  'Waterproof Coil Zipper',
  'Fully bonded seams',
  false,
  NULL
),
(
  'volume-overcoat',
  'Volume Overcoat',
  'volume-overcoat',
  'APP-VO-006',
  1450,
  6,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDiNVIRX7blr872PFvnvfOVUEuQlE5uHKbo6AJza7qIBfWZMMdoE4qrBuxsri4WjzujH-3zjhlvMW2_OsS_Q_zVQgDjx6JZDFzP0Ciu-yP82kE7Q5JSrAfW2s7FtmxoA3nbG6ZRSSyIYF-SQ2NqbLVBhqJS4xyzJKK_0wUQIH56tymIgwbUoW5TCIyg8d0M19LaBrQosDY1wEuATb7eYW-VSUwEmWsclWyUPx3EGKMlSTw3LIidxbR68TdsQK7jIfNUEOA6nwfKlo5b',
  'Brutalist oversized coat silhouette, tailored shoulder lines, structured back panel drape.',
  '{"S", "M", "L", "XL"}',
  '{"https://lh3.googleusercontent.com/aida-public/AB6AXuDiNVIRX7blr872PFvnvfOVUEuQlE5uHKbo6AJza7qIBfWZMMdoE4qrBuxsri4WjzujH-3zjhlvMW2_OsS_Q_zVQgDjx6JZDFzP0Ciu-yP82kE7Q5JSrAfW2s7FtmxoA3nbG6ZRSSyIYF-SQ2NqbLVBhqJS4xyzJKK_0wUQIH56tymIgwbUoW5TCIyg8d0M19LaBrQosDY1wEuATb7eYW-VSUwEmWsclWyUPx3EGKMlSTw3LIidxbR68TdsQK7jIfNUEOA6nwfKlo5b"}',
  '[{"name": "Ash", "hex": "#8e8e8e"}]'::jsonb,
  'Felted Wool Blend',
  'Semi-waterproof treatment',
  'Highly Breathable',
  'Custom Snaps',
  'Taped interior seams',
  false,
  NULL
),
(
  'kinetics-shell',
  'Kinetics Shell',
  'kinetics-shell',
  'APP-KS-201',
  450,
  10,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCjlDZs_2O1NSuBgZHH5C_cQ8qd_5g_g528jbVybnpwq8Z7b9bo0hoWoxC10n_fDn29SrzpuKEo951YqsQ65aNU1fjuwVwSWJLUTDuzkQHBs630cGJAhK4oyCwElemH7g8iuYlYr9wrokGjwNgPQYnzmWafxEV0_0qRsOuRxWFXfx-9suHvEJfXoVMtH1tUhjBhkptdxl72iTacAux2HHt0h7Fvd3Gc4AN7wMPXG8FwuootqK0Use4gI8d5sLKwskV8Xveetgg8mALW',
  'A high-performance technical shell jacket featuring structural seam placements and water-resistant kinetics design.',
  '{"S", "M", "L", "XL"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  'Series 02 / Tech'
),
(
  'modular-tote',
  'Modular Tote',
  'modular-tote',
  'ACC-MT-202',
  280,
  15,
  'Accessories',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqb49rc1xOonG_T8wEIQznPcyiq2GDIJDHB8K2MyNQKsuzmZUhUu2YJ2CBbdjKy-wk-PZTTIFoB2iIl7Sqj3dQT-DwG-HaBCHyvk16J_DW0Ehabd2dsgkEd_Epf473bIkAAkfquGcdiixzHETJu0sESqpJjSNYOPU8Y6IwtXdHQyO8YVds2Ny5ocV9vtcT8sIJ15M39vPcPrRzhXPoo6oe2oYpP1KoJO4lyVEj1F6rSJ-6kVWe2HzYZEt0kroPI50JvkPNHL3hIPSZ',
  'A premium technical tote bag featuring modular compartments and heavy-duty structural straps.',
  '{"OS"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  'Series 02 / Acc'
),
(
  'tectonic-vest',
  'Tectonic Vest',
  'tectonic-vest',
  'APP-TV-203',
  320,
  8,
  'Outerwear',
  'Active',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Dki32HOcAtGS59CpGySwRHehmArKtJx8GfNseF_Q-IG3mvgcwdC1KCr0zgVXCJPbAkpqSmx1e51-BuGc6LeknvBVid9oRRbVXBWTDODmup6Nyt_E4mQL29WFzw3Y6IiiylZQ46RvyLe4Uzh8YYTfA6u6SvSgrslt8aP9B3tkPyFHtzKc363nXlQArpHAy4z3F14RCfPL_SS-HduWAPYZZC28g4E0J4sHGBmnIhq39Lo9cM-OCZ03GgEMN1wJg-sDKwVRNLnGlRda',
  'A multi-pocket structural vest tailored for layering, referencing modern brutalist angles.',
  '{"S", "M", "L"}',
  '{}',
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  'Series 02 / Layer'
)
ON CONFLICT (id) DO NOTHING;
