import { useState } from "react";
import { KeyRound, Languages, ShieldAlert, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useScans } from "@/contexts/ScanContext";
import { useToast } from "@/contexts/ToastContext";
import { MODES } from "@/data/modes";
import type { ScanMode } from "@/types";
import { Modal } from "@/components/ui/Modal";

export function SettingsPage() {
  const { user } = useAuth();
  const { scans } = useScans();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [lang, setLang] = useState("en");
  const [defaultMode, setDefaultMode] = useState<ScanMode>("plant");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  function saveSection(label: string) {
    toast(`${label} updated`, "success");
  }

  function deleteHistory() {
    localStorage.removeItem("avh_scans");
    toast("Scan history cleared. Please refresh.", "success");
    setConfirmOpen(false);
  }

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-plum-500">Preferences</p>
        <h1 className="mt-2 font-display text-4xl text-plum-900">Settings</h1>
      </header>

      <SettingsSection
        title="Account"
        description="Manage your profile information."
        icon={User}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={user?.email} disabled />
        </div>
        <div className="mt-4">
          <Button size="sm" onClick={() => saveSection("Account")}>Save changes</Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Preferences"
        description="Personalize your analysis experience."
        icon={Languages}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-ink-soft uppercase">
              Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full rounded-md border border-plum-100 bg-white px-3 py-2.5 text-sm focus:border-plum-400 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-ink-soft uppercase">
              Default analysis mode
            </label>
            <select
              value={defaultMode}
              onChange={(e) => setDefaultMode(e.target.value as ScanMode)}
              className="w-full rounded-md border border-plum-100 bg-white px-3 py-2.5 text-sm focus:border-plum-400 focus:outline-none"
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" onClick={() => saveSection("Preferences")}>Save preferences</Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security"
        description="Update your password to keep your account safe."
        icon={KeyRound}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Current password"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button
            size="sm"
            onClick={() => {
              if (!current || next.length < 6) return toast("Please enter valid passwords", "error");
              saveSection("Password");
              setCurrent("");
              setNext("");
            }}
          >
            Change password
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Privacy"
        description="You currently have your data stored locally on this device."
        icon={ShieldAlert}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-rose-soft/60 bg-rose-mist/20 p-4">
          <div>
            <p className="font-medium text-plum-800">Delete scan history</p>
            <p className="text-xs text-ink-mute mt-1">
              This will remove all {scans.length} scans. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="danger"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => setConfirmOpen(true)}
          >
            Delete history
          </Button>
        </div>
      </SettingsSection>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete all scans?">
        <p className="text-sm text-ink-soft">
          You're about to delete all {scans.length} scans permanently. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteHistory}>
            Yes, delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-plum-100 bg-white p-6">
      <div className="flex items-start gap-4 pb-5 border-b border-plum-50 mb-5">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-plum-50 text-plum-700">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl text-plum-800">{title}</h3>
          <p className="text-sm text-ink-mute mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
