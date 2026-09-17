import { useMemo, useState } from "react";
import { Search, ScanLine } from "lucide-react";
import { useScans } from "@/contexts/ScanContext";
import { MODES } from "@/data/modes";
import { ScanCard } from "@/components/scan/ScanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import type { ScanMode } from "@/types";

type Filter = "all" | ScanMode;

export function HistoryPage() {
  const { scans, toggleFavorite } = useScans();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return scans.filter((s) => {
      const okMode = filter === "all" || s.mode === filter;
      const okQ = !q || s.title.toLowerCase().includes(q.toLowerCase());
      return okMode && okQ;
    });
  }, [scans, filter, q]);

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-plum-500">Library</p>
        <h1 className="mt-2 font-display text-4xl text-plum-900">My Scan History</h1>
        <p className="mt-2 text-ink-mute">A complete archive of every image you've analyzed.</p>
      </header>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-2 flex-1 rounded-md border border-plum-100 bg-white px-3">
            <Search className="h-4 w-4 text-ink-mute" />
            <input
              placeholder="Search scans…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 bg-transparent py-2 text-sm placeholder:text-ink-mute/60 focus:outline-none"
            />
          </div>
        </div>
        <div className="hidden sm:flex items-center rounded-md border border-plum-100 bg-white p-0.5 text-xs">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "px-3 py-1.5 rounded-md",
              view === "grid" ? "bg-plum-700 text-cream" : "text-ink-soft"
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "px-3 py-1.5 rounded-md",
              view === "list" ? "bg-plum-700 text-cream" : "text-ink-soft"
            )}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {MODES.map((m) => (
          <FilterChip
            key={m.id}
            active={filter === m.id}
            onClick={() => setFilter(m.id)}
            icon={m.icon}
          >
            {m.label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ScanLine}
          title={q ? "No matching scans" : "No scans yet"}
          description={q ? "Try a different search or filter." : "Start your first analysis to see it here."}
          action={
            <Link to="/scan">
              <Button>Start scanning</Button>
            </Link>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ScanCard key={s.id} scan={s} onFavorite={toggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <ScanCard key={s.id} scan={s} onFavorite={toggleFavorite} variant="list" />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors border",
        active
          ? "bg-plum-700 text-cream border-plum-700"
          : "bg-white text-ink-soft border-plum-100 hover:border-plum-300"
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
