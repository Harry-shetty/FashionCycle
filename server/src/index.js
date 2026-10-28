import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./seed.js";

import listingsRoutes from "./routes/listings.js";
import ordersRoutes from "./routes/orders.js";
import conversationsRoutes from "./routes/conversations.js";
import savedRoutes from "./routes/saved.js";
import impactRoutes from "./routes/impact.js";
import notificationsRoutes from "./routes/notifications.js";
import newsletterRoutes from "./routes/newsletter.js";
import chatbotRoutes from "./routes/chatbot.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import communityRoutes from "./routes/community.js";
import databaseRoutes from "./routes/database.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Setup Socket.IO with CORS
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// Attach io to express app
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/listings", listingsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/database", databaseRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: "MongoDB (FashionCycle)",
    realtime: "Socket.IO Active",
    timestamp: new Date().toISOString(),
  });
});

import { Conversation } from "./models/Conversation.js";

// Socket.IO active connections tracker
const activeSockets = new Set();

// Socket.IO event handling
io.on("connection", (socket) => {
  activeSockets.add(socket.id);
  io.emit("users_online", { count: activeSockets.size });
  console.log(`⚡ Socket.IO client connected: ${socket.id} (Total: ${activeSockets.size})`);

  // Join / Leave conversation rooms
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
  });

  // Direct real-time message sending via Socket.IO
  socket.on("send_message", async ({ conversationId, text, sender = "me" }, callback) => {
    try {
      const convo = await Conversation.findOne({ id: conversationId });
      if (!convo) {
        if (callback) callback({ error: "Conversation not found" });
        return;
      }

      const now = new Date();
      const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newMsg = {
        id: `msg-${Date.now()}`,
        sender,
        text,
        time: timeFormatted,
        reaction: "",
        createdAt: now,
      };

      convo.messages.push(newMsg);
      convo.time = "Just now";
      convo.unread = false;
      await convo.save();

      io.emit("message_received", { conversationId, message: newMsg });
      io.emit("conversation_updated", convo);

      if (callback) callback({ success: true, message: newMsg });

      // Intelligent seller reply scheduled over Socket.IO
      if (sender === "me") {
        setTimeout(() => {
          io.emit("user_typing", { conversationId, handle: convo.handle, isTyping: true });
        }, 400);

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

            const currentConvo = await Conversation.findOne({ id: conversationId });
            if (currentConvo) {
              const replyNow = new Date();
              const replyTimeFormatted = replyNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const sellerMsg = {
                id: `msg-rep-${Date.now()}`,
                sender: "them",
                text: reply,
                time: replyTimeFormatted,
                reaction: "",
                createdAt: replyNow,
              };

              currentConvo.messages.push(sellerMsg);
              currentConvo.time = "Just now";
              await currentConvo.save();

              io.emit("user_typing", { conversationId, handle: currentConvo.handle, isTyping: false });
              io.emit("message_received", { conversationId, message: sellerMsg });
              io.emit("conversation_updated", currentConvo);
            }
          } catch (e) {
            console.error("Socket seller reply error:", e);
          }
        }, 1400);
      }
    } catch (err) {
      console.error("Socket send_message error:", err);
      if (callback) callback({ error: err.message });
    }
  });

  // Real-time message reactions
  socket.on("message_reaction", async ({ conversationId, messageId, emoji }) => {
    try {
      const convo = await Conversation.findOne({ id: conversationId });
      if (convo) {
        const msg = convo.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.reaction = msg.reaction === emoji ? "" : emoji;
          await convo.save();
          io.emit("message_reaction_updated", {
            conversationId,
            messageId,
            emoji: msg.reaction,
          });
        }
      }
    } catch (err) {
      console.error("Socket reaction error:", err);
    }
  });

  // Mark conversation as read
  socket.on("mark_read", async ({ conversationId }) => {
    try {
      const updated = await Conversation.findOneAndUpdate(
        { id: conversationId },
        { unread: false },
        { new: true }
      );
      if (updated) {
        io.emit("conversation_read", { conversationId });
      }
    } catch (err) {
      console.error("Socket mark_read error:", err);
    }
  });

  // Real-time typing indicators
  socket.on("typing_start", ({ conversationId, handle }) => {
    socket.broadcast.emit("user_typing", { conversationId, handle, isTyping: true });
  });

  socket.on("typing_stop", ({ conversationId, handle }) => {
    socket.broadcast.emit("user_typing", { conversationId, handle, isTyping: false });
  });

  // Real-time Audio/Video Calls
  socket.on("start_call", ({ conversationId, callType, callerName }) => {
    socket.broadcast.emit("incoming_call", { conversationId, callType, callerName });
  });

  socket.on("end_call", ({ conversationId }) => {
    socket.broadcast.emit("call_ended", { conversationId });
  });

  socket.on("disconnect", () => {
    activeSockets.delete(socket.id);
    io.emit("users_online", { count: activeSockets.size });
    console.log(`🔌 Socket.IO client disconnected: ${socket.id} (Remaining: ${activeSockets.size})`);
  });
});

// Connect to MongoDB and start server
async function startServer() {
  mongoose.connection.on("connected", () => {
    seedDatabase().catch((e) => console.warn("Seed notice:", e.message));
  });

  await connectDB();
  if (mongoose.connection.readyState === 1) {
    await seedDatabase();
  }

  server.listen(PORT, () => {
    console.log(`🚀 FashionCycle Express+MongoDB+Socket.IO Backend running on http://localhost:${PORT}`);
  });
}

startServer();
