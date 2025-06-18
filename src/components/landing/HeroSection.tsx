"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  imageUrls: string[];
}

export const HeroSection = ({ imageUrls }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  return (
    <section className="relative text-center py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {imageUrls.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt="게임 배경 이미지"
            fill
            sizes="100vw"
            className={`
              object-cover transition-opacity duration-1000 ease-in-out
              ${currentIndex === index ? "opacity-30" : "opacity-0"}
            `}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
          모든 게임 숙제를
          <br />
          <span className="text-cyan-400">한 곳에서</span> 깔끔하게.
        </h2>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          명조, 붕괴: 스타레일, 니케, 로스트아크, 던전앤파이터, 원신,
          메이플스토리...
          <br />
          여러 게임의 일일/주간 숙제를 더 이상 헷갈리지 마세요.
          <br />
          <strong className="text-cyan-400">My Game TODO</strong>로 당신의 게임
          숙제를 관리해보세요.
        </p>
        <Link
          href="/todo"
          className="mt-8 inline-block bg-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105"
        >
          지금 바로 시작하기
        </Link>
      </div>
    </section>
  );
};
