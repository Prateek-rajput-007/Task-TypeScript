import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import router from "./routes";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://tasktypescript.vercel.app",
  "https://task-type-script.vercel.app", // Add your correct frontend URL
  "http://localhost:5173" // Keep local for testing
];
app.use(
  cors({
    origin: "*", // ⚠️ Allow all origins (Only for testing, not for production)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use("/api", router);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err: { stack: any; }) => {
    console.error("Database connection error", err.stack);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
