import { Plus } from "lucide-react";

interface AddGameCardProps {
  onOpenModal: () => void;
}

export const AddGameCard = ({ onOpenModal }: AddGameCardProps) => {
  return (
    <button
      onClick={onOpenModal}
      className="border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400 transition-colors min-h-[400px]"
    >
      <Plus size={48} />
      <span className="mt-2 font-semibold">새 게임 추가</span>
    </button>
  );
};
