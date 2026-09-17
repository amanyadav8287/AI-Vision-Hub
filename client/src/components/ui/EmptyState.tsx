import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-plum-200 bg-plum-50/40 px-6 py-16 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white border border-plum-100 text-plum-500">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl text-plum-800">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-mute">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
