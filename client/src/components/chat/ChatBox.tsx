import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import type { ChatMessage, ScanResult } from "@/types";
import { formatTime } from "@/utils/format";
import { cn } from "@/utils/cn";

interface Props {
  scan: ScanResult;
}

const SUGGESTED: Record<string, string[]> = {
  plant: ["Is this suitable for indoors?", "How often should I water it?", "Is it toxic to pets?"],
  product: ["Are there similar products?", "What are the main features?", "Is it worth the price?"],
  food: ["Is this vegetarian?", "How many calories per serving?", "What can I pair it with?"],
  electronics: ["What is this device used for?", "How do I set it up?", "Which ports does it have?"],
  document: [
    "What are the important points?",
    "Summarize this for me",
    "Generate questions from it",
  ],
};

function buildReply(scan: ScanResult, q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("summar")) return scan.overview;
  if (lower.includes("water") && scan.plant)
    return `${scan.title} typically needs watering ${scan.plant.watering?.toLowerCase()}.`;
  if (lower.includes("indoor") && scan.plant)
    return `Yes — ${scan.title} does well indoors with ${scan.plant.sunlight?.toLowerCase()} light.`;
  if (lower.includes("calor") && scan.food)
    return `Approximate calories: ${scan.food.nutrition?.[0]?.value ?? "not available"}. Nutritional values are approximate.`;
  if (lower.includes("port") && scan.electronics)
    return `Common ports for this device: ${scan.electronics.ports?.join(", ")}.`;
  if (lower.includes("similar") && scan.product)
    return `Similar options include: ${scan.product.similar?.join(", ")}.`;
  if (lower.includes("question") && scan.document)
    return `Here are a few generated questions:\n• ${scan.document.suggestedQuestions?.join("\n• ")}`;
  return `Based on the analysis of ${scan.title}: ${scan.insights[0] || scan.overview}`;
}

export function ChatBox({ scan }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content: `I've analyzed this ${scan.mode}. Ask me anything about "${scan.title}".`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    // Simulated AI response (would call chatService.ask when backend is live)
    await new Promise((r) => setTimeout(r, 900));
    const aiMsg: ChatMessage = {
      id: `a_${Date.now()}`,
      role: "ai",
      content: buildReply(scan, content),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, aiMsg]);
    setLoading(false);
  }

  const suggestions = SUGGESTED[scan.mode] || [];

  return (
    <div className="flex flex-col rounded-md border border-plum-100 bg-white overflow-hidden">
      <div className="flex items-center gap-2 border-b border-plum-50 px-4 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-plum-700 text-cream">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-plum-800">Ask AI about this image</h3>
          <p className="text-xs text-ink-mute">Conversational insights on your scan</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[420px] p-4 space-y-4 bg-plum-50/30">
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-ink-mute animate-pulse-soft">
            <span className="inline-block h-2 w-2 rounded-full bg-plum-400" />
            <span className="inline-block h-2 w-2 rounded-full bg-plum-400" />
            <span className="inline-block h-2 w-2 rounded-full bg-plum-400" />
            AI is thinking…
          </div>
        )}
      </div>

      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs rounded-md border border-plum-100 bg-white px-3 py-1.5 text-plum-700 hover:border-plum-300 hover:bg-plum-50 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-plum-50 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="flex-1 rounded-md border border-plum-100 bg-white px-3 py-2.5 text-sm placeholder:text-ink-mute/60 focus:border-plum-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-plum-700 text-cream hover:bg-plum-800 disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[85%]">
        <div
          className={cn(
            "rounded-md px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
            isUser
              ? "bg-plum-700 text-cream rounded-tr-sm"
              : "bg-white text-ink border border-plum-100 rounded-tl-sm"
          )}
        >
          {msg.content}
        </div>
        <p className={cn("mt-1 text-[10px] text-ink-mute", isUser ? "text-right" : "text-left")}>
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}
