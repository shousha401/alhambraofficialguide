import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title_en, title_es, excerpt_en, excerpt_es')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (!post) return {};
  const isEs = locale === 'es';
  return {
    title: isEs ? post.title_es : post.title_en,
    description: isEs ? post.excerpt_es : post.excerpt_en,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('blog');
  const supabase = await createServerSupabaseClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  const isEs = locale === 'es';
  const title = isEs ? post.title_es : post.title_en;
  const content = isEs ? post.content_es : post.content_en;
  const publishedAt = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-primary-600 hover:text-primary-800 mb-6 inline-block">
          ← {t('backToBlog')}
        </Link>
        {post.image_url && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-primary-200 relative">
            <Image src={post.image_url} alt={title} fill sizes="(max-width: 1024px) 100vw, 768px" className="object-cover" />
          </div>
        )}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4">{title}</h1>
        <p className="text-primary-500 mb-8">{t('publishedOn')} {publishedAt}</p>
        <div className="prose prose-primary max-w-none text-primary-700" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
