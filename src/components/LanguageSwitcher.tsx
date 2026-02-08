'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    router.replace(pathname || '/', { locale: newLocale as 'en' | 'es' });
  };

  return (
    <div className="flex rounded-md border border-stone-700 overflow-hidden">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === code
              ? 'bg-gold-500 text-stone-950'
              : 'bg-transparent text-sand hover:bg-stone-800 hover:text-cream'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
