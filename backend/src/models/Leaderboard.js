import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true },
    name: { type: String, required: true },
    handle: { type: String, required: true },
    avatar: { type: String, required: true },
    city: { type: String, required: true },
    co2Saved: { type: Number, required: true, default: 0 },
    itemsCycled: { type: Number, required: true, default: 0 },
    badge: { type: String, default: "🌱 Eco Cycler" },
    points: { type: Number, required: true, default: 0 },
    isCurrentUser: { type: Boolean, default: false },
    period: { type: String, enum: ["month", "allTime", "local"], default: "month" },
  },
  { timestamps: true }
);

LeaderboardSchema.index({ period: 1, rank: 1 });
LeaderboardSchema.index({ handle: 1, period: 1 }, { unique: true });

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);

