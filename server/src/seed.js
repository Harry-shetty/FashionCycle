import mongoose from "mongoose";
import { Listing } from "./models/Listing.js";
import { Order } from "./models/Order.js";
import { SavedItem } from "./models/SavedItem.js";
import { Impact } from "./models/Impact.js";
import { Notification } from "./models/Notification.js";
import { Leaderboard } from "./models/Leaderboard.js";
import { CommunityPost } from "./models/CommunityPost.js";

const SEED_LISTINGS = [
  {
    id: "lst-001",
    title: "Vintage Ralph Lauren Wool Blazer",
    brand: "Ralph Lauren",
    size: "L",
    condition: "Excellent",
    category: "Outerwear",
    price: 85,
    images: ["https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format"],
    description: "Classic 90s tailoring with horn buttons. 100% pure virgin wool. Mint vintage condition.",
    sellerId: "seller-1",
    sold: false,
    views: 342,
    likes: 28,
  },
  {
    id: "lst-002",
    title: "Zara Mulberry Silk Wrap Dress",
    brand: "Zara",
    size: "M",
    condition: "Good",
    category: "Dresses",
    price: 42,
    images: ["https://images.unsplash.com/photo-1664076458686-3449062080ac?w=600&h=800&fit=crop&auto=format"],
    description: "Fluid emerald silk wrap dress with ties. Beautiful drape, worn twice for gallery events.",
    sellerId: "seller-2",
    sold: false,
    views: 511,
    likes: 41,
  },
  {
    id: "lst-003",
    title: "Linen Minimalist Co-ord Set",
    brand: "& Other Stories",
    size: "S",
    condition: "Like New",
    category: "Tops & Tees",
    price: 68,
    images: ["https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=600&h=800&fit=crop&auto=format"],
    description: "Breathable European flax linen. Top and matching tailored trousers.",
    sellerId: "seller-3",
    sold: false,
    views: 728,
    likes: 63,
  },
  {
    id: "lst-004",
    title: "Massimo Dutti Heavy Wool Overcoat",
    brand: "Massimo Dutti",
    size: "M",
    condition: "Good",
    category: "Outerwear",
    price: 110,
    images: ["https://images.unsplash.com/photo-1659522761084-79196b64abe4?w=600&h=800&fit=crop&auto=format"],
    description: "Structured double-breasted long winter coat in warm camel hue.",
    sellerId: "seller-4",
    sold: false,
    views: 209,
    likes: 17,
  },
  {
    id: "lst-005",
    title: "Vintage Levi's 501 Original Fit",
    brand: "Levi's",
    size: "32",
    condition: "Good",
    category: "Denim",
    price: 55,
    images: ["https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=600&h=800&fit=crop&auto=format"],
    description: "Authentic made in USA 501s with natural vintage whiskering and distressing.",
    sellerId: "seller-5",
    sold: false,
    views: 188,
    likes: 19,
  },
  {
    id: "lst-006",
    title: "Ganni Pastel Check Ruffle Blouse",
    brand: "Ganni",
    size: "M",
    condition: "Like New",
    category: "Tops & Tees",
    price: 65,
    images: ["https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=600&h=800&fit=crop&auto=format"],
    description: "Signature oversized collar blouse in organic cotton seersucker check.",
    sellerId: "seller-6",
    sold: false,
    views: 420,
    likes: 38,
  },
  {
    id: "lst-007",
    title: "Nanushka Vegan Leather Shirt Jacket",
    brand: "Nanushka",
    size: "M",
    condition: "Like New",
    category: "Outerwear",
    price: 195,
    images: ["https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=600&h=800&fit=crop&auto=format"],
    description: "Buttery soft faux leather in rich espresso tone. Padded buttons.",
    sellerId: "seller-7",
    sold: false,
    views: 610,
    likes: 54,
  },
  {
    id: "lst-008",
    title: "Acne Studios Canada Wool Scarf",
    brand: "Acne Studios",
    size: "OS",
    condition: "Like New",
    category: "Accessories",
    price: 78,
    images: ["https://images.unsplash.com/photo-1619161519929-befcb28d6384?w=600&h=800&fit=crop&auto=format"],
    description: "Virgin wool fringed scarf in oat melange with stitched label intact.",
    sellerId: "seller-1",
    sold: false,
    views: 312,
    likes: 27,
  },
];

const SEED_ORDERS = [
  {
    id: "#FC-00412",
    item: "Vintage Levi's 501 Original Fit",
    seller: "Marco R.",
    date: "Sep 8, 2026",
    price: 54,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-8829104",
    carrier: "EcoCourier Express (100% Electric)",
    estimatedDelivery: "Delivered on Sep 11, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00398",
    item: "Ganni Pastel Check Ruffle Blouse",
    seller: "Ana K.",
    date: "Sep 2, 2026",
    price: 67,
    status: "In Transit",
    img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-9912034",
    carrier: "BlueDart CarbonNeutral",
    estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00371",
    item: "Bottega Veneta Mule Heels",
    seller: "Lea B.",
    date: "Aug 25, 2026",
    price: 210,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-7734190",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Aug 28, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
];

const SEED_NOTIFICATIONS = [
  { id: "n1", icon: "💬", text: "Tom offered ₹74 for your Acne scarf", time: "5m ago", read: false },
  { id: "n2", icon: "❤️", text: "Elena liked your Ralph Lauren Blazer listing", time: "18m ago", read: false },
  { id: "n3", icon: "📦", text: "Your order #FC-00398 has shipped with live tracking!", time: "2h ago", read: false },
  { id: "n4", icon: "✨", text: "You reached Gold Level Eco Contributor!", time: "1d ago", read: true },
];

export async function seedDatabase() {
  try {
    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      await Listing.insertMany(SEED_LISTINGS);
      console.log("🌱 Seeded initial listings into MongoDB");
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(SEED_ORDERS);
      console.log("🌱 Seeded initial orders into MongoDB");
    }

    // Ensure collection 'conversations' is removed from MongoDB
    try {
      const collections = await mongoose.connection.db.listCollections({ name: "conversations" }).toArray();
      if (collections.length > 0) {
        await mongoose.connection.db.dropCollection("conversations");
        console.log("🗑️ Collection 'conversations' dropped from database");
      }
    } catch {
      // Ignore if collection does not exist
    }

    const savedCount = await SavedItem.countDocuments();
    if (savedCount === 0) {
      await SavedItem.insertMany([
        { listingId: "lst-001", userId: "default-user" },
        { listingId: "lst-003", userId: "default-user" },
      ]);
      console.log("🌱 Seeded initial saved items into MongoDB");
    }

    const impactDoc = await Impact.findOne({ userId: "default-user" });
    if (!impactDoc) {
      await Impact.create({
        userId: "default-user",
        co2: 48.4,
        water: 3820,
        items: 12,
        money: 836,
      });
      console.log("🌱 Seeded initial sustainability impact into MongoDB");
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany(SEED_NOTIFICATIONS);
      console.log("🌱 Seeded initial notifications into MongoDB");
    }

    const leaderboardCount = await Leaderboard.countDocuments();
    if (leaderboardCount === 0) {
      const SEED_MONTH_LEADERBOARD = [
        { rank: 1, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 184.2, itemsCycled: 42, badge: "🌱 Eco Master", points: 4850, period: "month" },
        { rank: 2, name: "Priya Sharma", handle: "@priyawears", avatar: "PS", city: "Mumbai, IN", co2Saved: 142.8, itemsCycled: 36, badge: "♻️ Zero Waste Hero", points: 3920, period: "month" },
        { rank: 3, name: "Elena Rostova", handle: "@elenavintage", avatar: "ER", city: "Bengaluru, IN", co2Saved: 118.5, itemsCycled: 29, badge: "👗 Vintage Curator", points: 3150, period: "month" },
        { rank: 4, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Rising Cycler", points: 1420, isCurrentUser: true, period: "month" },
        { rank: 5, name: "Kavya Nair", handle: "@kavyacircles", avatar: "KN", city: "Delhi, IN", co2Saved: 44.1, itemsCycled: 11, badge: "✨ Trend Setter", points: 1310, period: "month" },
        { rank: 6, name: "Rohan Varma", handle: "@rohanthrift", avatar: "RV", city: "Hyderabad, IN", co2Saved: 39.6, itemsCycled: 9, badge: "👕 Denim Saver", points: 1180, period: "month" },
        { rank: 7, name: "Ananya Deshmukh", handle: "@ananyastyle", avatar: "AD", city: "Pune, IN", co2Saved: 35.2, itemsCycled: 8, badge: "🧵 Stitch Rebel", points: 990, period: "month" },
        { rank: 8, name: "Dev Patel", handle: "@devvintage", avatar: "DP", city: "Bengaluru, IN", co2Saved: 31.0, itemsCycled: 7, badge: "🌟 Conscious Shopper", points: 860, period: "month" },
      ];
      await Leaderboard.insertMany(SEED_MONTH_LEADERBOARD);
      console.log("🌱 Seeded initial leaderboard into MongoDB");
    }

    const communityCount = await CommunityPost.countDocuments();
    if (communityCount === 0) {
      await CommunityPost.insertMany([
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
      ]);
      console.log("🌱 Seeded initial community posts into MongoDB");
    }
  } catch (error) {
    console.error("Database seeding error:", error);
  }
}
