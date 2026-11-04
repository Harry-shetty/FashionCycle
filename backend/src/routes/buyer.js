import express from "express";
import mongoose from "mongoose";
import { Buyer } from "../models/Buyer.js";
import { Order } from "../models/Order.js";
import { SavedItem } from "../models/SavedItem.js";
import { BuyerFollow } from "../models/BuyerFollow.js";
import { Notification } from "../models/Notification.js";
import { CommunityPost } from "../models/CommunityPost.js";

const router = express.Router();

const MOCK_BUYER = {
  buyerId: "buyer-001",
  name: "Harsha (Buyer)",
  email: "harsha@gmail.com",
  handle: "@harsha",
  avatar: "HA",
  shippingAddress: "Flat 402, Green Meadows, Bengaluru, 560034",
  ecoPoints: 1420,
  co2SavedKg: 48.4,
  waterSavedLitres: 3820,
  piecesPurchased: 12,
  tier: "Gold Level Eco Contributor",
};

// GET /api/buyer/all - Complete bundle of everything related to the buyer
router.get("/all", async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const buyerId =
      req.headers["x-user-id"] ||
      req.headers["x-user-email"] ||
      req.query.buyerId ||
      "buyer-001";

    let profile = MOCK_BUYER;
    let orders = [];
    let saved = [];
    let follows = [];
    let notifications = [];
    let communityPosts = [];

    if (isConnected) {
      const [dbProfile, dbOrders, dbSaved, dbFollows, dbNotifs, dbPosts] = await Promise.all([
        Buyer.findOne({ $or: [{ buyerId }, { email: req.headers["x-user-email"] || buyerId }] }),
        Order.find({ $or: [{ buyerId }, { userId: buyerId }] }).sort({ createdAt: -1 }),
        SavedItem.find({ userId: buyerId }).sort({ createdAt: -1 }),
        BuyerFollow.find({ buyerId }),
        Notification.find({ $or: [{ userId: buyerId }, { userId: { $exists: false } }] }).sort({ createdAt: -1 }).limit(20),
        CommunityPost.find().sort({ createdAt: -1 }).limit(10),
      ]);
      if (dbProfile) profile = dbProfile;
      orders = dbOrders;
      saved = dbSaved;
      follows = dbFollows;
      notifications = dbNotifs;
      communityPosts = dbPosts;
    }

    res.json({
      success: true,
      domain: "buyer",
      connected: isConnected,
      buyerId,
      profile,
      orders,
      savedItems: saved,
      followedSellers: follows,
      notifications,
      communityPosts,
      metrics: {
        totalOrders: orders.length,
        savedCount: saved.length,
        followedSellersCount: follows.length,
        ecoPoints: profile?.ecoPoints || 1420,
        co2SavedKg: profile?.co2SavedKg || 48.4,
        waterSavedLitres: profile?.waterSavedLitres || 3820,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/profile - Buyer profile
router.get("/profile", async (req, res) => {
  try {
    const buyerId = req.query.buyerId || "buyer-001";
    let buyer = await Buyer.findOne({ buyerId });
    if (!buyer) {
      buyer = await Buyer.findOne();
    }
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/buyer/profile - Update buyer shipping address or name
router.put("/profile", async (req, res) => {
  try {
    const buyerId = req.body.buyerId || "buyer-001";
    const updated = await Buyer.findOneAndUpdate(
      { buyerId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ success: true, profile: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/orders - Placed orders
router.get("/orders", async (req, res) => {
  try {
    const buyerId = req.headers["x-user-id"] || req.query.buyerId;
    const filter = buyerId ? { $or: [{ buyerId }, { userId: buyerId }] } : { buyerId: "buyer-001" };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/buyer/orders - Place a new order
router.post("/orders", async (req, res) => {
  try {
    const buyerId = req.headers["x-user-id"] || req.body.buyerId || "buyer-001";
    const newOrder = new Order({
      id: req.body.id || `#FC-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      trackingNumber: `FC-IND-${Math.floor(1000000 + Math.random() * 9000000)}`,
      ...req.body,
    });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/saved - Saved items
router.get("/saved", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.query.buyerId || "buyer-001";
    const saved = await SavedItem.find({ userId }).sort({ createdAt: -1 });
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/following - Followed sellers
router.get("/following", async (req, res) => {
  try {
    const buyerId = req.query.buyerId || "buyer-001";
    const follows = await BuyerFollow.find({ buyerId });
    res.json(follows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/buyer/following - Toggle follow/unfollow seller
router.post("/following", async (req, res) => {
  try {
    const { buyerId = "buyer-001", sellerId, sellerName, sellerHandle } = req.body;
    const existing = await BuyerFollow.findOne({ buyerId, sellerId });
    if (existing) {
      await BuyerFollow.deleteOne({ buyerId, sellerId });
      return res.json({ following: false, sellerId });
    } else {
      const created = await BuyerFollow.create({
        buyerId,
        sellerId,
        sellerName: sellerName || "FashionCycle Curator",
        sellerHandle: sellerHandle || "",
      });
      return res.status(201).json({ following: true, follow: created });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/notifications - Buyer notifications
router.get("/notifications", async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 });
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
