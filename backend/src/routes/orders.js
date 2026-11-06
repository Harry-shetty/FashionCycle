import express from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Impact } from "../models/Impact.js";
import { Notification } from "../models/Notification.js";
import { Listing } from "../models/Listing.js";

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

const HARSHA_BASE_ORDERS = [
  {
    id: "#FC-00412",
    item: "Vintage Levi's 501 Original Fit",
    seller: "Marco R.",
    date: "Sep 8, 2026",
    price: 54,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-8829104",
    carrier: "EcoCourier Express (100% Electric)",
    estimatedDelivery: "Delivered on Sep 11, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
    buyerId: "usr-buyer-harsha",
    userId: "usr-buyer-harsha",
    customer: "harsha@gmail.com",
    buyerEmail: "harsha@gmail.com",
  },
  {
    id: "#FC-00398",
    item: "Ganni Pastel Check Ruffle Blouse",
    seller: "Ana K.",
    date: "Sep 2, 2026",
    price: 67,
    status: "In Transit",
    img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-9912034",
    carrier: "BlueDart CarbonNeutral",
    estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
    buyerId: "usr-buyer-harsha",
    userId: "usr-buyer-harsha",
    customer: "harsha@gmail.com",
    buyerEmail: "harsha@gmail.com",
  },
  {
    id: "#FC-00371",
    item: "Bottega Veneta Mule Heels",
    seller: "Lea B.",
    date: "Aug 25, 2026",
    price: 210,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-7734190",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Aug 28, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
    buyerId: "usr-buyer-harsha",
    userId: "usr-buyer-harsha",
    customer: "harsha@gmail.com",
    buyerEmail: "harsha@gmail.com",
  },
  {
    id: "#FC-00289",
    item: "Organic Linen Oversized Shirt",
    seller: "Priya Archives",
    date: "Aug 12, 2026",
    price: 75,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-6619021",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Aug 15, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
    buyerId: "usr-buyer-harsha",
    userId: "usr-buyer-harsha",
    customer: "harsha@gmail.com",
    buyerEmail: "harsha@gmail.com",
  },
];

const SELLER_BASE_ORDERS = [
  {
    id: "#FC-00520",
    item: "Vintage Ralph Lauren Wool Blazer",
    seller: "Admin Seller Studio",
    customer: "Sophia Laurent (Bengaluru)",
    date: "Nov 3, 2026",
    price: 85,
    status: "In Transit",
    img: "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-9941088",
    carrier: "EcoCourier Express (100% Electric)",
    estimatedDelivery: "Out for delivery to buyer today",
    address: "Flat 204, Indiranagar 12th Main, Bengaluru, 560038",
    sellerId: "usr-seller-admin",
  },
  {
    id: "#FC-00488",
    item: "Toteme Silk Midi Dress",
    seller: "Admin Seller Studio",
    customer: "Priya Sen (Mumbai)",
    date: "Oct 28, 2026",
    price: 180,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1664076458686-3449062080ac?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-7782194",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered & verified on Oct 30, 2026",
    address: "Tower 3, Bandra West, Mumbai, 400050",
    sellerId: "usr-seller-admin",
  },
  {
    id: "#FC-00432",
    item: "Yves Saint Laurent Rive Gauche Trench",
    seller: "Admin Seller Studio",
    customer: "Ananya Verma (Delhi)",
    date: "Oct 15, 2026",
    price: 480,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-6549012",
    carrier: "BlueDart CarbonNeutral",
    estimatedDelivery: "Delivered & verified on Oct 18, 2026",
    address: "Sector 14, Greater Kailash 1, New Delhi, 110048",
    sellerId: "usr-seller-admin",
  },
  {
    id: "#FC-00395",
    item: "Celine Triomphe Wool Flannel Trousers",
    seller: "Admin Seller Studio",
    customer: "Kavya Nambiar (Kochi)",
    date: "Oct 02, 2026",
    price: 320,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-5412980",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered & verified on Oct 05, 2026",
    address: "Marine Drive Enclave, Kochi, 682011",
    sellerId: "usr-seller-admin",
  },
  {
    id: "#FC-00340",
    item: "Issey Miyake Pleats Please Top",
    seller: "Admin Seller Studio",
    customer: "Rohan Kapoor (Pune)",
    date: "Sep 18, 2026",
    price: 260,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-4321908",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Sep 21, 2026",
    address: "Koregaon Park Lane 7, Pune, 411001",
    sellerId: "usr-seller-admin",
  },
];

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

    const isSeller =
      userId === "usr-seller-admin" ||
      userEmail === "admin@gmail.com" ||
      req.headers["x-user-role"] === "seller";

    const queries = [{ buyerId: userId }, { userId }];
    if (userEmail) {
      queries.push(
        { buyerId: userEmail },
        { userId: userEmail },
        { buyerEmail: userEmail },
        { customer: userEmail }
      );
    }
    if (isSeller) {
      queries.push(
        { sellerId: userId },
        { seller: "Admin Seller Studio" },
        { seller: "FashionCycle Verified Seller" },
        { seller: userEmail }
      );
    }
    if (isPrimary) {
      queries.push(
        { buyerId: "usr-buyer-harsha" },
        { userId: "usr-buyer-harsha" },
        { buyerId: "default-user" },
        { userId: "default-user" },
        { customer: "harsha@gmail.com" },
        { buyerEmail: "harsha@gmail.com" },
        { buyerId: { $exists: false } },
        { buyerId: null },
        { buyerId: "" }
      );
    }

    let orders = await Order.find({ $or: queries }).sort({ createdAt: -1 });

    // Ensure baseline demo orders are always persisted and present in MongoDB
    if (isPrimary) {
      const existingIds = new Set(orders.map((o) => o.id));
      const missingBase = HARSHA_BASE_ORDERS.filter((b) => !existingIds.has(b.id));
      if (missingBase.length > 0) {
        Order.insertMany(missingBase).catch(() => {});
        orders = [...orders, ...missingBase];
      }
    } else if (isSeller) {
      const existingIds = new Set(orders.map((o) => o.id));
      const missingSeller = SELLER_BASE_ORDERS.filter((b) => !existingIds.has(b.id));
      if (missingSeller.length > 0) {
        Order.insertMany(missingSeller).catch(() => {});
        orders = [...orders, ...missingSeller];
      }
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { item, price, img, seller, savings, co2, water, address, trackingNumber, carrier, estimatedDelivery, status, listingId, sellerId } = req.body;
    const userId = getUserId(req);
    const userEmail = req.headers["x-user-email"] || req.body?.userEmail || req.body?.buyerEmail || "";
    const customerName = req.body?.customer || req.body?.shippingName || (userEmail ? userEmail.split("@")[0] : "Valued Buyer");
    
    // Generate unique order ID or use provided one
    const orderId = req.body?.id || `#FC-${Math.floor(10000 + Math.random() * 90000)}`;

    const numPrice = Number(price) || 50;
    const calcSavings = Number(savings) || Math.round(numPrice * 1.4);
    const garmentsPurchased = 1;
    const calcCo2 = Number(co2) || Number(Math.max(0, (garmentsPurchased * 12 * 0.70) - (garmentsPurchased * 1)).toFixed(1));
    const calcWater = Number(water) || Math.max(0, (garmentsPurchased * 2400 * 0.70) - (garmentsPurchased * 100));

    const newOrder = await Order.create({
      id: orderId,
      item,
      seller: seller || "FashionCycle Verified Seller",
      sellerId: sellerId || "seller-1",
      date: req.body?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      price: numPrice,
      status: status || "In Transit",
      img: img || "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format",
      trackingNumber: trackingNumber || `FC-IND-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: carrier || "EcoCourier Express (100% Electric)",
      estimatedDelivery: estimatedDelivery || "Arriving Tomorrow by 5:00 PM",
      address: address || "Flat 402, Green Meadows, Bengaluru, 560034",
      customer: customerName,
      buyerId: req.body?.buyerId || userId,
      userId: userId,
      buyerEmail: userEmail,
      listingId: listingId,
    });

    // Mark listing as sold in MongoDB if listingId is provided
    if (listingId) {
      await Listing.findOneAndUpdate(
        { id: listingId },
        { $set: { sold: true } }
      ).catch((err) => console.warn("Notice: listing sold status update:", err.message));
    }

    // Update impact stats in MongoDB for this specific user
    await Impact.findOneAndUpdate(
      { userId },
      { $inc: { items: 1, co2: calcCo2, water: calcWater, money: calcSavings } },
      { upsert: true }
    ).catch(() => {});

    // Create notification in MongoDB for this specific user
    await Notification.create({
      id: `notif-${Date.now()}`,
      userId,
      icon: "🛍️",
      text: `Order ${orderId} placed for "${item}" · Saved ${calcSavings}₹ vs retail!`,
      time: "Just now",
      read: false,
    }).catch(() => {});

    // Broadcast new order via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("order_created", newOrder);
    }

    console.log(`📦 MongoDB Order created: ${orderId} for "${item}" (${numPrice}₹)`);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error);
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
