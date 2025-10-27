export type Priority = "High" | "Medium" | "Low";
export type TaskStatusFilter = "All" | "Completed" | "Pending";
export type PriorityFilter = "All" | Priority;
export type SortDirection = "asc" | "desc";
export type SortBy = "priority" | "text" | "createdAt";
export type Platform = "ios" | "android";
export interface TodoTask {
  id?: string;
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
  sortBy: SortBy;
  sortDirection: SortDirection;
  statusFilter: TaskStatusFilter;
  priorityFilter: PriorityFilter;
  // Actions
  setHydrated: (hydrated: boolean) => void;
  addTask: (task: Omit<TodoTask, "id">) => Promise<void>;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updates: Partial<Omit<TodoTask, "id">>) => void;
  setStatusFilter: (status: TaskStatusFilter) => void;
  setPriorityFilter: (priority: PriorityFilter) => void;
  setSortBy: (by: SortBy, direction: SortDirection) => void;
}
