// types/todo.ts (or wherever you define your types)

export type Priority = 'High' | 'Medium' | 'Low';

export interface TodoTask {
  id: string; // Used for key and API calls
  text: string;
  isCompleted: boolean;
  priority: Priority;
}