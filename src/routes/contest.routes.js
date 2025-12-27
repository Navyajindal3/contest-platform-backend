import express from "express";
import { createContest, endContest } from "../services/contest.service.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.post("/create", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { contestId, durationSec } = req.body;

    if (!contestId) {
      return res.status(400).json({ error: "contestId required" });
    }

    await createContest(contestId, durationSec);
    res.json({ success: true, contestId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/end", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { contestId } = req.body;
  await endContest(contestId);
  res.json({ success: true });
});



export default router;
