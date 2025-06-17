import { Game, Category, Task } from "@/app/(main)/todo/page";
import { Plus, X } from "lucide-react";

// 컴포넌트가 받을 props 정의
interface GameCardProps {
  game: Game;
  onDeleteGame: (gameId: string) => void;
  onOpenTaskModal: (gameId: string, category: Category, title: string) => void;
  onToggleTask: (gameId: string, category: Category, taskId: string) => void;
  onDeleteTask: (gameId: string, category: Category, taskId: string) => void;
}

// 할 일 아이템을 위한 컴포넌트
const TaskItem = ({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) => (
  <li className="flex items-center gap-2 py-1.5">
    <input
      type="checkbox"
      checked={task.completed}
      onChange={onToggle}
      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600"
    />
    <span
      className={`flex-grow ${
        task.completed ? "line-through text-gray-500" : "text-gray-200"
      }`}
    >
      {task.text}
    </span>
    <button onClick={onDelete} className="text-gray-500 hover:text-red-500">
      <X size={16} />
    </button>
  </li>
);

// 메인 게임 카드 컴포넌트
export const GameCard = ({
  game,
  onDeleteGame,
  onOpenTaskModal,
  onToggleTask,
  onDeleteTask,
}: GameCardProps) => {
  const categories: { key: Category; title: string }[] = [
    { key: "daily", title: "일일 숙제" },
    { key: "other", title: "주간 숙제" },
    { key: "misc", title: "기타" },
  ];

  return (
    <div className="bg-[#1F2937] rounded-lg border border-[#374151] flex flex-col shadow-lg">
      <div
        className="h-36 bg-cover bg-center rounded-t-lg relative"
        style={{
          backgroundImage: `url(${game.imageUrl || ""})`,
          backgroundColor: "#374151",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <button
          onClick={() => onDeleteGame(game.id)}
          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-2xl font-bold text-white shadow-black/50 [text-shadow:_0_1px_3px_var(--tw-shadow-color)]">
            {game.name}
          </h3>
          <p className="text-gray-300 font-medium [text-shadow:_0_1px_2px_var(--tw-shadow-color)]">
            {game.characterName}
          </p>
        </div>
      </div>

      <div className="p-4 flex-grow">
        {categories.map(({ key, title }) => (
          <div key={key} className="mb-4">
            <h4 className="font-bold text-cyan-400 mb-2">{title}</h4>
            <ul className="space-y-1">
              {game.tasks[key].map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(game.id, key, task.id)}
                  onDelete={() => onDeleteTask(game.id, key, task.id)}
                />
              ))}
            </ul>
            <button
              onClick={() => onOpenTaskModal(game.id, key, `새 ${title}`)}
              className="mt-2 flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors w-full"
            >
              <Plus size={16} />
              <span>숙제 추가</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
