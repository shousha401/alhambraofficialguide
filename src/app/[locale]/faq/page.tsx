import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { FaqAccordion } from '@/components/FaqAccordion';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('faq');
  const supabase = await createServerSupabaseClient();
  const { data: faqs } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });

  const items = (faqs || []).map((faq) => ({
    question: locale === 'es' ? faq.question_es : faq.question_en,
    answer: locale === 'es' ? faq.answer_es : faq.answer_en,
  }));

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">{t('title')}</h1>
        <p className="text-primary-600 mb-12">{t('subtitle')}</p>
        <FaqAccordion items={items} />
      </div>
    </div>
  );
}
