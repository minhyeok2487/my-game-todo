"use client";

import { useState } from "react";
import { Settings, X, ListOrdered } from "lucide-react";

interface FloatingMenuProps {
  isReorderMode: boolean;
  onToggleReorderMode: () => void;
  onSaveOrder: () => void;
  onCancelReorder: () => void;
}

export const FloatingMenu = ({
  isReorderMode,
  onToggleReorderMode,
  onCancelReorder,
}: FloatingMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메인 버튼 클릭 핸들러
  const handleToggleMenu = () => {
    if (isReorderMode) {
      onCancelReorder();
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };

  // 메뉴의 '순서 변경' 버튼 클릭 핸들러
  const handleReorderClick = () => {
    onToggleReorderMode();
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-30">
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={handleReorderClick}
          className="cursor-pointer bg-white text-gray-700 w-max px-4 py-2 rounded-full shadow-lg hover:bg-gray-200 flex items-center gap-3"
        >
          <span className="font-semibold text-sm">순서 변경</span>
          <ListOrdered size={20} />
        </button>
      </div>

      {/* 메인 설정 버튼 */}
      <button
        onClick={handleToggleMenu}
        className="cursor-pointer bg-gray-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600 transition-transform duration-300"
        aria-label="설정 메뉴"
        style={{
          transform: isMenuOpen || isReorderMode ? "rotate(45deg)" : "none",
        }}
      >
        <div className="transition-opacity duration-300">
          {isMenuOpen || isReorderMode ? (
            <X size={24} />
          ) : (
            <Settings size={24} />
          )}
        </div>
      </button>
    </div>
  );
};
