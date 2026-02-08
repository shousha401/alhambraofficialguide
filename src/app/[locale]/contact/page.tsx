import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/ContactForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tour?: string; date?: string; time?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('contact');

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">{t('title')}</h1>
        <p className="text-primary-600 mb-8">{t('subtitle')}</p>
        <ContactForm locale={locale} initialTourId={sp?.tour} initialDate={sp?.date} initialTime={sp?.time} />
      </div>
    </div>
  );
}
