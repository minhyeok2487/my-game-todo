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
  title: "My Game TODO | 로스트아크, 원신, 메이플스토리 숙제 관리 및 TODO",
  description:
    "로스트아크, 원신, 메이플스토리 등 다양한 게임의 일일/주간 숙제를 더 이상 놓치지 마세요. My Game TODO가 당신의 게임 라이프를 쉽고 효율적으로 관리해 드립니다.",
  keywords: [
    "게임",
    "TODO",
    "숙제",
    "로스트아크",
    "원신",
    "메이플스토리",
    "일일 숙제",
    "주간 숙제",
    "할일 관리",
  ],
  authors: [{ name: "Minhyeok" }],
  openGraph: {
    title: "My Game TODO | 게임 숙제 관리 도우미",
    description: "모든 게임의 숙제를 한 곳에서 관리하세요.",
    url: "https://my-game-todo.com",
    siteName: "My Game TODO",
    images: [
      {
        url: "https://my-game-todo.com/app-preview.jpg",
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
    title: "My Game TODO | 게임 숙제 관리 도우미",
    description:
      "로스트아크, 원신, 메이플스토리 등 다양한 게임의 일일/주간 숙제를 놓치지 마세요. My Game TODO가 당신의 게임 라이프를 쉽고 효율적으로 관리해 드립니다.",
    images: ["https://my-game-todo.com/app-preview.jpg"], // 절대 경로로 변경 권장
  },
  verification: {
    google: "1BgdgLxDBsy4HGU_9iKVa4zmjGAPuBodvfY9t3EHOBI",
  },
  icons: {
    icon: "/favicon.ico", // public 폴더 기준
    shortcut: "/favicon-16x16.png",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });

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
