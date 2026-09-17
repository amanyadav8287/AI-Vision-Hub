import type { ScanResult } from "@/types";

// Mock scan library used when backend is offline. Keeps the frontend fully demoable.
export const MOCK_SCANS: ScanResult[] = [
  {
    id: "scan_1",
    mode: "plant",
    imageUrl:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=70",
    title: "Aloe Vera",
    confidence: 96,
    category: "Succulent",
    overview:
      "Aloe vera is a hardy succulent widely grown for its ornamental value and the soothing gel found in its fleshy leaves.",
    keyInfo: [
      { label: "Scientific name", value: "Aloe barbadensis miller" },
      { label: "Origin", value: "Arabian Peninsula" },
      { label: "Lifespan", value: "Perennial (5–25 yrs)" },
      { label: "Toxicity", value: "Mild to pets" },
    ],
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
    plant: {
      careLevel: "Very easy",
      watering: "Every 2–3 weeks",
      sunlight: "Bright, indirect",
      soil: "Well-draining, sandy",
      problems: ["Root rot from overwatering", "Leaf browning in direct sun", "Mealybugs"],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    favorite: true,
  },
  {
    id: "scan_2",
    mode: "electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=70",
    title: "Wireless Over-Ear Headphones",
    confidence: 92,
    category: "Audio device",
    overview:
      "A pair of premium over-ear wireless headphones designed for immersive listening with active noise cancellation.",
    keyInfo: [
      { label: "Type", value: "Over-ear, closed-back" },
      { label: "Connection", value: "Bluetooth 5.3" },
      { label: "Battery", value: "~30 hours" },
      { label: "Weight", value: "~250g" },
    ],
    insights: [
      "Designed for long listening sessions with plush earcups.",
      "Active noise cancellation reduces ambient noise by up to 25 dB.",
      "Supports multipoint pairing across two devices.",
    ],
    recommendations: [
      "Charge fully before first use for battery calibration.",
      "Store in a dry case to preserve the earcup foam.",
      "Update firmware for the latest ANC improvements.",
    ],
    electronics: {
      brandModel: "Generic premium ANC headphones",
      purpose: "Personal audio, calls, immersive listening.",
      features: ["Active noise cancellation", "Touch controls", "Voice assistant"],
      ports: ["USB-C charging", "3.5mm aux"],
      setup: "Hold power button 3 seconds, pair via Bluetooth settings on your device.",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "scan_3",
    mode: "food",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=70",
    title: "Margherita Pizza",
    confidence: 94,
    category: "Italian cuisine",
    overview:
      "Margherita is a classic Neapolitan pizza celebrating the colors of the Italian flag with tomato, mozzarella and basil.",
    keyInfo: [
      { label: "Cuisine", value: "Italian, Neapolitan" },
      { label: "Serving", value: "1 medium pizza" },
      { label: "Prep time", value: "~25 min" },
      { label: "Cook", value: "~8 min at 260°C" },
    ],
    insights: [
      "Traditionally cooked in a wood-fired oven at very high heat.",
      "Uses San Marzano tomatoes and fresh mozzarella di bufala.",
      "Named after Queen Margherita of Savoy in 1889.",
    ],
    recommendations: [
      "Pair with a light Chianti or sparkling water.",
      "Add a drizzle of olive oil after baking, not before.",
      "Rest the dough 24h in the fridge for better flavor.",
    ],
    food: {
      cuisine: "Italian",
      ingredients: ["Wheat flour", "Tomato", "Mozzarella", "Basil", "Olive oil", "Salt"],
      nutrition: [
        { label: "Calories", value: "~270 kcal / slice" },
        { label: "Carbs", value: "~34 g" },
        { label: "Protein", value: "~11 g" },
        { label: "Fat", value: "~10 g" },
      ],
      serving: "Serves 2 as a main, 4 as a starter.",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    favorite: true,
  },
  {
    id: "scan_4",
    mode: "product",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=70",
    title: "Running Sneakers",
    confidence: 89,
    category: "Athletic footwear",
    overview:
      "Lightweight cushioned running shoes engineered for daily training on pavement and light trails.",
    keyInfo: [
      { label: "Category", value: "Neutral running" },
      { label: "Drop", value: "~10 mm" },
      { label: "Weight", value: "~275 g" },
      { label: "Use", value: "Road running" },
    ],
    insights: [
      "Foam midsole optimized for repeated impact absorption.",
      "Breathable engineered mesh keeps the foot cool.",
      "Best for runners with a neutral gait pattern.",
    ],
    recommendations: [
      "Retire after 500–800 km of use.",
      "Rotate with a second pair to extend midsole life.",
      "Use running-specific socks to prevent blisters.",
    ],
    product: {
      brand: "Athletic performance brand",
      features: ["Responsive foam", "Engineered mesh", "Rubber outsole"],
      specifications: [
        { label: "Upper", value: "Engineered mesh" },
        { label: "Midsole", value: "EVA foam" },
        { label: "Outsole", value: "Rubber pods" },
      ],
      pros: ["Comfortable long-distance ride", "Breathable upper", "Great value"],
      cons: ["Not ideal for trails", "Midsole compresses over time"],
      similar: ["Daily trainer alternatives", "Cushioned max stack shoes"],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "scan_5",
    mode: "document",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70",
    title: "Rental Agreement",
    confidence: 91,
    category: "Legal document",
    overview:
      "A standard residential lease agreement outlining terms between landlord and tenant for a 12-month tenancy.",
    keyInfo: [
      { label: "Type", value: "Residential lease" },
      { label: "Term", value: "12 months" },
      { label: "Language", value: "English" },
      { label: "Pages", value: "6" },
    ],
    insights: [
      "Contains a standard security deposit clause.",
      "Includes early termination penalties.",
      "References local tenancy law for dispute resolution.",
    ],
    recommendations: [
      "Read section 4 (maintenance) carefully.",
      "Verify the deposit amount matches your records.",
      "Store a signed copy in cloud backup.",
    ],
    document: {
      docType: "Residential lease agreement",
      extractedText:
        "This Residential Lease Agreement is made and entered into as of the date below, between the Landlord and the Tenant, for the premises located at the address specified in Schedule A...",
      summary:
        "A 12-month lease with monthly rent due on the 1st, requiring a two-month security deposit and 30-day notice for termination.",
      keyPoints: [
        "Rent due monthly on the 1st",
        "Two-month refundable security deposit",
        "30-day written notice for termination",
        "Tenant covers utilities",
      ],
      suggestedQuestions: [
        "What are the penalties for late rent?",
        "Can I sublet the apartment?",
        "Who is responsible for major repairs?",
      ],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];
