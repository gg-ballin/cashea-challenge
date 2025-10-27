import { TodoState } from "@/constants/types";
import {
  changeTaskStatus,
  deleteTask,
  getTasksApi,
  patchTaskEdit,
  postTask,
} from "@/services/api";
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
    (set, get) => ({
      tasks: [],
      isHydrated: false,
      statusFilter: "All", // 🚨 Default Filter
      priorityFilter: "All", // 🚨 Default Filter
      loadingTaskId: null,
      isAddingTask: false,
      isRefreshing: false,
      // Actions
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setTasks: (tasks) => set({ tasks }),
      getTasks: async (isRefreshing = false) => {
        try {
          if (isRefreshing) {
            set({ isRefreshing: true });
          }
          const fetchedTasks = await getTasksApi();
          set({ tasks: fetchedTasks });
        } catch (error) {
          console.error("Zustand Action Error (GET /tasks):", error);
        } finally {
          if (isRefreshing) {
            set({ isRefreshing: false });
          }
        }
      },
      addTask: async (task) => {
        set({ isAddingTask: true });
        try {
          const newTask = await postTask(task);
          set((state) => ({
            tasks: [newTask, ...state.tasks],
          }));
        } catch (error) {
          alert("Error adding task. Please try again.");
          console.error("Zustand Action Error:", error);
        } finally {
          set({ isAddingTask: false });
        }
      },
      toggleTask: async (id) => {
        const taskToToggle = get().tasks.find((t) => t.id === id);
        if (!taskToToggle) return;
        const newIsCompletedStatus = !taskToToggle.isCompleted;
        set({ loadingTaskId: id });
        try {
          const confirmedTask = await changeTaskStatus(
            id,
            newIsCompletedStatus
          );
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? confirmedTask : task
            ),
          }));
        } catch (error) {
          alert(`Error toggling task ${id}. Please check your connection.`);
          console.error("Zustand Action Error (PATCH /tasks):", error);
        } finally {
          set({ loadingTaskId: null });
        }
      },
      deleteTask: async (id) => {
        set({ loadingTaskId: id });
        try {
          await deleteTask(id);
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        } catch (error) {
          alert(
            `Error deleting task ${id}. Please check your connection and try again.`
          );
          console.error("Zustand Action Error (DELETE /tasks):", error);
        } finally {
          set({ loadingTaskId: null });
        }
      },
      editTask: async (id, updates) => {
        set({ loadingTaskId: id });
        const payload = {
          text: updates.text,
          isCompleted: updates.isCompleted,
          priority: updates.priority,
        };

        try {
          const confirmedTask = await patchTaskEdit(id, payload);
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? confirmedTask : task
            ),
          }));
        } catch (error) {
          alert(`Error saving changes for task ${id}.`);
          console.error("Zustand Action Error (PATCH /tasks):", error);
        } finally {
          set({ loadingTaskId: null });
        }
      },
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
