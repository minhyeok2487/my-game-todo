"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, LogIn, LoaderCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (error.message === "Email not confirmed") {
        const shouldResend = window.confirm(
          "이메일 인증이 필요합니다. 인증 메일을 다시 보내드릴까요?"
        );
        if (shouldResend) {
          await supabase.auth.resend({ type: "signup", email: email });
          alert("인증 메일을 다시 보냈습니다. 받은 편지함을 확인해주세요.");
        }
      } else {
        alert("로그인 중 알 수 없는 오류가 발생했습니다.");
        console.error("로그인 에러:", error);
      }
      setIsLoading(false);
    } else if (data.user) {
      if (rememberEmail) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (!data.user.user_metadata.display_name) {
        router.push("/profile/setup");
      } else {
        router.push("/todo");
      }
      router.refresh();
    }
  };

  const handleSignInWithProvider = async (
    provider: "google" | "github" | "kakao"
  ) => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            다시 오신 것을 환영해요!
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium dark:text-blue-400"
            >
              새로 만들기
            </Link>
          </p>
        </header>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일 주소"
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호"
              className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* ⭐️ 이 부분이 수정되었습니다. */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="remember-email"
              className="flex items-center cursor-pointer"
            >
              {/* 실제 체크박스는 숨김 처리 */}
              <input
                id="remember-email"
                type="checkbox"
                className="sr-only"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
              />
              {/* 커스텀 토글 스위치 UI */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  rememberEmail ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    rememberEmail ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </div>
              <span className="ml-3 text-sm text-gray-900 dark:text-gray-300">
                이메일 기억하기
              </span>
            </label>

            {/* ⭐️ "비밀번호를 잊으셨나요?" 링크 주석 처리 */}
            {/* <div className="text-sm">
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                비밀번호를 잊으셨나요?
              </a>
            </div> 
            */}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                로그인
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
              또는
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSignInWithProvider("google")}
            className="w-full flex items-center justify-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <Image
              src="/google-logo.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Google 계정으로 로그인
          </button>
        </div>
      </div>
    </main>
  );
}
