import express from "express";
import { Newsletter } from "../models/Newsletter.js";

const router = express.Router();

// POST /api/newsletter
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const sub = await Newsletter.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, email: sub.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/newsletter
router.get("/", async (req, res) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/newsletter/:email
router.delete("/:email", async (req, res) => {
  try {
    const deleted = await Newsletter.findOneAndDelete({ email: req.params.email });
    if (!deleted) return res.status(404).json({ error: "Subscriber not found" });
    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/newsletter (clear collection)
router.delete("/", async (req, res) => {
  try {
    const result = await Newsletter.deleteMany({});
    res.json({ success: true, message: "All newsletter subscribers deleted", count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
