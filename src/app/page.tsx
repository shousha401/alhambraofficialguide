import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

export default async function RootPage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const acceptLanguage = headersList.get('accept-language') || '';
  const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
  const locale = (localeCookie && ['en', 'es'].includes(localeCookie)) ? localeCookie : (browserLang === 'es' ? 'es' : 'en');
  redirect(`/${locale}`);
}
