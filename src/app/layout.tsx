import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
    <html lang="ko">
      <body className={`${inter.className} bg-background text-foreground`}>
        <header className="w-full p-4 border-b border-gray-700 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-cyan-500">
            My Game TODO
          </Link>
          <AuthButton />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
