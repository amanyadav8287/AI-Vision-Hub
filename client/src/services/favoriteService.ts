import api from "./api";
import type { ScanResult } from "@/types";

export const favoriteService = {
  list: () => api.get<ScanResult[]>("/favorites").then((r) => r.data),
  add: (scanId: string) => api.post(`/favorites/${scanId}`).then((r) => r.data),
  remove: (scanId: string) => api.delete(`/favorites/${scanId}`).then((r) => r.data),
};
