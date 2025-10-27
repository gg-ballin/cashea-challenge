import { Priority, PriorityFilter, PriorityStyle } from "./types";

export type Priorities = Priority | PriorityFilter | "Default";
export const PRIORITY_STYLES: Record<Priorities, PriorityStyle> = {
  High: { backgroundColor: "#F97070", color: "white" },
  Medium: { backgroundColor: "#FFD700", color: "black" },
  Low: { backgroundColor: "#48BB78", color: "white" },
  Default: { backgroundColor: "#CCCCCC", color: "black" },
  All: { backgroundColor: "#FDFA3D", color: "black" },
};
