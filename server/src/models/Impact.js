import mongoose from "mongoose";

const impactSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default-user", unique: true },
    co2: { type: Number, default: 48.4 },
    water: { type: Number, default: 3820 },
    items: { type: Number, default: 12 },
    money: { type: Number, default: 836 },
  },
  { timestamps: true }
);

export const Impact = mongoose.model("Impact", impactSchema);
