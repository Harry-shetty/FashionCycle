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

// Socket.IO active connections tracker
const activeSockets = new Set();

// Socket.IO event handling
io.on("connection", (socket) => {
  activeSockets.add(socket.id);
  io.emit("users_online", { count: activeSockets.size });
  console.log(`⚡ Socket.IO client connected: ${socket.id} (Total: ${activeSockets.size})`);

  // Join / Leave rooms
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
  });

  // Ephemeral real-time messaging via Socket.IO
  socket.on("send_message", ({ conversationId, text, sender = "me" }, callback) => {
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

    io.emit("message_received", { conversationId, message: newMsg });
    if (callback) callback({ success: true, message: newMsg });

    // Optional quick auto-reply simulation
    if (sender === "me") {
      setTimeout(() => {
        io.emit("user_typing", { conversationId, handle: "@seller", isTyping: true });
      }, 400);

      setTimeout(() => {
        const replyNow = new Date();
        const sellerMsg = {
          id: `msg-rep-${Date.now()}`,
          sender: "them",
          text: "Thanks for reaching out! The item is in great condition and ready to ship 🌿",
          time: replyNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          reaction: "",
          createdAt: replyNow,
        };
        io.emit("user_typing", { conversationId, handle: "@seller", isTyping: false });
        io.emit("message_received", { conversationId, message: sellerMsg });
      }, 1400);
    }
  });

  // Real-time message reactions
  socket.on("message_reaction", ({ conversationId, messageId, emoji }) => {
    io.emit("message_reaction_updated", {
      conversationId,
      messageId,
      emoji,
    });
  });

  // Mark conversation as read
  socket.on("mark_read", ({ conversationId }) => {
    io.emit("conversation_read", { conversationId });
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
