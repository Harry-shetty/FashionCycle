import express from "express";
import { SavedItem } from "../models/SavedItem.js";

const router = express.Router();

// GET /api/saved
router.get("/", async (req, res) => {
  try {
    const items = await SavedItem.find({ userId: "default-user" });
    const listingIds = items.map((i) => i.listingId);
    res.json(listingIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/saved/toggle/:listingId
router.post("/toggle/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const existing = await SavedItem.findOne({ listingId, userId: "default-user" });

    if (existing) {
      await SavedItem.deleteOne({ _id: existing._id });
      res.json({ saved: false, listingId });
    } else {
      await SavedItem.create({ listingId, userId: "default-user" });
      res.json({ saved: true, listingId });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/saved/:listingId
router.delete("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    await SavedItem.deleteOne({ listingId, userId: "default-user" });
    res.json({ success: true, message: "Item removed from wishlist", listingId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/saved (clear collection)
router.delete("/", async (req, res) => {
  try {
    const result = await SavedItem.deleteMany({ userId: "default-user" });
    res.json({ success: true, message: "All saved items removed from MongoDB", count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
