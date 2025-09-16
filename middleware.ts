import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';


const locales = ['ko-KR', 'en-US']
const defaultLocale = 'ko-KR'
const { auth } = NextAuth(authConfig)


export default auth(async function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    let langHeader = request.headers.get('accept-language') ?? '';
    let languages = new Negotiator({ headers:{ 'accept-language': langHeader }}).languages();
    const locale = match(languages, locales, defaultLocale)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
});


// only applies this middleware to files in the app directory
export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};


