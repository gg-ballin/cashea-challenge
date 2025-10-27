// services/api.ts

import { TodoTask } from "@/constants/types";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/tasks"
    : "http://localhost:3000/tasks";

// A generic function to handle CRUD operations
// T is the expected return type (e.g., TodoTask or TodoTask[])
// D is the data payload (e.g., Omit<TodoTask, 'id'>)
export async function apiFetch<T, D = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
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

  // Note: We use the endpoint relative to the base URL
  const url = `${BASE_URL.replace(/\/tasks$/, "")}${endpoint}`;

  const response = await fetch(url, config);

  // 1. Check for bad HTTP response (4xx or 5xx)
  if (!response.ok) {
    // Log error details for debugging
    console.error(`API Error (${method} ${url}): Status ${response.status}`);

    // Throw a generic error that the Zustand action can catch
    throw new Error(`Request failed with status: ${response.status}`);
  }

  // 2. Return parsed JSON (assuming all your requests return JSON)
  return response.json() as Promise<T>;
}

type CreateTaskPayload = Omit<TodoTask, "id">;

export async function postTask(taskData: CreateTaskPayload): Promise<TodoTask> {
  const newTask = await apiFetch<TodoTask, CreateTaskPayload>(
    "/tasks",
    "POST",
    taskData
  );
  return newTask;
}
