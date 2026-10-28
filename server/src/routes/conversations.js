import express from "express";
import { Conversation } from "../models/Conversation.js";

const router = express.Router();

// GET /api/conversations
router.get("/", async (req, res) => {
  try {
    const convos = await Conversation.find().sort({ updatedAt: -1 });
    res.json(convos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/conversations
router.post("/", async (req, res) => {
  try {
    const { name, itemContext } = req.body;
    let convo = await Conversation.findOne({ name });

    if (!convo) {
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      const handle = `@${name.toLowerCase().replace(/\s+/g, "")}`;

      convo = await Conversation.create({
        id: `conv-${Date.now()}`,
        name,
        handle,
        avatar: initials,
        unread: false,
        time: "Just now",
        itemContext: itemContext || "",
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "them",
            text: `Hi! Thanks for reaching out regarding "${itemContext}". How can I help?`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      });
    }

    res.status(201).json(convo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/conversations/:id/messages
router.post("/:id/messages", async (req, res) => {
  try {
    const { text, sender = "me" } = req.body;
    const convo = await Conversation.findOne({ id: req.params.id });
    if (!convo) return res.status(404).json({ error: "Conversation not found" });

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      time: timeFormatted,
      createdAt: now,
    };

    convo.messages.push(newMsg);
    convo.time = "Just now";
    convo.unread = false;
    await convo.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("message_received", {
        conversationId: convo.id,
        message: newMsg,
      });
      io.emit("conversation_updated", convo);
    }

    res.status(201).json(convo);

    // If sender is 'me', schedule intelligent seller reply via Socket.IO
    if (sender === "me") {
      // 1. Emit typing indicator after 450ms
      setTimeout(() => {
        if (io) {
          io.emit("user_typing", {
            conversationId: convo.id,
            handle: convo.handle,
            isTyping: true,
          });
        }
      }, 450);

      // 2. Deliver message with real-time timestamp after 1500ms
      setTimeout(async () => {
        try {
          const lower = text.toLowerCase();
          let reply = "Thanks for the message! Let me know if you need any extra details or measurements 🌿";
          if (lower.includes("available")) {
            reply = "Yes, absolutely! It's still available, carefully stored, and ready to ship ✨";
          } else if (lower.includes("₹") || lower.includes("price") || lower.includes("offer") || lower.includes("do")) {
            reply = "That offer sounds very reasonable! Send the official price offer and I'll accept right away 🤝";
          } else if (lower.includes("ship") || lower.includes("tomorrow") || lower.includes("courier")) {
            reply = "Yes! If you place the order today, I'll drop it off at our zero-emission hub by 11 AM tomorrow 📦";
          } else if (lower.includes("photo") || lower.includes("close")) {
            reply = "Just uploaded high-res closeups of the fabric tags, lining, and craftsmanship ✨";
          } else if (lower.includes("authentic") || lower.includes("real")) {
            reply = "100% certified authentic! Accompanied by our circular blockchain authenticity verification 🌱";
          } else if (lower.includes("voice note")) {
            reply = "Heard your voice note loud and clear! Sounds great, let's proceed 🙌";
          }

          const currentConvo = await Conversation.findOne({ id: req.params.id });
          if (currentConvo) {
            const replyNow = new Date();
            const replyTimeFormatted = replyNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            const sellerMsg = {
              id: `msg-rep-${Date.now()}`,
              sender: "them",
              text: reply,
              time: replyTimeFormatted,
              createdAt: replyNow,
            };

            currentConvo.messages.push(sellerMsg);
            currentConvo.time = "Just now";
            await currentConvo.save();

            if (io) {
              io.emit("user_typing", {
                conversationId: currentConvo.id,
                handle: currentConvo.handle,
                isTyping: false,
              });
              io.emit("message_received", {
                conversationId: currentConvo.id,
                message: sellerMsg,
              });
              io.emit("conversation_updated", currentConvo);
            }
          }
        } catch (e) {
          console.error("Error saving real-time automated response:", e);
        }
      }, 1500);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/conversations/:id/read
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      { $set: { unread: false } },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/conversations/:id - Delete single conversation
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Conversation.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Conversation not found" });
    res.json({ success: true, message: "Conversation deleted from MongoDB" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/conversations - Clear all conversations collection
router.delete("/", async (req, res) => {
  try {
    const result = await Conversation.deleteMany({});
    res.json({ success: true, message: "All conversations deleted from MongoDB", count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
