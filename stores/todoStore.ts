import { TodoState } from "@/constants/types";
import { postTask } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { PersistStorage, persist } from "zustand/middleware";

type StorageValue<T> = { state: T };

const customStorage: PersistStorage<TodoState> = {
  getItem: async (name: string): Promise<StorageValue<TodoState> | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ? { state: JSON.parse(value) } : null;
    } catch (e) {
      console.error("AsyncStorage Error: Failed to load items.", e);
      return null;
    }
  },
  setItem: async (
    name: string,
    value: StorageValue<TodoState>
  ): Promise<void> => {
    try {
      const serializedValue = JSON.stringify(value.state);
      await AsyncStorage.setItem(name, serializedValue);
    } catch (e) {
      console.error("AsyncStorage Error: Failed to save item.", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.error("AsyncStorage Error: Failed to remove item.", e);
    }
  },
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      isHydrated: false,
      statusFilter: "All", // 🚨 Default Filter
      priorityFilter: "All", // 🚨 Default Filter
      sortBy: "createdAt", // 🚨 Default Sort by date
      sortDirection: "desc", // 🚨 Default Sort Desc
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      addTask: async (task) => {
        try {
          const newTask = await postTask(task);
          set((state) => ({
            tasks: [newTask, ...state.tasks],
          }));
        } catch (error) {
          alert("Error adding task. Please try again.");
          console.error("Zustand Action Error:", error);
        }
      },
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      editTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setSortBy: (by, direction) =>
        set({ sortBy: by, sortDirection: direction }),
    }),
    {
      name: "todo-storage",
      storage: customStorage as
        | PersistStorage<TodoState>
        | PersistStorage<TodoState>
        | any,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
      partialize: (state) => ({
        tasks: state.tasks,
        statusFilter: state.statusFilter,
        priorityFilter: state.priorityFilter,
      }),
    }
  )
);
