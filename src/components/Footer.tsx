'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Guía Oficial de la Alhambra
            </h3>
            <p className="text-sm text-primary-200">{t('description')}</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tours" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('tours')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('faq')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('blog')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('terms')}
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="text-primary-200 hover:text-white transition-colors">
                  {tNav('cancellation')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">{t('contact')}</h4>
            <p className="text-sm text-primary-200">Granada, Spain</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-700">
          <p className="text-sm text-primary-300 text-center">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
