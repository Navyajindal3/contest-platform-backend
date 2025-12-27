import express from "express";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import contestRoutes from "./routes/contest.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/auth", authRoutes);

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/contest", contestRoutes);

export default app;
