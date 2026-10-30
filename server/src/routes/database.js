import express from "express";
import mongoose from "mongoose";
import { Listing } from "../models/Listing.js";
import { Order } from "../models/Order.js";
import { SavedItem } from "../models/SavedItem.js";
import { Impact } from "../models/Impact.js";
import { Notification } from "../models/Notification.js";
import { Newsletter } from "../models/Newsletter.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { Leaderboard } from "../models/Leaderboard.js";
import { CommunityPost } from "../models/CommunityPost.js";
import { User } from "../models/User.js";
import { seedDatabase } from "../seed.js";

const router = express.Router();

const MODEL_MAP = {
  listings: Listing,
  orders: Order,
  saveditems: SavedItem,
  impacts: Impact,
  notifications: Notification,
  newsletters: Newsletter,
  chatmessages: ChatMessage,
  leaderboards: Leaderboard,
  communityposts: CommunityPost,
  users: User,
};

// GET /api/database/collections - List all collections with stats
router.get("/collections", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const stats = [];

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      stats.push({
        name: col.name,
        type: col.type,
        count,
        status: count > 0 ? "active" : "empty",
      });
    }

    res.json({
      connected: mongoose.connection.readyState === 1,
      database: db.databaseName,
      host: mongoose.connection.host,
      totalCollections: stats.length,
      collections: stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/database/collections/:name/create - Create / seed a specific collection
router.post("/collections/:name/create", async (req, res) => {
  try {
    const colName = req.params.name.toLowerCase();
    const Model = MODEL_MAP[colName];

    if (!Model) {
      // Create an empty collection via native driver if no model
      await mongoose.connection.db.createCollection(colName);
      return res.status(201).json({ success: true, message: `Collection "${colName}" created` });
    }

    // Seed the specific collection
    if (colName === "listings") {
      await seedDatabase();
    } else {
      // Trigger a find or dummy create to ensure collection exists
      await Model.init();
    }

    const count = await Model.countDocuments();
    res.status(201).json({
      success: true,
      message: `Collection "${colName}" ready in MongoDB`,
      count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/database/collections/:name - Drop / delete a collection completely
router.delete("/collections/:name", async (req, res) => {
  try {
    const colName = req.params.name.toLowerCase();
    const db = mongoose.connection.db;

    const collections = await db.listCollections({ name: colName }).toArray();
    if (collections.length === 0) {
      return res.status(404).json({ error: `Collection "${colName}" does not exist in MongoDB` });
    }

    await db.dropCollection(colName);
    res.json({
      success: true,
      message: `Collection "${colName}" deleted from MongoDB`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/database/seed - Seed all collections with initial data
router.post("/seed", async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: "All FashionCycle collections seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/database/wipe - Wipe all collections
router.delete("/wipe", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const dropped = [];

    for (const col of collections) {
      // Preserve system collections if any
      if (!col.name.startsWith("system.")) {
        await db.dropCollection(col.name);
        dropped.push(col.name);
      }
    }

    res.json({
      success: true,
      message: "All collections dropped from MongoDB",
      dropped,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

