import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, enum: ["me", "them"], required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  reaction: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    handle: { type: String, required: true },
    avatar: { type: String, required: true },
    unread: { type: Boolean, default: false },
    time: { type: String, default: "Just now" },
    itemContext: { type: String, default: "" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
