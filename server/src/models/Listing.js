import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String, required: true },
    condition: { 
      type: String, 
      enum: ["Like New", "Excellent", "Good", "Fair"], 
      default: "Excellent" 
    },
    category: { 
      type: String, 
      enum: ["Tops & Tees", "Outerwear", "Dresses", "Denim", "Shoes", "Accessories"], 
      required: true 
    },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    sellerId: { type: String, default: "user-current" },
    sold: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
