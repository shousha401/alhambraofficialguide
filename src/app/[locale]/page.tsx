import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const supabase = await createServerSupabaseClient();
  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(3);

  const isEs = locale === 'es';

  return (
    <div>
      {/* Hero - Panoramic Alhambra view */}
      <section className="relative bg-primary-800 text-white py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/alhambra-hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-primary-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tours"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors"
            >
              {t('hero.cta')}
            </Link>
            <Link
              href="/availability"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      {tours && tours.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-2 text-center">
              {t('featured.title')}
            </h2>
            <p className="text-primary-600 text-center mb-12 max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} locale={locale} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/tours"
                className="inline-flex items-center text-primary-700 font-semibold hover:text-primary-900"
              >
                {t('featured.viewAll')}
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Us - Alhambra carving detail as subtle background */}
      <section className="relative py-16 md:py-24 bg-primary-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: "url('/alhambra-carving.png')" }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-2 text-center">
            {t('whyUs.title')}
          </h2>
          <p className="text-primary-600 text-center mb-12 max-w-2xl mx-auto">
            {t('whyUs.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
              <h3 className="font-serif text-xl font-bold text-primary-800 mb-2">{t('whyUs.expert.title')}</h3>
              <p className="text-primary-600">{t('whyUs.expert.desc')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
              <h3 className="font-serif text-xl font-bold text-primary-800 mb-2">{t('whyUs.personal.title')}</h3>
              <p className="text-primary-600">{t('whyUs.personal.desc')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-100">
              <h3 className="font-serif text-xl font-bold text-primary-800 mb-2">{t('whyUs.flexible.title')}</h3>
              <p className="text-primary-600">{t('whyUs.flexible.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-200 mb-8">
            {t('cta.subtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}

async function TourCard({
  tour,
  locale,
}: {
  tour: {
    id: string;
    slug: string;
    title_en: string;
    title_es: string;
    short_description_en: string;
    short_description_es: string;
    duration_minutes: number;
    image_url: string | null;
  };
  locale: string;
}) {
  const isEs = locale === 'es';
  const title = isEs ? tour.title_es : tour.title_en;
  const desc = isEs ? tour.short_description_es : tour.short_description_en;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-primary-100 hover:shadow-md transition-shadow"
    >
      {tour.image_url ? (
        <div className="aspect-[4/3] bg-primary-200 relative overflow-hidden">
          <img src={tour.image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-primary-300 to-primary-400 flex items-center justify-center">
          <span className="text-6xl text-white/50">🏛️</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-primary-800 group-hover:text-primary-600">{title}</h3>
        <p className="text-sm text-primary-600 mt-1 line-clamp-2">{desc}</p>
        <p className="text-sm text-primary-500 mt-2">{tour.duration_minutes} min</p>
      </div>
    </Link>
  );
}
