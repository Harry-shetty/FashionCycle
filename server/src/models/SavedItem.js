import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true },
    userId: { type: String, default: "default-user" },
  },
  { timestamps: true }
);

savedItemSchema.index({ listingId: 1, userId: 1 }, { unique: true });

export const SavedItem = mongoose.model("SavedItem", savedItemSchema);
