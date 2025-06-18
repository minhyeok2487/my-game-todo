// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/ThemeProvider";
import { ThemeToggleButton } from "@/components/themes/ThemeToggleButton";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Game TODO",
  description: "모든 게임의 숙제를 한 곳에서 관리하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground transition-colors`}
      >
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
              <ThemeToggleButton />
              <AuthButton />
            </div>
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
