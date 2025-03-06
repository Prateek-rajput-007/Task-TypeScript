import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask, setAuthToken } from "../services/api";
import { Task } from "../types";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to fetch tasks");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [navigate]);

  const handleAddTask = async (task: Partial<Task>) => {
    try {
      await createTask(task);
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleUpdateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      await updateTask(id, updatedTask);
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Task Manager</h1>
          <button onClick={handleLogout} className="dashboard-logout">Logout</button>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <TaskForm onSubmit={handleAddTask} />

        <div className="dashboard-task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;