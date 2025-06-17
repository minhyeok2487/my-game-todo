export const Header = () => {
  return (
    <header className="py-4 px-4 md:px-6 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cyan-400">My Game TODO</h1>
        <a
          href="/todo"
          className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
        >
          앱 시작하기
        </a>
      </div>
    </header>
  );
};
