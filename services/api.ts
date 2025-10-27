import { TodoTask } from "@/constants/types";
import { Platform } from "react-native";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/tasks"
    : "http://localhost:3000/tasks";

const NETWORK_LATENCY_MS = 1500;

export async function apiFetch<T, D = any>(
  endpoint: string,
  method: HttpMethod,
  data?: D
): Promise<T> {
  const config: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && method !== "GET" && method !== "DELETE") {
    config.body = JSON.stringify(data);
  }

  const url = `${BASE_URL.replace(/\/tasks$/, "")}${endpoint}`;
  await new Promise((resolve) => setTimeout(resolve, NETWORK_LATENCY_MS));
  const response = await fetch(url, config);

  if (!response.ok) {
    console.error(`API Error (${method} ${url}): Status ${response.status}`);
    throw new Error(`Request failed with status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

type CreateTaskPayload = Omit<TodoTask, "id">;

export async function getTasksApi(): Promise<TodoTask[]> {
  const tasks = await apiFetch<TodoTask[]>("/tasks", "GET");
  return tasks;
}

export async function postTask(taskData: CreateTaskPayload): Promise<TodoTask> {
  const newTask = await apiFetch<TodoTask, CreateTaskPayload>(
    "/tasks",
    "POST",
    taskData
  );
  return newTask;
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`/tasks/${id}`, "DELETE");
}

export async function changeTaskStatus(
  id: string,
  isCompleted: boolean
): Promise<TodoTask> {
  const payload = { isCompleted: isCompleted };
  const updatedTask = await apiFetch<TodoTask, typeof payload>(
    `/tasks/${id}`,
    "PATCH",
    payload
  );
  return updatedTask;
}
