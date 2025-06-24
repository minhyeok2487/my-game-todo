"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Category, Task } from "@/app/[locale]/(main)/todo/page";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: {
    gameId: string;
    category: Category;
    title: string;
  };
  onAddTask: (
    gameId: string,
    category: Category,
    task: Omit<Task, "id" | "category" | "completed">
  ) => void;
  taskToEdit?: Task | null;
  onUpdateTask: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "category" | "completed">>
  ) => void;
}

export const AddTaskModal = ({
  isOpen,
  onClose,
  modalData,
  onAddTask,
  taskToEdit,
  onUpdateTask,
}: AddTaskModalProps) => {
  const t = useTranslations("TodoPage.addTaskModal");

  const [text, setText] = useState("");
  const [dueDateType, setDueDateType] = useState<"absolute" | "relative">(
    "absolute"
  );
  const [absoluteDueDate, setAbsoluteDueDate] = useState("");
  const [duration, setDuration] = useState({ days: 7, hours: 0 });

  const isEditMode = !!taskToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && taskToEdit) {
        setText(taskToEdit.text);
        if (taskToEdit.due_date) {
          setDueDateType("absolute");
          const localDate = new Date(taskToEdit.due_date);
          const year = localDate.getFullYear();
          const month = String(localDate.getMonth() + 1).padStart(2, "0");
          const day = String(localDate.getDate()).padStart(2, "0");
          const hours = String(localDate.getHours()).padStart(2, "0");
          const minutes = String(localDate.getMinutes()).padStart(2, "0");
          setAbsoluteDueDate(`${year}-${month}-${day}T${hours}:${minutes}`);
        } else {
          setAbsoluteDueDate("");
        }
      } else {
        setText("");
        setDueDateType("absolute");
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 7);
        defaultDueDate.setHours(6, 0, 0, 0);

        const year = defaultDueDate.getFullYear();
        const month = String(defaultDueDate.getMonth() + 1).padStart(2, "0");
        const day = String(defaultDueDate.getDate()).padStart(2, "0");
        const hours = String(defaultDueDate.getHours()).padStart(2, "0");
        const minutes = String(defaultDueDate.getMinutes()).padStart(2, "0");
        setAbsoluteDueDate(`${year}-${month}-${day}T${hours}:${minutes}`);
        setDuration({ days: 7, hours: 0 });
      }
    }
  }, [isOpen, isEditMode, taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    let finalDueDate: string | null = null;

    // 👇 'misc' 카테고리도 마감일 처리에 포함되도록 조건 수정
    if (
      (modalData.category === "other" || modalData.category === "misc") &&
      (absoluteDueDate || duration.days > 0 || duration.hours > 0)
    ) {
      if (dueDateType === "absolute") {
        if (absoluteDueDate)
          finalDueDate = new Date(absoluteDueDate).toISOString();
      } else {
        const now = new Date();
        now.setDate(now.getDate() + Number(duration.days || 0));
        now.setHours(now.getHours() + Number(duration.hours || 0));
        finalDueDate = now.toISOString();
      }
    }

    if (isEditMode) {
      onUpdateTask(taskToEdit.id, { text, due_date: finalDueDate });
    } else {
      onAddTask(modalData.gameId, modalData.category, {
        text,
        due_date: finalDueDate,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-700 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">
          {isEditMode ? t("editTitle") : modalData.title}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="task-text" className="font-semibold text-gray-300">
              {t("label_taskText")}
            </label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="bg-gray-900 border border-gray-700 rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white"
            />
          </div>

          {/* 👇 'misc' 카테고리도 마감일 설정 UI가 보이도록 조건 수정 */}
          {(modalData.category === "other" ||
            modalData.category === "misc") && (
            <div className="flex flex-col gap-4 p-4 rounded-md bg-black/20 border border-gray-700">
              <div className="flex gap-2 bg-gray-800 p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => setDueDateType("absolute")}
                  className={`cursor-pointer flex-1 p-2 rounded text-sm font-semibold transition-colors ${
                    dueDateType === "absolute"
                      ? "bg-cyan-500 text-white"
                      : "bg-transparent text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {t("dueDateToggle_absolute")}
                </button>
                <button
                  type="button"
                  onClick={() => setDueDateType("relative")}
                  className={`cursor-pointer flex-1 p-2 rounded text-sm font-semibold transition-colors ${
                    dueDateType === "relative"
                      ? "bg-cyan-500 text-white"
                      : "bg-transparent text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {t("dueDateToggle_relative")}
                </button>
              </div>

              {dueDateType === "absolute" ? (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="due-date-abs"
                    className="font-semibold text-gray-300 text-sm"
                  >
                    {t("label_dueDate")}
                  </label>
                  <input
                    id="due-date-abs"
                    type="datetime-local"
                    value={absoluteDueDate}
                    onChange={(e) => setAbsoluteDueDate(e.target.value)}
                    className="cursor-pointer bg-gray-900 border border-gray-700 rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white [color-scheme:dark]"
                    required
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-300 text-sm">
                    {t("label_duration")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-center block mb-1 text-gray-400">
                        {t("unit_days")}
                      </span>
                      <input
                        type="number"
                        value={duration.days}
                        onChange={(e) =>
                          setDuration((d) => ({
                            ...d,
                            days: Number(e.target.value),
                          }))
                        }
                        className="bg-gray-900 border border-gray-700 rounded-md p-3 w-full outline-none text-white text-center focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-center block mb-1 text-gray-400">
                        {t("unit_hours")}
                      </span>
                      <input
                        type="number"
                        value={duration.hours}
                        onChange={(e) =>
                          setDuration((d) => ({
                            ...d,
                            hours: Number(e.target.value),
                          }))
                        }
                        className="bg-gray-900 border border-gray-700 rounded-md p-3 w-full outline-none text-white text-center focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 font-semibold text-white transition-colors"
            >
              {t("button_cancel")}
            </button>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors"
            >
              {isEditMode ? t("button_update") : t("button_add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
