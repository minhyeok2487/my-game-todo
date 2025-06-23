"use client";

import { useState, useCallback, useMemo } from "react";
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
import { SortedTaskCard } from "@/components/todo/SortedTaskCard";
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
  const [viewMode, setViewMode] = useState<"game" | "sorted">("game");
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

  // 마감일 순으로 정렬된 숙제 목록 데이터 가공
  const sortedTasks = useMemo(() => {
    return (
      games
        .flatMap((game) =>
          game.tasks.map((task) => ({
            ...task,
            gameName: game.name,
            characterName: game.character_name,
            gameImageUrl: game.image_url,
          }))
        )
        // 1. 필터링 조건 수정: 미완료이면서, (일일 숙제 이거나 || 마감일이 있는 숙제)
        .filter(
          (task) =>
            !task.completed && (task.category === "daily" || task.due_date)
        )
        // 2. 정렬 로직 수정
        .sort((a, b) => {
          // --- 1순위: '일일 숙제'를 최상단으로 ---
          const isADaily = a.category === "daily";
          const isBDaily = b.category === "daily";

          if (isADaily && !isBDaily) return -1; // a(일일)가 b(일일 아님)보다 먼저
          if (!isADaily && isBDaily) return 1; // b(일일)가 a(일일 아님)보다 먼저

          // --- 2순위: 둘 다 '일일 숙제'가 아닐 경우, 마감일 순으로 정렬 ---
          // (필터링 조건에 의해 둘 다 due_date가 있는 것이 보장됨)
          if (!isADaily && !isBDaily) {
            return (
              new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
            );
          }

          // --- 둘 다 '일일 숙제'일 경우, 순서 변경 없음 ---
          return 0;
        })
    );
  }, [games]);

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

  const handleAddGame = async (newGameData: {
    name: string;
    character_name: string;
    image_url: string;
  }) => {
    // ⭐️ order 계산 로직은 그대로 사용합니다.
    const maxOrder =
      games.length > 0 ? Math.max(...games.map((game) => game.order)) : -1;

    const { error } = await supabase.from("games").insert({
      ...newGameData,
      user_id: user.id,
      order: maxOrder + 1,
    });

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

    // '마감순 보기'에서는 체크하면 바로 UI에서 숨기기 (Optimistic Update)
    if (viewMode === "sorted") {
      setGames((currentGames) =>
        currentGames.map((game) => ({
          ...game,
          tasks: game.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: true } : task
          ),
        }))
      );
    }

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
    <div className="container max-w-screen-2xl mx-auto relative">
      {isReorderMode && (
        <button
          onClick={handleSaveOrder}
          className="fixed top-25 right-18 z-40 cursor-pointer bg-cyan-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-cyan-600 flex items-center gap-2 font-bold transition-transform hover:scale-105"
          aria-label="순서 저장"
        >
          <Save size={18} />
          <span>순서 저장</span>
        </button>
      )}

      <div className="mb-6 flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-full flex items-center">
          <button
            onClick={() => setViewMode("game")}
            className={`cursor-pointer px-4 py-1.5 text-sm font-semibold rounded-full ${
              viewMode === "game"
                ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                : "text-gray-500"
            }`}
          >
            게임별 보기
          </button>
          <button
            onClick={() => setViewMode("sorted")}
            className={`cursor-pointer px-4 py-1.5 text-sm font-semibold rounded-full ${
              viewMode === "sorted"
                ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                : "text-gray-500"
            }`}
          >
            마감순 보기
          </button>
        </div>
      </div>

      {viewMode === "game" ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
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
      ) : (
        // --- 새로운 마감순 보기 ---
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedTasks.map((task) => (
            <SortedTaskCard
              key={task.id}
              task={task}
              onToggle={() => handleToggleTask(task.id)}
            />
          ))}
        </main>
      )}

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
