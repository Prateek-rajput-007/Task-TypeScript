import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) throw new Error("supabaseUrl is required.");
if (!supabaseKey) throw new Error("supabaseKey is required.");

const supabase = createClient(supabaseUrl, supabaseKey);

// User Interface
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at?: string;
  refresh_token?: string;
}

// Task Interface
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  due_date?: string; // Ensure this is handled as a string in YYYY-MM-DD format
  created_at?: string;
}

// Database Operations

/** Create a new user */
export const createUser = async (username: string, email: string, password: string): Promise<User[]> => {
  // Check if user already exists
  const { data: existingUser, error: userError } = await supabase
    .from("users")
    .select("*")
    .or(`username.eq.${username},email.eq.${email}`)
    .single();

  if (existingUser) {
    throw new Error("User already exists");
  }

  if (userError && userError.code !== "PGRST116") { // PGRST116 means no rows returned
    throw new Error(userError.message);
  }

  // Insert new user into the database
  const { data, error } = await supabase.from("users").insert([{ username, email, password }]).select();
  if (error) throw error;
  return data as User[];
};

/** Get user by email */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (error) return null;
  return data as User;
};

/** Create a new task */
export const createTask = async (
  user_id: string,
  title: string,
  description?: string,
  due_date?: string
): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id, title, description, due_date, status: "pending" }])
    .select();
  if (error) throw error;
  return data as Task[];
};

/** Get tasks by user */
export const getTasksByUser = async (user_id: string): Promise<Task[]> => {
  const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user_id);
  if (error) throw error;
  return data as Task[];
};

/** Update task */
export const updateTask = async (task_id: string, updates: Partial<Task>): Promise<Task[]> => {
  // Check if the task exists
  const { data: existingTask, error: taskError } = await supabase.from("tasks").select("*").eq("id", task_id).single();
  if (!existingTask) {
    throw new Error("Task not found");
  }
  if (taskError) throw taskError;

  // Update the task
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", task_id).select();
  if (error) throw error;
  return data as Task[];
};

/** Delete task */
export const deleteTask = async (task_id: string): Promise<{ message: string }> => {
  // Check if the task exists
  const { data: existingTask, error: taskError } = await supabase.from("tasks").select("*").eq("id", task_id).single();
  if (!existingTask) {
    throw new Error("Task not found");
  }
  if (taskError) throw taskError;

  // Delete the task
  const { error } = await supabase.from("tasks").delete().eq("id", task_id);
  if (error) throw error;
  return { message: "Task deleted" };
};