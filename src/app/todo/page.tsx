"use client";

import { useState, useEffect } from "react";
import { GameCard } from "@/components/todo/GameCard";
import { AddGameCard } from "@/components/todo/AddGameCard";
import { AddGameModal } from "@/components/todo/AddGameModal";
import { AddTaskModal } from "@/components/todo/AddTaskModal";

// --- 타입 정의 ---
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

// 'daily', 'other', 'misc'만 카테고리로 사용하도록 타입을 명확히 지정
export type Category = "daily" | "other" | "misc";

export interface Game {
  id: string;
  name: string;
  characterName: string;
  imageUrl: string;
  tasks: {
    daily: Task[];
    other: Task[];
    misc: Task[];
  };
}

export default function TodoPage() {
  // --- 상태 관리 ---
  const [games, setGames] = useState<Game[]>([]);
  const [isGameModalOpen, setGameModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalData, setTaskModalData] = useState<{
    gameId: string;
    category: Category;
    title: string;
  } | null>(null);

  // --- 데이터 로딩 & 저장 ---
  useEffect(() => {
    const savedGames = localStorage.getItem("myGameTodo");
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }
  }, []);

  useEffect(() => {
    // games 배열이 초기화된 후부터 localStorage에 저장
    if (games.length > 0 || localStorage.getItem("myGameTodo")) {
      localStorage.setItem("myGameTodo", JSON.stringify(games));
    }
  }, [games]);

  // --- 핸들러 함수들 ---
  const handleAddGame = (newGameData: Omit<Game, "id" | "tasks">) => {
    const newGame: Game = {
      ...newGameData,
      id: "game-" + Date.now(),
      tasks: { daily: [], other: [], misc: [] },
    };
    setGames([...games, newGame]);
  };

  const handleDeleteGame = (gameId: string) => {
    if (confirm("정말로 이 게임 카드를 삭제하시겠습니까?")) {
      setGames(games.filter((game) => game.id !== gameId));
    }
  };

  const handleOpenTaskModal = (
    gameId: string,
    category: Category,
    title: string
  ) => {
    setTaskModalData({ gameId, category, title });
    setTaskModalOpen(true);
  };

  const handleAddTask = (
    gameId: string,
    category: Category,
    task: Omit<Task, "id">
  ) => {
    const newTask: Task = { ...task, id: "task-" + Date.now() };
    setGames(
      games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            tasks: {
              ...game.tasks,
              [category]: [...game.tasks[category], newTask],
            },
          };
        }
        return game;
      })
    );
  };

  const handleToggleTask = (
    gameId: string,
    category: Category,
    taskId: string
  ) => {
    setGames(
      games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            tasks: {
              ...game.tasks,
              [category]: game.tasks[category].map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            },
          };
        }
        return game;
      })
    );
  };

  const handleDeleteTask = (
    gameId: string,
    category: Category,
    taskId: string
  ) => {
    setGames(
      games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            tasks: {
              ...game.tasks,
              [category]: game.tasks[category].filter(
                (task) => task.id !== taskId
              ),
            },
          };
        }
        return game;
      })
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          My Game TODO
        </h1>
        <p className="text-gray-400 mt-2">오늘의 숙제를 관리하세요.</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDeleteGame={handleDeleteGame}
            onOpenTaskModal={handleOpenTaskModal}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
        <AddGameCard onOpenModal={() => setGameModalOpen(true)} />
      </main>

      <AddGameModal
        isOpen={isGameModalOpen}
        onClose={() => setGameModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {taskModalData && (
        <AddTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          modalData={taskModalData}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
