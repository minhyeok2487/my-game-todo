"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";

// 함수가 FormData를 받도록 수정합니다.
export async function signOut(formData: FormData) {
    const supabase = createSupabaseServerClient(false);
    await supabase.auth.signOut();
    const locale = formData.get("locale") as string;
    return redirect({ href: "/login", locale: locale });
}