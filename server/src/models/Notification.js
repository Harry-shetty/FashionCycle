import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    icon: { type: String, default: "✨" },
    text: { type: String, required: true },
    time: { type: String, default: "Just now" },
    read: { type: Boolean, default: false },
    userId: { type: String, default: "default-user" },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
