import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-4">{t('title')}</h1>
        <p className="text-lg text-primary-600 mb-8">{t('subtitle')}</p>
        <div className="prose prose-primary max-w-none text-primary-700 space-y-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-primary-800 mb-2">{t('mission')}</h2>
            <p>{t('missionText')}</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-primary-800 mb-2">{t('team')}</h2>
            <p>{t('teamText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
