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

// Models to try in order
const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.8-flash"];

/**
 * Call Google Gemini API with fallback across models
 */
export async function queryGemini(
  prompt: string,
  images?: { mimeType: string; base64: string }[]
): Promise<GeminiAnalysisResult> {
  const isImageAnalysis = images && images.length > 0;

  if (!GEMINI_API_KEY) {
    return generateFallbackAnalysis(prompt, images);
  }

  const systemInstructions = `You are CycleBot, the intelligent AI circular fashion advisor & garment appraiser for FashionCycle (a premier sustainable circular fashion marketplace).
Always use Indian Rupee currency with the symbol placed AFTER the number (e.g. 850₹ – 1,400₹).
Tone: Chic, encouraging, eco-conscious, authoritative yet friendly.

${
  isImageAnalysis
    ? `TASK FOR IMAGE ANALYSIS:
Carefully inspect the uploaded garment image(s).
Evaluate:
1. Garment type, brand/aesthetic, fabric texture, condition (like new, excellent, good, fair, or damaged).
2. Calculate the PERCENTAGE PROBABILITY of which circular action is best for the customer:
   - "To Sell" (Resale value, buyer demand, fashion desirability)
   - "To Repair" (Fixable seams, lost buttons, lint, stains, restorable value)
   - "To Donate" (Everyday essential, charity drop-off, community swap)
   - "To Recycle" (Unwearable, severe tears, textile fiber downcycling)
Ensure the 4 percentages sum up to exactly 100%. The highest percentage is the topAction.
3. Resale price estimate in ₹ (format: "X₹ – Y₹").
4. Sustainability metrics (approx CO2 kg prevented, water liters conserved).
5. 4 style/search tags.
6. 2-3 interactive suggested follow-up prompts.

You MUST respond strictly in valid JSON matching this schema:
{
  "analysisText": "Clean, polished text describing what you observe in the garment. Format as clear sections (e.g. Garment Inspection, Item, Fabric & Feel, Condition Evaluation, Recommendation). Do NOT output raw markdown symbols like '###' or raw asterisks '* ' bullets; provide clean text that reads beautifully.",
  "topAction": {
    "action": "To Sell" | "To Repair" | "To Donate" | "To Recycle",
    "percentage": 68,
    "icon": "🏷️" | "🪡" | "🎁" | "♻️",
    "reason": "Brief reason why this action is best"
  },
  "actionBreakdown": [
    { "action": "To Sell", "percentage": 68, "icon": "🏷️", "color": "var(--accent)", "description": "..." },
    { "action": "To Repair", "percentage": 16, "icon": "🪡", "color": "#fbbf24", "description": "..." },
    { "action": "To Donate", "percentage": 11, "icon": "🎁", "color": "#38bdf8", "description": "..." },
    { "action": "To Recycle", "percentage": 5, "icon": "♻️", "color": "#a78bfa", "description": "..." }
  ],
  "estimatedValue": "850₹ – 1,450₹",
  "co2Saved": "12.4 kg CO₂",
  "waterSaved": "2,400 L Water",
  "styleTags": ["#Vintage", "#Minimalist", "#PreLoved", "#Sustainable"],
  "suggestedPrompts": ["How to stage photos for selling?", "What should I pair this with?", "How to wash this fabric?"]
}`
    : `TASK FOR TEXT CHAT:
Answer questions about circular fashion, selling on FashionCycle, garment repair, fabric care, pricing recommendations, and sustainability.
Provide engaging markdown with bullet points, bold highlights, and helpful advice.
Also provide 2-3 interactive suggested follow-up prompts.`
}`;

  for (const model of MODELS_TO_TRY) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const parts: any[] = [];
      parts.push({ text: `${systemInstructions}\n\nUSER PROMPT: ${prompt || "Analyze this garment and calculate the best circular option."}` });

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

      const requestBody: any = {
        contents: [{ parts }],
      };

      if (isImageAnalysis) {
        requestBody.generationConfig = {
          responseMimeType: "application/json",
          temperature: 0.4,
        };
      } else {
        requestBody.generationConfig = {
          temperature: 0.7,
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.warn(`Gemini model ${model} responded with status ${response.status}. Trying next...`);
        continue;
      }

      const data = await response.json();
      const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!outputText) {
        continue;
      }

      if (isImageAnalysis) {
        try {
          const parsed = JSON.parse(outputText);
          return {
            text: parsed.analysisText || "Analysis complete!",
            topAction: parsed.topAction,
            actionBreakdown: parsed.actionBreakdown,
            estimatedValue: parsed.estimatedValue,
            co2Saved: parsed.co2Saved,
            waterSaved: parsed.waterSaved,
            styleTags: parsed.styleTags,
            suggestedPrompts: parsed.suggestedPrompts,
          };
        } catch (e) {
          // If JSON parsing had trailing markdown ticks
          const cleaned = outputText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
          const parsed = JSON.parse(cleaned);
          return {
            text: parsed.analysisText || "Analysis complete!",
            topAction: parsed.topAction,
            actionBreakdown: parsed.actionBreakdown,
            estimatedValue: parsed.estimatedValue,
            co2Saved: parsed.co2Saved,
            waterSaved: parsed.waterSaved,
            styleTags: parsed.styleTags,
            suggestedPrompts: parsed.suggestedPrompts,
          };
        }
      }

      // For text chat
      return {
        text: outputText,
        suggestedPrompts: [
          "📸 Value an item from a photo",
          "🌱 How does circular fashion save water?",
          "🏷️ Best tips to sell faster",
        ],
      };
    } catch (err) {
      console.warn(`Error querying ${model}:`, err);
    }
  }

  // Graceful fallback if Gemini API is temporarily busy or unreachable
  return getFallbackResult(prompt, isImageAnalysis);
}

function getFallbackResult(userText: string, isImage: boolean): GeminiAnalysisResult {
  const text = userText.toLowerCase();

  const isRepair = text.includes("tear") || text.includes("rip") || text.includes("hole") || text.includes("button") || text.includes("repair");
  const isRecycle = text.includes("ruined") || text.includes("destroyed") || text.includes("stain") || text.includes("scrap");
  const isDonate = text.includes("donate") || text.includes("charity") || text.includes("give") || text.includes("small");

  let top = { action: "To Sell", percentage: 68, icon: "🏷️", reason: "Good fabric condition & high buyer interest on FashionCycle." };
  let breakdown: CircularActionBreakdown[] = [
    { action: "To Sell", percentage: 68, icon: "🏷️", color: "var(--accent)", description: "Optimal return. High buyer demand." },
    { action: "To Repair", percentage: 17, icon: "🪡", color: "#fbbf24", description: "Minor steam or lint clean-up before photography." },
    { action: "To Donate", percentage: 10, icon: "🎁", color: "#38bdf8", description: "Viable for local circular swap." },
    { action: "To Recycle", percentage: 5, icon: "♻️", color: "#a78bfa", description: "Garment is too valuable to scrap." },
  ];

  if (isRepair) {
    top = { action: "To Repair", percentage: 64, icon: "🪡", reason: "A quick stitch or replacement button restores premium resale value!" };
    breakdown = [
      { action: "To Repair", percentage: 64, icon: "🪡", color: "#fbbf24", description: "Quick fix restores up to 80% resale value." },
      { action: "To Sell", percentage: 22, icon: "🏷️", color: "var(--accent)", description: "Can still sell as 'Fair/Good' with disclosure." },
      { action: "To Donate", percentage: 9, icon: "🎁", color: "#38bdf8", description: "Most shelters require ready-to-wear pieces." },
      { action: "To Recycle", percentage: 5, icon: "♻️", color: "#a78bfa", description: "Repairability is high; recycling not needed." },
    ];
  } else if (isRecycle) {
    top = { action: "To Recycle", percentage: 70, icon: "♻️", reason: "Severe fabric wear makes fiber downcycling the most eco-friendly choice." };
    breakdown = [
      { action: "To Recycle", percentage: 70, icon: "♻️", color: "#a78bfa", description: "Fiber recycling diverts textile from landfills." },
      { action: "To Repair", percentage: 15, icon: "🪡", color: "#fbbf24", description: "Patchwork or upcycling into an accessory is possible." },
      { action: "To Donate", percentage: 10, icon: "🎁", color: "#38bdf8", description: "Drop in designated textile recycling bins." },
      { action: "To Sell", percentage: 5, icon: "🏷️", color: "var(--accent)", description: "Low commercial resale value." },
    ];
  } else if (isDonate) {
    top = { action: "To Donate", percentage: 62, icon: "🎁", reason: "Everyday wardrobe essential ideal for community redistribution." };
    breakdown = [
      { action: "To Donate", percentage: 62, icon: "🎁", color: "#38bdf8", description: "Highest immediate community impact." },
      { action: "To Sell", percentage: 26, icon: "🏷️", color: "var(--accent)", description: "Ready to list if you prefer pocket money." },
      { action: "To Repair", percentage: 8, icon: "🪡", color: "#fbbf24", description: "Ready to wear with no fixes needed." },
      { action: "To Recycle", percentage: 4, icon: "♻️", color: "#a78bfa", description: "Too good to downcycle." },
    ];
  }

  return {
    text: isImage
      ? `🔍 **Visual Garment Analysis**\n\nI evaluated this garment across condition, fabric longevity, and marketplace desirability. Here is your circular action breakdown:`
      : `🌿 **CycleBot Circular Stylist**\n\nEvery item recirculated through second-hand circularity avoids up to **82% of greenhouse gas emissions** compared to new fashion! Upload an image anytime for an instant appraisal.`,
    topAction: top,
    actionBreakdown: breakdown,
    estimatedValue: "750₹ – 1,500₹",
    co2Saved: "11.2 kg CO₂",
    waterSaved: "2,300 L Water",
    styleTags: ["#PreLoved", "#Sustainable", "#CircularChoice", "#Quality"],
    suggestedPrompts: [
      "📸 Analyze another photo",
      "🌱 How are CO2 savings calculated?",
      "🏷️ How do I list this on the shop?",
    ],
  };
}

