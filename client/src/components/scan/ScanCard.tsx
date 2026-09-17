import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { ScanResult } from "@/types";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { modeById } from "@/data/modes";
import { relativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";

interface Props {
  scan: ScanResult;
  onFavorite?: (id: string) => void;
  variant?: "list" | "grid";
}

export function ScanCard({ scan, onFavorite, variant = "grid" }: Props) {
  const mode = modeById(scan.mode);
  const Icon = mode.icon;

  if (variant === "list") {
    return (
      <div className="flex items-center gap-4 rounded-md border border-plum-100 bg-white p-3 hover:border-plum-300 transition-colors">
        <img
          src={scan.imageUrl}
          alt={scan.title}
          className="h-16 w-16 rounded-md object-cover bg-plum-50"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-plum-50 px-2 py-0.5 text-[11px] text-plum-700">
              <Icon className="h-3 w-3" />
              {mode.label}
            </span>
            <ConfidenceBadge value={scan.confidence} />
          </div>
          <p className="mt-1.5 font-display text-plum-800 truncate">{scan.title}</p>
          <p className="text-xs text-ink-mute">{relativeTime(scan.createdAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          {onFavorite && (
            <button
              onClick={() => onFavorite(scan.id)}
              className={cn(
                "h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-plum-50",
                scan.favorite ? "text-plum-700" : "text-ink-mute"
              )}
              aria-label="Toggle favorite"
            >
              <Heart className={cn("h-4 w-4", scan.favorite && "fill-current")} />
            </button>
          )}
          <Link
            to={`/scan/${scan.id}`}
            className="rounded-md bg-plum-700 text-cream text-xs px-3 py-2 hover:bg-plum-800"
          >
            View
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-md border border-plum-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-plum-900/5">
      <Link to={`/scan/${scan.id}`} className="block relative aspect-[4/3] overflow-hidden bg-plum-50">
        <img
          src={scan.imageUrl}
          alt={scan.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur px-2 py-1 text-[11px] text-plum-700 border border-plum-100">
          <Icon className="h-3 w-3" />
          {mode.label}
        </div>
        {onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite(scan.id);
            }}
            className={cn(
              "absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/90 backdrop-blur border border-plum-100",
              scan.favorite ? "text-plum-700" : "text-ink-mute"
            )}
            aria-label="Toggle favorite"
          >
            <Heart className={cn("h-4 w-4", scan.favorite && "fill-current")} />
          </button>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-plum-800 text-lg truncate">{scan.title}</p>
          <ConfidenceBadge value={scan.confidence} />
        </div>
        <p className="mt-1 text-xs text-ink-mute">
          {scan.category} · {relativeTime(scan.createdAt)}
        </p>
      </div>
    </div>
  );
}
