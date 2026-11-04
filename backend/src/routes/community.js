import express from "express";
import { CommunityPost } from "../models/CommunityPost.js";

const router = express.Router();

const DEFAULT_POSTS = [
  {
    name: "Aarav Mehta",
    handle: "@aaravcycles",
    text: "Circulating heritage selvedge denim through my studio here has reached authentic vintage lovers across India who value longevity over fast fashion.",
    avatar: "AM",
    items: 42,
    likes: 68,
  },
  {
    name: "Priya Nair",
    handle: "@priyaonrepeat",
    text: "The zero-waste shipping, authentic appraisal tools, and conscious buyer base make managing my pre-loved silk & blazer studio an absolute joy.",
    avatar: "PN",
    items: 36,
    likes: 85,
  },
  {
    name: "Elena Rostova",
    handle: "@elenavintage",
    text: "Curating authenticated European wool coats and archival knitwear. My drops find loving new homes within hours thanks to the verified buyer network.",
    avatar: "ER",
    items: 29,
    likes: 54,
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

