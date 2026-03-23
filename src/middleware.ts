import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Payload admin, API, static files, and Next.js internals
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/graphql') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || ''
  const preferredLocale =
    locales.find((locale) => acceptLanguage.includes(locale)) || defaultLocale

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|admin|api|graphql|favicon.ico).*)'],
}
