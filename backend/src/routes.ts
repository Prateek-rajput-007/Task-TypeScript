import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { createUser, getUserByEmail, createTask, getTasksByUser, updateTask, deleteTask } from "./models";
import { authMiddleware, AuthenticatedRequest } from "./authMiddleware";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

/** Register Route */
router.post(
  "/register",
  [
    check("username").notEmpty().isLength({ min: 3 }),
    check("email").isEmail(),
    check("password").notEmpty().isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await createUser(username, email, hashedPassword);
      res.status(201).json({ message: "User registered", userId: user[0].id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Unknown error" });
      }
    }
  }
);

/** Login Route */
router.post(
  "/login",
  [check("email").isEmail(), check("password").notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await getUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

      res.json({ token, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/** Refresh Token */
router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token: newToken, refreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

/** Get Tasks */
router.get("/tasks", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await getTasksByUser(req.userId as string);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/** Create Task */
router.post(
  "/tasks",
  authMiddleware,
  [check("title").notEmpty().isLength({ min: 1 }), check("dueDate").optional().isISO8601()],
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate } = req.body;

    try {
      const task = await createTask(req.userId as string, title, description, dueDate);
      res.status(201).json(task[0]); // Return single task object
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/** Update Task */
router.put("/tasks/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const updatedTask = await updateTask(id, { title, description, status, due_date: dueDate });
    res.json(updatedTask[0]); // Return single task object
  } catch (error) {
    if (error instanceof Error && error.message === "Task not found") {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

/** Delete Task */
router.delete("/tasks/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await deleteTask(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "Task not found") {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

export default router;