"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GameCard } from "@/components/todo/GameCard";
import { AddGameCard } from "@/components/todo/AddGameCard";
import { SelectGameModal } from "@/components/todo/SelectGameModal";
import { AddGameModal } from "@/components/todo/AddGameModal";
import { AddTaskModal } from "@/components/todo/AddTaskModal";
import { User } from "@supabase/supabase-js";

// --- 타입 정의 ---
export type Category = "daily" | "other" | "misc";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
  category: Category;
}

export interface Game {
  id: string;
  name: string;
  character_name: string;
  image_url: string;
  tasks: Task[];
}

// --- 메인 컴포넌트 ---
export default function TodoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);

  // 모달 상태 관리
  const [isSelectGameModalOpen, setSelectGameModalOpen] = useState(false);
  const [isAddGameModalOpen, setAddGameModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // 모달 간 데이터 전달을 위한 상태
  const [initialGameData, setInitialGameData] = useState<{
    name: string;
    imageUrl: string;
  } | null>(null);
  const [taskModalData, setTaskModalData] = useState<{
    gameId: string;
    category: Category;
    title: string;
  } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // 1. 페이지 접근 시 로그인 여부 확인
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
          `id, name, character_name, image_url, tasks ( id, text, completed, due_date, category )`
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("데이터 로딩 실패:", error);
      } else if (data) {
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

  // --- 모달 제어 핸들러 ---
  const handleOpenSelectGameModal = () => setSelectGameModalOpen(true);

  const handleSelectPredefinedGame = (game: {
    name: string;
    default_image_url: string;
  }) => {
    setInitialGameData({ name: game.name, imageUrl: game.default_image_url });
    setSelectGameModalOpen(false);
    setAddGameModalOpen(true);
  };

  const handleSelectCustomGame = () => {
    setInitialGameData(null);
    setSelectGameModalOpen(false);
    setAddGameModalOpen(true);
  };

  const handleOpenTaskModal = (
    gameId: string,
    category: Category,
    title: string
  ) => {
    setTaskModalData({ gameId, category, title });
    setTaskModalOpen(true);
  };

  // --- 데이터 CRUD 핸들러 ---
  const handleAddGame = async (newGameData: Omit<Game, "id" | "tasks">) => {
    if (!user) return;

    const { data: newGame, error } = await supabase
      .from("games")
      .insert({ ...newGameData, user_id: user.id })
      .select()
      .single();

    if (error) {
      alert("게임 추가 실패: " + error.message);
    } else if (newGame) {
      setGames([...games, { ...newGame, tasks: [] }]);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm("정말로 이 게임 카드를 삭제하시겠습니까?")) {
      const { error } = await supabase.from("games").delete().eq("id", gameId);
      if (error) alert("게임 삭제 실패: " + error.message);
      else setGames(games.filter((game) => game.id !== gameId));
    }
  };

  const handleAddTask = async (
    gameId: string,
    category: Category,
    taskData: Omit<Task, "id" | "category">
  ) => {
    if (!user) return;

    const { data: newTask, error } = await supabase
      .from("tasks")
      .insert({ ...taskData, game_id: gameId, user_id: user.id, category })
      .select()
      .single();

    if (error) alert("숙제 추가 실패: " + error.message);
    else if (newTask) fetchGames(user.id); // 데이터 정합성을 위해 전체 재조회
  };

  const handleToggleTask = async (taskId: string) => {
    const taskToToggle = games
      .flatMap((g) => g.tasks)
      .find((t) => t.id === taskId);
    if (!taskToToggle || !user) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !taskToToggle.completed })
      .eq("id", taskId);

    if (error) alert("상태 변경 실패: " + error.message);
    else fetchGames(user.id);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) alert("숙제 삭제 실패: " + error.message);
    else fetchGames(user.id);
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#111827] text-white">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
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
        <AddGameCard onOpenModal={handleOpenSelectGameModal} />
      </main>

      <SelectGameModal
        isOpen={isSelectGameModalOpen}
        onClose={() => setSelectGameModalOpen(false)}
        onSelectGame={handleSelectPredefinedGame}
        onSelectCustom={handleSelectCustomGame}
      />

      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setAddGameModalOpen(false)}
        onAddGame={handleAddGame}
        initialData={initialGameData}
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
