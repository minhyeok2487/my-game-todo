"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing"; // 👈 next-intl의 Link로 변경

// 부모로부터 받을 데이터 타입을 정의합니다.
interface HeroTranslations {
  title_line1: string;
  title_line2_span: string;
  title_line2_rest: string;
  subtitle_line1: string;
  subtitle_line2: string;
  subtitle_line3_strong: string;
  subtitle_line3_rest: string;
  button: string;
  alt_text: string;
}

interface HeroSectionProps {
  imageUrls: string[];
  translations: HeroTranslations;
}

export const HeroSection = ({ imageUrls, translations }: HeroSectionProps) => {
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
            alt={translations.alt_text} // 👈 번역된 alt 텍스트 사용
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
          {translations.title_line1}
          <br />
          <span className="text-cyan-400">{translations.title_line2_span}</span>
          {translations.title_line2_rest}
        </h2>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-1xl mx-auto">
          {translations.subtitle_line1}
          <br />
          {translations.subtitle_line2}
          <br />
          <strong className="text-cyan-400">
            {translations.subtitle_line3_strong}
          </strong>
          {translations.subtitle_line3_rest}
        </p>
        <Link
          href="/todo"
          className="mt-8 inline-block bg-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105"
        >
          {translations.button}
        </Link>
      </div>
    </section>
  );
};
