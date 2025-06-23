import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthButton() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm hidden sm:block">{user.email}</span>
      <form action={signOut}>
        <button className="cursor-pointer px-3 py-1.5 text-sm font-semibold bg-gray-700 dark:bg-gray-50 rounded-md hover:bg-gray-600 text-gray-100 dark:text-gray-900">
          로그아웃
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="cursor-pointer px-4 py-2 text-sm font-semibold bg-cyan-600 rounded-md hover:bg-cyan-700"
    >
      로그인
    </Link>
  );
}
