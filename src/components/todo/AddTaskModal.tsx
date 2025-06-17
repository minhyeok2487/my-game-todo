"use client";

import { useState, useEffect } from "react";
import { Task, Category } from "@/app/(main)/todo/page";

// 컴포넌트가 받을 props의 타입을 정의합니다.
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 어떤 게임의 어떤 카테고리에 추가할지 정보를 받습니다.
  modalData: {
    gameId: string;
    category: Category;
    title: string;
  };
  // 부모 컴포넌트(TodoPage)에 새로운 할 일 데이터를 전달하는 함수입니다.
  onAddTask: (
    gameId: string,
    category: Category,
    task: Omit<Task, "id">
  ) => void;
}

export const AddTaskModal = ({
  isOpen,
  onClose,
  modalData,
  onAddTask,
}: AddTaskModalProps) => {
  // 모달 내부에서 사용될 입력값 상태
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  // 모달이 열릴 때마다 카테고리에 맞춰 상태를 초기화합니다.
  useEffect(() => {
    if (isOpen) {
      // 텍스트는 항상 비움
      setText("");
      // '주간 숙제(other)' 카테고리일 때만 날짜를 설정
      if (modalData.category === "other") {
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 7);
        setDueDate(defaultDueDate.toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
    }
  }, [isOpen, modalData]); // isOpen이나 modalData가 바뀔 때마다 실행

  // 폼 제출 시 실행될 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return; // 내용이 없으면 추가하지 않음

    onAddTask(modalData.gameId, modalData.category, {
      text,
      completed: false,
      dueDate: modalData.category === "other" ? dueDate : null,
    });

    onClose(); // 모달 닫기
  };

  // isOpen이 false이면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div
        className="bg-[#1F2937] p-8 rounded-lg w-full max-w-md border border-[#374151]"
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시에는 닫히지 않도록
      >
        <h2 className="text-2xl font-bold mb-6">{modalData.title}</h2>

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
              className="bg-[#111827] border border-[#374151] rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none"
              required
            />
          </div>

          {/* '주간 숙제'일 때만 날짜 입력 필드를 보여줌 */}
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
                className="bg-[#111827] border border-[#374151] rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
