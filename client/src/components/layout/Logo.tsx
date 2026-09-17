import { cn } from "@/utils/cn";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dot = size === "lg" ? "h-8 w-8" : size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-md bg-gradient-to-br from-plum-700 to-plum-500 text-cream",
          dot
        )}
      >
        <span className="absolute inset-1 rounded-sm border border-cream/50" />
        <span className="relative block h-1.5 w-1.5 rounded-full bg-cream" />
      </span>
      <span className={cn("font-display tracking-tight text-plum-800", text)}>
        AI Vision <span className="text-plum-500">Hub</span>
      </span>
    </div>
  );
}
