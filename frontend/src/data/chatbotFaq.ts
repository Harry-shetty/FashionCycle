import type { CircularActionBreakdown } from "../components/shared/FashionChatbot";

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  response: {
    text: string;
    topAction?: {
      action: string;
      percentage: number;
      icon: string;
      reason: string;
    };
    actionBreakdown?: CircularActionBreakdown[];
    estimatedValue?: string;
    co2Saved?: string;
    waterSaved?: string;
    styleTags?: string[];
    suggestedPrompts?: string[];
  };
}

export const CHATBOT_FAQS: FaqItem[] = [
  {
    id: "sell-vs-repair-vs-donate",
    category: "Circular Decision",
    question: "Which is a better option: to sell, repair, donate, or recycle?",
    keywords: [
      "sell vs repair",
      "sell or repair",
      "sell or donate",
      "better option",
      "what should i do with",
      "donate or sell",
      "recycle or donate",
      "decision",
      "repair or sell",
    ],
    response: {
      text: `⚖️ **Circular Decision Matrix Guide:**\n\nHere is how to choose the optimal circular pathway for your garments:\n\n• **🏷️ To Sell (First Priority)**: If the item is in Good to Like-New condition, has recognizable branding, or on-trend styling. Gives you earnings and recirculates quality clothing.\n• **🪡 To Repair (Value Booster)**: If there is a missing button, loose hem, or small seam tear. A 10-minute fix can increase resale value by up to 50%!\n• **🎁 To Donate (Community Impact)**: Best for comfortable basics and everyday clothing in good condition where quick re-homing does immediate good.\n• **♻️ To Recycle (Zero Waste)**: When fabrics are heavily stained, frayed, or shredded beyond wearability. Diverts textiles to fiber recycling.`,
      topAction: {
        action: "To Sell",
        percentage: 65,
        icon: "🏷️",
        reason: "Highest economic & circular value for wearable pre-loved garments.",
      },
      actionBreakdown: [
        { action: "To Sell", percentage: 65, icon: "🏷️", color: "var(--accent)", description: "High marketplace desirability on FashionCycle." },
        { action: "To Repair", percentage: 18, icon: "🪡", color: "#fbbf24", description: "Minor fixes restore original premium value." },
        { action: "To Donate", percentage: 12, icon: "🎁", color: "#38bdf8", description: "Ideal for basics or community clothing swaps." },
        { action: "To Recycle", percentage: 5, icon: "♻️", color: "#a78bfa", description: "Textile downcycling for unwearable scraps." },
      ],
      suggestedPrompts: [
        "📸 Value an item from a photo",
        "🏷️ How do I list an item to sell?",
        "🌱 How is CO2 calculated?",
      ],
    },
  },
  {
    id: "how-to-sell",
    category: "Selling",
    question: "How do I sell clothes on FashionCycle?",
    keywords: [
      "how to sell",
      "how do i sell",
      "selling guide",
      "list an item",
      "how to list",
      "become a seller",
      "sell clothes",
    ],
    response: {
      text: `🏷️ **How to Sell on FashionCycle in 4 Simple Steps:**\n\n1. **Snap Clear Photos**: Take bright photos in natural daylight showing the front, back, label, and any minor flaws.\n2. **Describe & Grade Condition**: Tag the brand, fabric composition, and accurately select Pristine, Excellent, or Good.\n3. **Set Your Price**: Competitive circular prices sell 3x faster. (You can also ask me for a price estimate!)\n4. **Ship with Eco-Mailers**: Once bought, use your downloadable pre-paid label. Payouts are transferred as soon as delivered.`,
      suggestedPrompts: [
        "📸 Value an item from a photo",
        "📦 How does shipping work?",
        "💰 How do payouts work?",
      ],
    },
  },
  {
    id: "pricing-guide",
    category: "Valuation",
    question: "How should I price my pre-loved clothing?",
    keywords: [
      "how to price",
      "pricing guide",
      "how much to charge",
      "pricing tips",
      "resale price",
      "how much is it worth",
      "estimate price",
    ],
    response: {
      text: `💰 **FashionCycle Circular Pricing Formula:**\n\n• **Like-New / With Tags**: Price at **60% – 75%** of original retail value.\n• **Excellent Condition**: Price at **45% – 60%** of original retail.\n• **Good / Vintage Condition**: Price at **30% – 45%**.\n• **Designer & Archival Items** (e.g. Toteme, Acne Studios, Levi's 501s): Retain up to **70%–85%** of retail due to collector demand.\n\n💡 *Tip: Drop a photo of your item here and I'll calculate an instant resale appraisal in ₹!*`,
      estimatedValue: "750₹ – 2,200₹",
      styleTags: ["Pricing", "ResaleGuide", "FairPrice"],
      suggestedPrompts: [
        "📸 Value an item from a photo",
        "🏷️ Best tips to sell faster",
        "⚖️ Sell vs Repair vs Donate",
      ],
    },
  },
  {
    id: "eco-impact-co2-water",
    category: "Sustainability",
    question: "How does FashionCycle calculate CO₂ and water savings?",
    keywords: [
      "how is co2 calculated",
      "carbon saved",
      "water saved",
      "eco impact",
      "co2 impact",
      "sustainability calculation",
      "environmental impact",
      "green metrics",
    ],
    response: {
      text: `🌱 **Our Circular Impact Methodology:**\n\nBuying or reselling one pre-loved garment displaces the manufacturing footprint of a new garment:\n\n• **💧 Water Conserved**: Producing one new cotton shirt requires ~2,700 Liters of water; denim jeans require ~7,600 Liters. Circulating an existing piece saves 100% of that agricultural water!\n• **🌿 CO₂ Emissions Prevented**: Extending garment life by just 9 months reduces carbon, waste, and water footprints by approximately **20% to 30%**.\n• **♻️ Landfill Avoidance**: Every transaction keeps ~0.5 kg to 1.8 kg of textile materials out of municipal landfills.\n\nYou can track your cumulative eco-savings live on your **My Impact** dashboard!`,
      co2Saved: "48.4 kg CO₂ prevented",
      waterSaved: "3,820 L Water saved",
      suggestedPrompts: [
        "🌱 Check My Impact page",
        "🧼 Garment longevity tips",
        "📸 Value an item from a photo",
      ],
    },
  },
  {
    id: "shipping-and-packaging",
    category: "Logistics",
    question: "How does shipping and packaging work?",
    keywords: [
      "shipping",
      "delivery",
      "packaging",
      "shipping cost",
      "how to ship",
      "courier",
      "dispatch",
      "mailers",
    ],
    response: {
      text: `📦 **Eco-Friendly Shipping with FashionCycle:**\n\n• **100% Compostable Packaging**: We partner with eco-packaging suppliers so all items travel in recycled kraft mailers.\n• **Prepaid Shipping Labels**: As soon as a buyer orders your item, a prepaid downloadable shipping label is automatically generated in your **Orders** tab.\n• **Pickup & Drop-off**: Hand over the package to our partnered green couriers or drop it off at designated hubs.\n• **Track Real-time**: Both buyer and seller receive live tracking notifications directly in the app.`,
      suggestedPrompts: [
        "📦 View active orders",
        "💰 When do I receive payout?",
        "🏷️ How to sell clothes",
      ],
    },
  },
  {
    id: "payouts-and-earnings",
    category: "Finance",
    question: "When and how do sellers receive their payout?",
    keywords: [
      "payout",
      "get paid",
      "receive money",
      "payment methods",
      "bank transfer",
      "earnings",
      "seller commission",
      "fees",
    ],
    response: {
      text: `💳 **Seller Payouts & Security:**\n\n• **Escrow Protection**: Buyer payment is securely held when an order is placed.\n• **Instant Release**: Funds are released to your FashionCycle balance as soon as the courier confirms delivery.\n• **Direct Bank Transfer**: Transfer your earnings straight to your bank account or UPI in **₹** with zero transfer delay.\n• **Transparent Platform Fee**: We maintain a flat, low platform fee of only 8% to fund zero-emission logistics and buyer verification.`,
      suggestedPrompts: [
        "🏷️ How to sell clothes",
        "📦 How does shipping work?",
        "📸 Value an item from a photo",
      ],
    },
  },
  {
    id: "fabric-care-repair",
    category: "Care",
    question: "How can I care for and repair delicate vintage garments?",
    keywords: [
      "care guide",
      "how to wash",
      "wash vintage",
      "repair clothes",
      "fixing seams",
      "loose buttons",
      "garment care",
      "longevity",
    ],
    response: {
      text: `🧼 **Pro Garment Longevity & Repair Guide:**\n\n1. **Cold Wash Always**: Washing at 30°C or cold protects natural fibers (wool, linen, silk) and cuts washing energy by 60%.\n2. **Avoid Tumble Dryers**: Line dry or lay flat on a towel. Dryers degrade elastic fibers and cause fabric pilling.\n3. **Quick Seam Stitch**: A basic running stitch or invisible slip stitch fixes hem unraveling in under 5 minutes.\n4. **Depill with a Wool Comb**: Remove surface pills gently with a cashmere/wool comb to make knitwear look brand new before photographing for sale!`,
      suggestedPrompts: [
        "🪡 Repair or sell my clothes?",
        "📸 Value an item from a photo",
        "🌱 How is CO2 calculated?",
      ],
    },
  },
  {
    id: "returns-buyer-protection",
    category: "Trust",
    question: "What is FashionCycle's return and authenticity policy?",
    keywords: [
      "return policy",
      "returns",
      "refund",
      "authenticity",
      "buyer protection",
      "fake",
      "guarantee",
      "money back",
    ],
    response: {
      text: `🛡️ **Buyer Protection & Authenticity Guarantee:**\n\n• **Condition Accuracy Guarantee**: If an item arrives significantly different from the seller's photos or description, you have 48 hours to request a full refund.\n• **Zero Counterfeit Policy**: All high-tier designer listings undergo AI verification and expert curator review.\n• **Secure Dispute Resolution**: Our team mediates any sizing or shipping concerns promptly.`,
      suggestedPrompts: [
        "📦 View my orders",
        "🏷️ How to sell clothes",
        "📸 Value an item from a photo",
      ],
    },
  },
];

/**
 * Searches predetermined FAQs for matching keywords or questions.
 * Returns the predetermined mock data response if matched, avoiding Gemini API calls.
 */
export function findFaqMatch(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  for (const item of CHATBOT_FAQS) {
    // 1. Exact or near-exact question match
    if (normalized === item.question.toLowerCase() || item.question.toLowerCase().includes(normalized)) {
      return item.response;
    }

    // 2. Keyword trigger match
    for (const kw of item.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        return item.response;
      }
    }
  }

  return null;
}

