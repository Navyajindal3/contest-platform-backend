import express from "express";
import { registerUser, loginUser } from "../services/auth.service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    if (password.length < 6) return res.status(400).json({ error: "password must be at least 6 chars" });

    const result = await registerUser({ email, password });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const result = await loginUser({ email, password });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
