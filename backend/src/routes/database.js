import express from "express";
import mongoose from "mongoose";
import { Seller } from "../models/Seller.js";
import { SellerSale } from "../models/SellerSale.js";
import { Listing } from "../models/Listing.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { Buyer } from "../models/Buyer.js";
import { BuyerFollow } from "../models/BuyerFollow.js";
import { Order } from "../models/Order.js";
import { SavedItem } from "../models/SavedItem.js";
import { Notification } from "../models/Notification.js";
import { CommunityPost } from "../models/CommunityPost.js";
import { Impact } from "../models/Impact.js";
import { Leaderboard } from "../models/Leaderboard.js";
import { Newsletter } from "../models/Newsletter.js";
import { User } from "../models/User.js";
import { seedDatabase } from "../seed.js";

const router = express.Router();

export const DOMAIN_STRUCTURE = {
  seller: {
    title: "Seller Domain",
    description: "Collections holding all merchant, store inventory, sales, and AI styling appraisals",
    collections: [
      { name: "seller_profiles", model: Seller, description: "Seller bio, credentials, badges, metrics & ratings" },
      { name: "seller_listings", model: Listing, description: "Garments & inventory for sale in the circular marketplace" },
      { name: "seller_sales", model: SellerSale, description: "Orders fulfilled by sellers, shipping tracking & payouts" },
      { name: "seller_appraisals", model: ChatMessage, description: "AI CycleBot appraisal valuations, style tags & CO₂ analysis" },
    ],
  },
  buyer: {
    title: "Buyer Domain",
    description: "Collections holding all customer orders, wishlists, followed curators, and alerts",
    collections: [
      { name: "buyer_profiles", model: Buyer, description: "Buyer eco score, delivery addresses & collector tier" },
      { name: "buyer_orders", model: Order, description: "Customer purchases, tracking numbers & eco courier shipments" },
      { name: "buyer_saveditems", model: SavedItem, description: "Customer bookmarked garments & saved wishlist pieces" },
      { name: "buyer_follows", model: BuyerFollow, description: "Curators and sustainable stores followed by buyers" },
      { name: "buyer_notifications", model: Notification, description: "Live drop alerts, price offers & shipment status updates" },
      { name: "buyer_communityposts", model: CommunityPost, description: "Collector voices, styling stories & sustainable reviews" },
    ],
  },
  platform: {
    title: "Platform Core",
    description: "Global impact metrics, circular leaderboards, and newsletter subscriptions",
    collections: [
      { name: "impacts", model: Impact, description: "Collective CO₂, water diverted & financial savings stats" },
      { name: "leaderboards", model: Leaderboard, description: "Monthly & all-time circular community rankings" },
      { name: "newsletters", model: Newsletter, description: "Subscriber emails for drops and circular fashion news" },
    ],
  },
};

const MODEL_MAP = {
  seller_profiles: Seller,
  sellers: Seller,
  seller_listings: Listing,
  listings: Listing,
  seller_sales: SellerSale,
  seller_appraisals: ChatMessage,
  chatmessages: ChatMessage,
  buyer_profiles: Buyer,
  buyers: Buyer,
  buyer_orders: Order,
  orders: Order,
  buyer_saveditems: SavedItem,
  saveditems: SavedItem,
  buyer_follows: BuyerFollow,
  buyer_notifications: Notification,
  notifications: Notification,
  buyer_communityposts: CommunityPost,
  communityposts: CommunityPost,
  impacts: Impact,
  leaderboards: Leaderboard,
  newsletters: Newsletter,
  users: User,
};

// GET /api/database/structure - Categorized structure (Seller vs Buyer)
router.get("/structure", async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const db = isConnected ? mongoose.connection.db : null;

    const result = {
      connected: isConnected,
      database: db ? db.databaseName : "fashioncycle (offline/mock)",
      host: mongoose.connection.host || "Atlas / Local",
      domains: {},
    };

    for (const [domainKey, domain] of Object.entries(DOMAIN_STRUCTURE)) {
      result.domains[domainKey] = {
        title: domain.title,
        description: domain.description,
        collections: [],
      };

      for (const col of domain.collections) {
        let count = 0;
        try {
          if (isConnected && db) {
            count = await col.model.countDocuments();
          }
        } catch {
          count = 0;
        }

        result.domains[domainKey].collections.push({
          name: col.name,
          description: col.description,
          count,
          status: count > 0 ? "active" : "empty",
        });
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/database/collections - List all collections with stats
router.get("/collections", async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const db = isConnected ? mongoose.connection.db : null;
    const stats = [];

    if (isConnected && db) {
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        
        // Determine domain
        let domain = "platform";
        if (col.name.startsWith("seller_") || col.name === "sellers" || col.name === "listings") domain = "seller";
        else if (col.name.startsWith("buyer_") || col.name === "buyers" || col.name === "orders" || col.name === "saveditems") domain = "buyer";

        stats.push({
          name: col.name,
          domain,
          type: col.type,
          count,
          status: count > 0 ? "active" : "empty",
        });
      }
    } else {
      // Return predefined structure schema when disconnected
      for (const [dKey, dVal] of Object.entries(DOMAIN_STRUCTURE)) {
        for (const col of dVal.collections) {
          stats.push({
            name: col.name,
            domain: dKey,
            type: "collection",
            count: 0,
            status: "ready",
          });
        }
      }
    }

    res.json({
      connected: isConnected,
      database: db ? db.databaseName : "fashioncycle",
      host: mongoose.connection.host || "offline",
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
      await mongoose.connection.db.createCollection(colName);
      return res.status(201).json({ success: true, message: `Collection "${colName}" created in MongoDB` });
    }

    await Model.init();
    await seedDatabase();
    const count = await Model.countDocuments();

    res.status(201).json({
      success: true,
      message: `Collection "${colName}" initialized in MongoDB`,
      count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/database/collections/:name/alter - Alter a collection (rename, reindex, or add options)
router.patch("/collections/:name/alter", async (req, res) => {
  try {
    const colName = req.params.name.toLowerCase();
    const { newName, reindex } = req.body;
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const existing = await db.listCollections({ name: colName }).toArray();
    if (existing.length === 0) {
      return res.status(404).json({ error: `Collection "${colName}" does not exist in MongoDB` });
    }

    const operations = [];

    // Rename collection if requested
    if (newName && newName !== colName) {
      await db.renameCollection(colName, newName);
      operations.push(`Renamed "${colName}" to "${newName}"`);
    }

    // Reindex collection if requested
    if (reindex) {
      const targetName = newName || colName;
      await db.collection(targetName).reIndex();
      operations.push(`Reindexed collection "${targetName}"`);
    }

    res.json({
      success: true,
      message: `Collection "${colName}" altered successfully`,
      operations,
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

    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const collections = await db.listCollections({ name: colName }).toArray();
    if (collections.length === 0) {
      return res.status(404).json({ error: `Collection "${colName}" does not exist in MongoDB` });
    }

    await db.dropCollection(colName);
    res.json({
      success: true,
      message: `Collection "${colName}" dropped from MongoDB`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/database/seed - Seed all collections with structured Seller and Buyer data
router.post("/seed", async (req, res) => {
  try {
    await seedDatabase();
    res.json({ 
      success: true, 
      message: "All FashionCycle collections seeded into Seller & Buyer domains successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/database/wipe - Wipe all collections
router.delete("/wipe", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }

    const collections = await db.listCollections().toArray();
    const dropped = [];

    for (const col of collections) {
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
