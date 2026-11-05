import express from "express";
import mongoose from "mongoose";
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

// Helper to match order by various ID formats (with or without #)
function buildOrderQuery(targetId) {
  if (!targetId) return null;
  const decoded = decodeURIComponent(String(targetId)).trim();
  const raw = decoded.replace(/^#/, "");
  const withHash = `#${raw}`;

  const queries = [
    { id: decoded },
    { id: withHash },
    { id: raw },
    { trackingNumber: decoded },
  ];

  if (mongoose.Types.ObjectId.isValid(decoded)) {
    queries.push({ _id: new mongoose.Types.ObjectId(decoded) });
  }

  return { $or: queries };
}

// DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    const rawId = req.params.id || req.body?.id || req.body?.orderId || req.query?.id;
    const query = buildOrderQuery(rawId);
    if (!query) {
      return res.status(400).json({ error: "Missing order ID" });
    }

    const deleted = await Order.findOneAndDelete(query);
    if (!deleted) {
      console.warn(`Order cancel notice: ${rawId} not found in MongoDB`);
      return res.status(404).json({ error: "Order not found in MongoDB" });
    }

    console.log(`🗑️ Deleted order ${deleted.id} (${deleted.item}) from MongoDB Atlas`);

    // Decrement impact metrics in MongoDB
    const userId = deleted.buyerId || deleted.userId || getUserId(req);
    if (userId && userId !== "guest") {
      const garmentsPurchased = 1;
      const calcCo2 = Number(Math.max(0, (garmentsPurchased * 12 * 0.70) - (garmentsPurchased * 1)).toFixed(1));
      const calcWater = Math.max(0, (garmentsPurchased * 2400 * 0.70) - (garmentsPurchased * 100));
      const calcSavings = Math.round((Number(deleted.price) || 50) * 1.4);

      await Impact.findOneAndUpdate(
        { userId },
        { 
          $inc: { 
            items: -1, 
            co2: -calcCo2, 
            water: -calcWater, 
            money: -calcSavings 
          } 
        }
      ).catch(() => {});
    }

    // Broadcast cancellation over Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("order_cancelled", { orderId: deleted.id });
    }

    res.json({ success: true, message: `Order ${deleted.id} cancelled and removed from MongoDB`, order: deleted });
  } catch (error) {
    console.error("Order delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/orders (delete single order via body/query, or wipe all if explicit)
router.delete("/", async (req, res) => {
  try {
    const targetId = req.body?.id || req.body?.orderId || req.query?.id || req.query?.orderId;
    if (targetId) {
      const query = buildOrderQuery(targetId);
      const deleted = await Order.findOneAndDelete(query);
      if (!deleted) return res.status(404).json({ error: "Order not found in MongoDB" });

      const io = req.app.get("io");
      if (io) {
        io.emit("order_cancelled", { orderId: deleted.id });
      }

      console.log(`🗑️ Deleted order ${deleted.id} via root DELETE /api/orders`);
      return res.json({ success: true, message: `Order ${deleted.id} cancelled`, order: deleted });
    }

    if (req.query?.wipeAll === "true" || req.body?.wipeAll === true) {
      const result = await Order.deleteMany({});
      return res.json({ success: true, message: "All orders cleared", count: result.deletedCount });
    }

    return res.status(400).json({ error: "Specify order id to delete or wipeAll=true" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
