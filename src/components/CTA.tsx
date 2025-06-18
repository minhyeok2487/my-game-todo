import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 md:py-8 overflow-hidden bg-background">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10">
            <div className="w-full aspect-square bg-[radial-gradient(circle_at_center,_rgba(0,194,203,0.2),_transparent_50%)]"></div>
          </div>
          <div className="relative w-full aspect-[16/10] border-2 border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10">
            <Image
              src="/app-preview.jpg"
              alt="앱 미리보기"
              fill
              className="object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">
                당신의 모든 게임 기록
              </h3>
              <p className="mt-2 text-lg md:text-xl text-gray-200 [text-shadow:_0_1px_2px_rgba(0,0,0,0.5)]">
                한눈에 보고, 놓치지 마세요.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center mt-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text md:whitespace-nowrap">
            모든 게임의 숙제, 한 곳에서 깔끔하게.
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            직관적인 TODO 리스트로 어떤 숙제를 완료했는지 한눈에 파악하고,
            게임에 더 집중하세요.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-cyan-500 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-cyan-600"
          >
            <span className="relative flex items-center gap-2">
              무료로 시작하기{" "}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,194,203,0.15),_transparent_40%)]"></div>
      </div>
    </section>
  );
};
