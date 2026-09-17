import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, hint, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-md border border-plum-100 bg-white p-5 transition-colors hover:border-plum-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-ink-mute">{label}</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-plum-50 text-plum-700">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-plum-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}
