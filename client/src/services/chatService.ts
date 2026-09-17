import api from "./api";

export interface ChatMessagePayload {
  scanId: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  timestamp: string;
}

export const chatService = {
  ask: (payload: ChatMessagePayload) =>
    api.post<ChatResponse>("/chat/ask", payload).then((r) => r.data),

  history: (scanId: string) => api.get(`/chat/${scanId}`).then((r) => r.data),
};
