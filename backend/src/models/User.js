import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    itemsSold: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 },
    points: { type: Number, default: 100 },
    role: { type: String, default: "member" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

