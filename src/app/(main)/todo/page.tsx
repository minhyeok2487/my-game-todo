import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TodoClientPage from "./TodoClientPage";

// ⭐️ 모든 페이지에서 공통으로 사용할 타입 정의
export type Category = "daily" | "other" | "misc";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
  category: Category;
}

export interface Game {
  id: string;
  name: string;
  character_name: string;
  image_url: string;
  tasks: Task[];
}

export default async function TodoPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 사용자 프로필 설정이 완료되었는지 확인하는 로직 (선택적)
  if (!user.user_metadata.display_name) {
    redirect("/profile/setup");
  }

  // 게임 및 관련 태스크 데이터 로드
  const { data: games, error } = await supabase
    .from("games")
    .select(
      `id, name, character_name, image_url, tasks ( id, text, completed, due_date, category )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("데이터 로딩 실패:", error.message);
    // 여기서 에러 페이지를 보여주거나 빈 배열을 넘길 수 있습니다.
  }

  return <TodoClientPage serverGames={games || []} user={user} />;
}
