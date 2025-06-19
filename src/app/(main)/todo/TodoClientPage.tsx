"use client";

import { useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import type { Game, Task, Category } from "./page"; // page.tsx에서 타입 임포트
import { createClient } from "@/lib/supabase/client";

import { GameCard } from "@/components/todo/GameCard";
import { AddGameCard } from "@/components/todo/AddGameCard";
import { SelectGameModal } from "@/components/todo/SelectGameModal";
import { AddGameModal } from "@/components/todo/AddGameModal";
import { AddTaskModal } from "@/components/todo/AddTaskModal";

interface TodoClientPageProps {
  serverGames: Game[];
  user: User;
}

export default function TodoClientPage({
  serverGames,
  user,
}: TodoClientPageProps) {
  const [games, setGames] = useState<Game[]>(serverGames);

  // 모달 상태 관리
  const [isSelectGameModalOpen, setSelectGameModalOpen] = useState(false);
  const [isAddGameModalOpen, setAddGameModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // 모달에 전달할 데이터 상태 관리
  const [initialGameData, setInitialGameData] = useState<{
    name: string;
    imageUrl: string;
  } | null>(null);
  const [taskModalData, setTaskModalData] = useState<{
    gameId: string;
    category: Category;
    title: string;
  } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // 수정할 Task 관리 상태

  const supabase = createClient();

  // 데이터를 다시 불러오는 함수
  const fetchGames = useCallback(async () => {
    const { data, error } = await supabase
      .from("games")
      .select(
        `id, name, character_name, image_url, tasks ( id, text, completed, due_date, category )`
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("데이터 재조회 실패:", error.message);
    } else if (data) {
      setGames(data as Game[]);
    }
  }, [supabase, user.id]);

  // 게임 추가 모달 열기 관련 핸들러
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

  // 숙제 추가/수정 모달 열기 관련 핸들러
  const handleOpenTaskModal = (
    gameId: string,
    category: Category,
    title: string
  ) => {
    setEditingTask(null); // '추가' 모드이므로 수정 상태는 null
    setTaskModalData({ gameId, category, title });
    setTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task); // 수정할 task를 상태에 저장
    const gameId = games.find((g) => g.tasks.some((t) => t.id === task.id))?.id;
    if (!gameId) return; // 혹시 모를 에러 방지

    setTaskModalData({
      gameId: gameId,
      category: task.category,
      title: `${
        task.category === "daily"
          ? "일일"
          : task.category === "other"
          ? "기간"
          : "기타"
      } 숙제 수정`,
    });
    setTaskModalOpen(true);
  };

  // 데이터 CUD (생성, 업데이트, 삭제) 핸들러
  const handleAddGame = async (
    newGameData: Omit<Game, "id" | "tasks" | "created_at">
  ) => {
    const { data: newGame, error } = await supabase
      .from("games")
      .insert({ ...newGameData, user_id: user.id })
      .select()
      .single();

    if (error) alert("게임 추가 실패: " + error.message);
    else if (newGame) setGames([...games, { ...newGame, tasks: [] }]);
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
    taskData: Omit<Task, "id" | "category" | "completed">
  ) => {
    const { data: newTask, error } = await supabase
      .from("tasks")
      .insert({
        ...taskData,
        completed: false,
        game_id: gameId,
        user_id: user.id,
        category,
      })
      .select()
      .single();

    if (error) {
      alert("숙제 추가 실패: " + error.message);
    } else if (newTask) {
      await fetchGames();
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "category">>
  ) => {
    const { error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId);
    if (error) {
      alert("숙제 업데이트 실패: " + error.message);
    } else {
      await fetchGames();
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const taskToToggle = games
      .flatMap((g) => g.tasks)
      .find((t) => t.id === taskId);
    if (!taskToToggle) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !taskToToggle.completed })
      .eq("id", taskId);

    if (error) {
      alert("상태 변경 실패: " + error.message);
    } else {
      await fetchGames();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      alert("숙제 삭제 실패: " + error.message);
    } else {
      await fetchGames();
    }
  };

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-6">
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDeleteGame={handleDeleteGame}
            onOpenTaskModal={handleOpenTaskModal}
            onEditTask={handleOpenEditModal}
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
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(null);
          }}
          modalData={taskModalData}
          onAddTask={handleAddTask}
          taskToEdit={editingTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}
