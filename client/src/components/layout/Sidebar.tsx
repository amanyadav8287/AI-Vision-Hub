import { NavLink } from "react-router-dom";
import { Home, ScanLine, Clock, Heart, User, Settings, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Logo } from "./Logo";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/scan", label: "New Scan", icon: ScanLine },
  { to: "/history", label: "History", icon: Clock },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-plum-900/40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed z-50 md:z-auto md:static top-0 left-0 h-full w-72 bg-white border-r border-plum-100 transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-plum-100">
          <Logo />
          <button
            className="md:hidden text-ink-mute"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-0.5">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-plum-700 text-cream"
                    : "text-ink-soft hover:bg-plum-50 hover:text-plum-700"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
