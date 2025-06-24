"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface NewGameData {
  name: string;
  character_name: string;
  image_url: string;
}

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (gameData: NewGameData) => void;
  initialData?: {
    name: string;
    imageUrl: string;
  } | null;
}

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
  initialData,
}: AddGameModalProps) => {
  const t = useTranslations("TodoPage.addGameModal");

  const [name, setName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setImageUrl(initialData?.imageUrl || "");
      setCharacterName("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGame({
      name,
      character_name: characterName,
      image_url: imageUrl,
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
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-700 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">
          {initialData ? t("title_edit") : t("title_new")}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="bg-gray-900 border border-gray-700 rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white"
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
              className="bg-gray-900 border border-gray-700 rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white"
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
              className="bg-gray-900 border border-gray-700 rounded-md p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none text-white"
            />
          </div>
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
              {t("button_confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
