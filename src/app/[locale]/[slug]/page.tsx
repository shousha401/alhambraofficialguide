import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const LEGAL_SLUGS = ['privacy', 'terms', 'cancellation'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!LEGAL_SLUGS.includes(slug as typeof LEGAL_SLUGS[number])) return {};
  const supabase = await createServerSupabaseClient();
  const { data: page } = await supabase
    .from('legal_pages')
    .select('title_en, title_es')
    .eq('slug', slug)
    .single();
  if (!page) return {};
  const isEs = locale === 'es';
  return { title: isEs ? page.title_es : page.title_en };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!LEGAL_SLUGS.includes(slug as typeof LEGAL_SLUGS[number])) notFound();

  const supabase = await createServerSupabaseClient();
  const { data: page } = await supabase
    .from('legal_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!page) notFound();

  const isEs = locale === 'es';
  const title = isEs ? page.title_es : page.title_en;
  const content = isEs ? page.content_es : page.content_en;
  const t = await getTranslations('legal');

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4">{title}</h1>
        <p className="text-sm text-primary-500 mb-8">{t('lastUpdated')}: {new Date(page.updated_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}</p>
        <div className="prose prose-primary max-w-none text-primary-700" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
