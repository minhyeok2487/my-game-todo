"use client";

import { useState, useEffect } from "react";

// 타입 정의 (변경 없음)
export type Category = "daily" | "other" | "misc";
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
  category: Category;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: { gameId: string; category: Category; title: string };
  onAddTask: (
    gameId: string,
    category: Category,
    task: Omit<Task, "id" | "category" | "completed">
  ) => void;
}

export const AddTaskModal = ({
  isOpen,
  onClose,
  modalData,
  onAddTask,
}: AddTaskModalProps) => {
  const [text, setText] = useState("");
  const [dueDateType, setDueDateType] = useState<"absolute" | "relative">(
    "absolute"
  );
  const [absoluteDueDate, setAbsoluteDueDate] = useState("");

  // ⭐️ 1. 'minutes' 상태 제거
  const [duration, setDuration] = useState({ days: 7, hours: 0 });

  useEffect(() => {
    if (isOpen) {
      setText("");
      setDueDateType("absolute");
      const defaultAbsoluteDate = new Date();
      defaultAbsoluteDate.setDate(defaultAbsoluteDate.getDate() + 7);
      defaultAbsoluteDate.setHours(6, 0, 0, 0);
      const year = defaultAbsoluteDate.getFullYear();
      const month = String(defaultAbsoluteDate.getMonth() + 1).padStart(2, "0");
      const day = String(defaultAbsoluteDate.getDate()).padStart(2, "0");
      const hours = String(defaultAbsoluteDate.getHours()).padStart(2, "0");
      const minutes = String(defaultAbsoluteDate.getMinutes()).padStart(2, "0");
      setAbsoluteDueDate(`${year}-${month}-${day}T${hours}:${minutes}`);

      setDuration({ days: 7, hours: 0 });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    let finalDueDate: string | null = null;
    if (modalData.category === "other") {
      if (dueDateType === "absolute") {
        finalDueDate = new Date(absoluteDueDate).toISOString();
      } else {
        const now = new Date();
        now.setDate(now.getDate() + Number(duration.days || 0));
        now.setHours(now.getHours() + Number(duration.hours || 0));

        finalDueDate = now.toISOString();
      }
    }
    onAddTask(modalData.gameId, modalData.category, {
      text,
      due_date: finalDueDate,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1F2937] p-8 rounded-lg w-full max-w-md border border-[#374151]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">
          {modalData.title}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="task-text" className="font-semibold text-gray-300">
              숙제 내용
            </label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="bg-[#111827] border border-[#374151] rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white"
            />
          </div>

          {modalData.category === "other" && (
            <div className="flex flex-col gap-4 p-4 rounded-md bg-black/20 border border-gray-700">
              <div className="flex gap-2 bg-gray-800 p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => setDueDateType("absolute")}
                  className={`flex-1 p-2 rounded text-sm font-semibold transition-colors ${
                    dueDateType === "absolute"
                      ? "bg-cyan-500 text-white"
                      : "bg-transparent text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  날짜/시간 지정
                </button>
                <button
                  type="button"
                  onClick={() => setDueDateType("relative")}
                  className={`flex-1 p-2 rounded text-sm font-semibold transition-colors ${
                    dueDateType === "relative"
                      ? "bg-cyan-500 text-white"
                      : "bg-transparent text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  기간으로 설정
                </button>
              </div>

              {dueDateType === "absolute" ? (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="due-date-abs"
                    className="font-semibold text-gray-300 text-sm"
                  >
                    마감일
                  </label>
                  <input
                    id="due-date-abs"
                    type="datetime-local"
                    value={absoluteDueDate}
                    onChange={(e) => setAbsoluteDueDate(e.target.value)}
                    className="bg-[#111827] border border-[#374151] rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white [color-scheme:dark]"
                    required
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-300 text-sm">
                    마감까지 남은 시간
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-center block mb-1 text-gray-400">
                        일
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
                        className="bg-[#111827] border border-[#374151] rounded-md p-3 w-full outline-none text-white text-center focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-center block mb-1 text-gray-400">
                        시간
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
                        className="bg-[#111827] border border-[#374151] rounded-md p-3 w-full outline-none text-white text-center focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              className="cursor-pointer px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 font-semibold text-white"
            >
              취소
            </button>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
