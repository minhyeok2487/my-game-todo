"use client"; // ⭐️ 1. 클라이언트 컴포넌트로 지정

import Image from "next/image";
import { Gamepad2, CheckSquare, CalendarDays, LucideIcon } from "lucide-react";
import { motion } from "framer-motion"; // ⭐️ 2. framer-motion import

// 데이터 구조는 변경 없음
const featureList: {
  icon: LucideIcon;
  title: string;
  description: string;
  imageSrc: string;
}[] = [
  {
    icon: Gamepad2,
    title: "다양한 게임 지원",
    description: "여러 게임을 등록하고, 캐릭터별로 숙제를 관리할 수 있습니다.",
    imageSrc: "/features/feature-games.png",
  },
  {
    icon: CheckSquare,
    title: "커스텀 숙제 관리",
    description:
      "일일, 주간, 기타 숙제를 자유롭게 추가하고 체크하며 진행 상황을 추적하세요.",
    imageSrc: "/features/feature-tasks.png",
  },
  {
    icon: CalendarDays,
    title: "자동 초기화 및 D-Day",
    description:
      "일일 숙제는 매일 자동으로 초기화되고, 주간 숙제는 마감일을 알려줍니다.",
    imageSrc: "/features/feature-auto.png",
  },
];

export const Features = () => {
  return (
    <section className="py-20 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">주요 기능</h2>
          <p className="mt-4 text-lg text-foreground/70">
            My Game TODO가 제공하는 강력한 기능들을 만나보세요.
          </p>
        </div>

        <div className="space-y-24">
          {featureList.map((feature, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              // ⭐️ 3. div를 motion.div로 변경하고 애니메이션 속성 추가
              <motion.div
                key={feature.title}
                className="relative grid md:grid-cols-2 items-center gap-8 md:gap-16"
                initial={{ opacity: 0, y: 50 }} // 초기 상태: 투명하고 50px 아래에 위치
                whileInView={{ opacity: 1, y: 0 }} // 화면에 보일 때의 상태: 불투명하고 제자리로 이동
                transition={{ duration: 0.6, delay: 0.2 }} // 0.6초 동안 0.2초 딜레이 후 애니메이션
                viewport={{ once: true }} // 애니메이션이 한번만 실행되도록 설정
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
                    <feature.icon className="w-5 h-5" />
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
                    src={feature.imageSrc}
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
