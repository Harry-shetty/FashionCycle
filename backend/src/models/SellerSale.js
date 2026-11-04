import mongoose from "mongoose";

const sellerSaleSchema = new mongoose.Schema(
  {
    saleId: { type: String, required: true, unique: true },
    sellerId: { type: String, required: true, default: "seller-1" },
    buyerId: { type: String, default: "buyer-001" },
    buyerName: { type: String, default: "Harsha (Buyer)" },
    listingId: { type: String, required: true },
    itemTitle: { type: String, required: true },
    brand: { type: String, default: "" },
    price: { type: Number, required: true },
    sellerPayout: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Awaiting Packing", "Packed", "Shipped", "Delivered", "Completed"],
      default: "Delivered",
    },
    trackingNumber: { type: String, default: "FC-IND-8829104" },
    carrier: { type: String, default: "EcoCourier Express (100% Electric)" },
    shippingAddress: { type: String, default: "Flat 402, Green Meadows, Bengaluru, 560034" },
    saleDate: { type: String, default: () => new Date().toLocaleDateString() },
  },
  { timestamps: true }
);

export const SellerSale = mongoose.model("SellerSale", sellerSaleSchema, "seller_sales");

