import express from "express";
import { Leaderboard } from "../models/Leaderboard.js";

const router = express.Router();

// Top Buyers Eco Leaderboard
const DEFAULT_LEADERBOARD = {
  month: [
    { rank: 1, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 164.2, itemsCycled: 38, badge: "👑 Top Circular Buyer", points: 4850 },
    { rank: 2, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 136.5, itemsCycled: 29, badge: "🛍️ Zero Waste Buyer", points: 3920 },
    { rank: 3, name: "Maya Kapoor", handle: "@mayarepeats", avatar: "MK", city: "Bengaluru, IN", co2Saved: 98.4, itemsCycled: 21, badge: "👗 Conscious Collector", points: 3150 },
    { rank: 4, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Rising Buyer", points: 1420 },
    { rank: 5, name: "Rohan Varma", handle: "@rohanreclaims", avatar: "RV", city: "Hyderabad, IN", co2Saved: 62.0, itemsCycled: 14, badge: "🌱 Mindful Thrifter", points: 1600 },
    { rank: 6, name: "Diya Roy", handle: "@diyasaves", avatar: "DR", city: "Kolkata, IN", co2Saved: 49.5, itemsCycled: 11, badge: "✨ Sustainable Stylist", points: 1280 },
    { rank: 7, name: "Dev Patel", handle: "@devcircular", avatar: "DP", city: "Bengaluru, IN", co2Saved: 38.0, itemsCycled: 9, badge: "🌟 Eco Patron", points: 980 },
    { rank: 8, name: "Nisha Rao", handle: "@nishathrifts", avatar: "NR", city: "Bengaluru, IN", co2Saved: 26.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 720 },
  ],
  allTime: [
    { rank: 1, name: "Zara Chen", handle: "@zarathrifts", avatar: "ZC", city: "Singapore", co2Saved: 684.5, itemsCycled: 186, badge: "👑 Global Circular Buyer", points: 18900 },
    { rank: 2, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 542.0, itemsCycled: 134, badge: "🌱 Master Shopper", points: 14200 },
    { rank: 3, name: "Mateo Silva", handle: "@mateothrift", avatar: "MS", city: "Lisbon, PT", co2Saved: 478.2, itemsCycled: 112, badge: "♻️ Zero Waste Legend", points: 12100 },
    { rank: 4, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 390.6, itemsCycled: 94, badge: "👗 Vintage Patron", points: 9800 },
    { rank: 14, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 148.4, itemsCycled: 34, badge: "🌿 Verified Buyer", points: 3420 },
  ],
  local: [
    { rank: 1, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 164.2, itemsCycled: 38, badge: "👑 Top Circular Buyer", points: 4850 },
    { rank: 2, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 136.5, itemsCycled: 29, badge: "🛍️ Zero Waste Buyer", points: 3920 },
    { rank: 3, name: "Maya Kapoor", handle: "@mayarepeats", avatar: "MK", city: "Bengaluru, IN", co2Saved: 98.4, itemsCycled: 21, badge: "👗 Conscious Collector", points: 3150 },
    { rank: 4, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Top 4 Buyer in Bengaluru", points: 1420 },
    { rank: 5, name: "Dev Patel", handle: "@devcircular", avatar: "DP", city: "Bengaluru, IN", co2Saved: 38.0, itemsCycled: 9, badge: "🌟 Eco Patron", points: 980 },
    { rank: 6, name: "Nisha Rao", handle: "@nishathrifts", avatar: "NR", city: "Bengaluru, IN", co2Saved: 26.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 720 },
  ],
};

// GET /api/leaderboard?period=month|allTime|local
router.get("/", async (req, res) => {
  try {
    const period = req.query.period || "month";
    let list = await Leaderboard.find({ period }).sort({ rank: 1 });

    if (list.length === 0) {
      // Auto seed default data for this period
      const defaults = DEFAULT_LEADERBOARD[period] || DEFAULT_LEADERBOARD.month;
      await Leaderboard.insertMany(defaults.map((d) => ({ ...d, period })));
      list = await Leaderboard.find({ period }).sort({ rank: 1 });
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/leaderboard - create or update ranking entry
router.post("/", async (req, res) => {
  try {
    const { name, handle, avatar, city, co2Saved, itemsCycled, badge, points, period = "month", isCurrentUser = false } = req.body;
    
    const entry = await Leaderboard.findOneAndUpdate(
      { handle, period },
      {
        name,
        handle,
        avatar: avatar || name.slice(0, 2).toUpperCase(),
        city: city || "Bengaluru, IN",
        co2Saved: Number(co2Saved) || 0,
        itemsCycled: Number(itemsCycled) || 0,
        badge: badge || "🌱 Circular Member",
        points: Number(points) || 100,
        isCurrentUser,
        period,
      },
      { upsert: true, new: true }
    );

    // Recalculate ranks in this period
    const allInPeriod = await Leaderboard.find({ period }).sort({ points: -1, co2Saved: -1 });
    for (let i = 0; i < allInPeriod.length; i++) {
      allInPeriod[i].rank = i + 1;
      await allInPeriod[i].save();
    }

    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/leaderboard/:id - delete single ranking
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Leaderboard.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Leaderboard entry not found" });
    res.json({ success: true, message: "Leaderboard entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/leaderboard - clear / drop all leaderboard rankings
router.delete("/", async (req, res) => {
  try {
    const period = req.query.period;
    if (period) {
      await Leaderboard.deleteMany({ period });
      res.json({ success: true, message: `Leaderboard collection for ${period} cleared` });
    } else {
      await Leaderboard.deleteMany({});
      res.json({ success: true, message: "Entire Leaderboard collection cleared" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

