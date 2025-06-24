// components/todo/AddGameModal.tsx 전체 코드

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Category } from "@/app/[locale]/(main)/todo/page";

interface NewGameData {
  name: string;
  character_name: string;
  image_url: string;
}

// 👇 추천 숙제 타입을 추가
export interface RecommendedTask {
  text: string;
  category: Category;
}

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (
    gameData: NewGameData,
    recommendedTasks: RecommendedTask[]
  ) => void;
  initialData?: {
    name: string;
    imageUrl: string;
  } | null;
  recommendedTasks?: RecommendedTask[];
}

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
  initialData,
  recommendedTasks = [], // 기본값 빈 배열
}: AddGameModalProps) => {
  const t = useTranslations("TodoPage.addGameModal");

  const [name, setName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // 👇 선택된 추천 숙제를 관리하는 state
  const [selectedTasks, setSelectedTasks] = useState<Set<RecommendedTask>>(
    new Set()
  );

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setImageUrl(initialData?.imageUrl || "");
      setCharacterName("");
      // 모달이 열릴 때 선택된 숙제 목록 초기화
      setSelectedTasks(new Set());
    }
  }, [isOpen, initialData]);

  const handleTaskToggle = (task: RecommendedTask) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(task)) {
        newSet.delete(task);
      } else {
        newSet.add(task);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGame(
      { name, character_name: characterName, image_url: imageUrl },
      Array.from(selectedTasks) // Set을 배열로 변환하여 전달
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-700 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">
          {initialData ? t("title_edit") : t("title_new")}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 이름, 캐릭터명, 이미지URL 입력 필드는 동일 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="game-name" className="font-semibold text-gray-300">
              {t("label_gameName")}
            </label>
            <input
              id="game-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-900 ..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="char-name" className="font-semibold text-gray-300">
              {t("label_charName")}
            </label>
            <input
              id="char-name"
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="bg-gray-900 ..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image-url" className="font-semibold text-gray-300">
              {t("label_imageUrl")}
            </label>
            <input
              id="image-url"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-gray-900 ..."
            />
          </div>

          {/* 👇 추천 숙제 섹션 추가 */}
          {recommendedTasks.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="font-semibold text-gray-300">
                {t("recommended_tasks_title")}
              </h3>
              <div className="bg-black/20 p-4 rounded-md max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {recommendedTasks.map((task) => (
                    <label
                      key={task.text}
                      className="flex items-center gap-2 cursor-pointer text-white"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task)}
                        onChange={() => handleTaskToggle(task)}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600"
                      />
                      <span>{task.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-5 py-2 ..."
            >
              {t("button_cancel")}
            </button>
            <button type="submit" className="cursor-pointer px-5 py-2 ...">
              {t("button_confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
