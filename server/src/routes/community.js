import express from "express";
import { CommunityPost } from "../models/CommunityPost.js";

const router = express.Router();

const DEFAULT_POSTS = [
  {
    name: "Harsha Shetty",
    handle: "@ariawears",
    text: "I've cleared out my entire winter wardrobe and made 380₹. The whole process was so smooth — FashionCycle is genuinely changing how I think about clothes.",
    avatar: "AC",
    items: 14,
    likes: 42,
  },
  {
    name: "Rohit Kapoor",
    handle: "@rohitk",
    text: "Found a Comme des Garçons jacket here for 90₹. That's not possible anywhere else. This platform attracts people who actually care about fashion.",
    avatar: "RK",
    items: 8,
    likes: 29,
  },
  {
    name: "Priya Nair",
    handle: "@priyaonrepeat",
    text: "The sustainability impact tracker is so motivating. Seeing how many kg of CO₂ I've saved makes the whole experience feel meaningful.",
    avatar: "PN",
    items: 23,
    likes: 85,
  },
];

// GET /api/community
router.get("/", async (req, res) => {
  try {
    let posts = await CommunityPost.find().sort({ createdAt: -1 });
    if (posts.length === 0) {
      await CommunityPost.insertMany(DEFAULT_POSTS);
      posts = await CommunityPost.find().sort({ createdAt: -1 });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/community
router.post("/", async (req, res) => {
  try {
    const { name, handle, text, avatar, items } = req.body;
    const post = await CommunityPost.create({
      name,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      text,
      avatar: avatar || name.slice(0, 2).toUpperCase(),
      items: Number(items) || 1,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/community/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CommunityPost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ success: true, message: "Community post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/community (clear collection)
router.delete("/", async (req, res) => {
  try {
    await CommunityPost.deleteMany({});
    res.json({ success: true, message: "Community collection cleared from MongoDB" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

