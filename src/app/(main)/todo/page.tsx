import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TodoClientPage from "./TodoClientPage";

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

  if (!user.user_metadata.display_name) {
    redirect("/profile/setup");
  }

  const { data: games, error } = await supabase
    .from("games")
    .select(
      `id, name, character_name, image_url, tasks ( id, text, completed, due_date, category )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("데이터 로딩 실패:", error.message);
  }

  return <TodoClientPage serverGames={games || []} user={user} />;
}
