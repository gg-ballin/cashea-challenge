export type Priority = "High" | "Medium" | "Low";

export interface TodoTask {
  id: string; // Used for key and API calls
  text: string;
  isCompleted: boolean;
  priority: Priority;
}

export type PriorityStyle = {
  backgroundColor: string;
  color: string;
};
