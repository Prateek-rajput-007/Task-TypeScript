import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import router from "./routes";

dotenv.config();

const app = express();

const allowedOrigins = ["https://tasktypescript.vercel.app", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
