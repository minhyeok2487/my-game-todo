import { Game } from "@/app/(main)/todo/page";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Omit<Game, "id" | "tasks">) => void;
}

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}: AddGameModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">새 게임 추가</h2>
        {/* 폼 내용은 여기에 추가됩니다. */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={() =>
              onAddGame({ name: "", characterName: "", imageUrl: "" })
            }
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};
