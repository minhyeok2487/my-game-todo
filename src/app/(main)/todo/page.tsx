"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GameCard } from "@/components/todo/GameCard";
import { AddGameCard } from "@/components/todo/AddGameCard";
import { AddGameModal } from "@/components/todo/AddGameModal";
import { AddTaskModal } from "@/components/todo/AddTaskModal";
import { User } from "@supabase/supabase-js";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
  category: Category;
}

export type Category = "daily" | "other" | "misc";

export interface Game {
  id: string;
  name: string;
  character_name: string;
  image_url: string;
  tasks: Task[];
}

export default function TodoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [isGameModalOpen, setGameModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalData, setTaskModalData] = useState<{
    gameId: string;
    category: Category;
    title: string;
  } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // 페이지 접근 시 로그인 여부 확인
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  // 2. 로그인된 사용자의 데이터 불러오기
  const fetchGames = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select(
          `
        id,
        name,
        character_name,
        image_url,
        tasks ( id, text, completed, due_date, category )
      `
        )
        .eq("user_id", userId);

      if (error) {
        console.error("데이터 로딩 실패:", error);
      } else {
        setGames(data as Game[]);
      }
      setIsLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    if (user) {
      fetchGames(user.id);
    }
  }, [user, fetchGames]);

  const handleAddGame = async (newGameData: Omit<Game, "id" | "tasks">) => {
    if (!user) return;

    const { data: newGame, error } = await supabase
      .from("games")
      .insert({ ...newGameData, user_id: user.id })
      .select()
      .single();

    if (error) {
      alert("게임 추가 실패: " + error.message);
    } else {
      setGames([...games, { ...newGame, tasks: [] }]);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm("정말로 이 게임 카드를 삭제하시겠습니까?")) {
      const { error } = await supabase.from("games").delete().eq("id", gameId);
      if (error) {
        alert("게임 삭제 실패: " + error.message);
      } else {
        setGames(games.filter((game) => game.id !== gameId));
      }
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

  const handleAddTask = async (
    gameId: string,
    category: Category,
    taskData: Omit<Task, "id" | "category">
  ) => {
    if (!user) return;
    const taskPayload = {
      ...taskData,
      game_id: gameId,
      user_id: user.id,
      category,
    };

    const { data: newTask, error } = await supabase
      .from("tasks")
      .insert(taskPayload)
      .select()
      .single();

    if (error) {
      alert("숙제 추가 실패: " + error.message);
    } else {
      setGames(
        games.map((g) =>
          g.id === gameId ? { ...g, tasks: [...g.tasks, newTask] } : g
        )
      );
    }
  };

  const handleToggleTask = async (
    gameId: string,
    category: Category,
    taskId: string
  ) => {
    const taskToToggle = games
      .flatMap((g) => g.tasks)
      .find((t) => t.id === taskId);
    if (!taskToToggle) return;

    const { data: updatedTask, error } = await supabase
      .from("tasks")
      .update({ completed: !taskToToggle.completed })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      alert("상태 변경 실패: " + error.message);
    } else {
      setGames(
        games.map((g) => ({
          ...g,
          tasks: g.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        }))
      );
    }
  };

  const handleDeleteTask = async (
    gameId: string,
    category: Category,
    taskId: string
  ) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      alert("숙제 삭제 실패: " + error.message);
    } else {
      setGames(
        games.map((g) => ({
          ...g,
          tasks: g.tasks.filter((t) => t.id !== taskId),
        }))
      );
    }
  };

  // 로딩 중이거나 사용자가 아직 확인되지 않았을 때 로딩 화면 표시
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold">My Game TODO</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {user.user_metadata.display_name || "사용자"}님의 숙제를 관리하세요.
        </p>
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
