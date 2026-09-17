import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  imageUrl: string;
}

const STAGES = [
  { label: "Image uploaded", duration: 500 },
  { label: "Visual features detected", duration: 900 },
  { label: "Object identified", duration: 1000 },
  { label: "Generating insights", duration: 1100 },
];

export function AnalysisProgress({ imageUrl }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
  if (current >= STAGES.length - 1) return;

  const t = setTimeout(
    () => setCurrent((c) => c + 1),
    STAGES[current].duration
  );

  return () => clearTimeout(t);
}, [current]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-center">
      <div className="relative overflow-hidden rounded-md border border-plum-100 bg-plum-900 aspect-square">
        <img src={imageUrl} alt="Analyzing" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-900/50 via-transparent to-plum-900/20" />
        <div
          className="absolute inset-x-0 h-16 bg-gradient-to-b from-cream/60 via-cream/20 to-transparent animate-scan-line"
          style={{ top: 0 }}
        />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-md bg-cream/95 px-3 py-1.5 text-xs text-plum-800 backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-plum-700 animate-pulse-soft" />
          Analyzing
        </div>
      </div>

      <div>
        <h2 className="font-display text-3xl text-plum-800 tracking-tight">
          Analyzing your image…
        </h2>
        <p className="mt-2 text-ink-mute">
          Our multimodal model is reading visual features and preparing intelligent insights.
        </p>
        <ul className="mt-6 space-y-3">
          {STAGES.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li
                key={s.label}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-4 py-3 transition-all",
                  done && "border-plum-200 bg-plum-50/60",
                  active && "border-plum-400 bg-white shadow-sm shadow-plum-900/5",
                  !done && !active && "border-plum-100 bg-white/60 opacity-60"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full",
                    done ? "bg-plum-700 text-cream" : active ? "bg-plum-100 text-plum-700" : "bg-plum-50 text-ink-mute"
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    done ? "text-plum-800" : active ? "text-plum-700" : "text-ink-mute"
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
