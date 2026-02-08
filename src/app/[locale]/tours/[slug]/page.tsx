import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HreflangTags } from '@/components/HreflangTags';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: tour } = await supabase.from('tours').select('title_en, title_es, short_description_en, short_description_es').eq('slug', slug).eq('published', true).single();
  if (!tour) return {};
  const isEs = locale === 'es';
  return {
    title: isEs ? tour.title_es : tour.title_en,
    description: isEs ? tour.short_description_es : tour.short_description_en,
    alternates: {
      canonical: `https://guiaoficialalhambra.com/${locale}/tours/${slug}`,
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('tourDetail');
  const supabase = await createServerSupabaseClient();
  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!tour) notFound();

  const isEs = locale === 'es';
  const title = isEs ? tour.title_es : tour.title_en;
  const shortDesc = isEs ? tour.short_description_es : tour.short_description_en;
  const description = isEs ? tour.description_es : tour.description_en;
  const itinerary = isEs ? tour.itinerary_es : tour.itinerary_en;
  const inclusions = isEs ? tour.inclusions_es : tour.inclusions_en;
  const exclusions = isEs ? tour.exclusions_es : tour.exclusions_en;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {tour.image_url && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-primary-200">
            <img src={tour.image_url} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4">{title}</h1>
        <p className="text-lg text-primary-600 mb-6">{shortDesc}</p>

        <div className="flex flex-wrap gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm">
            {t('duration')}: {tour.duration_minutes} min
          </span>
          <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm">
            {t('groupSize')}: {tour.max_group_size}
          </span>
          {tour.languages && tour.languages.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm">
              {t('languages')}: {tour.languages.join(', ').toUpperCase()}
            </span>
          )}
        </div>

        {description && (
          <section className="mb-8">
            <h2 className="font-serif text-xl font-bold text-primary-800 mb-3">{t('overview')}</h2>
            <div className="prose prose-primary max-w-none text-primary-700" dangerouslySetInnerHTML={{ __html: description }} />
          </section>
        )}

        {itinerary && (
          <section className="mb-8">
            <h2 className="font-serif text-xl font-bold text-primary-800 mb-3">{t('itinerary')}</h2>
            <div className="prose prose-primary max-w-none text-primary-700" dangerouslySetInnerHTML={{ __html: itinerary }} />
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {inclusions && inclusions.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-primary-800 mb-3">{t('inclusions')}</h2>
              <ul className="list-disc list-inside text-primary-700 space-y-1">
                {inclusions.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {exclusions && exclusions.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-bold text-primary-800 mb-3">{t('exclusions')}</h2>
              <ul className="list-disc list-inside text-primary-700 space-y-1">
                {exclusions.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={{ pathname: '/contact', query: { tour: tour.id } }}
            className="inline-flex justify-center px-6 py-3 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors"
          >
            {t('requestTour')}
          </Link>
          <Link
            href="/availability"
            className="inline-flex justify-center px-6 py-3 rounded-lg border-2 border-primary-600 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            {t('checkAvailability')}
          </Link>
        </div>
      </div>
    </div>
  );
}
