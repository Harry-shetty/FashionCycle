import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true },
    userId: { type: String, default: "default-user" },
    title: { type: String, default: "" },
    brand: { type: String, default: "" },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    size: { type: String, default: "" },
    condition: { type: String, default: "" },
  },
  { timestamps: true }
);

savedItemSchema.index({ listingId: 1, userId: 1 }, { unique: true });

export const SavedItem = mongoose.model("SavedItem", savedItemSchema, "buyer_saveditems");
