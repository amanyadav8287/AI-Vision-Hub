import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Heart, Share2, Sparkles, Trash2 } from "lucide-react";
import { useScans } from "@/contexts/ScanContext";
import { modeById } from "@/data/modes";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { Button } from "@/components/ui/Button";
import { ModeSpecificResult } from "@/components/scan/ModeSpecificResult";
import { ChatBox } from "@/components/chat/ChatBox";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/utils/format";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/utils/cn";

export function ScanResultPage() {
  const { id } = useParams();
  const { getScan, toggleFavorite, removeScan } = useScans();
  const { toast } = useToast();
  const nav = useNavigate();
  const scan = id ? getScan(id) : undefined;

  if (!scan) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Scan not found"
        description="This scan may have been removed or the link is invalid."
        action={<Link to="/scan"><Button>Start a new scan</Button></Link>}
      />
    );
  }

  const mode = modeById(scan.mode);
  const Icon = mode.icon;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-2 text-sm text-plum-700 hover:text-plum-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="h-3.5 w-3.5" />}
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast("Link copied to clipboard", "success");
            }}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            onClick={() => toast("Export coming soon", "info")}
          >
            Export
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => {
              removeScan(scan.id);
              toast("Scan removed", "success");
              nav("/history");
            }}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Header block */}
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
        <div className="relative overflow-hidden rounded-md border border-plum-100 bg-plum-50">
          <img
            src={scan.imageUrl}
            alt={scan.title}
            className="w-full h-full max-h-[560px] object-cover"
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur px-2.5 py-1 text-xs text-plum-800 border border-plum-100">
            <Icon className="h-3.5 w-3.5" /> {mode.label}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-plum-500">Detected</p>
          <h1 className="mt-2 font-display text-5xl text-plum-900 tracking-tight leading-none">
            {scan.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ConfidenceBadge value={scan.confidence} />
            {scan.category && (
              <span className="text-sm text-ink-mute">
                Category · <span className="text-ink">{scan.category}</span>
              </span>
            )}
            <span className="text-sm text-ink-mute">Scanned {formatDate(scan.createdAt)}</span>
          </div>

          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-wider text-ink-mute mb-2">Overview</h4>
            <p className="text-ink leading-relaxed">{scan.overview}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                toggleFavorite(scan.id);
                toast(scan.favorite ? "Removed from favorites" : "Saved to favorites", "success");
              }}
              leftIcon={<Heart className={cn("h-4 w-4", scan.favorite && "fill-current")} />}
              variant={scan.favorite ? "secondary" : "primary"}
            >
              {scan.favorite ? "Saved" : "Save to Favorites"}
            </Button>
            <Link to="/scan">
              <Button variant="outline">New scan</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="space-y-8">
          <SectionCard title="Key Information">
            <dl className="grid sm:grid-cols-2 gap-3">
              {scan.keyInfo.map((k) => (
                <div
                  key={k.label}
                  className="rounded-md border border-plum-100 bg-white p-4"
                >
                  <dt className="text-[11px] uppercase tracking-widest text-ink-mute">
                    {k.label}
                  </dt>
                  <dd className="mt-1 text-sm text-plum-800 font-medium">{k.value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard title="Details" subtitle={`${mode.label}-specific analysis`}>
            <ModeSpecificResult scan={scan} />
          </SectionCard>

          <SectionCard title="AI Insights">
            <ul className="space-y-3">
              {scan.insights.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-plum-100 bg-white p-4"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-plum-50 text-plum-700">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm text-ink leading-relaxed">{i}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Recommendations">
            <ul className="space-y-2">
              {scan.recommendations.map((r, idx) => (
                <li
                  key={r}
                  className="flex items-start gap-3 rounded-md bg-cream-light/60 border border-cream-deep/40 p-4"
                >
                  <span className="font-display text-plum-700 text-lg leading-none pt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-ink leading-relaxed">{r}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <ChatBox scan={scan} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-xl text-plum-800">{title}</h3>
        {subtitle && <span className="text-xs text-ink-mute">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}
