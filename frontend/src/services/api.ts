import axios from "axios";
import { User, Task } from "../types";

// const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL
cont API_URL ="https://task-typescript-backend.onrender.com";
const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const register = async (user: User): Promise<void> => {
  try {
    await api.post("/register", user);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const login = async (user: User): Promise<{ token: string; refreshToken: string }> => {
  try {
    const response = await api.post("/login", user);
    setAuthToken(response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data; // Keep dueDate as string from Supabase
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await api.post("/tasks", task);
  return response.data; // Keep dueDate as string
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data; // Keep dueDate as string
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
