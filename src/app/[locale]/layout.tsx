import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/themes/ThemeProvider";
import { ThemeToggleButton } from "@/components/themes/ThemeToggleButton";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LocaleDropdown from "@/components/LocaleDropdown";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Game TODO",
  description: "모든 게임의 숙제를 한 곳에서 관리하세요.",
  keywords: ["게임", "TODO", "할일관리"],
  authors: [{ name: "Minhyeok" }],
  openGraph: {
    title: "My Game TODO",
    description: "모든 게임의 숙제를 한 곳에서 관리하세요.",
    url: "https://my-game-todo.com",
    siteName: "My Game TODO",
    images: [
      {
        url: "/app-preview.jpg",
        width: 1200,
        height: 630,
        alt: "My Game TODO 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Game TODO",
    description: "모든 게임의 숙제를 한 곳에서 관리하세요.",
    images: ["/app-preview.jpg"],
  },
  verification: {
    google: "BgdgLxDBsy4HGU_9iKVa4zmjGAPuBodvfY9t3EHOBI",
  },
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const { children } = props;
  const params = await props.params;
  const { locale } = params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground transition-colors`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
          >
            <header className="sticky top-0 z-50 w-full p-4 border-border bg-background/95 backdrop-blur-sm flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-cyan-400">
                My Game TODO
              </Link>
              <div className="flex items-center gap-2">
                <LocaleDropdown />
                <ThemeToggleButton />
                <AuthButton />
              </div>
            </header>
            <main>{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
