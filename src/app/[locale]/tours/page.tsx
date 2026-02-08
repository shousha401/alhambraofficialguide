import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Always fetch fresh tours (no static cache)
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tours' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('tours');
  let tours: { id: string; slug: string; title_en: string; title_es: string; short_description_en: string; short_description_es: string; duration_minutes: number; image_url: string | null }[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('tours')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    tours = data ?? [];
  } catch {
    tours = [];
  }

  const isEs = locale === 'es';

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">{t('title')}</h1>
        <p className="text-primary-600 mb-12">{t('subtitle')}</p>

        {tours && tours.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => {
              const title = isEs ? tour.title_es : tour.title_en;
              const desc = isEs ? tour.short_description_es : tour.short_description_en;
              return (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-primary-100 hover:shadow-md transition-shadow"
                >
                  {tour.image_url ? (
                    <div className="aspect-[4/3] bg-primary-200 overflow-hidden">
                      <img src={tour.image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary-300 to-primary-400 flex items-center justify-center">
                      <span className="text-6xl text-white/50">🏛️</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-serif text-xl font-bold text-primary-800 group-hover:text-primary-600">{title}</h2>
                    <p className="text-sm text-primary-600 mt-1 line-clamp-2">{desc}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-primary-500">{t('duration')}: {tour.duration_minutes} min</span>
                      <span className="text-primary-700 font-semibold text-sm">{t('requestTour')} →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-primary-600 text-center py-12">{t('noTours')}</p>
        )}
      </div>
    </div>
  );
}
