import Image from "next/image";

export const CTA = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">이제 스크린샷은 그만!</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          직관적인 TODO 리스트로 어떤 숙제를 완료했는지 한눈에 파악하고, 게임에
          더 집중하세요.
        </p>
        <div className="relative max-w-4xl mx-auto border-2 border-gray-700 rounded-lg shadow-2xl">
          <Image
            src="/app-preview.jpg"
            alt="앱 미리보기"
            width={1200}
            height={800}
            className="rounded-md"
          />
        </div>
      </div>
    </section>
  );
};
