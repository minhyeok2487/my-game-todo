"use client";

import type { Game, Category, Task } from "@/app/(main)/todo/page";
import { Plus, X, Check, Calendar, Pencil } from "lucide-react"; // ⭐️ 1. Pencil 아이콘 임포트

// ⭐️ 2. GameCardProps 인터페이스에 onEditTask 추가
interface GameCardProps {
  game: Game;
  onDeleteGame: (gameId: string) => void;
  onOpenTaskModal: (gameId: string, category: Category, title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

// ⭐️ 3. TaskItem 컴포넌트에 onEdit prop 추가
const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) => {
  // D-day 계산 함수 (변경 없음)
  const getDday = (dueDate: string | null) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (task.completed) return null;

    if (diffDays < 0)
      return (
        <span className="text-xs text-red-500 font-semibold">
          D+{Math.abs(diffDays)}
        </span>
      );
    if (diffDays === 0)
      return (
        <span className="text-xs text-yellow-400 font-semibold">D-Day</span>
      );
    return `D-${diffDays}`;
  };

  return (
    <li className="flex items-center justify-between py-1.5 group">
      <div
        className="flex items-center gap-2 flex-grow cursor-pointer"
        onClick={onToggle}
      >
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${
            task.completed
              ? "bg-cyan-500 border-cyan-500"
              : "bg-gray-800 border-gray-600 group-hover:border-cyan-500"
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </div>
        <span
          className={`flex-grow ${
            task.completed ? "line-through text-gray-500" : "text-gray-200"
          }`}
        >
          {task.text}
        </span>
      </div>

      {task.due_date && !task.completed && (
        <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto pl-2">
          <Calendar size={12} />
          {getDday(task.due_date)}
        </span>
      )}

      {/* ⭐️ 4. 수정 및 삭제 버튼 그룹 */}
      <div className="flex items-center ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="cursor-pointer text-gray-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label={`${task.text} 숙제 수정`}
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="cursor-pointer text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label={`${task.text} 숙제 삭제`}
        >
          <X size={16} />
        </button>
      </div>
    </li>
  );
};

// 메인 게임 카드 컴포넌트
export const GameCard = ({
  game,
  onDeleteGame,
  onOpenTaskModal,
  onToggleTask,
  onDeleteTask,
  onEditTask, // ⭐️ 5. onEditTask prop 받기
}: GameCardProps) => {
  const categories: { key: Category; title: string }[] = [
    { key: "daily", title: "일일 숙제" },
    { key: "other", title: "기간 숙제" },
    { key: "misc", title: "기타" },
  ];

  return (
    <div className="bg-[#1F2937] rounded-lg border border-[#374151] flex flex-col shadow-lg min-h-[400px]">
      <div
        className="h-36 bg-cover bg-center rounded-t-lg relative"
        style={{
          backgroundImage: `url(${game.image_url || ""})`,
          backgroundColor: "#374151",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <button
          onClick={() => onDeleteGame(game.id)}
          className="cursor-pointer absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-10"
          aria-label="게임 카드 삭제"
        >
          <X size={18} />
        </button>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-2xl font-bold text-white shadow-black/50 [text-shadow:_0_1px_3px_var(--tw-shadow-color)]">
            {game.name}
          </h3>
          <p className="text-gray-300 font-medium [text-shadow:_0_1px_2px_var(--tw-shadow-color)]">
            {game.character_name}
          </p>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        {categories.map(({ key, title }) => (
          <div key={key} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-cyan-400">{title}</h4>
            </div>
            <ul className="space-y-1">
              {game.tasks
                .filter((task) => task.category === key)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onToggleTask(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    onEdit={() => onEditTask(task)} // ⭐️ 6. onEdit 핸들러 연결
                  />
                ))}
            </ul>
            <button
              onClick={() => onOpenTaskModal(game.id, key, `새 ${title}`)}
              className="cursor-pointer mt-2 flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors w-full"
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
