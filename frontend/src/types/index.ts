export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  dueDate?: string; // Changed to string to match Supabase ISO format
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}