import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/scan", label: "Scan" },
  { to: "/history", label: "History" },
  { to: "/favorites", label: "Favorites" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-plum-100 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">

        <NavLink to="/dashboard" className="flex items-center gap-2">
          <Logo />
        </NavLink>

        <nav className="ml-6 hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive
                    ? "text-plum-800 bg-plum-100/70"
                    : "text-ink-soft hover:text-plum-700 hover:bg-plum-50"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-plum-700 hover:bg-plum-50 relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-soft" />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-md p-1 pr-3 hover:bg-plum-50"
              aria-label="Account menu"
            >
              <ProfileAvatar name={user?.name} src={user?.avatar} size="sm" />
              <span className="hidden sm:inline text-sm text-ink-soft">{user?.name}</span>
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div className="absolute right-0 mt-2 w-56 z-20 rounded-md border border-plum-100 bg-white shadow-lg shadow-plum-900/10 animate-fade-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-plum-50">
                    <p className="text-sm font-medium text-plum-800 truncate">{user?.name}</p>
                    <p className="text-xs text-ink-mute truncate">{user?.email}</p>
                  </div>
                  <MenuItem
                    icon={UserIcon}
                    label="Profile"
                    onClick={() => {
                      setMenuOpen(false);
                      nav("/profile");
                    }}
                  />
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => {
                      setMenuOpen(false);
                      nav("/settings");
                    }}
                  />
                  <div className="border-t border-plum-50" />
                  <MenuItem
                    icon={LogOut}
                    label="Log out"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      nav("/login");
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof UserIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-plum-50"
    >
      <Icon className="h-4 w-4 text-plum-500" />
      {label}
    </button>
  );
}
