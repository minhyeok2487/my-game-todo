import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['ko', 'en', 'ja', 'zh'];
const defaultLocale = 'ko';

const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
});


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const locale = locales.find(loc => pathname.startsWith(`/${loc}`)) || defaultLocale;
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options) {
                    request.cookies.set({ name, value, ...options })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options) {
                    request.cookies.set({ name, value: '', ...options })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();


    // 4. 인증 로직을 수행합니다. (locale을 고려하여)
    // 비로그인 유저가 /todo 접근 시
    if (!user && pathnameWithoutLocale.startsWith('/todo')) {
        // locale을 포함한 로그인 URL로 리다이렉트
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 로그인했지만 프로필 설정이 안 된 유저 처리
    if (user && !user.user_metadata.display_name && !pathnameWithoutLocale.startsWith('/profile/setup')) {
        // locale을 포함한 프로필 설정 URL로 리다이렉트
        const profileSetupUrl = new URL(`/${locale}/profile/setup`, request.url);
        return NextResponse.redirect(profileSetupUrl);
    }

    // 5. 모든 인증 체크를 통과하면, next-intl 미들웨어를 실행합니다.
    // Supabase 인증으로 쿠키가 변경되었을 수 있으므로 위에서 만든 response를 사용합니다.
    const intlResponse = intlMiddleware(request);

    // Supabase와 next-intl의 응답 헤더를 병합합니다.
    response.headers.forEach((value, key) => {
        if (!key.startsWith('x-middleware-')) { // next-intl의 내부 헤더는 덮어쓰지 않음
            intlResponse.headers.set(key, value);
        }
    });

    return intlResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)'
    ]
};