import express from "express";
import { Leaderboard } from "../models/Leaderboard.js";

const router = express.Router();

const DEFAULT_LEADERBOARD = {
  month: [
    { rank: 1, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 184.2, itemsCycled: 42, badge: "🌱 Eco Master", points: 4850 },
    { rank: 2, name: "Priya Sharma", handle: "@priyawears", avatar: "PS", city: "Mumbai, IN", co2Saved: 142.8, itemsCycled: 36, badge: "♻️ Zero Waste Hero", points: 3920 },
    { rank: 3, name: "Elena Rostova", handle: "@elenavintage", avatar: "ER", city: "Bengaluru, IN", co2Saved: 118.5, itemsCycled: 29, badge: "👗 Vintage Curator", points: 3150 },
    { rank: 4, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Rising Cycler", points: 1420, isCurrentUser: true },
    { rank: 5, name: "Kavya Nair", handle: "@kavyacircles", avatar: "KN", city: "Delhi, IN", co2Saved: 44.1, itemsCycled: 11, badge: "✨ Trend Setter", points: 1310 },
    { rank: 6, name: "Rohan Varma", handle: "@rohanthrift", avatar: "RV", city: "Hyderabad, IN", co2Saved: 39.6, itemsCycled: 9, badge: "👕 Denim Saver", points: 1180 },
    { rank: 7, name: "Ananya Deshmukh", handle: "@ananyastyle", avatar: "AD", city: "Pune, IN", co2Saved: 35.2, itemsCycled: 8, badge: "🧵 Stitch Rebel", points: 990 },
    { rank: 8, name: "Dev Patel", handle: "@devvintage", avatar: "DP", city: "Bengaluru, IN", co2Saved: 31.0, itemsCycled: 7, badge: "🌟 Conscious Shopper", points: 860 },
  ],
  allTime: [
    { rank: 1, name: "Zara Chen", handle: "@zaracircular", avatar: "ZC", city: "Singapore", co2Saved: 684.5, itemsCycled: 186, badge: "👑 Planet Champion", points: 18900 },
    { rank: 2, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 542.0, itemsCycled: 134, badge: "🌱 Eco Master", points: 14200 },
    { rank: 3, name: "Mateo Silva", handle: "@mateothrift", avatar: "MS", city: "Lisbon, PT", co2Saved: 478.2, itemsCycled: 112, badge: "♻️ Zero Waste Legend", points: 12100 },
    { rank: 4, name: "Priya Sharma", handle: "@priyawears", avatar: "PS", city: "Mumbai, IN", co2Saved: 390.6, itemsCycled: 94, badge: "👗 Vintage Icon", points: 9800 },
    { rank: 14, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 148.4, itemsCycled: 34, badge: "🌿 Verified Cycler", points: 3420, isCurrentUser: true },
  ],
  local: [
    { rank: 1, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 184.2, itemsCycled: 42, badge: "🌱 Eco Master", points: 4850 },
    { rank: 2, name: "Elena Rostova", handle: "@elenavintage", avatar: "ER", city: "Bengaluru, IN", co2Saved: 118.5, itemsCycled: 29, badge: "👗 Vintage Curator", points: 3150 },
    { rank: 3, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Top 3 in Bengaluru", points: 1420, isCurrentUser: true },
    { rank: 4, name: "Dev Patel", handle: "@devvintage", avatar: "DP", city: "Bengaluru, IN", co2Saved: 31.0, itemsCycled: 7, badge: "🌟 Conscious Shopper", points: 860 },
    { rank: 5, name: "Nisha Rao", handle: "@nishaloops", avatar: "NR", city: "Bengaluru, IN", co2Saved: 28.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 740 },
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

