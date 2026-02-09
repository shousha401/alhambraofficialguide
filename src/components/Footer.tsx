'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const exploreLinks = [
  { href: '/tours', key: 'tours' },
  { href: '/availability', key: 'availability' },
  { href: '/about', key: 'about' },
] as const;

const infoLinks = [
  { href: '/contact', key: 'contact' },
  { href: '/faq', key: 'faq' },
  { href: '/blog', key: 'blog' },
] as const;

const legalLinks = [
  { href: '/privacy', key: 'privacy' },
  { href: '/terms', key: 'terms' },
  { href: '/cancellation', key: 'cancellation' },
] as const;

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="relative bg-stone-950 text-sand overflow-hidden">
      {/* Gold accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500/90 to-transparent" />

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill='%23d4a853' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block group">
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream tracking-tight group-hover:text-gold-400/90 transition-colors">
                Guía Oficial de la Alhambra
              </h3>
            </Link>
            <p className="mt-4 text-sand/85 text-sm leading-relaxed max-w-sm">
              {t('description')}
            </p>
            <p className="mt-6 text-sand/70 text-sm flex items-center gap-2">
              <span className="text-gold-500/80" aria-hidden>📍</span>
              Granada, Spain
            </p>
          </div>

          {/* Explore */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h4 className="font-sans font-semibold text-cream/95 mb-4 text-xs uppercase tracking-widest">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sand/80 hover:text-gold-400 transition-colors text-sm"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h4 className="font-sans font-semibold text-cream/95 mb-4 text-xs uppercase tracking-widest">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              {infoLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sand/80 hover:text-gold-400 transition-colors text-sm"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h4 className="font-sans font-semibold text-cream/95 mb-4 text-xs uppercase tracking-widest">
              {t('legal')}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sand/80 hover:text-gold-400 transition-colors text-sm"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-stone-800/80">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sand/50 text-center sm:text-left order-2 sm:order-1">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 order-1 sm:order-2">
              {legalLinks.map(({ href, key }) => (
                <Link
                  key={key}
                  href={href}
                  className="text-xs text-sand/50 hover:text-sand/80 transition-colors"
                >
                  {tNav(key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
