"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
    // 서버 액션은 쿠키를 수정해야 하므로 readonly를 false로 설정
    const supabase = createSupabaseServerClient(false);
    await supabase.auth.signOut();
    return redirect("/login");
}