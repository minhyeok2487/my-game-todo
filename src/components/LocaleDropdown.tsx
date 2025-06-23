"use client";

// ⭐️ 1. react에서 useTransition을 import 합니다.
import React, { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleDropdown() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // ⭐️ 2. useTransition 훅을 사용합니다.
  // isPending: 전환 작업이 진행 중인지 여부 (true/false)
  // startTransition: 상태 변경 함수를 감싸는 함수
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    // ⭐️ 3. router.push를 startTransition으로 감싸줍니다.
    startTransition(() => {
      router.push(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      className="bg-gray-800 text-white p-2 rounded-md border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="zh">中文</option>
    </select>
  );
}
