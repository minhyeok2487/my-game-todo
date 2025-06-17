export const Hero = () => {
  return (
    <section className="text-center py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          모든 게임 숙제를
          <br />
          <span className="text-cyan-400">한 곳에서</span> 깔끔하게.
        </h2>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          로스트아크, 원신, 메이플스토리... 여러 게임의 일일/주간 숙제를 더 이상
          놓치지 마세요. My Game TODO가 당신의 게임 라이프를 관리해 드립니다.
        </p>
        <a
          href="/todo"
          className="mt-8 inline-block bg-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105"
        >
          지금 바로 시작하기
        </a>
      </div>
    </section>
  );
};
