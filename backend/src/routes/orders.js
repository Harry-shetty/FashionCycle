import express from "express";
import { Order } from "../models/Order.js";
import { Impact } from "../models/Impact.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

function getUserId(req) {
  return (
    req.headers["x-user-id"] ||
    req.headers["x-user-email"] ||
    req.query.userId ||
    req.body?.buyerId ||
    req.body?.userId ||
    "guest"
  );
}

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (userId === "guest") {
      return res.json([]);
    }
    const userEmail = req.headers["x-user-email"];
    const isPrimary =
      userId === "usr-buyer-harsha" ||
      userId === "usr-buyer-01" ||
      userId === "default-user" ||
      userEmail === "harsha@gmail.com" ||
      userEmail === "sophia@fashioncycle.eco";

    const queries = [{ buyerId: userId }, { userId }];
    if (userEmail) queries.push({ buyerId: userEmail }, { userId: userEmail });
    if (isPrimary) {
      queries.push({ buyerId: "default-user" }, { userId: "default-user" });
      queries.push({ buyerId: { $exists: false } });
      queries.push({ buyerId: null });
      queries.push({ buyerId: "" });
    }

    const orders = await Order.find({ $or: queries }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { item, price, img, seller, savings, co2, water } = req.body;
    const userId = getUserId(req);
    const orderId = `#FC-00${Math.floor(100 + Math.random() * 900)}`;

    const numPrice = Number(price) || 50;
    const calcSavings = Number(savings) || Math.round(numPrice * 1.4);
    const garmentsPurchased = 1;
    const calcCo2 = Number(co2) || Number(Math.max(0, (garmentsPurchased * 12 * 0.70) - (garmentsPurchased * 1)).toFixed(1));
    const calcWater = Number(water) || Math.max(0, (garmentsPurchased * 2400 * 0.70) - (garmentsPurchased * 100));

    const newOrder = await Order.create({
      id: orderId,
      item,
      seller: seller || "FashionCycle Verified Seller",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      price: numPrice,
      status: "In Transit",
      img: img || "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format",
      trackingNumber: `FC-IND-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: "EcoCourier Express (100% Electric)",
      estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
      address: req.body?.address || "Flat 402, Green Meadows, Bengaluru, 560034",
      buyerId: userId,
      userId: userId,
    });

    // Update impact stats in MongoDB for this specific user
    await Impact.findOneAndUpdate(
      { userId },
      { $inc: { items: 1, co2: calcCo2, water: calcWater, money: calcSavings } },
      { upsert: true }
    );

    // Create notification in MongoDB for this specific user
    await Notification.create({
      id: `notif-${Date.now()}`,
      userId,
      icon: "🛍️",
      text: `Order ${orderId} placed for "${item}" · Saved ${calcSavings}₹ vs retail!`,
      time: "Just now",
      read: false,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/orders/:id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/orders (clear all orders collection)
router.delete("/", async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.json({ success: true, message: "All orders deleted from MongoDB", count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
