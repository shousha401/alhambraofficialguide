'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="relative bg-stone-950 text-sand overflow-hidden">
      {/* Decorative pattern strip */}
      <div className="h-1 bg-pattern-strip bg-repeat-x opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-cream mb-3 tracking-tight">
              Guía Oficial de la Alhambra
            </h3>
            <p className="text-sand/90 text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4 tracking-wide uppercase text-xs">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/tours', key: 'tours' },
                { href: '/about', key: 'about' },
                { href: '/contact', key: 'contact' },
                { href: '/faq', key: 'faq' },
                { href: '/blog', key: 'blog' },
                { href: '/privacy', key: 'privacy' },
                { href: '/terms', key: 'terms' },
                { href: '/cancellation', key: 'cancellation' },
              ].map(({ href, key }) => (
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

          <div>
            <h4 className="font-semibold text-cream mb-4 tracking-wide uppercase text-xs">
              {t('contact')}
            </h4>
            <p className="text-sand/80 text-sm">Granada, Spain</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800">
          <p className="text-sm text-sand/60 text-center">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
