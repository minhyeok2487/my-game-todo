import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ locale: string }>; }
) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "todo";
    const { locale } = await params;

    if (code) {
        const supabase = createSupabaseServerClient(false);
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            // 👇 모든 리다이렉션에 locale을 포함시킵니다.
            return NextResponse.redirect(`${origin}/${locale}/login?error=auth_failed`);
        }

        if (data.user) {
            // 프로필 설정이 필요한 경우
            if (!data.user.user_metadata.display_name) {
                return NextResponse.redirect(`${origin}/${locale}/profile/setup`);
            }

            // 로그인 성공
            return NextResponse.redirect(`${origin}/${locale}/${next}`);
        }
    }

    // 유효하지 않은 콜백
    return NextResponse.redirect(`${origin}/${locale}/login?error=invalid_callback`);
}