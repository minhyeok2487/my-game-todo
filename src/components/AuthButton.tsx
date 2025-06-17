import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthButton() {
  // 서버 컴포넌트는 데이터를 읽기만 하므로 readonly 모드로 클라이언트 생성
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-300 hidden sm:block">
        {user.email}
      </span>
      <form action={signOut}>
        <button className="px-3 py-1.5 text-sm font-semibold bg-gray-700 rounded-md hover:bg-gray-600">
          로그아웃
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="px-4 py-2 text-sm font-semibold bg-cyan-600 rounded-md hover:bg-cyan-700"
    >
      로그인
    </Link>
  );
}
