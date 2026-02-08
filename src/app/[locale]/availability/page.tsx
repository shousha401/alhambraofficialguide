import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AvailabilityChecker } from '@/components/AvailabilityChecker';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'availability' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function AvailabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('availability');
  const supabase = await createServerSupabaseClient();
  const { data: tours } = await supabase
    .from('tours')
    .select('id, slug, title_en, title_es')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  const tourOptions = (tours || []).map((t) => ({
    id: t.id,
    slug: t.slug,
    title: locale === 'es' ? t.title_es : t.title_en,
  }));

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">{t('title')}</h1>
        <p className="text-primary-600 mb-8">{t('subtitle')}</p>
        <AvailabilityChecker tours={tourOptions} locale={locale} />
      </div>
    </div>
  );
}
