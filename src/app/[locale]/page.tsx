import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Always fetch fresh tours (no static cache)
export const dynamic = 'force-dynamic';

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
  let tours: { id: string; slug: string; title_en: string; title_es: string; short_description_en: string; short_description_es: string; duration_minutes: number; image_url: string | null }[] | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('tours')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(3);
    tours = data ?? null;
  } catch {
    tours = null;
  }

  const isEs = locale === 'es';

  return (
    <div>
      {/* Hero - full impact */}
      <section className="relative min-h-[85vh] flex flex-col justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/alhambra-hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-stone-950/70" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          <p className="font-sans text-gold-400 text-sm uppercase tracking-[0.3em] mb-4 animate-fade-in">
            Granada · UNESCO World Heritage
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance mb-6 animate-fade-in-up">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-sand max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up-delay">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up-delay-2">
            <Link
              href="/tours"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-gold-500 text-stone-950 font-semibold hover:bg-gold-400 transition-all hover:scale-[1.02] shadow-lg"
            >
              {t('hero.cta')}
            </Link>
            <Link
              href="/availability"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md border-2 border-cream/80 text-cream font-semibold hover:bg-cream/10 transition-all"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours - bento feel */}
      {tours && tours.length > 0 && (
        <section className="py-20 md:py-28 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="font-sans text-tile-600 text-sm uppercase tracking-widest">
                {t('featured.title')}
              </span>
              <p className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 mt-2 text-balance max-w-2xl mx-auto">
                {t('featured.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              {tours.map((tour, i) => (
                <TourCard key={tour.id} tour={tour} locale={locale} index={i} viewTourLabel={t('featured.viewTour')} />
              ))}
            </div>
            <div className="text-center mt-14">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 font-semibold text-tile-600 hover:text-tile-700 transition-colors border-b-2 border-tile-500 pb-0.5"
              >
                {t('featured.viewAll')}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Us - with visual punch */}
      <section className="relative py-20 md:py-28 bg-sand overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('/alhambra-carving.png')" }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="font-sans text-terracotta-600 text-sm uppercase tracking-widest">
              {t('whyUs.title')}
            </span>
            <p className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 mt-2 max-w-2xl mx-auto">
              {t('whyUs.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { titleKey: 'expert', descKey: 'expert', num: '01' },
              { titleKey: 'personal', descKey: 'personal', num: '02' },
              { titleKey: 'flexible', descKey: 'flexible', num: '03' },
            ].map(({ titleKey, descKey, num }) => (
              <div
                key={titleKey}
                className="relative bg-cream rounded-lg p-8 shadow-sm border border-stone-200/80 hover:shadow-md hover:border-terracotta-400/30 transition-all"
              >
                <span className="absolute top-6 right-6 font-serif text-4xl font-light text-terracotta-400/40">
                  {num}
                </span>
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-3">
                  {t(`whyUs.${titleKey}.title`)}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {t(`whyUs.${descKey}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - bold strip */}
      <section className="relative py-20 md:py-24 bg-stone-950 text-cream">
        <div className="h-1 bg-gold-500/80 w-full" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-balance">
            {t('cta.title')}
          </h2>
          <p className="text-sand mb-10">
            {t('cta.subtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 rounded-md bg-gold-500 text-stone-950 font-semibold hover:bg-gold-400 transition-all hover:scale-[1.02]"
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
  index,
  viewTourLabel,
}: {
  viewTourLabel: string;
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
  index: number;
}) {
  const isEs = locale === 'es';
  const title = isEs ? tour.title_es : tour.title_en;
  const desc = isEs ? tour.short_description_es : tour.short_description_en;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-xl hover:border-tile-400/30 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden">
        {tour.image_url ? (
          <img
            src={tour.image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-terracotta-400/20 to-tile-400/20 flex items-center justify-center">
            <span className="text-5xl opacity-50">🏛️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 text-cream font-sans text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {tour.duration_minutes} min
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-tile-700 transition-colors">
          {title}
        </h3>
        <p className="text-stone-600 text-sm mt-1 line-clamp-2">{desc}</p>
        <span className="inline-block mt-3 text-tile-600 text-sm font-medium">
          {viewTourLabel} →
        </span>
      </div>
    </Link>
  );
}
