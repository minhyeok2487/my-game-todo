"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Gamepad2 } from "lucide-react";

export default function SignUpPage() {
  // ... (useState, handleSignUp 로직은 이전과 동일)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("회원가입 에러: " + error.message);
    } else {
      alert("회원가입 성공! 이메일을 확인하여 계정을 활성화해주세요.");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Gamepad2 className="mx-auto h-12 w-12 text-cyan-400" />
          <h1 className="text-4xl font-bold text-white mt-4">My Game TODO</h1>
          <p className="text-gray-400 mt-2">몇 단계만으로 계정을 생성하세요.</p>
        </div>

        {/* --- Glassmorphism UI 카드 --- */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* 이메일, 비밀번호 input은 로그인 폼과 동일한 스타일 적용 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 mt-1 text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                비밀번호 (6자 이상)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 mt-1 text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-300"
            >
              계정 생성하기
            </button>
          </form>
          <p className="text-sm text-center text-gray-400 mt-6">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-medium text-cyan-400 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
