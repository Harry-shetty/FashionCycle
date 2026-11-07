import mongoose from "mongoose";
import { Listing } from "./models/Listing.js";
import { Order } from "./models/Order.js";
import { SavedItem } from "./models/SavedItem.js";
import { Impact } from "./models/Impact.js";
import { Notification } from "./models/Notification.js";
import { Leaderboard } from "./models/Leaderboard.js";
import { CommunityPost } from "./models/CommunityPost.js";
import { Seller } from "./models/Seller.js";
import { SellerSale } from "./models/SellerSale.js";
import { Buyer } from "./models/Buyer.js";
import { BuyerFollow } from "./models/BuyerFollow.js";

export const SEED_LISTINGS = [
  {
    id: "lst-001",
    title: "Vintage Ralph Lauren Wool Blazer Jacket",
    brand: "Ralph Lauren",
    size: "L",
    condition: "Excellent",
    category: "Jackets",
    price: 85,
    images: ["https://images.unsplash.com/photo-1646654793829-222c56e60300?w=600&h=800&fit=crop&auto=format"],
    description: "Classic 90s tailored wool jacket with horn buttons. 100% pure virgin wool in pristine vintage condition.",
    sellerId: "seller-1",
    sold: false,
    views: 342,
    likes: 28,
  },
  {
    id: "lst-002",
    title: "Vintage Levi's 501 Original Fit Denim",
    brand: "Levi's",
    size: "32",
    condition: "Good",
    category: "Denim",
    price: 55,
    images: ["https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=800&fit=crop&auto=format"],
    description: "Authentic made in USA 501s with natural vintage whiskering, straight leg and raw selvedge hem.",
    sellerId: "seller-2",
    sold: false,
    views: 511,
    likes: 41,
  },
  {
    id: "lst-003",
    title: "Massimo Dutti Heavy Wool Long Overcoat",
    brand: "Massimo Dutti",
    size: "M",
    condition: "Excellent",
    category: "Long Coats",
    price: 130,
    images: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop&auto=format"],
    description: "Structured double-breasted long winter coat in warm camel hue. Premium Italian wool blend tailored to perfection.",
    sellerId: "seller-3",
    sold: false,
    views: 728,
    likes: 63,
  },
  {
    id: "lst-004",
    title: "Studio Nicholson Heavyweight Boxy Cotton Tee",
    brand: "Studio Nicholson",
    size: "M",
    condition: "Like New",
    category: "Tees & Tops",
    price: 45,
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop&auto=format"],
    description: "Heavyweight 280gsm organic combed cotton tee. Relaxed drop shoulder silhouette in optic white.",
    sellerId: "seller-4",
    sold: false,
    views: 209,
    likes: 17,
  },
  {
    id: "lst-005",
    title: "Filippa K Ribbed Fisherman Wool Sweater",
    brand: "Filippa K",
    size: "L",
    condition: "Like New",
    category: "Sweaters",
    price: 92,
    images: ["https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&h=800&fit=crop&auto=format"],
    description: "Chunky ribbed crewneck knit crafted from Scandinavian merino wool. Soft oatmeal melange hue.",
    sellerId: "seller-1",
    sold: false,
    views: 188,
    likes: 19,
  },
  {
    id: "lst-006",
    title: "Nanushka Vegan Leather Moto Jacket",
    brand: "Nanushka",
    size: "M",
    condition: "Like New",
    category: "Jackets",
    price: 195,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&auto=format"],
    description: "Buttery soft cruelty-free vegan leather jacket in rich espresso tone. Padded buttons and satin lining.",
    sellerId: "seller-2",
    sold: false,
    views: 420,
    likes: 38,
  },
  {
    id: "lst-007",
    title: "Acne Studios 1996 High-Rise Straight Denim",
    brand: "Acne Studios",
    size: "28",
    condition: "Excellent",
    category: "Denim",
    price: 110,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&auto=format"],
    description: "High-waist straight leg jeans in vintage stone wash with copper button rivets and leather back patch.",
    sellerId: "seller-3",
    sold: false,
    views: 610,
    likes: 54,
  },
  {
    id: "lst-008",
    title: "Arket Minimalist Long Trench Coat",
    brand: "Arket",
    size: "S",
    condition: "Good",
    category: "Long Coats",
    price: 145,
    images: ["https://images.unsplash.com/photo-1633821879282-0c4e91f96232?w=600&h=800&fit=crop&auto=format"],
    description: "Classic water-repellent organic cotton gabardine long trench with storm flap and waist tie belt.",
    sellerId: "seller-4",
    sold: false,
    views: 312,
    likes: 27,
  },
  {
    id: "lst-009",
    title: "Ganni Pastel Check Organic Cotton Top",
    brand: "Ganni",
    size: "M",
    condition: "Like New",
    category: "Tees & Tops",
    price: 65,
    images: ["https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&h=800&fit=crop&auto=format"],
    description: "Signature oversized ruffled collar blouse top in certified organic cotton seersucker pastel check.",
    sellerId: "seller-1",
    sold: false,
    views: 480,
    likes: 39,
  },
  {
    id: "lst-010",
    title: "Loro Piana Chunky Cable-Knit Cashmere Sweater",
    brand: "Loro Piana",
    size: "M",
    condition: "Excellent",
    category: "Sweaters",
    price: 240,
    images: ["https://images.unsplash.com/photo-1523523262500-ec13396518c6?w=600&h=800&fit=crop&auto=format"],
    description: "Ultra-luxurious hand-finished cable knit sweater in pure Mongolian cashmere. Incredibly warm and soft.",
    sellerId: "seller-2",
    sold: false,
    views: 390,
    likes: 45,
  },
];

const SEED_ORDERS = [
  {
    id: "#FC-00412",
    item: "Vintage Levi's 501 Original Fit Denim",
    seller: "Marco R.",
    date: "Sep 8, 2026",
    price: 55,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop&auto=format",
    trackingNumber: "FC-IND-8829104",
    carrier: "EcoCourier Express (100% Electric)",
    estimatedDelivery: "Delivered on Sep 11, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00398",
    item: "Ganni Pastel Check Organic Cotton Top",
    seller: "Ana K.",
    date: "Sep 2, 2026",
    price: 65,
    status: "In Transit",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
    trackingNumber: "FC-IND-9912034",
    carrier: "BlueDart CarbonNeutral",
    estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00371",
    item: "Nanushka Vegan Leather Moto Jacket",
    seller: "Lea B.",
    date: "Aug 25, 2026",
    price: 195,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format",
    trackingNumber: "FC-IND-7734190",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Aug 28, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
];

const SEED_SELLERS = [
  {
    sellerId: "seller-0",
    email: "aarav@fashioncycle.eco",
    name: "Aarav Mehta",
    handle: "@aaravcycles",
    avatar: "AM",
    storeName: "Aarav Heritage Denims",
    bio: "Dedicated to heritage selvedge denim and zero-waste tailoring. Circulating certified vintage and upcycled classics.",
    city: "Bengaluru, IN",
    specialty: "Heritage Denim & Upcycled Workwear",
    featuredDrop: "Japanese Selvedge Denim & Utility Overalls",
    rating: 5.0,
    followersCount: 1620,
    piecesCirculated: 42,
    co2Diverted: 184.2,
    totalEarnings: 4850,
    badge: "🌱 Eco Master",
    isVerified: true,
  },
  {
    sellerId: "seller-1",
    email: "admin@gmail.com",
    name: "Priya Nair",
    handle: "@priyaonrepeat",
    avatar: "PN",
    storeName: "Priya Archives & Tailoring",
    bio: "Official Sustainable Studio on FashionCycle. Specializing in archival vintage, verified woolens, authenticated designer tailoring, and zero-plastic eco shipments.",
    city: "Bengaluru, IN",
    specialty: "Capsule Silk Sets & Designer Archives",
    featuredDrop: "Indigo Mulberry Silk Sets & Tailored Blazers",
    rating: 4.9,
    followersCount: 1410,
    piecesCirculated: 36,
    co2Diverted: 142.8,
    totalEarnings: 3920,
    badge: "♻️ Zero Waste Hero",
    isVerified: true,
  },
  {
    sellerId: "seller-2",
    email: "elena@vintage.com",
    name: "Elena Rostova",
    handle: "@elenavintage",
    avatar: "ER",
    storeName: "Rostova European Archive",
    bio: "Curating rare European tailoring, vintage knitwear, and authenticated archival outerwear.",
    city: "Bengaluru, IN",
    specialty: "Pre-loved European Wool & Luxury Knits",
    featuredDrop: "Double-Breasted Wool Overcoats",
    rating: 5.0,
    followersCount: 1180,
    piecesCirculated: 29,
    co2Diverted: 118.5,
    totalEarnings: 3150,
    badge: "👗 Vintage Curator",
    isVerified: true,
  },
  {
    sellerId: "seller-3",
    email: "harsha.seller@gmail.com",
    name: "Harsha Shetty",
    handle: "@harsha",
    avatar: "HA",
    storeName: "Harsha Minimal Studio",
    bio: "Minimalist silhouettes, relaxed Italian blazers, and certified organic European flax co-ords.",
    city: "Bengaluru, IN",
    specialty: "Archival Tailoring & Minimalist Sets",
    featuredDrop: "Relaxed Italian Wool Blazers",
    rating: 4.9,
    followersCount: 940,
    piecesCirculated: 12,
    co2Diverted: 48.4,
    totalEarnings: 1420,
    badge: "🌿 Rising Cycler",
    isVerified: true,
  },
  {
    sellerId: "seller-4",
    email: "kavya@fashioncycle.eco",
    name: "Kavya Nair",
    handle: "@kavyacircles",
    avatar: "KN",
    storeName: "Kavya Organic Co.",
    bio: "Promoting organic cottons, handloom textiles & circular everyday essentials. Slow fashion advocate.",
    city: "Delhi, IN",
    specialty: "Organic Cottons & Handloom Outerwear",
    featuredDrop: "Handwoven Khadi Trench Coats",
    rating: 4.8,
    followersCount: 860,
    piecesCirculated: 22,
    co2Diverted: 94.2,
    totalEarnings: 2310,
    badge: "✨ Trend Setter",
    isVerified: true,
  },
  {
    sellerId: "seller-5",
    email: "marcus@vance.com",
    name: "Marcus Vance",
    handle: "@vancestudio",
    avatar: "MV",
    storeName: "Vance Heritage Menswear",
    bio: "Specialist in heritage British outerwear, heavy woolens, pleated trousers, and circular menswear.",
    city: "Mumbai, IN",
    specialty: "Heritage Menswear & Cashmere",
    featuredDrop: "Pleated Trousers & Chunky Cardigans",
    rating: 4.9,
    followersCount: 720,
    piecesCirculated: 18,
    co2Diverted: 78.6,
    totalEarnings: 1980,
    badge: "✨ Heritage Curator",
    isVerified: true,
  },
];

const SEED_SELLER_SALES = [
  {
    saleId: "sale-001",
    sellerId: "seller-1",
    buyerId: "buyer-001",
    buyerName: "Harsha (Buyer)",
    listingId: "lst-001",
    itemTitle: "Vintage Ralph Lauren Wool Blazer",
    brand: "Ralph Lauren",
    price: 85,
    sellerPayout: 85,
    commission: 0,
    status: "Delivered",
    trackingNumber: "FC-IND-8829104",
    carrier: "EcoCourier Express (100% Electric)",
    shippingAddress: "Flat 402, Green Meadows, Bengaluru, 560034",
    saleDate: "Sep 8, 2026",
  },
  {
    saleId: "sale-002",
    sellerId: "seller-1",
    buyerId: "buyer-002",
    buyerName: "Aarav Mehta",
    listingId: "lst-008",
    itemTitle: "Acne Studios Canada Wool Scarf",
    brand: "Acne Studios",
    price: 78,
    sellerPayout: 78,
    commission: 0,
    status: "Shipped",
    trackingNumber: "FC-IND-9912034",
    carrier: "BlueDart CarbonNeutral",
    shippingAddress: "Indiranagar 100ft Rd, Bengaluru, 560038",
    saleDate: "Sep 28, 2026",
  },
];

const SEED_BUYERS = [
  {
    buyerId: "buyer-001",
    email: "harsha@gmail.com",
    name: "Harsha (Buyer)",
    handle: "@harsha",
    avatar: "HA",
    shippingAddress: "Flat 402, Green Meadows, Bengaluru, 560034",
    ecoPoints: 1420,
    co2SavedKg: 48.4,
    waterSavedLitres: 3820,
    piecesPurchased: 12,
    tier: "Gold Level Eco Contributor",
  },
];

const SEED_BUYER_FOLLOWS = [
  {
    buyerId: "buyer-001",
    sellerId: "seller-1",
    sellerName: "Priya Nair",
    sellerHandle: "@priyaonrepeat",
  },
  {
    buyerId: "buyer-001",
    sellerId: "seller-2",
    sellerName: "Harsha Shetty",
    sellerHandle: "@ariawears",
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
    // -------------------------------------------------------------
    // SELLER DOMAIN SEEDING:
    // -------------------------------------------------------------
    const sellerCount = await Seller.countDocuments();
    if (sellerCount === 0) {
      await Seller.insertMany(SEED_SELLERS);
      console.log("🌱 Seeded seller profiles into MongoDB (db.seller_profiles)");
    }

    const saleCount = await SellerSale.countDocuments();
    if (saleCount === 0) {
      await SellerSale.insertMany(SEED_SELLER_SALES);
      console.log("🌱 Seeded seller sales into MongoDB (db.seller_sales)");
    }

    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      await Listing.insertMany(SEED_LISTINGS);
      console.log("🌱 Seeded seller listings into MongoDB (db.seller_listings)");
    } else {
      for (const item of SEED_LISTINGS) {
        await Listing.findOneAndUpdate({ id: item.id }, item, { upsert: true });
      }
      console.log("🌱 Synced curated clothing listings into MongoDB (db.seller_listings)");
    }

    // -------------------------------------------------------------
    // BUYER DOMAIN SEEDING:
    // -------------------------------------------------------------
    const buyerCount = await Buyer.countDocuments();
    if (buyerCount === 0) {
      await Buyer.insertMany(SEED_BUYERS);
      console.log("🌱 Seeded buyer profiles into MongoDB (db.buyer_profiles)");
    }

    const followCount = await BuyerFollow.countDocuments();
    if (followCount === 0) {
      await BuyerFollow.insertMany(SEED_BUYER_FOLLOWS);
      console.log("🌱 Seeded buyer follows into MongoDB (db.buyer_follows)");
    }

    for (const ord of SEED_ORDERS) {
      await Order.findOneAndUpdate({ id: ord.id }, { $set: ord }, { upsert: true, new: true });
    }
    console.log("🌱 Synced buyer orders into MongoDB (db.buyer_orders)");

    const savedCount = await SavedItem.countDocuments();
    if (savedCount === 0) {
      await SavedItem.insertMany([
        { listingId: "lst-001", userId: "default-user", title: "Vintage Ralph Lauren Wool Blazer", brand: "Ralph Lauren", price: 85 },
        { listingId: "lst-003", userId: "default-user", title: "Linen Minimalist Co-ord Set", brand: "& Other Stories", price: 68 },
      ]);
      console.log("🌱 Seeded buyer saved items into MongoDB (db.buyer_saveditems)");
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany(SEED_NOTIFICATIONS);
      console.log("🌱 Seeded buyer notifications into MongoDB (db.buyer_notifications)");
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
      console.log("🌱 Seeded buyer community posts into MongoDB (db.buyer_communityposts)");
    }

    // -------------------------------------------------------------
    // PLATFORM COMMON: IMPACT & LEADERBOARDS
    // -------------------------------------------------------------
    const impactDoc = await Impact.findOne({ userId: "default-user" });
    if (!impactDoc) {
      await Impact.create({
        userId: "default-user",
        co2: 48.4,
        water: 3820,
        items: 12,
        money: 836,
      });
      console.log("🌱 Seeded platform sustainability impact into MongoDB (db.impacts)");
    }

    const leaderboardCount = await Leaderboard.countDocuments();
    if (leaderboardCount === 0) {
      const SEED_MONTH_LEADERBOARD = [
        { rank: 1, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 164.2, itemsCycled: 38, badge: "👑 Top Circular Buyer", points: 4850, period: "month" },
        { rank: 2, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 136.5, itemsCycled: 29, badge: "🛍️ Zero Waste Buyer", points: 3920, period: "month" },
        { rank: 3, name: "Maya Kapoor", handle: "@mayarepeats", avatar: "MK", city: "Bengaluru, IN", co2Saved: 98.4, itemsCycled: 21, badge: "👗 Conscious Collector", points: 3150, period: "month" },
        { rank: 4, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Rising Buyer", points: 1420, period: "month" },
        { rank: 5, name: "Rohan Varma", handle: "@rohanreclaims", avatar: "RV", city: "Hyderabad, IN", co2Saved: 62.0, itemsCycled: 14, badge: "🌱 Mindful Thrifter", points: 1600, period: "month" },
        { rank: 6, name: "Diya Roy", handle: "@diyasaves", avatar: "DR", city: "Kolkata, IN", co2Saved: 49.5, itemsCycled: 11, badge: "✨ Sustainable Stylist", points: 1280, period: "month" },
        { rank: 7, name: "Dev Patel", handle: "@devcircular", avatar: "DP", city: "Bengaluru, IN", co2Saved: 38.0, itemsCycled: 9, badge: "🌟 Eco Patron", points: 980, period: "month" },
        { rank: 8, name: "Nisha Rao", handle: "@nishathrifts", avatar: "NR", city: "Bengaluru, IN", co2Saved: 26.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 720, period: "month" },
      ];
      await Leaderboard.insertMany(SEED_MONTH_LEADERBOARD);
      console.log("🌱 Seeded circular leaderboard into MongoDB (db.leaderboards)");
    }

    // -------------------------------------------------------------
    // HARSHA DEMO DATA SEEDING (usr-buyer-harsha / harsha@gmail.com):
    // -------------------------------------------------------------
    const harshaSeedOrders = [
      {
        id: "#FC-00412",
        item: "Vintage Levi's 501 Original Fit Denim",
        seller: "Marco R.",
        date: "Sep 8, 2026",
        price: 55,
        status: "Delivered",
        img: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop&auto=format",
        trackingNumber: "FC-IND-8829104",
        carrier: "EcoCourier Express (100% Electric)",
        estimatedDelivery: "Delivered on Sep 11, 2026",
        address: "Flat 402, Green Meadows, Bengaluru, 560034",
        buyerId: "usr-buyer-harsha",
        userId: "harsha@gmail.com",
      },
      {
        id: "#FC-00398",
        item: "Ganni Pastel Check Organic Cotton Top",
        seller: "Ana K.",
        date: "Sep 2, 2026",
        price: 65,
        status: "In Transit",
        img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
        trackingNumber: "FC-IND-9912034",
        carrier: "BlueDart CarbonNeutral",
        estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
        address: "Flat 402, Green Meadows, Bengaluru, 560034",
        buyerId: "usr-buyer-harsha",
        userId: "harsha@gmail.com",
      },
      {
        id: "#FC-00371",
        item: "Nanushka Vegan Leather Moto Jacket",
        seller: "Lea B.",
        date: "Aug 25, 2026",
        price: 195,
        status: "Delivered",
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format",
        trackingNumber: "FC-IND-7734190",
        carrier: "EcoCourier Express",
        estimatedDelivery: "Delivered on Aug 28, 2026",
        address: "Flat 402, Green Meadows, Bengaluru, 560034",
        buyerId: "usr-buyer-harsha",
        userId: "harsha@gmail.com",
      },
      {
        id: "#FC-00289",
        item: "Studio Nicholson Heavyweight Boxy Cotton Tee",
        seller: "Priya Archives",
        date: "Aug 12, 2026",
        price: 45,
        status: "Delivered",
        img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop&auto=format",
        trackingNumber: "FC-IND-6619021",
        carrier: "EcoCourier Express",
        estimatedDelivery: "Delivered on Aug 15, 2026",
        address: "Flat 402, Green Meadows, Bengaluru, 560034",
        buyerId: "usr-buyer-harsha",
        userId: "harsha@gmail.com",
      },
    ];
    for (const ord of harshaSeedOrders) {
      await Order.findOneAndUpdate({ id: ord.id }, { $set: ord }, { upsert: true, new: true });
    }
    console.log("🌱 Synced mock orders for harsha@gmail.com");

    const harshaSavedCount = await SavedItem.countDocuments({
      $or: [{ userId: "usr-buyer-harsha" }, { userId: "harsha@gmail.com" }],
    });
    if (harshaSavedCount === 0) {
      await SavedItem.insertMany([
        { listingId: "lst-001", userId: "usr-buyer-harsha", title: "Vintage Ralph Lauren Wool Blazer", brand: "Ralph Lauren", price: 85 },
        { listingId: "lst-002", userId: "usr-buyer-harsha", title: "Zara Mulberry Silk Wrap Dress", brand: "Zara", price: 42 },
        { listingId: "lst-003", userId: "usr-buyer-harsha", title: "Linen Minimalist Co-ord Set", brand: "& Other Stories", price: 68 },
        { listingId: "lst-005", userId: "usr-buyer-harsha", title: "Reformation Floral Midi Dress", brand: "Reformation", price: 94 },
      ]);
      console.log("🌱 Seeded mock wishlist for harsha@gmail.com");
    }

    await Impact.findOneAndUpdate(
      { userId: "usr-buyer-harsha" },
      { userId: "usr-buyer-harsha", co2: 48.4, water: 2400, items: 12, money: 480 },
      { upsert: true, new: true }
    );
    await Impact.findOneAndUpdate(
      { userId: "harsha@gmail.com" },
      { userId: "harsha@gmail.com", co2: 48.4, water: 2400, items: 12, money: 480 },
      { upsert: true, new: true }
    );

    const harshaNotifCount = await Notification.countDocuments({
      $or: [{ userId: "usr-buyer-harsha" }, { userId: "harsha@gmail.com" }],
    });
    if (harshaNotifCount === 0) {
      await Notification.insertMany([
        {
          id: "notif-h1",
          icon: "📦",
          text: "Your order #FC-00398 (Ganni Pastel Check Blouse) is In Transit with EcoCourier Express!",
          time: "15m ago",
          read: false,
          userId: "usr-buyer-harsha",
        },
        {
          id: "notif-h2",
          icon: "🌿",
          text: "You reached #4 on the Bengaluru Top Buyers Leaderboard with 48.4 kg CO₂ prevented!",
          time: "2h ago",
          read: false,
          userId: "usr-buyer-harsha",
        },
        {
          id: "notif-h3",
          icon: "🏷️",
          text: "Price Drop Alert: Vintage Ralph Lauren Wool Blazer on your wishlist dropped to 85₹",
          time: "1d ago",
          read: true,
          userId: "usr-buyer-harsha",
        },
        {
          id: "notif-h4",
          icon: "✨",
          text: "Welcome back Harsha! You have 1,420 circular points and Gold Contributor tier.",
          time: "3d ago",
          read: true,
          userId: "usr-buyer-harsha",
        },
      ]);
      console.log("🌱 Seeded mock notifications for harsha@gmail.com");
    }

    await Buyer.findOneAndUpdate(
      { buyerId: "usr-buyer-harsha" },
      {
        buyerId: "usr-buyer-harsha",
        email: "harsha@gmail.com",
        name: "Harsha (Buyer)",
        handle: "@harsha",
        avatar: "HA",
        shippingAddress: "Flat 402, Green Meadows, Bengaluru, 560034",
        ecoPoints: 1420,
        co2SavedKg: 48.4,
        waterSavedLitres: 2400,
        piecesPurchased: 12,
        tier: "Gold Level Eco Contributor",
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Database seeding error:", error);
  }
}
