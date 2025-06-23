import { Link } from "@/i18n/routing";
import { signOut } from "@/app/[locale]/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export default async function AuthButton() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headersList = await headers();
  const pathname = headersList.get("x-next-pathname") || "/";
  const locale = pathname.split("/")[1] || "en"; // 기본값으로 'en' 설정

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm hidden sm:block">{user.email}</span>
      <form action={signOut}>
        <input type="hidden" name="locale" value={locale} />
        <button className="cursor-pointer px-3 py-1.5 text-sm font-semibold bg-gray-700 dark:bg-gray-50 rounded-md hover:bg-gray-600 text-gray-100 dark:text-gray-900">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="cursor-pointer px-4 py-2 text-sm font-semibold bg-cyan-600 rounded-md hover:bg-cyan-700"
    >
      Login
    </Link>
  );
}
