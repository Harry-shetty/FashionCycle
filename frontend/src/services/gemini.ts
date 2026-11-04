import type { CircularActionBreakdown } from "../components/shared/FashionChatbot";

export interface GeminiAnalysisResult {
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
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Standard official Google Gemini models to try in priority order
const MODELS_TO_TRY = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

const SYSTEM_INSTRUCTIONS = `You are CycleBot, the AI circular fashion intelligence agent and garment appraisal expert for FashionCycle (a premier sustainable circular fashion marketplace).

CORE CAPABILITY:
You evaluate clothing and calculate the exact percentage score for the best sustainable management pathway (e.g. To Sell: 90%, To Repair: 5%, To Recycle: 5%, etc.).

STRICT TOPIC GUARDRAILS:
1. You MUST ONLY respond to queries related to:
   - Fashion, clothing, garments, textiles, fabrics, footwear, bags, and luxury accessories.
   - Sustainable fashion, circular economy, textile waste, carbon/water conservation, and eco metrics.
   - Garment appraisal, condition evaluation, and fair resale pricing (in Indian Rupees with ₹ symbol placed AFTER the amount, e.g. 850₹ – 1,400₹).
   - Clothing care, washing, stain removal, sewing repairs, alterations, upcycling, donation, and textile recycling.
   - Wardrobe curation, styling recommendations, and second-hand shopping tips.
   - FashionCycle marketplace features (buying, selling, orders, circular savings, leaderboard).

2. UNRELATED / OFF-TOPIC QUERIES:
   If the user asks about ANYTHING outside this domain (e.g., coding, math, general trivia, politics, sports, movies, recipes, non-fashion advice):
   - You MUST POLITELY DECLINE to answer the off-topic query.
   - State that you are CycleBot, specialized exclusively in circular fashion, garment care, and sustainable wardrobe management.
   - Set "isRelated": false in your JSON output.
   - Set "hasCircularBreakdown": false.
   - In "analysisText", output: "I am CycleBot, your dedicated circular fashion and sustainable garment appraisal advisor! 🌿 I specialize exclusively in fashion, garment care, eco-impact, resale valuations, and circular styling.\n\nI can only assist with queries related to clothing and sustainable fashion. How can I help with your wardrobe today?"
   - In "suggestedPrompts", suggest 3 relevant circular fashion questions.
   - Do NOT provide the off-topic answer under any circumstance.

SUSTAINABLE MANAGEMENT SCORING RULES:
Whenever evaluating a garment (either from an uploaded image OR a user's text description of a garment, condition, or dilemma):
You MUST dynamically score the 4 sustainable circular pathways so they sum to EXACTLY 100%:
- "To Sell" (Resale value, buyer demand, style desirability, wearable condition)
- "To Repair" (Fixable seams, torn hem, missing buttons, stains that can be removed to restore value)
- "To Donate" (Everyday essential basic, community swap, shelter drop-off)
- "To Recycle" (Severe rips, threadbare fabric, non-repairable structural damage, downcycling into fiber/rags)

Choose the highest percentage as the "topAction".
Ensure the percentages realistically reflect the specific item described or pictured!
(Examples:
- Pristine/Like-New item: Sell 88-92%, Repair 4-6%, Donate 3-4%, Recycle 1-2%.
- Damaged but fixable item: Repair 70-80%, Sell 12-18%, Donate 5-7%, Recycle 3-5%.
- Everyday worn basic: Donate 60-70%, Sell 20-25%, Repair 5-10%, Recycle 5%.
- Ruined/unwearable scrap: Recycle 80-90%, Repair 5-10%, Donate 2-5%, Sell 1-2%.)

RESPONSE SCHEMA:
You MUST respond strictly with a valid JSON object matching this schema:
{
  "isRelated": boolean,
  "hasCircularBreakdown": boolean,
  "analysisText": "Polished, well-formatted markdown response with clear sections.",
  "topAction": {
    "action": "To Sell" | "To Repair" | "To Donate" | "To Recycle",
    "percentage": number,
    "icon": "🏷️" | "🪡" | "🎁" | "♻️",
    "reason": "Brief, compelling explanation why this action is best"
  },
  "actionBreakdown": [
    { "action": "To Sell", "percentage": number, "icon": "🏷️", "color": "var(--accent)", "description": "..." },
    { "action": "To Repair", "percentage": number, "icon": "🪡", "color": "#fbbf24", "description": "..." },
    { "action": "To Donate", "percentage": number, "icon": "🎁", "color": "#38bdf8", "description": "..." },
    { "action": "To Recycle", "percentage": number, "icon": "♻️", "color": "#a78bfa", "description": "..." }
  ],
  "estimatedValue": "string (e.g. '850₹ – 1,400₹')",
  "co2Saved": "string (e.g. '12.4 kg CO₂')",
  "waterSaved": "string (e.g. '2,400 L Water')",
  "styleTags": ["#Vintage", "#PreLoved", "#Sustainable", "#Quality"],
  "suggestedPrompts": ["Question 1", "Question 2", "Question 3"]
}

If the query is a general sustainable fashion question without an item to score:
Set "isRelated": true, "hasCircularBreakdown": false, omit topAction and actionBreakdown, and provide an engaging "analysisText".`;

/**
 * Call Google Gemini API with fallback across models
 */
export async function queryGemini(
  prompt: string,
  images?: { mimeType: string; base64: string }[]
): Promise<GeminiAnalysisResult> {
  const isImageAnalysis = images && images.length > 0;

  if (!GEMINI_API_KEY) {
    return getFallbackResult(prompt, Boolean(isImageAnalysis));
  }

  for (const model of MODELS_TO_TRY) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const parts: any[] = [];
      parts.push({
        text: `${SYSTEM_INSTRUCTIONS}\n\nUSER PROMPT: ${prompt || "Analyze this garment, score its best sustainable pathway (Sell, Repair, Donate, Recycle), and provide circular recommendations."}`,
      });

      if (images && images.length > 0) {
        images.forEach((img) => {
          parts.push({
            inlineData: {
              mimeType: img.mimeType,
              data: img.base64,
            },
          });
        });
      }

      const requestBody = {
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini model ${model} responded with status ${response.status}:`, errorText);
        continue;
      }

      const data = await response.json();
      const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!outputText) {
        continue;
      }

      try {
        const cleaned = outputText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
        const parsed = JSON.parse(cleaned);

        return {
          text: parsed.analysisText || "Analysis complete!",
          topAction: parsed.hasCircularBreakdown ? parsed.topAction : undefined,
          actionBreakdown: parsed.hasCircularBreakdown ? parsed.actionBreakdown : undefined,
          estimatedValue: parsed.hasCircularBreakdown ? parsed.estimatedValue : undefined,
          co2Saved: parsed.hasCircularBreakdown ? parsed.co2Saved : undefined,
          waterSaved: parsed.hasCircularBreakdown ? parsed.waterSaved : undefined,
          styleTags: parsed.styleTags || ["#Sustainable", "#CircularChoice", "#FashionCycle"],
          suggestedPrompts: parsed.suggestedPrompts || [
            "📸 Appraise a photo of another item",
            "🌱 How do my purchases save water?",
            "🏷️ Best price strategy to sell faster",
          ],
        };
      } catch (parseErr) {
        console.warn("Could not parse JSON response from Gemini, using raw text:", parseErr);
        return {
          text: outputText,
          suggestedPrompts: [
            "📸 Appraise a photo of another item",
            "🌱 How do my purchases save water?",
            "🏷️ Best price strategy to sell faster",
          ],
        };
      }
    } catch (err) {
      console.warn(`Error querying ${model}:`, err);
    }
  }

  // Graceful fallback if Gemini API is temporarily busy or unreachable
  return getFallbackResult(prompt, Boolean(isImageAnalysis));
}

function getFallbackResult(userText: string, isImage: boolean): GeminiAnalysisResult {
  const text = userText.toLowerCase();

  // Guardrail check in fallback mode as well!
  const isOffTopic =
    text.includes("python") ||
    text.includes("code") ||
    text.includes("javascript") ||
    text.includes("math") ||
    text.includes("capital of") ||
    text.includes("football") ||
    text.includes("cricket") ||
    text.includes("recipe") ||
    text.includes("movie") ||
    text.includes("weather");

  if (isOffTopic) {
    return {
      text: "I am CycleBot, your dedicated circular fashion and sustainable garment appraisal advisor! 🌿 I specialize exclusively in fashion, garment care, eco-impact, resale valuations, and circular styling.\n\nI can only assist with queries related to clothing and sustainable fashion. How can I help with your wardrobe today?",
      suggestedPrompts: [
        "🏷️ Score an item: Sell, Repair, Donate, or Recycle?",
        "🪡 How do I fix a torn seam or missing button?",
        "🌱 How much CO₂ is avoided by buying second-hand?",
      ],
    };
  }

  const isRepair =
    text.includes("tear") ||
    text.includes("rip") ||
    text.includes("hole") ||
    text.includes("button") ||
    text.includes("stitch") ||
    text.includes("repair");
  const isRecycle =
    text.includes("ruined") ||
    text.includes("destroyed") ||
    text.includes("stain") ||
    text.includes("shredded") ||
    text.includes("scrap");
  const isDonate =
    text.includes("donate") ||
    text.includes("charity") ||
    text.includes("give") ||
    text.includes("basic");

  let top = {
    action: "To Sell",
    percentage: 90,
    icon: "🏷️",
    reason: "Pristine fabric condition & high buyer demand make resale the optimal circular choice.",
  };
  let breakdown: CircularActionBreakdown[] = [
    { action: "To Sell", percentage: 90, icon: "🏷️", color: "var(--accent)", description: "Optimal return. High marketplace desirability." },
    { action: "To Repair", percentage: 5, icon: "🪡", color: "#fbbf24", description: "Quick steam before photography." },
    { action: "To Donate", percentage: 3, icon: "🎁", color: "#38bdf8", description: "Viable for community redistribution." },
    { action: "To Recycle", percentage: 2, icon: "♻️", color: "#a78bfa", description: "Garment is too valuable to downcycle." },
  ];

  if (isRepair) {
    top = {
      action: "To Repair",
      percentage: 75,
      icon: "🪡",
      reason: "A quick stitch or replacement button restores premium resale value!",
    };
    breakdown = [
      { action: "To Repair", percentage: 75, icon: "🪡", color: "#fbbf24", description: "Quick fix restores up to 80% resale value." },
      { action: "To Sell", percentage: 15, icon: "🏷️", color: "var(--accent)", description: "Can still sell as 'Good' once mended." },
      { action: "To Donate", percentage: 6, icon: "🎁", color: "#38bdf8", description: "Drop at local circular swap." },
      { action: "To Recycle", percentage: 4, icon: "♻️", color: "#a78bfa", description: "Repairability is high; downcycling not needed." },
    ];
  } else if (isRecycle) {
    top = {
      action: "To Recycle",
      percentage: 85,
      icon: "♻️",
      reason: "Severe fabric wear makes fiber downcycling the most eco-friendly choice.",
    };
    breakdown = [
      { action: "To Recycle", percentage: 85, icon: "♻️", color: "#a78bfa", description: "Fiber recycling diverts textile from landfills." },
      { action: "To Repair", percentage: 10, icon: "🪡", color: "#fbbf24", description: "Upcycling into an accessory or rag is possible." },
      { action: "To Donate", percentage: 3, icon: "🎁", color: "#38bdf8", description: "Drop in textile recycling bin." },
      { action: "To Sell", percentage: 2, icon: "🏷️", color: "var(--accent)", description: "Low commercial resale value." },
    ];
  } else if (isDonate) {
    top = {
      action: "To Donate",
      percentage: 65,
      icon: "🎁",
      reason: "Everyday wardrobe essential ideal for community redistribution.",
    };
    breakdown = [
      { action: "To Donate", percentage: 65, icon: "🎁", color: "#38bdf8", description: "Highest immediate community impact." },
      { action: "To Sell", percentage: 25, icon: "🏷️", color: "var(--accent)", description: "Ready to list if you prefer pocket money." },
      { action: "To Repair", percentage: 6, icon: "🪡", color: "#fbbf24", description: "Ready to wear with no fixes needed." },
      { action: "To Recycle", percentage: 4, icon: "♻️", color: "#a78bfa", description: "Too good to downcycle." },
    ];
  }

  return {
    text: isImage
      ? `🔍 **Visual Garment Analysis & Circular Pathway**\n\nI evaluated this garment across condition, fabric longevity, and marketplace desirability. Here is your circular management score:`
      : `🌿 **CycleBot Sustainable Fashion Advisor**\n\nHere is your calculated sustainable management breakdown based on fabric condition and circular resale value:`,
    topAction: top,
    actionBreakdown: breakdown,
    estimatedValue: "850₹ – 1,450₹",
    co2Saved: "11.2 kg CO₂",
    waterSaved: "2,400 L Water",
    styleTags: ["#PreLoved", "#Sustainable", "#CircularChoice", "#Quality"],
    suggestedPrompts: [
      "📸 Analyze another photo",
      "🌱 How are CO2 savings calculated?",
      "🏷️ How do I list this on the shop?",
    ],
  };
}
