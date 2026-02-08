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
    <div className="flex rounded-lg border border-primary-200 overflow-hidden">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === code
              ? 'bg-primary-700 text-white'
              : 'bg-white text-primary-600 hover:bg-primary-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
