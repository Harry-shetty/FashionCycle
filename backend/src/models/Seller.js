import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerId: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    name: { type: String, required: true },
    handle: { type: String, required: true },
    avatar: { type: String, default: "AS" },
    storeName: { type: String, default: "Sustainable Studio" },
    bio: { 
      type: String, 
      default: "Official Sustainable Studio on FashionCycle. Specializing in archival vintage, verified woolens, authenticated designer tailoring, and zero-plastic eco shipments." 
    },
    city: { type: String, default: "Bengaluru, IN" },
    specialty: { type: String, default: "Capsule Denim & Restyled Archives" },
    featuredDrop: { type: String, default: "Indigo Selvedge Denim & Silk Tops" },
    rating: { type: Number, default: 5.0 },
    followersCount: { type: Number, default: 1620 },
    piecesCirculated: { type: Number, default: 42 },
    co2Diverted: { type: Number, default: 186.4 },
    totalEarnings: { type: Number, default: 3450 },
    badge: { type: String, default: "🏆 #1 Top Merchant" },
    isVerified: { type: Boolean, default: true },
    payoutMethod: { type: String, default: "UPI / Bank Transfer" },
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema, "seller_profiles");

