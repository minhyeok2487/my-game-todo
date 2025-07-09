import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import TodoClientPage from "./TodoClientPage";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { pick } from "lodash";

export type Category = "daily" | "other" | "misc";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
  category: Category;
  is_recurring: boolean | null;
  recurrence_type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE' | null;
  recurrence_value: string | null;
  auto_reset_enabled: boolean | null;
  last_reset_date: string | null;
};

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
      `id, name, character_name, image_url, order, tasks ( id, text, completed, due_date, category, is_recurring, recurrence_type, recurrence_value, auto_reset_enabled, last_reset_date )`
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
