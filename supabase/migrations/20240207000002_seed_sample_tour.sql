-- Sample tour for demo (optional - run after initial schema)
INSERT INTO tours (
  slug,
  title_en,
  title_es,
  short_description_en,
  short_description_es,
  description_en,
  description_es,
  duration_minutes,
  max_group_size,
  image_url,
  featured,
  sort_order,
  published
) VALUES (
  'alhambra-generalife',
  'Alhambra & Generalife Complete Tour',
  'Tour Completo Alhambra y Generalife',
  'Discover the complete Alhambra complex including Nasrid Palaces, Alcazaba, and Generalife gardens with an official licensed guide.',
  'Descubre el complejo completo de la Alhambra incluyendo Palacios Nazaríes, Alcazaba y jardines del Generalife con un guía oficial licenciado.',
  '<p>Our flagship tour covers the entire Alhambra UNESCO World Heritage site. You will explore the Nasrid Palaces with their intricate stucco work and tile mosaics, the Alcazaba fortress with stunning city views, and the Generalife summer palace and gardens.</p>',
  '<p>Nuestro tour estrella cubre todo el sitio Patrimonio de la Humanidad de la Alhambra. Explorarás los Palacios Nazaríes con su elaborado estuco y mosaicos de azulejos, la fortaleza de la Alcazaba con impresionantes vistas de la ciudad, y el palacio de verano del Generalife y sus jardines.</p>',
  180,
  15,
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
  true,
  0,
  true
) ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  updated_at = NOW();
