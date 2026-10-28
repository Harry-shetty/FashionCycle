import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    item: { type: String, required: true },
    seller: { type: String, default: "FashionCycle Verified Seller" },
    date: { type: String, required: true },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["Processing", "In Transit", "Delivered", "Cancelled"], 
      default: "Processing" 
    },
    img: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    carrier: { type: String, default: "EcoCourier Express (100% Electric)" },
    estimatedDelivery: { type: String, default: "2-3 business days" },
    address: { type: String, default: "Flat 402, Green Meadows, Bengaluru, 560034" },
    buyerId: { type: String, default: "user-current" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
