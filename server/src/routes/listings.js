import express from "express";
import { Listing } from "../models/Listing.js";
import { Impact } from "../models/Impact.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

// GET /api/listings
router.get("/", async (req, res) => {
  try {
    const { category, condition, q, sort } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (condition && condition !== "All") {
      filter.condition = condition;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    let query = Listing.find(filter);

    if (sort === "price-low") query = query.sort({ price: 1 });
    else if (sort === "price-high") query = query.sort({ price: -1 });
    else if (sort === "newest") query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 });

    const listings = await query.exec();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/listings/:id
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findOne({ id: req.params.id });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/listings
router.post("/", async (req, res) => {
  try {
    const { title, brand, size, condition, category, price, images, description } = req.body;
    const newId = `lst-${Date.now()}`;

    const newListing = await Listing.create({
      id: newId,
      title,
      brand,
      size,
      condition: condition || "Excellent",
      category,
      price: Number(price) || 50,
      images: images && images.length ? images : ["https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format"],
      description: description || "Pre-loved fashion item listed for sustainable reuse.",
      sellerId: "user-current",
      sold: false,
    });

    // Update impact in MongoDB
    await Impact.findOneAndUpdate(
      { userId: "default-user" },
      { $inc: { items: 1, co2: 3.2, water: 320 } },
      { upsert: true }
    );

    // Create notification in MongoDB
    await Notification.create({
      id: `notif-${Date.now()}`,
      icon: "✨",
      text: `Your piece "${title}" has been published to MongoDB marketplace!`,
      time: "Just now",
      read: false,
    });

    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/listings/:id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Listing.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Listing not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/listings (clear all listings collection)
router.delete("/", async (req, res) => {
  try {
    const result = await Listing.deleteMany({});
    res.json({ success: true, message: "All listings deleted from MongoDB", count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/listings/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Listing.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Listing not found" });
    res.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
