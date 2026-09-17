import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast("Welcome back to AI Vision Hub", "success");
      nav("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Left / brand */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-plum-700 text-cream overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-rose-soft/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-plum-500/40 blur-3xl" />
        <div className="relative">
          <Link to="/" className="inline-flex">
            <div className="[&_span]:!text-cream">
              <Logo />
            </div>
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-md border border-cream/20 bg-cream/10 backdrop-blur px-3 py-1.5 text-xs text-cream/90">
            <Sparkles className="h-3.5 w-3.5" />
            Visual intelligence, refined
          </div>
          <h2 className="mt-6 font-display text-4xl leading-tight max-w-md">
            Understand the world one image at a time.
          </h2>
          <p className="mt-4 text-cream/80 max-w-md">
            Sign in to continue your scans, review saved insights and chat with the AI about what
            you've captured.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            {[
              { k: "Modes", v: "5" },
              { k: "Avg confidence", v: "94%" },
              { k: "Response", v: "<2s" },
            ].map((s) => (
              <div key={s.k} className="rounded-md border border-cream/20 bg-cream/5 p-3">
                <p className="font-display text-2xl">{s.v}</p>
                <p className="text-[11px] uppercase tracking-widest text-cream/70">{s.k}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-cream/60">
          © {new Date().getFullYear()} AI Vision Hub
        </p>
      </div>

      {/* Right / form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <p className="text-xs uppercase tracking-widest text-plum-500">Welcome back</p>
          <h1 className="mt-2 font-display text-4xl text-plum-900">Log in to your account</h1>
          <p className="mt-2 text-sm text-ink-mute">
            New here?{" "}
            <Link to="/register" className="text-plum-500 hover:text-plum-700 underline underline-offset-4">
              Create an account
            </Link>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
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
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="p-1 text-ink-mute hover:text-plum-700"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              autoComplete="current-password"
              required
              error={error || undefined}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-ink-soft">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-plum-200 text-plum-700 accent-plum-700"
                />
                Remember me
              </label>
              <a href="#" className="text-plum-500 hover:text-plum-700">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Log in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-mute">
            <span className="h-px flex-1 bg-plum-100" />
            or continue with
            <span className="h-px flex-1 bg-plum-100" />
          </div>

          <button
            type="button"
            onClick={() => {
              login("guest@aivisionhub.app", "google-oauth").then(() => nav("/dashboard"));
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-plum-100 bg-white px-4 py-2.5 text-sm text-ink hover:border-plum-300"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-xs text-ink-mute text-center">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l6-5.8C34.6 3.5 29.7 1.5 24 1.5 14.9 1.5 7.1 6.7 3.4 14.3l7 5.4C12.2 14 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.3 2.2-1.7 5.5-4.9 7.6l7.6 5.9c4.5-4.2 7.1-10.3 7.1-17.2z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5L3.4 14.3C1.7 17.6.8 21.2.8 25s.9 7.4 2.6 10.7l7-5.4z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 12-2.1 15.9-5.8l-7.6-5.9c-2.1 1.5-4.9 2.5-8.3 2.5-6.4 0-11.8-4.5-13.6-10.4l-7 5.4C7.1 41.3 14.9 46.5 24 46.5z"
      />
    </svg>
  );
}
