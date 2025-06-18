"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  UserPlus,
  XCircle,
  CheckCircle,
} from "lucide-react";

type PasswordChecks = {
  length: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
};

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState<PasswordChecks>({
    length: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const allChecksPassed = Object.values(passwordChecks).every(Boolean);
    if (!allChecksPassed) {
      alert("비밀번호가 모든 조건을 만족하지 않습니다.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("회원가입 중 오류가 발생했습니다: " + error.message);
      setIsLoading(false);
    } else {
      alert("회원가입 확인 메일이 발송되었습니다. 이메일을 확인해주세요.");
      router.push("/login");
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <section className="w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold">새로운 계정 만들기</h1>
            <p className="mt-2 text-sm text-gray-600">
              My Game TODO와 함께 게임 라이프를 관리하세요.
            </p>
          </header>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="이메일 주소"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                placeholder="비밀번호"
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {isPasswordFocused && (
              <ul className="space-y-1 text-xs px-1">
                <li
                  className={`flex items-center ${
                    passwordChecks.length ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordChecks.length ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  8자 이상
                </li>
                <li
                  className={`flex items-center ${
                    passwordChecks.lowercase ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordChecks.lowercase ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  영문 소문자 포함
                </li>
                <li
                  className={`flex items-center ${
                    passwordChecks.number ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordChecks.number ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  숫자 포함
                </li>
                <li
                  className={`flex items-center ${
                    passwordChecks.specialChar
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordChecks.specialChar ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  특수문자 (!@#$%^&*) 포함
                </li>
              </ul>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="비밀번호 확인"
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full flex items-center justify-center py-2.5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  이메일로 가입하기
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              로그인
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
