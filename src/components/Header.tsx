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
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 min-h-[4.5rem]">
          <Link
            href="/"
            className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-cream hover:text-gold-400 transition-colors"
          >
            Guía Oficial de la Alhambra
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, key }) => {
              const isActive =
                pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={key}
                  href={href}
                  className={clsx(
                    'relative text-sm font-medium tracking-wide transition-colors py-1',
                    isActive
                      ? 'text-gold-400'
                      : 'text-sand hover:text-cream'
                  )}
                >
                  {t(key)}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-gold-500" />
                  )}
                </Link>
              );
            })}
            <LanguageSwitcher />
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              className="p-2 rounded-lg text-sand hover:bg-stone-800/50 transition-colors"
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

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-stone-800/50">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, key }) => (
                <Link
                  key={key}
                  href={href}
                  className="px-4 py-3 rounded-lg text-sand hover:bg-stone-800/50 hover:text-cream transition-colors"
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
