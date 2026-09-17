import { useState } from "react";
import { Camera, Check, Heart, Pencil, ScanLine } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useScans } from "@/contexts/ScanContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { StatCard } from "@/components/scan/StatCard";
import { useToast } from "@/contexts/ToastContext";
import { formatDate } from "@/utils/format";

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { stats } = useScans();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  function save() {
    updateUser({ name, email, avatar });
    setEditing(false);
    toast("Profile updated", "success");
  }

  function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  }

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-plum-500">Account</p>
        <h1 className="mt-2 font-display text-4xl text-plum-900">Your Profile</h1>
      </header>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        {/* Left column */}
        <div className="rounded-md border border-plum-100 bg-white p-6">
          <div className="relative inline-block">
            <ProfileAvatar name={name} src={avatar} size="xl" />
            {editing && (
              <label className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-md bg-plum-700 text-cream cursor-pointer border-2 border-white">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" className="hidden" onChange={pickAvatar} />
              </label>
            )}
          </div>
          <h2 className="mt-4 font-display text-2xl text-plum-800">{user?.name}</h2>
          <p className="text-sm text-ink-mute">{user?.email}</p>
          {user?.createdAt && (
            <p className="mt-1 text-xs text-ink-mute">
              Member since {formatDate(user.createdAt)}
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-plum-100 p-3">
              <p className="text-[11px] uppercase tracking-widest text-ink-mute">Scans</p>
              <p className="mt-1 font-display text-2xl text-plum-800">{stats.total}</p>
            </div>
            <div className="rounded-md border border-plum-100 p-3">
              <p className="text-[11px] uppercase tracking-widest text-ink-mute">Saved</p>
              <p className="mt-1 font-display text-2xl text-plum-800">{stats.saved}</p>
            </div>
          </div>
        </div>

        {/* Right column - edit */}
        <div className="rounded-md border border-plum-100 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl text-plum-800">Personal details</h3>
              <p className="text-sm text-ink-mute">Update your name and how we reach you.</p>
            </div>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <Button
                size="sm"
                leftIcon={<Check className="h-3.5 w-3.5" />}
                onClick={save}
              >
                Save
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <Input
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-display text-xl text-plum-800 mb-4">Activity summary</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total scans" value={stats.total} icon={ScanLine} />
          <StatCard label="Saved insights" value={stats.saved} icon={Heart} />
          <StatCard
            label="Most used mode"
            value={stats.mostUsed || "—"}
            icon={ScanLine}
            hint="Your top analysis category"
          />
        </div>
      </section>
    </div>
  );
}
