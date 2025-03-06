import React, { useState } from "react";
import { Task } from "../types";
import "../styles/TaskForm.css";

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [task, setTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task); // Send task without dueDate
    setTask({ title: "", description: "", status: "pending" });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="task-input"
      />
      <textarea
        placeholder="Description"
        value={task.description || ""}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="task-textarea"
      />
      <select
        value={task.status || "pending"}
        onChange={(e) =>
          setTask({ ...task, status: e.target.value as "pending" | "completed" })
        }
        className="task-select"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit" className="task-btn">Add Task</button>
    </form>
  );
};

export default TaskForm;