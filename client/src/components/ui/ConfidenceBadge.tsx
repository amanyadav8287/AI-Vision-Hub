import { Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

export function ConfidenceBadge({ value, className }: { value: number; className?: string }) {
  const tone =
    value >= 90
      ? "bg-plum-700 text-cream"
      : value >= 75
        ? "bg-plum-400 text-white"
        : "bg-rose-soft text-plum-800";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide",
        tone,
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      {value}% confidence
    </span>
  );
}
