import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 서버 컴포넌트, 서버 액션, 라우트 핸들러 등 서버 환경에서 사용할 클라이언트 생성 함수
export const createSupabaseServerClient = (readonly: boolean = true) => {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async get(name: string) {
                    return (await cookieStore).get(name)?.value;
                },
                async set(name: string, value: string, options: CookieOptions) {
                    if (readonly) return;
                    await (await cookieStore).set({ name, value, ...options });
                },
                async remove(name: string, options: CookieOptions) {
                    if (readonly) return;
                    await (await cookieStore).set({ name, value: "", ...options });
                },
            },
        }
    );
};