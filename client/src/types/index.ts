export type ScanMode = "product" | "plant" | "food" | "electronics" | "document";

export interface ScanResult {
  id: string;
  mode: ScanMode;
  imageUrl: string;
  title: string; // detected item name
  confidence: number; // 0-100
  category?: string;
  overview: string;
  keyInfo: { label: string; value: string }[];
  insights: string[];
  recommendations: string[];
  createdAt: string;
  favorite?: boolean;

  // Mode specific
  product?: {
    brand?: string;
    features?: string[];
    specifications?: { label: string; value: string }[];
    pros?: string[];
    cons?: string[];
    similar?: string[];
  };
  plant?: {
    careLevel?: string;
    watering?: string;
    sunlight?: string;
    soil?: string;
    problems?: string[];
  };
  food?: {
    cuisine?: string;
    ingredients?: string[];
    nutrition?: { label: string; value: string }[];
    serving?: string;
  };
  electronics?: {
    brandModel?: string;
    purpose?: string;
    features?: string[];
    ports?: string[];
    setup?: string;
  };
  document?: {
    docType?: string;
    extractedText?: string;
    summary?: string;
    keyPoints?: string[];
    suggestedQuestions?: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}
