import { TodoState } from "@/constants/types";
import {
  changeTaskStatus,
  deleteTask,
  getTasksApi,
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
      sortBy: "createdAt", // 🚨 Default Sort by date
      sortDirection: "asc", // 🚨 Default Sort Desc
      loadingTaskId: null,
      isAddingTask: false,
      // Actions
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      setTasks: (tasks) => set({ tasks }),
      getTasks: async () => {
        try {
          const fetchedTasks = await getTasksApi();
          set({ tasks: fetchedTasks });
        } catch (error) {
          console.error("Zustand Action Error (GET /tasks):", error);
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

        try {
          // 2. Llamada a la API (PATCH)
          // We only send the ID and the new status
          const confirmedTask = await changeTaskStatus(
            id,
            newIsCompletedStatus
          );

          // 3. Si la API tiene éxito, actualizar el estado local
          set((state) => ({
            tasks: state.tasks.map((task) =>
              // Reemplazar la tarea con los datos confirmados por el servidor
              task.id === id ? confirmedTask : task
            ),
          }));
        } catch (error) {
          // 4. Manejo de errores
          alert(`Error toggling task ${id}. Please check your connection.`);
          console.error("Zustand Action Error (PATCH /tasks):", error);
        }
      },
      deleteTask: async (id) => {
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
        }
      },

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
