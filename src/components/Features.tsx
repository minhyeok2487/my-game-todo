import { Gamepad2, CheckSquare, CalendarDays } from "lucide-react";

const featureList = [
  {
    icon: <Gamepad2 className="w-10 h-10 text-cyan-400" />,
    title: "다양한 게임 지원",
    description: "여러 게임을 등록하고, 캐릭터별로 숙제를 관리할 수 있습니다.",
  },
  {
    icon: <CheckSquare className="w-10 h-10 text-cyan-400" />,
    title: "커스텀 숙제 관리",
    description:
      "일일, 주간, 기타 숙제를 자유롭게 추가하고 체크하며 진행 상황을 추적하세요.",
  },
  {
    icon: <CalendarDays className="w-10 h-10 text-cyan-400" />,
    title: "자동 초기화 및 D-Day",
    description:
      "일일 숙제는 매일 자동으로 초기화되고, 주간 숙제는 마감일을 알려줍니다.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {featureList.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
