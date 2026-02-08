import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  const isEs = locale === 'es';

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">{t('title')}</h1>
        <p className="text-primary-600 mb-12">{t('subtitle')}</p>

        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => {
              const title = isEs ? post.title_es : post.title_en;
              const excerpt = isEs ? post.excerpt_es : post.excerpt_en;
              const publishedAt = post.published_at
                ? new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '';
              return (
                <article key={post.id} className="border-b border-primary-200 pb-8">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    {post.image_url && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-primary-200 relative">
                        <Image src={post.image_url} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <h2 className="font-serif text-2xl font-bold text-primary-800 group-hover:text-primary-600">
                      {title}
                    </h2>
                    <p className="text-primary-600 mt-2">{excerpt}</p>
                    <p className="text-sm text-primary-500 mt-2">
                      {t('publishedOn')} {publishedAt}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-primary-600 text-center py-12">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
