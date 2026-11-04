import mongoose from "mongoose";

const buyerFollowSchema = new mongoose.Schema(
  {
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerHandle: { type: String, default: "" },
    followedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

buyerFollowSchema.index({ buyerId: 1, sellerId: 1 }, { unique: true });

export const BuyerFollow = mongoose.model("BuyerFollow", buyerFollowSchema, "buyer_follows");

