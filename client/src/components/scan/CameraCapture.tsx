import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Camera, RefreshCw } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraCapture({ open, onClose, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSnapshot(null);
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        setError("Unable to access camera. Please check permissions.");
      }
    })();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  function capture() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d")?.drawImage(v, 0, 0);
    setSnapshot(canvas.toDataURL("image/jpeg", 0.9));
  }

  function confirm() {
    if (!snapshot) return;
    fetch(snapshot)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        onClose();
      });
  }

  return (
    <Modal open={open} onClose={onClose} title="Camera capture" className="max-w-xl">
      {error ? (
        <div className="text-sm text-plum-700">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-plum-100 bg-plum-900 aspect-video">
            {snapshot ? (
              <img src={snapshot} className="w-full h-full object-cover" alt="Snapshot" />
            ) : (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex justify-end gap-2">
            {snapshot ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setSnapshot(null)}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Retake
                </Button>
                <Button onClick={confirm}>Use photo</Button>
              </>
            ) : (
              <Button onClick={capture} leftIcon={<Camera className="h-4 w-4" />}>
                Capture
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
