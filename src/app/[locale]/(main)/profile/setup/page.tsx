"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { UserCircle2, LoaderCircle, Save } from "lucide-react";

export default function ProfileSetupPage() {
  const t = useTranslations("ProfileSetupPage");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: nickname },
      });

      if (error) {
        alert(t("alerts.setupError", { error: error.message }));
        setIsLoading(false);
      } else {
        alert(t("alerts.setupSuccess"));
        router.push("/todo");
        router.refresh();
      }
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <section className="w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
          </header>
          <form onSubmit={handleProfileSetup} className="space-y-5">
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder={t("nicknamePlaceholder")}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !nickname}
              className="cursor-pointer w-full flex items-center justify-center py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {t("submitButton")}
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
