import express from "express";
import { Impact } from "../models/Impact.js";

const router = express.Router();

// GET /api/impact
router.get("/", async (req, res) => {
  try {
    let impact = await Impact.findOne({ userId: "default-user" });
    if (!impact) {
      impact = await Impact.create({
        userId: "default-user",
        co2: 48.4,
        water: 3820,
        items: 12,
        money: 836,
      });
    } else if (typeof impact.co2 === "number") {
      const roundedCo2 = Math.round(impact.co2 * 10) / 10;
      if (roundedCo2 !== impact.co2) {
        impact.co2 = roundedCo2;
        await impact.save();
      }
    }
    res.json(impact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/impact/add
router.post("/add", async (req, res) => {
  try {
    const { co2 = 0, water = 0, items = 1, money = 0 } = req.body;
    let impact = await Impact.findOneAndUpdate(
      { userId: "default-user" },
      { $inc: { co2, water, items, money } },
      { new: true, upsert: true }
    );
    if (impact && typeof impact.co2 === "number") {
      impact.co2 = Math.round(impact.co2 * 10) / 10;
      await impact.save();
    }
    res.json(impact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/impact/reset
router.post("/reset", async (req, res) => {
  try {
    const reset = await Impact.findOneAndUpdate(
      { userId: "default-user" },
      { co2: 0, water: 0, items: 0, money: 0 },
      { new: true, upsert: true }
    );
    res.json(reset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/impact (clear collection)
router.delete("/", async (req, res) => {
  try {
    await Impact.deleteMany({});
    res.json({ success: true, message: "Impact collection cleared from MongoDB" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
