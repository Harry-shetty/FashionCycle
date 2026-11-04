import express from "express";
import { Notification } from "../models/Notification.js";

const router = express.Router();

function getUserId(req) {
  return (
    req.headers["x-user-id"] ||
    req.headers["x-user-email"] ||
    req.query.userId ||
    req.body?.userId ||
    "guest"
  );
}

// GET /api/notifications
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
      userEmail === "harsha@gmail.com";

    const filter = isPrimary
      ? {
          $or: [
            { userId },
            ...(userEmail ? [{ userId: userEmail }] : []),
            { userId: "usr-buyer-harsha" },
            { userId: "default-user" },
            { userId: { $exists: false } },
          ],
        }
      : { userId };

    const notifs = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { read: true } },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/notifications/:id - Delete single notification
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Notification not found" });
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notifications (clear all)
router.delete("/", async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
