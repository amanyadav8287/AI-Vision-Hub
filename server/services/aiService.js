/**
 * AI Service — pluggable vision analysis layer.
 *
 * Controllers call `analyzeImage(imagePath, mode)` and `askAboutScan(...)`.
 * The actual AI provider is selected via env.AI_PROVIDER:
 *   - "mock"    : built-in deterministic engine (works with no API key)
 *   - "openai"  : OpenAI vision endpoint (placeholder integration)
 *   - "gemini"  : Google Gemini vision endpoint (placeholder integration)
 *   - custom    : any URL set in env.AI_API_URL with env.AI_API_KEY
 *
 * To swap providers, implement a new provider object with the same shape
 * and add a case in `getProvider()`. Controllers, routes, and models stay
 * untouched.
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const env = require("../config/env");
const { AppError } = require("../middleware/errorMiddleware");

// ---------------------------------------------------------------------------
// Mock provider — deterministic, realistic-looking output for demo/dev.
// ---------------------------------------------------------------------------

const MODE_TEMPLATES = {
  product: () => ({
    detectedItem: "Premium Wireless Headphones",
    confidence: 92,
    category: "Audio device",
    overview:
      "A pair of wireless over-ear headphones designed for immersive personal audio, featuring active noise cancellation and long battery life.",
    keyInformation: {
      name: "Premium Wireless Headphones",
      brand: "Generic Audio Co.",
      model: "WH-X500",
      category: "Over-ear wireless",
    },
    specifications: [
      { label: "Driver", value: "40mm dynamic" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Battery", value: "~30 hours" },
      { label: "Weight", value: "~250 g" },
    ],
    features: [
      "Active noise cancellation",
      "Multipoint pairing",
      "Touch controls",
      "Voice assistant support",
    ],
    pros: [
      "Comfortable for long sessions",
      "Strong noise cancellation",
      "Good call quality",
    ],
    cons: [
      "No aptX support",
      "Case is bulkier than competitors",
    ],
    insights: [
      "Designed for long listening sessions with plush earcups.",
      "Active noise cancellation reduces ambient noise by up to 25 dB.",
      "Supports multipoint pairing across two devices.",
    ],
    recommendations: [
      "Charge fully before first use for battery calibration.",
      "Store in a dry case to preserve earcup foam.",
      "Update firmware for the latest ANC improvements.",
    ],
    price: null,
    priceNote: "Price information is unavailable from the image alone.",
  }),

  plant: () => ({
    detectedItem: "Aloe Vera",
    confidence: 94,
    category: "Succulent",
    overview:
      "Aloe vera is a hardy succulent widely grown for its ornamental value and the soothing gel found in its fleshy leaves.",
    keyInformation: {
      plantName: "Aloe Vera",
      scientificName: "Aloe barbadensis miller",
      origin: "Arabian Peninsula",
      lifespan: "Perennial (5–25 years)",
    },
    careLevel: "Very easy",
    watering: "Every 2–3 weeks, when top 2 inches of soil are dry",
    sunlight: "Bright, indirect light",
    soil: "Well-draining sandy or cactus mix",
    temperature: "13–27°C",
    commonProblems: [
      "Root rot from overwatering",
      "Leaf browning in direct sun",
      "Mealybugs",
    ],
    visibleSymptoms: [],
    insights: [
      "Thrives in bright, indirect light and low humidity.",
      "Prefers being under-watered rather than over-watered.",
      "Gel is commonly used to soothe minor burns and skin irritations.",
    ],
    recommendations: [
      "Water only when the top 2 inches of soil are dry.",
      "Use a well-draining cactus mix in a terracotta pot.",
      "Rotate the pot weekly for even growth.",
    ],
  }),

  food: () => ({
    detectedItem: "Margherita Pizza",
    confidence: 93,
    category: "Italian cuisine",
    overview:
      "A classic Neapolitan pizza celebrating the colors of the Italian flag with tomato, mozzarella and fresh basil.",
    keyInformation: {
      foodName: "Margherita Pizza",
      cuisine: "Italian",
      dish: "Pizza",
    },
    ingredients: [
      "Wheat flour",
      "San Marzano tomatoes",
      "Mozzarella di bufala",
      "Fresh basil",
      "Olive oil",
      "Salt",
    ],
    approxNutrition: [
      { label: "Calories", value: "~270 kcal per slice" },
      { label: "Carbs", value: "~34 g" },
      { label: "Protein", value: "~11 g" },
      { label: "Fat", value: "~10 g" },
    ],
    nutritionNote:
      "All nutritional values are approximate and vary by preparation.",
    healthInformation:
      "Moderate calorie density; contains gluten and dairy. Rich in carbohydrates and calcium.",
    allergens: ["Gluten (wheat)", "Dairy (mozzarella)"],
    insights: [
      "Traditionally cooked in a wood-fired oven at very high heat.",
      "Named after Queen Margherita of Savoy in 1889.",
      "Uses San Marzano tomatoes and fresh mozzarella di bufala.",
    ],
    recommendations: [
      "Pair with a light Chianti or sparkling water.",
      "Add a drizzle of olive oil after baking, not before.",
      "Rest the dough 24h in the fridge for better flavor.",
    ],
  }),

  electronics: () => ({
    detectedItem: "Wireless Router",
    confidence: 88,
    category: "Networking device",
    overview:
      "A consumer wireless router providing Wi-Fi connectivity for home and small-office networks.",
    keyInformation: {
      deviceName: "Wireless Router",
      brand: "Generic Networking Co.",
      model: "Model could not be confidently identified from the image.",
      category: "Home router",
    },
    features: [
      "Dual-band Wi-Fi (2.4 GHz / 5 GHz)",
      "Gigabit Ethernet LAN ports",
      "WPA3 security",
      "MU-MIMO",
    ],
    ports: [
      "1× WAN (RJ-45)",
      "4× LAN (RJ-45)",
      "1× DC power input",
      "1× Reset button",
    ],
    possibleUses: [
      "Provide Wi-Fi coverage for a home",
      "Share a wired internet connection with multiple devices",
      "Act as a basic firewall for a small network",
    ],
    basicSetup:
      "Connect the WAN port to your modem, power on, then open a browser to the default gateway (often 192.168.0.1) to run the setup wizard.",
    insights: [
      "Modern routers typically support Wi-Fi 6 (802.11ax) for better efficiency.",
      "Placement affects coverage — keep central and elevated.",
    ],
    recommendations: [
      "Update firmware periodically for security patches.",
      "Change the default admin password.",
      "Enable WPA3 for stronger encryption.",
    ],
  }),

  document: () => ({
    detectedItem: "Document",
    confidence: 90,
    category: "Text document",
    overview:
      "A structured text document with headings and body paragraphs. The AI extracted the visible text and produced a summary.",
    keyInformation: {
      documentType: "Plain text document",
      language: "English",
      pages: 1,
    },
    extractedText:
      "Sample extracted text. In a real integration, the OCR service would return the full text from the image. The AI then produces a summary, key points, and suggested questions below.",
    summary:
      "The document appears to contain general informational content. A real vision model would produce a more specific summary here.",
    keyPoints: [
      "The document contains multiple sections of text.",
      "The tone is informational.",
      "Key terminology appears throughout.",
    ],
    importantInformation: {
      dates: [],
      names: [],
      numbers: [],
    },
    suggestedQuestions: [
      "What is the main topic of this document?",
      "Are there any dates or deadlines?",
      "Who is the intended audience?",
    ],
    insights: [
      "Contains structured paragraphs suitable for summarization.",
      "No sensitive PII detected in the visible text.",
    ],
    recommendations: [
      "Verify extracted text against the original image for accuracy.",
      "Store a signed copy of the document in cloud backup.",
    ],
  }),
};

const mockProvider = {
  async analyzeImage(imagePath, mode) {
    // Touch the file so this stays realistic for later integrations.
    if (!fs.existsSync(imagePath)) {
      throw new AppError(`Image not found at ${imagePath}`, 400);
    }
    const factory = MODE_TEMPLATES[mode];
    if (!factory) throw new AppError(`Unsupported analysis mode: ${mode}`, 400);
    // Small random delay to simulate a real call
    await new Promise((r) => setTimeout(r, 150 + Math.random() * 250));
    const data = factory();
    return {
      ...data,
      provider: "mock",
      note:
        "This result is produced by the built-in mock provider. Configure AI_API_KEY and AI_PROVIDER to use a real vision model.",
    };
  },

  async askAboutScan({ scanContext, conversation, question }) {
  if (!env.AI_API_KEY) {
    throw new AppError(
      "AI_API_KEY is not configured for Gemini provider.",
      500
    );
  }

  const prompt = `
You are an AI assistant inside AI Vision Hub.

The user previously uploaded an image and it was analyzed.

Scan information:
${JSON.stringify(scanContext, null, 2)}

Previous conversation:
${JSON.stringify(conversation || [], null, 2)}

User question:
${question}

Answer the user's question clearly and naturally.

Rules:
- Use the scan information as the main context.
- Do not invent facts that cannot be supported.
- If the image analysis identifies a brand, company, product, model, plant, food, or document, use that information.
- Keep the answer concise but useful.
- If the user asks a follow-up question, use the previous conversation for context.
`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

  const { data } = await axios.post(
    url,
    {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    },
    {
      headers: {
        "x-goog-api-key": env.AI_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 60_000,
    }
  );

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new AppError(
      "Gemini returned an empty chat response.",
      502
    );
  }

  return {
    reply,
    provider: "gemini",
  };
},
};

// ---------------------------------------------------------------------------
// Gemini provider — real vision analysis
// ---------------------------------------------------------------------------

const geminiProvider = {
  async analyzeImage(imagePath, mode) {
    if (!env.AI_API_KEY) {
      throw new AppError(
        "AI_API_KEY is not configured for Gemini provider.",
        500
      );
    }

    if (!fs.existsSync(imagePath)) {
      throw new AppError(`Image not found at ${imagePath}`, 400);
    }

    const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    const ext = path.extname(imagePath).toLowerCase();

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };

    const mimeType = mimeTypes[ext] || "image/jpeg";

    const prompt = `
You are the advanced visual identification engine of AI Vision Hub.

Your primary goal is to identify the exact or most likely real-world item shown in the image.

Analyze the image extremely carefully.

Current scan mode: ${mode}

For ELECTRONICS and PRODUCTS, especially smartphones:

- Identify the brand.
- Try to identify the exact model.
- Inspect camera module shape and arrangement.
- Inspect camera count and positions.
- Inspect flash position.
- Inspect logo placement.
- Inspect visible text, model numbers, labels, stickers and markings.
- Inspect body shape, frame, color, texture and distinctive design elements.
- Inspect buttons, ports, speaker openings and other physical details if visible.
- Look for clues that distinguish similar models from the same brand.
- Do not stop at identifying only the brand when model-level identification is possible.

IMPORTANT:
Never invent an exact model.

If the exact model cannot be confidently identified from the image:
- Return the most likely model candidates.
- Give confidence for each candidate.
- Explain the visual evidence supporting each candidate.
- Explain what additional photo or information would confirm the model.

For visible text:
- Extract all readable text exactly.
- Include model numbers or codes if visible.
- Do not hallucinate unreadable text.

For model identification:
- Prefer evidence from the image.
- Compare distinctive physical characteristics.
- If several models look similar, mention that.
- Do not force an exact model.

For other products:
- Identify manufacturer.
- Identify product family.
- Identify model or variant if possible.
- Extract important visible specifications.
- Explain distinctive characteristics.

Return ONLY valid JSON.

Required JSON structure:

{
  "detectedItem": "",
  "brand": "",
  "model": null,
  "modelConfidence": 0,
  "modelStatus": "unknown",
  "modelCandidates": [
    {
      "model": "",
      "confidence": 0,
      "evidence": []
    }
  ],
  "visibleText": [],
  "identificationEvidence": [],
  "category": "",
  "overview": "",
  "keyInformation": {},
  "specifications": [],
  "features": [],
  "pros": [],
  "cons": [],
  "insights": [],
  "recommendations": [],
  "price": null,
  "priceNote": "",
  "confirmationNeeded": false,
  "confirmationTips": []
}

modelStatus must be one of:
- "identified" = exact model has strong evidence
- "likely" = one model is more likely but not certain
- "uncertain" = several models are possible
- "unknown" = insufficient information

Confidence must be a number from 0 to 100.

Do not invent:
- model numbers
- specifications
- prices
- launch dates
- technical details
- visible text

Only provide information supported by the image.
`;

    const models = [
  "gemini-3.8-flash",
];

let data;
let lastError;

for (const model of models) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    console.log(`[gemini] Trying model: ${model}`);

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      {
        headers: {
          "x-goog-api-key": env.AI_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 60_000,
      }
    );

    data = response.data;

    console.log(`[gemini] Success with model: ${model}`);

    break;
  } catch (err) {
    lastError = err;

    console.error(
      `[gemini] ${model} failed with status:`,
      err.response?.status
    );

    console.error(
      `[gemini] ${model} error:`,
      err.response?.data?.error?.message || err.message
    );

    const status = err.response?.status;

    // Only try another model for temporary availability/rate-limit errors.
    if (status !== 503) {
      throw new AppError(
        `AI analysis failed: ${err.message}`,
        status || 502
      );
    }
  }
}

if (!data) {
  throw new AppError(
    `All Gemini models failed: ${
      lastError?.response?.data?.error?.message ||
      lastError?.message ||
      "Unknown Gemini error"
    }`,
    502
  );
}
const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  throw new AppError(
    "Gemini returned an empty analysis response.",
    502
  );
}

let result;

try {
  result = JSON.parse(text);
} catch (err) {
  console.error("[gemini] Invalid JSON response:", text);

  throw new AppError(
    "Gemini returned invalid JSON.",
    502
  );
}

return {
  ...result,
  provider: "gemini",
};
  },
};

const openaiProvider = {
  async analyzeImage(_imagePath, _mode) {
    if (!env.AI_API_KEY) {
      throw new AppError("AI_API_KEY is not configured for OpenAI provider.", 500);
    }
    // Example structure for a real integration:
    // const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    // const { data } = await axios.post(env.AI_API_URL, { ... }, { headers: { Authorization: `Bearer ${env.AI_API_KEY}` } });
    // return data;
    throw new AppError(
      "OpenAI provider is not yet wired. Set AI_PROVIDER=mock to continue developing.",
      501
    );
  },
  async askAboutScan() {
    throw new AppError("OpenAI chat provider is not yet wired.", 501);
  },
};

// ---------------------------------------------------------------------------
// Generic HTTP provider — posts the image and mode to env.AI_API_URL.
// Useful when you have your own gateway or a third-party service.
// ---------------------------------------------------------------------------

const httpProvider = {
  async analyzeImage(imagePath, mode) {
    if (!env.AI_API_URL || !env.AI_API_KEY) {
      throw new AppError("AI_API_URL and AI_API_KEY must be set for the http provider.", 500);
    }
    const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    let data;

try {
  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    },
    {
      headers: {
        "x-goog-api-key": env.AI_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 60_000,
    }
  );

  data = response.data;
} catch (err) {
  console.error("[gemini] status:", err.response?.status);
  console.error("[gemini] response:", err.response?.data);
  console.error("[gemini] message:", err.message);

  throw err;
}
    return data;
  },
  async askAboutScan({ scanContext, conversation, question }) {
    if (!env.AI_API_URL || !env.AI_API_KEY) {
      throw new AppError("AI_API_URL and AI_API_KEY must be set for the http provider.", 500);
    }
    const { data } = await axios.post(
      `${env.AI_API_URL}/chat`,
      { scanContext, conversation, question },
      {
        headers: {
          Authorization: `Bearer ${env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60_000,
      }
    );
    return data;
  },
};

// ---------------------------------------------------------------------------
// Provider selector
// ---------------------------------------------------------------------------

function getProvider() {
  switch ((env.AI_PROVIDER || "mock").toLowerCase()) {
    case "mock":
      return mockProvider;
    case "gemini":
      console.log("[ai] Gemini provider selected");
      return geminiProvider;
    case "openai":
      return openaiProvider;
    case "http":
    case "custom":
      return httpProvider;
    default:
      console.warn(
        `[ai] Unknown AI_PROVIDER "${env.AI_PROVIDER}", falling back to mock.`
      );
      return mockProvider;
  }
}

/**
 * Analyze an image in the requested mode.
 * Returns structured data as defined by the active provider.
 */
async function analyzeImage(imagePath, mode) {
  const provider = getProvider();
  console.log("[ai] Active provider:", env.AI_PROVIDER);
  try {
    return await provider.analyzeImage(imagePath, mode);
  } catch (err) {
    if (err.isOperational) throw err;
    console.error("[gemini-debug] FULL ERROR:", err);
console.error("[gemini-debug] STATUS:", err.response?.status);
console.error("[gemini-debug] DATA:", err.response?.data);
console.error("[gemini-debug] HEADERS:", err.response?.headers);
    throw new AppError(
      `AI analysis failed: ${err.message || "unknown error"}`,
      502
    );
  }
}

/**
 * Ask a follow-up question about an existing scan.
 */
async function askAboutScan({ scanContext, conversation, question }) {
  const provider = getProvider();
  try {
    return await provider.askAboutScan({ scanContext, conversation, question });
  } catch (err) {
    if (err.isOperational) throw err;
    throw new AppError(
      `AI chat failed: ${err.message || "unknown error"}`,
      502
    );
  }
}

module.exports = {
  analyzeImage,
  askAboutScan,
  // Exposed for testing / custom wiring
  getProvider,

};
  
