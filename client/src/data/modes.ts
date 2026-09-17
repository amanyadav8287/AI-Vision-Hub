import { Package, Leaf, UtensilsCrossed, Cpu, FileText, type LucideIcon } from "lucide-react";
import type { ScanMode } from "@/types";

export interface ModeConfig {
  id: ScanMode;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  accent: string; // background gradient class
  tint: string; // subtle tint bg
}

export const MODES: ModeConfig[] = [
  {
    id: "product",
    label: "Product",
    short: "Identify products and understand their features.",
    description: "Point at any product to reveal brand, specs, features, and comparable alternatives.",
    icon: Package,
    accent: "from-plum-700 to-plum-500",
    tint: "bg-plum-50",
  },
  {
    id: "plant",
    label: "Plant",
    short: "Identify plants and receive care information.",
    description: "Recognize species and learn about watering, sunlight, soil and common issues.",
    icon: Leaf,
    accent: "from-plum-500 to-rose-soft",
    tint: "bg-rose-mist/40",
  },
  {
    id: "food",
    label: "Food",
    short: "Recognize food with nutritional and contextual info.",
    description: "Understand cuisine, ingredients, approximate nutrition and serving suggestions.",
    icon: UtensilsCrossed,
    accent: "from-plum-700 to-rose-soft",
    tint: "bg-cream",
  },
  {
    id: "electronics",
    label: "Electronics",
    short: "Identify devices and understand their purpose.",
    description: "Recognize gadgets, ports, features, and how to set them up.",
    icon: Cpu,
    accent: "from-plum-800 to-plum-500",
    tint: "bg-plum-50",
  },
  {
    id: "document",
    label: "Document",
    short: "Extract, summarize and understand documents.",
    description: "Turn paperwork into readable summaries, key points, and generated questions.",
    icon: FileText,
    accent: "from-plum-600 to-rose-soft",
    tint: "bg-cream-light",
  },
];

export const modeById = (id: ScanMode) => MODES.find((m) => m.id === id)!;
