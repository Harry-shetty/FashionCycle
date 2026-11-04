import express from "express";
import { SavedItem } from "../models/SavedItem.js";
import { Listing } from "../models/Listing.js";

const router = express.Router();

function getUserId(req) {
  return (
    req.headers["x-user-id"] ||
    req.headers["x-user-email"] ||
    req.query.userId ||
    req.body?.userId ||
    "guest"
  );
}

function getSavedFilter(req) {
  const userId = getUserId(req);
  const userEmail = req.headers["x-user-email"];
  const isPrimary =
    userId === "usr-buyer-harsha" ||
    userId === "usr-buyer-01" ||
    userId === "default-user" ||
    userEmail === "harsha@gmail.com" ||
    userEmail === "sophia@fashioncycle.eco";

  if (isPrimary) {
    return {
      $or: [
        { userId },
        ...(userEmail ? [{ userId: userEmail }] : []),
        { userId: "default-user" },
        { userId: "usr-buyer-harsha" },
        { userId: { $exists: false } },
        { userId: null },
      ],
    };
  }

  const ids = [userId];
  if (userEmail && userEmail !== userId) ids.push(userEmail);
  return { userId: { $in: ids } };
}

// GET /api/saved
router.get("/", async (req, res) => {
  try {
    const { full } = req.query;
    const filter = getSavedFilter(req);
    const items = await SavedItem.find(filter).sort({ createdAt: -1 });
    if (full === "true") {
      return res.json(items);
    }
    const listingIds = items.map((i) => i.listingId);
    res.json(listingIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/saved/details
router.get("/details", async (req, res) => {
  try {
    const filter = getSavedFilter(req);
    const items = await SavedItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/saved/toggle/:listingId
router.post("/toggle/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = getUserId(req);
    const existing = await SavedItem.findOne({ listingId, userId });

    if (existing) {
      await SavedItem.deleteOne({ _id: existing._id });
      await Listing.findOneAndUpdate({ id: listingId }, { $inc: { likes: -1 } });
      res.json({ saved: false, listingId });
    } else {
      // Find listing details to embed directly into saveditems collection
      const listing = await Listing.findOne({ id: listingId });
      const itemData = {
        listingId,
        userId,
        title: listing?.title || req.body?.title || "Favorited Piece",
        brand: listing?.brand || req.body?.brand || "Sustainable Brand",
        price: listing?.price || req.body?.price || 0,
        image: listing?.images?.[0] || req.body?.image || "",
        category: listing?.category || req.body?.category || "Tops & Tees",
        size: listing?.size || req.body?.size || "M",
        condition: listing?.condition || req.body?.condition || "Excellent",
      };

      const savedDoc = await SavedItem.create(itemData);
      await Listing.findOneAndUpdate({ id: listingId }, { $inc: { likes: 1 } });
      res.status(201).json({ saved: true, listingId, item: savedDoc });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/saved/:listingId
router.delete("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = getUserId(req);
    await SavedItem.deleteOne({ listingId, userId });
    res.json({ success: true, message: "Item removed from wishlist", listingId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/saved (clear collection for user)
router.delete("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await SavedItem.deleteMany({ userId });
    res.json({ success: true, message: "Saved items removed from MongoDB", count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
