import type { ScanResult } from "@/types";
import { Circle } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-ink-mute mb-3">{title}</h4>
      {children}
    </div>
  );
}

function List({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-sm text-ink">
          <Circle className="h-1.5 w-1.5 mt-2 fill-plum-500 text-plum-500 shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function KeyValues({ items }: { items?: { label: string; value: string }[] }) {
  if (!items?.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-3">
      {items.map((i) => (
        <div key={i.label} className="rounded-md border border-plum-100 bg-white p-3">
          <dt className="text-[11px] uppercase tracking-wider text-ink-mute">{i.label}</dt>
          <dd className="mt-1 text-sm text-plum-800 font-medium">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ModeSpecificResult({ scan }: { scan: ScanResult }) {
  if (scan.mode === "product" && scan.product) {
    return (
      <div className="space-y-6">
        {scan.product.brand && (
          <Section title="Brand">
            <p className="text-sm text-ink">{scan.product.brand}</p>
          </Section>
        )}
        <Section title="Key features">
          <List items={scan.product.features} />
        </Section>
        <Section title="Specifications">
          <KeyValues items={scan.product.specifications} />
        </Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <Section title="Pros">
            <List items={scan.product.pros} />
          </Section>
          <Section title="Cons">
            <List items={scan.product.cons} />
          </Section>
        </div>
        {scan.product.similar && (
          <Section title="Similar products">
            <div className="flex flex-wrap gap-2">
              {scan.product.similar.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-plum-100 bg-plum-50 px-3 py-1 text-xs text-plum-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    );
  }

  if (scan.mode === "plant" && scan.plant) {
    return (
      <div className="space-y-6">
        <KeyValues
          items={[
            { label: "Care level", value: scan.plant.careLevel || "—" },
            { label: "Watering", value: scan.plant.watering || "—" },
            { label: "Sunlight", value: scan.plant.sunlight || "—" },
            { label: "Soil", value: scan.plant.soil || "—" },
          ]}
        />
        <Section title="Common problems">
          <List items={scan.plant.problems} />
        </Section>
      </div>
    );
  }

  if (scan.mode === "food" && scan.food) {
    return (
      <div className="space-y-6">
        {scan.food.cuisine && (
          <Section title="Cuisine">
            <p className="text-sm text-ink">{scan.food.cuisine}</p>
          </Section>
        )}
        <Section title="Ingredients">
          <div className="flex flex-wrap gap-2">
            {scan.food.ingredients?.map((i) => (
              <span
                key={i}
                className="rounded-md bg-cream border border-cream-deep/50 px-3 py-1 text-xs text-plum-800"
              >
                {i}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Nutrition (approximate)">
          <KeyValues items={scan.food.nutrition} />
          <p className="mt-2 text-[11px] text-ink-mute italic">
            Values are approximate and may vary by preparation.
          </p>
        </Section>
        {scan.food.serving && (
          <Section title="Serving">
            <p className="text-sm text-ink">{scan.food.serving}</p>
          </Section>
        )}
      </div>
    );
  }

  if (scan.mode === "electronics" && scan.electronics) {
    return (
      <div className="space-y-6">
        <KeyValues
          items={[
            { label: "Brand / Model", value: scan.electronics.brandModel || "—" },
            { label: "Purpose", value: scan.electronics.purpose || "—" },
          ]}
        />
        <Section title="Main features">
          <List items={scan.electronics.features} />
        </Section>
        {scan.electronics.ports && (
          <Section title="Ports">
            <div className="flex flex-wrap gap-2">
              {scan.electronics.ports.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-plum-100 bg-plum-50 px-3 py-1 text-xs text-plum-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </Section>
        )}
        {scan.electronics.setup && (
          <Section title="Setup overview">
            <p className="text-sm text-ink leading-relaxed">{scan.electronics.setup}</p>
          </Section>
        )}
      </div>
    );
  }

  if (scan.mode === "document" && scan.document) {
    return (
      <div className="space-y-6">
        {scan.document.docType && (
          <Section title="Document type">
            <p className="text-sm text-ink">{scan.document.docType}</p>
          </Section>
        )}
        {scan.document.summary && (
          <Section title="Summary">
            <p className="text-sm text-ink leading-relaxed">{scan.document.summary}</p>
          </Section>
        )}
        {scan.document.keyPoints && (
          <Section title="Key points">
            <List items={scan.document.keyPoints} />
          </Section>
        )}
        {scan.document.extractedText && (
          <Section title="Extracted text">
            <div className="rounded-md border border-plum-100 bg-cream-light/50 p-4 text-sm text-ink leading-relaxed max-h-56 overflow-y-auto">
              {scan.document.extractedText}
            </div>
          </Section>
        )}
        {scan.document.suggestedQuestions && (
          <Section title="Generated questions">
            <List items={scan.document.suggestedQuestions} />
          </Section>
        )}
      </div>
    );
  }

  return null;
}
