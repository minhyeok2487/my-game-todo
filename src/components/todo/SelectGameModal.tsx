"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { X, PlusSquare } from "lucide-react";

interface PredefinedGame {
  id: number;
  name: string;
  default_image_url: string;
}

interface SelectGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: { name: string; default_image_url: string }) => void;
  onSelectCustom: () => void;
}

export const SelectGameModal = ({
  isOpen,
  onClose,
  onSelectGame,
  onSelectCustom,
}: SelectGameModalProps) => {
  const [predefinedGames, setPredefinedGames] = useState<PredefinedGame[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchPredefinedGames = async () => {
        const { data, error } = await supabase
          .from("predefined_games")
          .select("id, name, default_image_url")
          .order("id");
        if (data) setPredefinedGames(data);
        if (error) console.error("사전 정의된 게임 로딩 실패:", error);
      };
      fetchPredefinedGames();
    }
  }, [isOpen, supabase]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1F2937] rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col border border-[#374151]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-700 shrink-0">
          <h2 className="text-lg font-bold text-white">게임 선택</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-white"
          >
            <X />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {predefinedGames.map((game) => (
              <button
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="cursor-pointer h-40 group relative rounded-lg overflow-hidden border-2 border-transparent hover:border-cyan-500 focus:border-cyan-500 transition-all outline-none"
              >
                <Image
                  src={game.default_image_url}
                  alt={game.name}
                  fill
                  sizes="50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-2 left-2 text-white font-bold text-sm">
                  {game.name}
                </span>
              </button>
            ))}
            <button
              onClick={onSelectCustom}
              className="cursor-pointer h-40 flex flex-col items-center justify-center bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
            >
              <PlusSquare size={40} />
              <span className="mt-2 text-sm font-semibold">
                기타 (직접 입력)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
