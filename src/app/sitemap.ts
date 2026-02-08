import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://guiaoficialalhambra.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  const staticRoutes = [
    '',
    '/tours',
    '/availability',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/privacy',
    '/terms',
    '/cancellation',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ['en', 'es']) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  const { data: tours } = await supabase.from('tours').select('slug, updated_at').eq('published', true);
  if (tours) {
    for (const tour of tours) {
      for (const locale of ['en', 'es']) {
        entries.push({
          url: `${BASE_URL}/${locale}/tours/${tour.slug}`,
          lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        });
      }
    }
  }

  const { data: posts } = await supabase.from('blog_posts').select('slug, updated_at').eq('published', true);
  if (posts) {
    for (const post of posts) {
      for (const locale of ['en', 'es']) {
        entries.push({
          url: `${BASE_URL}/${locale}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
