import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
    images: [
      {
        id: String,
        name: String,
        type: { type: String },
        sizeFormatted: String,
        url: String,
      },
    ],
    details: {
      estimatedValue: String,
      co2Saved: String,
      waterSaved: String,
      styleTags: [String],
      topAction: {
        action: String,
        percentage: Number,
        icon: String,
        reason: String,
      },
      actionBreakdown: [
        {
          action: String,
          percentage: Number,
          icon: String,
          color: String,
          description: String,
        },
      ],
      suggestedPrompts: [String],
    },
    timestamp: { type: String, default: "Just now" },
    userId: { type: String, default: "default-user" },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

