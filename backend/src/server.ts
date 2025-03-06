import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import router from "./routes";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
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