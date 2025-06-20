"use client";

import { useState, useCallback } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import type { User } from "@supabase/supabase-js";
import type { Game, Task, Category } from "./page";
import { createClient } from "@/lib/supabase/client";
import { GameCard } from "@/components/todo/GameCard";
import { AddGameCard } from "@/components/todo/AddGameCard";
import { SelectGameModal } from "@/components/todo/SelectGameModal";
import { AddGameModal } from "@/components/todo/AddGameModal";
import { AddTaskModal } from "@/components/todo/AddTaskModal";
import { FloatingMenu } from "@/components/todo/FloatingMenu";
import { Save } from "lucide-react";

interface TodoClientPageProps {
  serverGames: Game[];
  user: User;
}

export default function TodoClientPage({
  serverGames,
  user,
}: TodoClientPageProps) {
  const [games, setGames] = useState<Game[]>(serverGames);
  const [isSelectGameModalOpen, setSelectGameModalOpen] = useState(false);
  const [isAddGameModalOpen, setAddGameModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [initialGameData, setInitialGameData] = useState<{
    name: string;
    imageUrl: string;
  } | null>(null);
  const [taskModalData, setTaskModalData] = useState<{
    gameId: string;
    category: Category;
    title: string;
  } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const supabase = createClient();

  const fetchGames = useCallback(async () => {
    const { data, error } = await supabase
      .from("games")
      .select(
        `id, name, character_name, image_url, order, tasks ( id, text, completed, due_date, category )`
      )
      .eq("user_id", user.id)
      .order("order", { ascending: true });

    if (error) {
      console.error("데이터 재조회 실패:", error.message);
    } else if (data) {
      setGames(data as Game[]);
    }
  }, [supabase, user.id]);

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
    setEditingTask(null);
    setTaskModalData({ gameId, category, title });
    setTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    const gameId = games.find((g) => g.tasks.some((t) => t.id === task.id))?.id;
    if (!gameId) return;

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

  const handleAddGame = async (
    newGameData: Omit<Game, "id" | "tasks" | "created_at" | "order">
  ) => {
    const maxOrder = games.reduce(
      (max, game) => Math.max(max, game.order || 0),
      0
    );
    const { error } = await supabase
      .from("games")
      .insert({ ...newGameData, user_id: user.id, order: maxOrder + 1 });

    if (error) {
      alert("게임 추가 실패: " + error.message);
    } else {
      await fetchGames();
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

  const handleAddTask = async (
    gameId: string,
    category: Category,
    taskData: Omit<Task, "id" | "category" | "completed">
  ) => {
    const { error } = await supabase.from("tasks").insert({
      ...taskData,
      completed: false,
      game_id: gameId,
      user_id: user.id,
      category,
    });
    if (error) {
      alert("숙제 추가 실패: " + error.message);
    } else {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setGames((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = async () => {
    const updates = games.map((game, index) =>
      supabase.from("games").update({ order: index }).eq("id", game.id)
    );
    const results = await Promise.all(updates);
    const firstError = results.find((result) => result.error);

    if (firstError && firstError.error) {
      alert("순서 저장에 실패했습니다: " + firstError.error.message);
    } else {
      alert("순서가 저장되었습니다.");
      setIsReorderMode(false);
    }
  };

  const handleCancelReorder = () => {
    setIsReorderMode(false);
    fetchGames(); // 순서 변경 전 상태로 되돌리기 위해 데이터를 다시 불러옵니다.
  };

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-6 relative">
      {isReorderMode && (
        <div className="fixed top-18 left-0 right-0 bg-cyan-800/80 backdrop-blur-sm p-1 flex justify-center items-center gap-4 z-40">
          <p className="text-white font-semibold">카드의 순서를 변경하세요</p>
          <button
            onClick={handleSaveOrder}
            className="cursor-pointer bg-cyan-500 text-white px-5 py-1 rounded-lg shadow-lg hover:bg-cyan-600 flex items-center gap-2 font-bold"
          >
            <Save size={18} />
            순서 저장
          </button>
        </div>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={games.map((g) => g.id)}
          strategy={rectSortingStrategy}
        >
          <main className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDeleteGame={handleDeleteGame}
                onOpenTaskModal={handleOpenTaskModal}
                onEditTask={handleOpenEditModal}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                isReorderMode={isReorderMode}
              />
            ))}
            {!isReorderMode && (
              <AddGameCard onOpenModal={handleOpenSelectGameModal} />
            )}
          </main>
        </SortableContext>
      </DndContext>

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

      <FloatingMenu
        isReorderMode={isReorderMode}
        onToggleReorderMode={() => setIsReorderMode((prev) => !prev)}
        onCancelReorder={handleCancelReorder}
        onSaveOrder={handleSaveOrder}
      />
    </div>
  );
}
