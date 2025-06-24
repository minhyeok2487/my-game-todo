import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import TodoClientPage from "./TodoClientPage";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { pick } from "lodash";

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
  order: number;
}

export default async function TodoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: locale });
  } else if (!user.user_metadata.display_name) {
    redirect({ href: "/profile/setup", locale: locale });
  }

  const { data: games, error } = await supabase
    .from("games")
    .select(
      `id, name, character_name, image_url, order, tasks ( id, text, completed, due_date, category )`
    )
    .eq("user_id", user!.id)
    .order("order", { ascending: true });

  if (error) {
    console.error(error.message);
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, "TodoPage")}>
      <TodoClientPage serverGames={games || []} user={user!} />
    </NextIntlClientProvider>
  );
}
