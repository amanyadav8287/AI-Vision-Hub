import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/utils/cn";

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

export function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => scorePassword(password), [password]);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][strength];

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) return setError("Please fill in every field.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!terms) return setError("Please accept the terms to continue.");
    setLoading(true);
    try {
      await register(name, email, password);
      toast("Account created — welcome!", "success");
      nav("/dashboard");
    } catch {
      setError("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      <div className="flex items-center justify-center p-6 sm:p-10 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <p className="text-xs uppercase tracking-widest text-plum-500">Get started</p>
          <h1 className="mt-2 font-display text-4xl text-plum-900">Create your account</h1>
          <p className="mt-2 text-sm text-ink-mute">
            Already have one?{" "}
            <Link to="/login" className="text-plum-500 hover:text-plum-700 underline underline-offset-4">
              Log in
            </Link>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              label="Full name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="name"
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type={show ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="p-1 text-ink-mute hover:text-plum-700"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />
            {password && (
              <div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i < strength
                          ? strength <= 1
                            ? "bg-rose-soft"
                            : strength === 2
                              ? "bg-plum-300"
                              : strength === 3
                                ? "bg-plum-500"
                                : "bg-plum-700"
                          : "bg-plum-100"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-ink-mute">
                  Password strength: <span className="text-plum-700">{strengthLabel}</span>
                </p>
              </div>
            )}
            <Input
              label="Confirm password"
              type={show ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              error={error && confirm && password !== confirm ? "Passwords do not match" : undefined}
              required
            />

            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-plum-200 accent-plum-700"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-plum-500 hover:text-plum-700">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-plum-500 hover:text-plum-700">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {error && <p className="text-xs text-plum-700">{error}</p>}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-mute">
            <span className="h-px flex-1 bg-plum-100" />
            or
            <span className="h-px flex-1 bg-plum-100" />
          </div>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-plum-100 bg-white px-4 py-2.5 text-sm text-ink hover:border-plum-300"
          >
            Continue with Google
          </button>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-plum-700 text-cream overflow-hidden order-1 lg:order-2">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-soft/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-plum-500/40 blur-3xl" />
        <div className="relative">
          <Link to="/" className="inline-flex">
            <div className="[&_span]:!text-cream">
              <Logo />
            </div>
          </Link>
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-md border border-cream/20 bg-cream/10 backdrop-blur px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> Join AI Vision Hub
          </span>
          <h2 className="mt-6 font-display text-4xl leading-tight max-w-md">
            Every image, decoded into useful knowledge.
          </h2>
          <p className="mt-4 text-cream/80 max-w-md">
            Save your scans, revisit insights, and build a personal library of visual knowledge.
          </p>
        </div>
        <p className="relative text-xs text-cream/60">Editorial visual intelligence, since today.</p>
      </div>
    </div>
  );
}
