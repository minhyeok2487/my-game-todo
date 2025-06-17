"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인에 실패했습니다: " + error.message);
    } else {
      router.push("/todo");
      router.refresh();
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      <section className="w-full max-w-md space-y-8 bg-surface p-8 rounded-2xl shadow-xl border border-border">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-text-primary">로그인</h1>
          <p className="mt-2 text-sm text-text-secondary">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              가입하기
            </Link>
          </p>
        </header>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-sm bg-background border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-sm bg-background border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover transition-colors"
          >
            로그인
          </button>
        </form>
      </section>
    </main>
  );
}
