import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ScanLine,
  Shield,
  Zap,
  Camera,
  Check,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MODES } from "@/data/modes";
import { Button } from "@/components/ui/Button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink overflow-x-hidden">
      {/* Top nav */}
      <header className="border-b border-plum-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-soft">
            <a href="#modes" className="hover:text-plum-700">Modes</a>
            <a href="#how" className="hover:text-plum-700">How it works</a>
            <a href="#features" className="hover:text-plum-700">Features</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-plum-700 hover:text-plum-800 px-3 py-2">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-plum-700 text-cream text-sm px-4 py-2 hover:bg-plum-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 -left-20 h-72 w-72 rounded-full bg-rose-soft/30 blur-3xl" />
          <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-plum-200/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-plum-200 bg-white/70 backdrop-blur px-3 py-1.5 text-xs text-plum-700">
              <Sparkles className="h-3.5 w-3.5" />
              Multimodal visual intelligence
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-plum-900 tracking-tight">
              Turn Images Into <em className="not-italic text-plum-500">Intelligence.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft leading-relaxed">
              Upload anything you want to understand. AI identifies it, explains it, and gives you
              useful insights — from plants and products to documents and devices.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start Scanning
                </Button>
              </Link>
              <a href="#modes">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-ink-mute">
              <span className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-plum-500" /> Free to try
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-plum-500" /> No card required
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-plum-500" /> Works on any device
              </span>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="border-t border-plum-100/60 bg-cream-light/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-plum-500">Capabilities</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-plum-900 leading-tight">
              One AI. Five ways to understand the world.
            </h2>
            <p className="mt-4 text-ink-soft">
              Choose a mode and let the model adapt its analysis to what matters most about your image.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODES.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="group relative rounded-md border border-plum-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-plum-900/10"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br ${m.accent} text-cream group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs text-ink-mute">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-plum-800">{m.label}</h3>
                  <p className="mt-2 text-sm text-ink-mute leading-relaxed">{m.description}</p>
                </div>
              );
            })}
            <div className="group relative rounded-md border border-plum-200 bg-gradient-to-br from-plum-700 to-plum-500 p-6 text-cream overflow-hidden">
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-rose-soft/30 blur-2xl" />
              <Sparkles className="h-6 w-6" />
              <h3 className="mt-6 font-display text-2xl">And an AI chat for every result.</h3>
              <p className="mt-2 text-sm text-cream/80">
                Ask follow-up questions in natural language after any scan.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-1 text-sm underline underline-offset-4 hover:no-underline"
              >
                Try it now
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-plum-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-plum-500">How it works</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-plum-900 leading-tight">
              From image to insight in seconds.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Camera,
                t: "1. Upload or capture",
                d: "Drop an image, browse files, or snap a photo with your camera.",
              },
              {
                icon: ScanLine,
                t: "2. AI analyzes",
                d: "The model detects visual features and identifies what's in your image.",
              },
              {
                icon: Sparkles,
                t: "3. Get insights",
                d: "Read a structured, editorial breakdown and chat with the AI for more.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="rounded-md border border-plum-100 bg-white p-6 hover:border-plum-300 transition-colors"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-plum-50 text-plum-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl text-plum-800">{t}</h3>
                <p className="mt-2 text-sm text-ink-mute leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section id="features" className="border-t border-plum-100/60 bg-plum-700 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, t: "Real-time analysis", d: "Fast, low-latency multimodal processing." },
            { icon: Shield, t: "Private by design", d: "Your images are never shared or sold." },
            { icon: Sparkles, t: "Conversational AI", d: "Ask follow-up questions after every scan." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-cream/10 text-cream">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl">{t}</h3>
                <p className="text-cream/70 text-sm mt-1">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-plum-100/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-24 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-plum-900 leading-tight">
            Ready to understand every image you see?
          </h2>
          <p className="mt-4 text-ink-soft">
            Join AI Vision Hub and turn curiosity into knowledge in a single scan.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-plum-100/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-ink-mute">
            © {new Date().getFullYear()} AI Vision Hub. Editorial visual intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-rose-soft/40 to-plum-200/30 rounded-md blur-2xl" />
      <div className="relative rounded-md border border-plum-100 bg-white p-4 shadow-xl shadow-plum-900/10">
        <div className="flex items-center gap-2 border-b border-plum-50 pb-3 mb-3">
          <span className="inline-block h-2 w-2 rounded-full bg-rose-soft" />
          <span className="inline-block h-2 w-2 rounded-full bg-plum-200" />
          <span className="inline-block h-2 w-2 rounded-full bg-plum-100" />
          <span className="ml-3 text-[11px] uppercase tracking-widest text-ink-mute">
            aivisionhub.app / scan
          </span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 relative overflow-hidden rounded-md bg-plum-900 aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=70"
              alt="Aloe Vera plant"
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-x-0 h-14 bg-gradient-to-b from-cream/60 via-cream/20 to-transparent animate-scan-line"
              style={{ top: 0 }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-md bg-cream/95 text-plum-800 px-2 py-1">
                <ScanLine className="h-3 w-3" /> Detecting features
              </span>
              <span className="rounded-md bg-plum-700 text-cream px-2 py-1">Plant mode</span>
            </div>
          </div>
          <div className="col-span-2 space-y-3">
            <div className="rounded-md border border-plum-100 p-3">
              <p className="text-[10px] uppercase tracking-widest text-ink-mute">Detected</p>
              <p className="mt-1 font-display text-xl text-plum-800">Aloe Vera</p>
              <p className="mt-1 text-[11px] text-plum-500">96% confidence</p>
            </div>
            <div className="rounded-md border border-plum-100 p-3 bg-plum-50/60">
              <p className="text-[10px] uppercase tracking-widest text-ink-mute">Care</p>
              <ul className="mt-1 space-y-1 text-xs text-ink">
                <li>💧 Every 2–3 weeks</li>
                <li>☀️ Bright, indirect</li>
                <li>🪴 Sandy soil</li>
              </ul>
            </div>
            <div className="rounded-md border border-plum-100 p-3 bg-cream">
              <p className="text-[10px] uppercase tracking-widest text-plum-700">AI Insight</p>
              <p className="mt-1 text-xs text-ink leading-relaxed">
                Tolerates neglect — perfect for beginners and sunny windowsills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
