import type { ModeConfig } from "@/data/modes";
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface Props {
  mode: ModeConfig;
  selected?: boolean;
  onSelect?: () => void;
  size?: "sm" | "md" | "lg";
}

export function ModeCard({ mode, selected, onSelect, size = "md" }: Props) {
  const Icon = mode.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-start text-left rounded-md border bg-white transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-plum-900/5",
        selected
          ? "border-plum-700 bg-plum-50/80 shadow-md shadow-plum-900/10"
          : "border-plum-100 hover:border-plum-300",
        size === "sm" && "p-4",
        size === "md" && "p-5",
        size === "lg" && "p-6"
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-plum-700 text-cream">
          <Check className="h-3 w-3" />
        </span>
      )}
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-gradient-to-br text-white transition-transform group-hover:scale-105",
          mode.accent,
          size === "lg" ? "h-12 w-12" : "h-10 w-10"
        )}
      >
        <Icon className={cn(size === "lg" ? "h-6 w-6" : "h-5 w-5")} />
      </span>
      <h3
        className={cn(
          "mt-4 font-display tracking-tight text-plum-800",
          size === "lg" ? "text-xl" : "text-lg"
        )}
      >
        {mode.label}
      </h3>
      <p className="mt-1 text-sm text-ink-mute leading-relaxed">{mode.short}</p>
    </button>
  );
}
