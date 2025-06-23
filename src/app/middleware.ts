import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const supabase = createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (!user && pathname.startsWith('/todo')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user && !user.user_metadata.display_name && pathname !== '/profile/setup') {
        return NextResponse.redirect(new URL('/profile/setup', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * 아래의 경로들과 일치하는 경우 미들웨어를 실행합니다.
         * - api (API 라우트)
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화 파일)
         * - favicon.ico (파비콘 파일)
         * 로 시작하지 않는 모든 요청 경로
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}