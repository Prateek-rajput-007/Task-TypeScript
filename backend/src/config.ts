import dotenv from "dotenv";
dotenv.config();

const config = {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  port: process.env.PORT || 5000,
};

export default config;
