import express from "express";
import { submitScore, getTopUsers, getUserRank } from "../services/leaderboard.service.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { isContestActive } from "../services/contest.service.js";
import redis from "../redis/client.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Apply rate limiter to score submission only
router.post(
  "/submit",
  requireAuth,
  rateLimiter({ windowSec: 10, maxRequests: 10 }),
  async (req, res) => {
    const { contestId, score } = req.body;
    const userId = req.user.id;

    if (!contestId || score === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const active = await isContestActive(contestId);
    if (!active) return res.status(403).json({ error: "Contest not active" });

    await submitScore(contestId, userId, score);
    res.json({ success: true });
  }
);



// Read-only endpoints do not need rate limiting
router.get("/top", async (req, res) => {
    const { contestId, limit } = req.query;
    const data = await getTopUsers(contestId, Number(limit) || 10);
    res.json({ leaderboard: data });
});

router.get("/rank", async (req, res) => {
    const { contestId, userId } = req.query;
    const rank = await getUserRank(contestId, userId);
    res.json({ rank });
});
router.get("/:contestId", async (req, res) => {
  try {
    const { contestId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await getTopUsers(contestId, limit);
    res.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
