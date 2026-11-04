import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    buyerId: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    name: { type: String, required: true },
    handle: { type: String, default: "@harsha_cycles" },
    avatar: { type: String, default: "HA" },
    shippingAddress: { type: String, default: "Flat 402, Green Meadows, Bengaluru, 560034" },
    ecoPoints: { type: Number, default: 1420 },
    co2SavedKg: { type: Number, default: 48.4 },
    waterSavedLitres: { type: Number, default: 3820 },
    piecesPurchased: { type: Number, default: 12 },
    tier: { type: String, default: "Gold Level Eco Contributor" },
  },
  { timestamps: true }
);

export const Buyer = mongoose.model("Buyer", buyerSchema, "buyer_profiles");

