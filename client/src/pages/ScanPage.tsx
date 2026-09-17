import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { MODES, modeById } from "@/data/modes";
import type { ScanMode, ScanResult } from "@/types";
import { ModeCard } from "@/components/scan/ModeCard";
import { ImageUploader } from "@/components/scan/ImageUploader";
import { CameraCapture } from "@/components/scan/CameraCapture";
import { AnalysisProgress } from "@/components/scan/AnalysisProgress";
import { Button } from "@/components/ui/Button";
import { useScans } from "@/contexts/ScanContext";
import { scanService } from "@/services/scanService";
import { useToast } from "@/contexts/ToastContext";



export function ScanPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { addScan } = useScans();
  const { toast } = useToast();

  const initialMode = (params.get("mode") as ScanMode) || "plant";
  const [mode, setMode] = useState<ScanMode>(initialMode);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(params.get("camera") === "1");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const selected = useMemo(() => modeById(mode), [mode]);

 async function analyze() {
  if (!file || !preview) return;

  try {
    setAnalyzing(true);

    const result = await scanService.analyze(file, mode);

    addScan(result);

    toast(
  `Detected: ${result.title}`,
  "success"
);

    setAnalyzing(false);

    nav(`/scan/${result.id}`);
  } catch (error: any) {
    setAnalyzing(false);

    toast(
      error?.response?.data?.message || "Failed to analyze image",
      "error"
    );
  }
}


 if (analyzing && preview) {
  return (
    <div className="animate-fade-in">
      <AnalysisProgress imageUrl={preview} />
    </div>
  );
}

  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <p className="text-xs uppercase tracking-widest text-plum-500">Workspace</p>
        <h1 className="mt-2 font-display text-4xl text-plum-900 tracking-tight">
          Analyze an Image
        </h1>
        <p className="mt-2 text-ink-mute max-w-2xl">
          Pick a mode that matches what's in your image, then upload or capture the photo. The AI
          will produce a structured, editorial breakdown.
        </p>
      </header>

      {/* Step 1 */}
      <section>
        <StepHeader step="Step 1" title="Choose what you're scanning" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MODES.map((m) => (
            <ModeCard
              key={m.id}
              mode={m}
              selected={m.id === mode}
              onSelect={() => setMode(m.id)}
            />
          ))}
        </div>
      </section>

      {/* Step 2 */}
      <section>
        <StepHeader step="Step 2" title="Upload your image" />
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <ImageUploader
            file={file}
            previewUrl={preview}
            onFile={setFile}
            onCameraOpen={() => setCameraOpen(true)}
          />
          <aside className="rounded-md border border-plum-100 bg-white p-6">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br ${selected.accent} text-cream`}
              >
                <selected.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-mute">Current mode</p>
                <p className="font-display text-lg text-plum-800">{selected.label}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-mute leading-relaxed">{selected.description}</p>
            <div className="mt-5 rounded-md bg-plum-50 border border-plum-100 p-3 text-xs text-plum-700">
              Supported: JPG, PNG, WEBP — up to 10 MB
            </div>
            <div className="mt-6 space-y-2">
              <Button
                fullWidth
                size="lg"
                disabled={!file}
                onClick={analyze}
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Analyze Image
              </Button>
              {!file && (
                <p className="text-[11px] text-ink-mute text-center">
                  Upload an image to enable analysis.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(f) => setFile(f)}
      />
    </div>
  );
}

function StepHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="text-xs uppercase tracking-widest text-plum-500">{step}</span>
      <span className="h-px flex-1 bg-plum-100" />
      <h2 className="font-display text-xl text-plum-800">{title}</h2>
    </div>
  );
}
