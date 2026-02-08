-- Guía Oficial de la Alhambra - Initial Schema
-- Bilingual support: all content tables have _en and _es columns

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tours table (bilingual)
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  short_description_en TEXT NOT NULL,
  short_description_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  itinerary_en TEXT,
  itinerary_es TEXT,
  inclusions_en TEXT[],
  inclusions_es TEXT[],
  exclusions_en TEXT[],
  exclusions_es TEXT[],
  duration_minutes INTEGER NOT NULL,
  max_group_size INTEGER NOT NULL DEFAULT 15,
  languages TEXT[] DEFAULT ARRAY['en', 'es'],
  price_from_cents INTEGER,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ table (bilingual)
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_en TEXT NOT NULL,
  question_es TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_es TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts (bilingual)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  excerpt_es TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_es TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tour requests / reservation inquiries
CREATE TABLE tour_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id),
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE,
  preferred_time TIME,
  number_of_guests INTEGER,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability slots (for admin-managed availability)
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 15,
  booked_guests INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tour_id, slot_date, slot_time)
);

-- Legal pages (bilingual) - stored in DB for easy editing
CREATE TABLE legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_es TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (optional, for metadata)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tours_published ON tours(published);
CREATE INDEX idx_tours_featured ON tours(featured);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_tour_requests_status ON tour_requests(status);
CREATE INDEX idx_tour_requests_created ON tour_requests(created_at DESC);
CREATE INDEX idx_availability_slots_date ON availability_slots(slot_date);

-- RLS policies (enable for Supabase)
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read tours" ON tours FOR SELECT USING (published = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public insert tour_requests" ON tour_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read availability" ON availability_slots FOR SELECT USING (true);
CREATE POLICY "Public read legal" ON legal_pages FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Insert default legal pages
INSERT INTO legal_pages (slug, title_en, title_es, content_en, content_es) VALUES
('privacy', 'Privacy Policy', 'Política de Privacidad', 
 '<p>Your privacy is important to us. We collect only the information necessary to process your tour request and respond to your inquiries.</p>',
 '<p>Tu privacidad es importante para nosotros. Solo recopilamos la información necesaria para procesar tu solicitud de tour y responder a tus consultas.</p>'),
('terms', 'Terms of Service', 'Términos de Servicio',
 '<p>By using our services, you agree to these terms. Tours are subject to availability and confirmation.</p>',
 '<p>Al utilizar nuestros servicios, aceptas estos términos. Los tours están sujetos a disponibilidad y confirmación.</p>'),
('cancellation', 'Cancellation Policy', 'Política de Cancelación',
 '<p>Free cancellation up to 48 hours before the tour. Cancellations within 48 hours may be subject to fees.</p>',
 '<p>Cancelación gratuita hasta 48 horas antes del tour. Las cancelaciones dentro de las 48 horas pueden estar sujetas a cargos.</p>');
