import api from "./api";
import type { ScanMode, ScanResult } from "@/types";

function normalizeScan(scan: any): ScanResult {
  const ai = scan.result || {};

  const keyInfo = Object.entries(ai.keyInformation || {}).map(
    ([label, value]) => ({
      label,
      value: String(value ?? "—"),
    })
  );

  const result: ScanResult = {
    id: scan._id || scan.id,
    mode: scan.mode,
    imageUrl: scan.image?.path || "",
    title: ai.detectedItem || scan.detectedItem || "Unknown item",
    confidence: Number(ai.confidence ?? scan.confidence ?? 0),
    category: ai.category || scan.category || "",
    overview: ai.overview || "",
    keyInfo,
    insights: ai.insights || [],
    recommendations: ai.recommendations || [],
    createdAt: scan.createdAt,
    favorite: false,
  };

  if (scan.mode === "product") {
    result.product = {
      brand: ai.keyInformation?.brand,
      features: ai.features || [],
      specifications: ai.specifications || [],
      pros: ai.pros || [],
      cons: ai.cons || [],
      similar: ai.similar || [],
    };
  }

  if (scan.mode === "plant") {
    result.plant = {
      careLevel: ai.keyInformation?.careLevel,
      watering: ai.keyInformation?.watering,
      sunlight: ai.keyInformation?.sunlight,
      soil: ai.keyInformation?.soil,
      problems: ai.problems || [],
    };
  }

  if (scan.mode === "food") {
    result.food = {
      cuisine: ai.keyInformation?.cuisine,
      ingredients: ai.ingredients || [],
      nutrition: ai.nutrition || [],
      serving: ai.keyInformation?.serving,
    };
  }

  if (scan.mode === "electronics") {
    result.electronics = {
      brandModel:
        ai.keyInformation?.brandModel ||
        ai.keyInformation?.brand ||
        ai.keyInformation?.model,
      purpose: ai.keyInformation?.purpose,
      features: ai.features || [],
      ports: ai.ports || [],
      setup: ai.setup,
    };
  }

  if (scan.mode === "document") {
    result.document = {
      docType: ai.keyInformation?.docType,
      extractedText: ai.extractedText,
      summary: ai.summary || ai.overview,
      keyPoints: ai.keyPoints || [],
      suggestedQuestions: ai.suggestedQuestions || [],
    };
  }

  return result;
}

export const scanService = {
  analyze: (
    file: File,
    mode: ScanMode,
    onUploadProgress?: (p: number) => void
  ) => {
    const form = new FormData();
    form.append("image", file);
    form.append("mode", mode);

    return api
      .post<{
        success: boolean;
        message: string;
        data: any;
      }>("/scans", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total && onUploadProgress) {
            onUploadProgress(
              Math.round((e.loaded / e.total) * 100)
            );
          }
        },
      })
      .then((r) => normalizeScan(r.data.data));
  },

  list: (params?: { mode?: ScanMode | "all"; q?: string }) =>
    api
      .get<{
        success: boolean;
        message: string;
        data: any[];
      }>("/scans", { params })
      .then((r) => r.data.data.map(normalizeScan)),

  get: (id: string) =>
    api
      .get<{
        success: boolean;
        message: string;
        data: any;
      }>(`/scans/${id}`)
      .then((r) => normalizeScan(r.data.data)),

  remove: (id: string) =>
    api.delete(`/scans/${id}`).then((r) => r.data),
};