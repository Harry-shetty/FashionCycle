import express from "express";
import { ChatMessage } from "../models/ChatMessage.js";

const router = express.Router();

// GET /api/chatbot/history - Retrieve full chatbot history
router.get("/history", async (req, res) => {
  try {
    const userId = req.query.userId || "default-user";
    const messages = await ChatMessage.find({
      $or: [{ userId }, { userId: "default-user" }, { userId: { $exists: false } }],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chatbot history:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chatbot/message - Save a single message (user or bot)
router.post("/message", async (req, res) => {
  try {
    const { id, sender, text, images, details, timestamp, userId = "default-user" } = req.body;

    if (!text || !sender) {
      return res.status(400).json({ error: "Sender and text are required." });
    }

    const messageId = id || `${sender}-${Date.now()}`;

    const savedMessage = await ChatMessage.findOneAndUpdate(
      { id: messageId },
      {
        id: messageId,
        sender,
        text,
        images: images || [],
        details: details || {},
        timestamp: timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        userId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error saving chatbot message:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chatbot/batch - Save multiple messages at once
router.post("/batch", async (req, res) => {
  try {
    const { messages, userId = "default-user" } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required." });
    }

    const ops = messages.map((m) => ({
      updateOne: {
        filter: { id: m.id || `${m.sender}-${Date.now()}` },
        update: {
          $set: {
            id: m.id || `${m.sender}-${Date.now()}`,
            sender: m.sender,
            text: m.text,
            images: m.images || [],
            details: m.details || {},
            timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            userId,
          },
        },
        upsert: true,
      },
    }));

    await ChatMessage.bulkWrite(ops);
    res.status(201).json({ success: true, count: messages.length });
  } catch (error) {
    console.error("Error batch saving chatbot messages:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/chatbot/history - Clear all chatbot history
router.delete("/history", async (req, res) => {
  try {
    const userId = req.query.userId || "default-user";
    await ChatMessage.deleteMany({
      $or: [{ userId }, { userId: "default-user" }, { userId: { $exists: false } }],
    });
    res.json({ success: true, message: "Chatbot history cleared from MongoDB" });
  } catch (error) {
    console.error("Error clearing chatbot history:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

