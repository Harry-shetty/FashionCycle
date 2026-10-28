import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    handle: { type: String, required: true },
    text: { type: String, required: true },
    avatar: { type: String, required: true },
    items: { type: Number, default: 1 },
    likes: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);

