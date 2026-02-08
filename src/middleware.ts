import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Cookie name for language preference
const LOCALE_COOKIE = 'NEXT_LOCALE';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin') // Admin uses separate locale handling
  ) {
    return NextResponse.next();
  }

  // Check for locale in path
  const pathnameLocale = pathname.split('/')[1];
  const isLocalePath = routing.locales.includes(pathnameLocale as 'en' | 'es');

  if (!isLocalePath) {
    // No locale in path - redirect based on cookie or Accept-Language
    let locale = request.cookies.get(LOCALE_COOKIE)?.value;

    if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
      const acceptLanguage = request.headers.get('accept-language') || '';
      const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
      locale = browserLang === 'es' ? 'es' : 'en';
    }

    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    const response = NextResponse.redirect(newUrl);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }

  // Pass pathname for getRequestConfig
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const response = createMiddleware(routing)(request);
  response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|admin|.*\\..*).*)'],
};
