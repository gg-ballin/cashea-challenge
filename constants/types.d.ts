export type Priority = "High" | "Medium" | "Low";
export type TaskStatusFilter = "All" | "Completed" | "Pending";
export type PriorityFilter = "All" | Priority;
export interface TodoTask {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: Priority;
}

export type PriorityStyle = {
  backgroundColor: string;
  color: string;
};
