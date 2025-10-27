import { PriorityFilter, TaskStatusFilter, TodoTask } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { PersistStorage, persist } from "zustand/middleware";

type StorageValue<T> = { state: T };
interface TodoState {
  tasks: TodoTask[];
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  addTask: (task: TodoTask) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  statusFilter: TaskStatusFilter;
  priorityFilter: PriorityFilter;
  editTask: (id: string, updates: Partial<Omit<TodoTask, "id">>) => void;
  setStatusFilter: (status: TaskStatusFilter) => void;
  setPriorityFilter: (priority: PriorityFilter) => void;
}

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
      statusFilter: "All",
      priorityFilter: "All",
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
      editTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
    }),
    {
      name: "todo-storage",
      storage: customStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
