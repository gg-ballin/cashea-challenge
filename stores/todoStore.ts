// store/todoStore.ts

import { TodoTask } from "@/constants/types"; // Import your task type
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
type StorageValue<T> = { state: T };
// 1. Define the store state and actions
interface TodoState {
  tasks: TodoTask[];
  isHydrated: boolean; // To track if data has been loaded from storage
  setHydrated: (hydrated: boolean) => void;
  addTask: (task: TodoTask) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

// 2. Define custom storage with error handling for AsyncStorage
const customStorage: PersistStorage<TodoState> = {
  getItem: async (name: string): Promise<StorageValue<TodoState> | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ? { state: JSON.parse(value) } : null; // Wrap in { state: ... }
    } catch (e) {
      console.error("AsyncStorage Error: Failed to load items.", e);
      return null; // Return null to prevent crashes
    }
  },
  setItem: async (
    name: string,
    value: StorageValue<TodoState>
  ): Promise<void> => {
    try {
      const serializedValue = JSON.stringify(value.state); // Use value.state
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

// 3. Create the persistent store
export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isHydrated: false, // Default state is not hydrated

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      addTask: (task) =>
        set((state) => ({
          tasks: [task, ...state.tasks],
        })),

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
    }),
    {
      name: "todo-storage", // Key for AsyncStorage
      storage: customStorage, // Use our custom storage with error handling
      onRehydrateStorage: () => (state) => {
        // Called when rehydration (loading) is finished
        if (state) {
          state.setHydrated(true);
        }
      },
      // You can limit which parts of the state are persisted if needed
      // partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
