import express from "express";
import mongoose from "mongoose";
import { Seller } from "../models/Seller.js";
import { Listing } from "../models/Listing.js";
import { SellerSale } from "../models/SellerSale.js";
import { ChatMessage } from "../models/ChatMessage.js";

const router = express.Router();

const MOCK_SELLER = {
  sellerId: "seller-1",
  name: "Priya Nair",
  handle: "@priyaonrepeat",
  avatar: "PN",
  storeName: "Priya Archives & Tailoring",
  bio: "Official Sustainable Studio on FashionCycle. Specializing in archival vintage, verified woolens, authenticated designer tailoring, and zero-plastic eco shipments.",
  city: "Bengaluru, IN",
  rating: 5.0,
  followersCount: 1620,
  piecesCirculated: 42,
  co2Diverted: 186.4,
  totalEarnings: 4280,
  badge: "🏆 #1 Top Merchant",
  isVerified: true,
};

// GET /api/seller/all - Complete bundle of everything related to the seller
router.get("/all", async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const sellerId = req.query.sellerId || "seller-1";

    let profile = MOCK_SELLER;
    let listings = [];
    let sales = [];
    let appraisals = [];

    if (isConnected) {
      const [dbProfile, dbListings, dbSales, dbAppraisals] = await Promise.all([
        Seller.findOne({ sellerId }) || Seller.findOne(),
        Listing.find({ sellerId }).sort({ createdAt: -1 }),
        SellerSale.find({ sellerId }).sort({ createdAt: -1 }),
        ChatMessage.find({ sender: "user" }).sort({ createdAt: -1 }).limit(20),
      ]);
      if (dbProfile) profile = dbProfile;
      listings = dbListings;
      sales = dbSales;
      appraisals = dbAppraisals;
    }

    res.json({
      success: true,
      domain: "seller",
      connected: isConnected,
      sellerId,
      profile,
      listings,
      sales,
      appraisals,
      analytics: {
        totalListings: listings.length,
        soldListings: listings.filter((l) => l.sold).length,
        activeListings: listings.filter((l) => !l.sold).length,
        totalSalesCount: sales.length,
        totalRevenue: sales.reduce((sum, s) => sum + (s.price || 0), 0),
        piecesCirculated: profile?.piecesCirculated || 42,
        co2DivertedKg: profile?.co2Diverted || 186.4,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/seller/profile - Seller profile details
router.get("/profile", async (req, res) => {
  try {
    const sellerId = req.query.sellerId || "seller-1";
    let seller = await Seller.findOne({ sellerId });
    if (!seller) {
      seller = await Seller.findOne();
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/seller/profile - Update seller bio / store settings
router.put("/profile", async (req, res) => {
  try {
    const sellerId = req.body.sellerId || "seller-1";
    const updateData = req.body;
    
    const updated = await Seller.findOneAndUpdate(
      { sellerId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ success: true, profile: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/seller/listings - Seller's items
router.get("/listings", async (req, res) => {
  try {
    const sellerId = req.query.sellerId || "seller-1";
    const listings = await Listing.find({ sellerId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/seller/listings - Create item in seller_listings
router.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing({
      id: req.body.id || `lst-${Date.now()}`,
      sellerId: req.body.sellerId || "seller-1",
      ...req.body,
    });
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/seller/sales - Orders to fulfill
router.get("/sales", async (req, res) => {
  try {
    const sellerId = req.query.sellerId || "seller-1";
    const sales = await SellerSale.find({ sellerId }).sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/seller/sales/:id - Update sale fulfillment status
router.patch("/sales/:id", async (req, res) => {
  try {
    const updated = await SellerSale.findOneAndUpdate(
      { saleId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/seller/appraisals - AI CycleBot valuations for seller
router.get("/appraisals", async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: -1 }).limit(30);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
