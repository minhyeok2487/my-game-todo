"use client";

import { useState, useEffect } from "react";
// page.tsx에서 타입을 직접 가져오는 대신, 여기서 직접 정의하여 의존성을 줄입니다.
export type Category = "daily" | "other" | "misc";
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null; // DB 컬럼명과 일치
  category: Category;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: {
    gameId: string;
    category: Category;
    title: string;
  };
  // 전달하는 데이터 타입을 명확히 합니다.
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
  // 내부 상태는 camelCase를 사용
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      setText("");
      if (modalData.category === "other") {
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 7);
        setDueDate(defaultDueDate.toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
    }
  }, [isOpen, modalData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // ⭐️ onAddTask에 전달하는 객체의 키를 'due_date'로 수정합니다.
    onAddTask(modalData.gameId, modalData.category, {
      text,
      due_date: modalData.category === "other" ? dueDate : null,
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
              placeholder="예: 카오스 던전 2회"
              className="bg-[#111827] border border-[#374151] rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white"
              required
            />
          </div>

          {modalData.category === "other" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="due-date" className="font-semibold text-gray-300">
                마감일
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#111827] border border-[#374151] rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white [color-scheme:dark]"
                required
              />
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
