import React, { useState, useEffect } from "react";
import { Task } from "../types";
import "../styles/TaskCard.css";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, task: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [randomDate, setRandomDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!task.dueDate) {
      const start = new Date(2020, 0, 1);
      const end = new Date(2025, 11, 31);
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      setRandomDate(date.toISOString().split("T")[0]); // YYYY-MM-DD
    }
  }, [task.dueDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(task.id, {
      title: editedTask.title,
      description: editedTask.description,
      dueDate: editedTask.dueDate, // Send as string
      status: editedTask.status,
    });
    setIsEditing(false);
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="task-input"
          />
          <textarea
            value={editedTask.description || ""}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="task-textarea"
          />
          <select
            value={editedTask.status}
            onChange={(e) =>
              setEditedTask({ ...editedTask, status: e.target.value as "pending" | "completed" })
            }
            className="task-select"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div className="task-date">
            Due Date: {formatDateForDisplay(editedTask.dueDate || randomDate)}
          </div>
          <div className="task-btn-group">
            <button type="submit" className="task-btn save">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="task-btn cancel">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description || "No description"}</p>
          <p className="task-meta">Status: {task.status}</p>
          <p className="task-meta">Due: {formatDateForDisplay(task.dueDate || randomDate)}</p>
          <div className="task-btn-group">
            <button onClick={() => setIsEditing(true)} className="task-btn edit">Edit</button>
            <button onClick={() => onDelete(task.id)} className="task-btn delete">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;