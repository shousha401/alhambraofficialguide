'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/tours', key: 'tours' },
  { href: '/availability', key: 'availability' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
  { href: '/faq', key: 'faq' },
  { href: '/blog', key: 'blog' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary-800">
            Guía Oficial de la Alhambra
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={clsx(
                  'text-sm font-medium transition-colors',
                  pathname?.endsWith(href) || (href !== '/' && pathname?.includes(href))
                    ? 'text-primary-700'
                    : 'text-primary-600 hover:text-primary-800'
                )}
              >
                {t(key)}
              </Link>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              className="p-2 rounded-lg text-primary-600 hover:bg-primary-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-100">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ href, key }) => (
                <Link
                  key={key}
                  href={href}
                  className="px-4 py-2 rounded-lg text-primary-700 hover:bg-primary-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
