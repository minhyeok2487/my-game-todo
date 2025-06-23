"use client";

import Image from "next/image";
import { Gamepad2, CheckSquare, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

// 부모 컴포넌트로부터 받을 데이터의 타입을 정의합니다.
type FeatureItem = {
  title: string;
  description: string;
};

type FeaturesProps = {
  title: string;
  subtitle: string;
  items: FeatureItem[];
};

// 아이콘, 이미지 등 언어에 따라 변하지 않는 '자산(Asset)'은 컴포넌트 내부에 둡니다.
const featureAssets = [
  { icon: Gamepad2, imageSrc: "/features/feature-games.png" },
  { icon: CheckSquare, imageSrc: "/features/feature-tasks.png" },
  { icon: CalendarDays, imageSrc: "/features/feature-auto.png" },
];

export const Features = ({ title, subtitle, items }: FeaturesProps) => {
  return (
    <section className="py-20 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {/* prop으로 받은 제목과 부제목을 사용합니다. */}
          <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>
          <p className="mt-4 text-lg text-foreground/70">{subtitle}</p>
        </div>

        <div className="space-y-24">
          {/* prop으로 받은 items 배열을 매핑하여 렌더링합니다. */}
          {items.map((feature, index) => {
            const Icon = featureAssets[index].icon;
            const imageSrc = featureAssets[index].imageSrc;
            const isImageLeft = index % 2 === 0;

            return (
              <motion.div
                key={feature.title}
                className="relative grid md:grid-cols-2 items-center gap-8 md:gap-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div
                  className={`absolute -z-10 w-full h-full opacity-20 blur-3xl 
                  ${isImageLeft ? "left-0" : "right-0"}`}
                >
                  <div
                    className={`w-full h-full rounded-full ${
                      isImageLeft ? "bg-cyan-400" : "bg-blue-500"
                    }`}
                  ></div>
                </div>

                <div
                  className={`text-center md:text-left ${
                    isImageLeft ? "md:order-last" : ""
                  }`}
                >
                  <div className="inline-flex items-center gap-3 mb-4 bg-primary/10 text-primary py-1 px-3 rounded-full">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{feature.title}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-foreground/80">
                    {feature.description}
                  </p>
                </div>

                <div className="relative w-full aspect-video rounded-xl shadow-2xl shadow-black/30">
                  <Image
                    src={imageSrc}
                    alt={`${feature.title} 대표 이미지`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
