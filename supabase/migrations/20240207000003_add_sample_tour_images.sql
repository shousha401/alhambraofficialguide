-- Add image URLs to existing sample tour (run if tour was already inserted without images)
UPDATE tours
SET image_url = 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
    updated_at = NOW()
WHERE slug = 'alhambra-generalife' AND image_url IS NULL;
