import { routing } from '@/i18n/routing';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://guiaoficialalhambra.com';

type HreflangTagsProps = {
  locale: string;
  path?: string;
};

export function HreflangTags({ locale, path = '' }: HreflangTagsProps) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return (
    <>
      {routing.locales.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={`${BASE_URL}/${loc}${cleanPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${BASE_URL}/en${cleanPath}`}
      />
    </>
  );
}
