import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HreflangTags } from '@/components/HreflangTags';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: {
      default: isEn
        ? 'Guía Oficial de la Alhambra | Official Alhambra Tours in Granada'
        : 'Guía Oficial de la Alhambra | Tours Oficiales de la Alhambra en Granada',
    },
    description: isEn
      ? 'Official guided tours of the Alhambra in Granada, Spain. Book your Alhambra experience with licensed official guides.'
      : 'Tours guiados oficiales de la Alhambra en Granada, España. Reserva tu experiencia en la Alhambra con guías oficiales licenciados.',
    alternates: {
      canonical: `https://guiaoficialalhambra.com/${locale}`,
      languages: {
        en: 'https://guiaoficialalhambra.com/en',
        es: 'https://guiaoficialalhambra.com/es',
        'x-default': 'https://guiaoficialalhambra.com/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <HreflangTags locale={locale} />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-primary-50">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
