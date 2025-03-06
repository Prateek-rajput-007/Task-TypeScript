import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import router from "./routes";

dotenv.config();

const app = express();

const allowedOrigins = ["https://tasktypescript.vercel.app", "http://localhost:5173"];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin || "") ? req.headers.origin : "");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight request response
  }

  next();
});

app.use(express.json());
app.use("/api", router);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err: { stack: any }) => console.error("Database connection error", err.stack));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
