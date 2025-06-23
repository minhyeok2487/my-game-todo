import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/todo";

    if (code) {
        const supabase = createSupabaseServerClient(false);
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("세션 교환 에러:", error);
            return NextResponse.redirect(`${origin}/login?error=auth_failed`);
        }

        if (data.user) {
            if (!data.user.user_metadata.display_name) {
                return NextResponse.redirect(`${origin}/profile/setup`);
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    console.error("인증 코드가 없습니다.");
    return NextResponse.redirect(`${origin}/login?error=invalid_callback`);
}