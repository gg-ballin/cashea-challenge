export type Priority = "High" | "Medium" | "Low";
export type TaskStatusFilter = "All" | "Completed" | "Pending";
export type PriorityFilter = "All" | Priority;
export type EditableTaskFields = Pick<
  TodoTask,
  "text" | "isCompleted" | "priority"
>;

export type Platform = "ios" | "android";
export interface TodoTask {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: Priority;
  platform: Platform;
}

export type PriorityStyle = {
  backgroundColor: string;
  color: string;
};

export interface TodoState {
  tasks: TodoTask[];
  isHydrated: boolean;
  loadingTaskId: string | null;
  isEditingTask: boolean;
  isAddingTask: boolean;
  statusFilter: TaskStatusFilter;
  priorityFilter: PriorityFilter;
  isRefreshing: boolean;
  // Actions
  setHydrated: (hydrated: boolean) => void;
  setTasks: (tasks: TodoTask[]) => void;
  getTasks: (isRefreshing?: boolean) => Promise<void>;
  addTask: (task: Omit<TodoTask, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => void;
  editTask: (id: string, updates: Partial<Omit<TodoTask, "id">>) => void;
  setStatusFilter: (status: TaskStatusFilter) => void;
  setPriorityFilter: (priority: PriorityFilter) => void;
}
