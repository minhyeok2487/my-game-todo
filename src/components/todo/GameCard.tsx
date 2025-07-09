"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";
import type { Game, Task, Category } from "@/app/[locale]/(main)/todo/page";
import {
  Plus,
  X,
  Check,
  Calendar,
  Pencil,
  GripVertical,
  Clock,
} from "lucide-react";
import { formatRemainingTime } from "@/lib/utils/times";

type ScopedTFunction = (
  key: string,
  values?: Record<string, string | number>
) => string;

interface GameCardProps {
  game: Game;
  onDeleteGame: (gameId: string) => void;
  onOpenTaskModal: (gameId: string, category: Category, title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  isReorderMode: boolean;
}

const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  t,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  t: ScopedTFunction;
}) => {
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
          {t("dDay_overdue_prefix")}
          {Math.abs(diffDays)}
        </span>
      );
    if (diffDays === 0)
      return (
        <span className="text-xs text-yellow-400 font-semibold">
          {t("dDay_today")}
        </span>
      );
    return `${t("dDay_prefix")}${diffDays}`;
  };

  const remainingTime = formatRemainingTime(task.due_date, {
    dueText: t("due"),
    days: t("timeUnits.days"),
    hours: t("timeUnits.hours"),
    minutes: t("timeUnits.minutes"),
  });

  return (
    <li className="flex items-center justify-between py-1.5 group">
      <div
        className="flex items-center gap-2 flex-grow cursor-pointer min-w-0"
        onClick={onToggle}
      >
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${
            task.completed
              ? "bg-cyan-500 border-cyan-500"
              : "bg-gray-800/80 dark:bg-gray-800 border-gray-600 group-hover:border-cyan-500"
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </div>
        <div className="flex flex-col flex-grow min-w-0">
          <span
            className={`truncate ${
              task.completed ? "line-through text-gray-500" : "text-gray-200"
            }`}
          >
            {task.text}
          </span>
          {/* 👇 'misc' 카테고리도 남은 시간(remainingTime)이 표시되도록 조건 수정 */}
          {(task.category === "other" || task.category === "misc") &&
            task.due_date &&
            !task.completed && (
              <span
                className={`text-xs flex items-center gap-1 mt-0.5 ${
                  remainingTime === t("due") ? "text-red-500" : "text-cyan-400"
                }`}
              >
                <Clock size={12} />
                {remainingTime}
              </span>
            )}
        </div>
      </div>
      {/* 👇 'daily' 카테고리일 때만 D-day가 표시되도록 조건 수정 */}
      {task.category === "daily" && task.due_date && !task.completed && (
        <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto pl-2">
          <Calendar size={12} />
          {getDday(task.due_date)}
        </span>
      )}
      <div className="flex items-center ml-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="cursor-pointer text-gray-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label={t("editTask_aria", { taskText: task.text })}
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="cursor-pointer text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          aria-label={t("deleteTask_aria", { taskText: task.text })}
        >
          <X size={16} />
        </button>
      </div>
    </li>
  );
};

export const GameCard = ({
  game,
  onDeleteGame,
  onOpenTaskModal,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  isReorderMode,
}: GameCardProps) => {
  const t = useTranslations("TodoPage.gameCard");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id, disabled: !isReorderMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const categories = [
    { key: "daily" as Category, title: t("categories.daily") },
    { key: "other" as Category, title: t("categories.other") },
    { key: "misc" as Category, title: t("categories.misc") },
  ];

  const tForItem: ScopedTFunction = (key, values) =>
    t(`taskItem.${key}`, values);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col shadow-lg min-h-[400px] relative touch-none"
    >
      {isReorderMode && (
        <div
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-full text-white cursor-grab active:cursor-grabbing z-20"
          aria-label={t("reorder_aria")}
        >
          <GripVertical size={20} />
        </div>
      )}
      <div
        className="h-36 bg-cover bg-center rounded-t-lg relative"
        style={{
          backgroundImage: `url(${game.image_url || ""})`,
          backgroundColor: "#374151",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        {!isReorderMode && (
          <button
            onClick={() => onDeleteGame(game.id)}
            className="cursor-pointer absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-10"
            aria-label={t("deleteCard_aria")}
          >
            <X size={18} />
          </button>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white shadow-black/50 [text-shadow:_0_1px_3px_var(--tw-shadow-color)]">
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
              {!isReorderMode && (
                <button
                  onClick={() =>
                    onOpenTaskModal(
                      game.id,
                      key,
                      t("addTask_modalTitle", { categoryTitle: title })
                    )
                  }
                  className="cursor-pointer text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 p-1 rounded-full transition-colors"
                  aria-label={t("addTask_aria", { categoryTitle: title })}
                >
                  <Plus size={20} />
                </button>
              )}
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
                    onEdit={() => onEditTask(task)}
                    t={tForItem}
                  />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
