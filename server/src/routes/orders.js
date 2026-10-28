import express from "express";
import { Order } from "../models/Order.js";
import { Impact } from "../models/Impact.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { item, price, img, seller } = req.body;
    const orderId = `#FC-00${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = await Order.create({
      id: orderId,
      item,
      seller: seller || "FashionCycle Verified Seller",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      price: Number(price) || 50,
      status: "Processing",
      img: img || "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format",
      trackingNumber: `FC-IND-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: "EcoCourier Express (100% Electric)",
      estimatedDelivery: "Estimated delivery in 2-3 business days",
      address: "Flat 402, Green Meadows, Bengaluru, 560034",
      buyerId: "user-current",
    });

    // Update impact stats in MongoDB
    await Impact.findOneAndUpdate(
      { userId: "default-user" },
      { $inc: { items: 1, co2: 4.1, water: 450, money: Number(price) || 50 } },
      { upsert: true }
    );

    // Create notification in MongoDB
    await Notification.create({
      id: `notif-${Date.now()}`,
      icon: "🛍️",
      text: `Order ${orderId} placed for "${item}" saved to MongoDB!`,
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
