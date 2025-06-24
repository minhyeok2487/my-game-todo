"use client";

import type { Task } from "@/app/[locale]/(main)/todo/page";
import { formatRemainingTime } from "@/lib/utils/times";
import { Check, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface SortedTaskCardProps {
  task: Task & {
    gameName: string;
    characterName: string;
    gameImageUrl: string;
  };
  onToggle: () => void;
}

export const SortedTaskCard = ({ task, onToggle }: SortedTaskCardProps) => {
  const t = useTranslations("TodoPage.gameCard.taskItem");

  const remainingTime = formatRemainingTime(task.due_date, {
    dueText: t("due"),
    days: t("timeUnits.days"),
    hours: t("timeUnits.hours"),
    minutes: t("timeUnits.minutes"),
  });

  return (
    <button
      onClick={onToggle}
      className={`
        p-4 rounded-lg border w-full text-left transition-all duration-200
        group relative overflow-hidden bg-cover bg-center
        ${
          task.completed
            ? "border-gray-700/30"
            : "border-gray-700 hover:border-cyan-500/50 dark:hover:border-cyan-400"
        }
      `}
      style={{
        backgroundImage: `url(${task.gameImageUrl || ""})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />

      {task.completed && (
        <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
          <Check className="text-cyan-400" size={48} />
        </div>
      )}

      <div className="cursor-pointer relative z-10 flex flex-col h-full">
        <div className="text-xs text-gray-300 mb-2 truncate">
          {task.gameName} &gt; {task.characterName}
        </div>

        <p className="font-bold text-white mb-3 truncate flex-grow">
          {task.text}
        </p>

        {task.category === "other" && (
          <div
            className={`
            text-sm flex items-center gap-1.5 mt-auto
            ${remainingTime === t("due") ? "text-red-500" : "text-cyan-400"}
          `}
          >
            <Clock size={14} />
            <span>{remainingTime}</span>
          </div>
        )}
      </div>
    </button>
  );
};
