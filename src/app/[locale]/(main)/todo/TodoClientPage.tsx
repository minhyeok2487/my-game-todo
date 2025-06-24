"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("TodoPage");
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

  const sortedTasks = useMemo(() => {
    return games
      .flatMap((game) =>
        game.tasks.map((task) => ({
          ...task,
          gameName: game.name,
          characterName: game.character_name,
          gameImageUrl: game.image_url,
        }))
      )
      .filter(
        (task) =>
          !task.completed && (task.category === "daily" || task.due_date)
      )
      .sort((a, b) => {
        const isADaily = a.category === "daily";
        const isBDaily = b.category === "daily";
        if (isADaily && !isBDaily) return -1;
        if (!isADaily && isBDaily) return 1;
        if (!isADaily && !isBDaily) {
          return (
            new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
          );
        }
        return 0;
      });
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

    const categoryText = t(`categories.${task.category}`);
    setTaskModalData({
      gameId: gameId,
      category: task.category,
      title: t("taskModal.editTitle", { category: categoryText }),
    });
    setTaskModalOpen(true);
  };

  const handleAddGame = async (newGameData: {
    name: string;
    character_name: string;
    image_url: string;
  }) => {
    const maxOrder =
      games.length > 0 ? Math.max(...games.map((game) => game.order)) : -1;
    const { error } = await supabase.from("games").insert({
      ...newGameData,
      user_id: user.id,
      order: maxOrder + 1,
    });
    if (error) {
      alert(t("alerts.addGameFailed") + " " + error.message);
    } else {
      await fetchGames();
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm(t("alerts.confirmDeleteGame"))) {
      const { error } = await supabase.from("games").delete().eq("id", gameId);
      if (error) {
        alert(t("alerts.deleteGameFailed") + " " + error.message);
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
      alert(t("alerts.addTaskFailed") + " " + error.message);
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
      alert(t("alerts.updateTaskFailed") + " " + error.message);
    } else {
      await fetchGames();
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const taskToToggle = games
      .flatMap((g) => g.tasks)
      .find((t) => t.id === taskId);
    if (!taskToToggle) return;

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
      alert(t("alerts.toggleTaskFailed") + " " + error.message);
      await fetchGames(); // 에러 발생 시 원래 상태로 복구
    } else {
      await fetchGames();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      alert(t("alerts.deleteTaskFailed") + " " + error.message);
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
      alert(t("alerts.saveOrderFailed") + " " + firstError.error.message);
    } else {
      alert(t("alerts.saveOrderSuccess"));
      setIsReorderMode(false);
    }
  };

  const handleCancelReorder = () => {
    setIsReorderMode(false);
    fetchGames();
  };

  return (
    <div className="container max-w-screen-2xl mx-auto relative">
      {isReorderMode && (
        <button
          onClick={handleSaveOrder}
          className="fixed top-24 right-5 z-40 bg-cyan-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-cyan-600 flex items-center gap-2 font-bold transition-transform hover:scale-105"
          aria-label={t("reorder.save_aria")}
        >
          <Save size={18} />
          <span>{t("reorder.save")}</span>
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
            {t("viewToggle.gameView")}
          </button>
          <button
            onClick={() => setViewMode("sorted")}
            className={`cursor-pointer px-4 py-1.5 text-sm font-semibold rounded-full ${
              viewMode === "sorted"
                ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                : "text-gray-500"
            }`}
          >
            {t("viewToggle.sortedView")}
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
