import { useRef, useState, type DragEvent } from "react";
import { Camera, ImagePlus, RefreshCw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useToast } from "@/contexts/ToastContext";

interface Props {
  file: File | null;
  previewUrl: string | null;
  onFile: (f: File | null) => void;
  onCameraOpen?: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ file, previewUrl, onFile, onCameraOpen }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  function handleFiles(list: FileList | null) {
    if (!list?.length) return;
    const f = list[0];
    if (!ACCEPT.includes(f.type)) {
      toast("Please upload a JPG, PNG, or WEBP image.", "error");
      return;
    }
    if (f.size > MAX_SIZE) {
      toast("Image is too large. Max size is 10 MB.", "error");
      return;
    }
    onFile(f);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  if (file && previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-md border border-plum-100 bg-white">
        <div className="relative">
          <img
            src={previewUrl}
            alt="Selected preview"
            className="w-full max-h-[420px] object-contain bg-plum-50/40"
          />
          <button
            onClick={() => onFile(null)}
            className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/95 border border-plum-100 text-plum-700 hover:bg-white shadow-sm"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-plum-50 px-4 py-3 flex-wrap">
          <div className="text-sm">
            <p className="font-medium text-plum-800 truncate max-w-[240px]">{file.name}</p>
            <p className="text-xs text-ink-mute">
              {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.split("/")[1].toUpperCase()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "relative overflow-hidden rounded-md border-2 border-dashed bg-white transition-colors",
        dragging ? "border-plum-500 bg-plum-50/60" : "border-plum-200"
      )}
    >
      <div className="grain relative flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="relative mb-4 h-16 w-16 rounded-md bg-gradient-to-br from-plum-100 to-rose-mist/60 flex items-center justify-center animate-float">
          <ImagePlus className="h-7 w-7 text-plum-700" />
        </div>
        <h3 className="font-display text-xl text-plum-800">Drop your image here</h3>
        <p className="mt-1 text-sm text-ink-mute">
          or browse files · JPG, PNG, WEBP up to 10 MB
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </Button>
          {onCameraOpen && (
            <Button
              variant="outline"
              leftIcon={<Camera className="h-4 w-4" />}
              onClick={onCameraOpen}
            >
              Use Camera
            </Button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
