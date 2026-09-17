import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Camera, Clock, Heart, ScanLine, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useScans } from "@/contexts/ScanContext";
import { MODES, modeById } from "@/data/modes";
import { ModeCard } from "@/components/scan/ModeCard";
import { ScanCard } from "@/components/scan/ScanCard";
import { StatCard } from "@/components/scan/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function DashboardPage() {
  const { user } = useAuth();
  const { scans, stats, toggleFavorite } = useScans();
  const nav = useNavigate();
  const recent = scans.slice(0, 6);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-md border border-plum-100 bg-gradient-to-br from-plum-700 via-plum-600 to-plum-500 text-cream p-6 sm:p-10">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-rose-soft/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-plum-800/40 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/70">Hello, {firstName}</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl leading-tight tracking-tight max-w-xl">
              What would you like to understand today?
            </h1>
            <p className="mt-4 text-cream/80 max-w-lg">
              Choose a scan mode below or jump straight to a new analysis. Your last insights are
              only a click away.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<ScanLine className="h-4 w-4" />}
                onClick={() => nav("/scan")}
              >
                New scan
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-cream hover:bg-cream/10"
                leftIcon={<Camera className="h-4 w-4" />}
                onClick={() => nav("/scan?camera=1")}
              >
                Open camera
              </Button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="rounded-md border border-cream/15 bg-cream/5 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-widest text-cream/70">Suggested</div>
              <p className="mt-2 font-display text-2xl">Try scanning a document</p>
              <p className="mt-2 text-sm text-cream/80">
                Extract text, summarize, and generate questions — instantly.
              </p>
              <Link
                to="/scan"
                className="mt-4 inline-flex items-center gap-1 text-sm underline underline-offset-4"
              >
                Start now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-plum-500">Analysis modes</p>
            <h2 className="mt-1 font-display text-2xl text-plum-800">Pick what to scan</h2>
          </div>
          <Link to="/scan" className="text-sm text-plum-500 hover:text-plum-700">
            Open workspace →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MODES.map((m) => (
            <ModeCard key={m.id} mode={m} onSelect={() => nav(`/scan?mode=${m.id}`)} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total scans" value={stats.total} icon={ScanLine} />
        <StatCard label="Saved results" value={stats.saved} icon={Heart} />
        <StatCard
          label="Most used mode"
          value={stats.mostUsed ? modeById(stats.mostUsed).label : "—"}
          icon={TrendingUp}
        />
        <StatCard
          label="Recent activity"
          value={scans[0] ? "Just now" : "None"}
          icon={Clock}
          hint={scans[0]?.title}
        />
      </section>

      {/* Recent */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-plum-500">Recent</p>
            <h2 className="mt-1 font-display text-2xl text-plum-800">Recent scans</h2>
          </div>
          <Link to="/history" className="text-sm text-plum-500 hover:text-plum-700">
            View all →
          </Link>
        </div>
        {recent.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((s) => (
              <ScanCard key={s.id} scan={s} onFavorite={toggleFavorite} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ScanLine}
            title="No scans yet"
            description="Start your first analysis to see it appear here."
            action={<Button onClick={() => nav("/scan")}>Start scanning</Button>}
          />
        )}
      </section>
    </div>
  );
}
