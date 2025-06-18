"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react"; // Laptop 아이콘 추가

export const ThemeToggleButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="테마 변경"
    >
      {/* 현재 테마에 따라 다른 아이콘을 보여줍니다. */}
      {theme === "light" && <Sun size={20} />}
      {theme === "dark" && <Moon size={20} />}
      {theme === "system" && <Laptop size={20} />}
    </button>
  );
};
