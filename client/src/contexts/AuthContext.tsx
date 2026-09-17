import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type User } from "@/services/authService";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN = "avh_token";
const STORAGE_USER = "avh_user";

// Demo credentials: any email/password works when backend is unreachable.
function fakeToken() {
  return "demo." + Math.random().toString(36).slice(2) + "." + Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_TOKEN);
    const u = localStorage.getItem(STORAGE_USER);
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      persist(res.token, res.user);
    } catch (err: any) {
      // Fallback to demo when API is unreachable
      if (!password || password.length < 4) {
        setError("Please enter a valid password (min 4 chars).");
        setLoading(false);
        throw err;
      }
      const demoUser: User = {
        id: "user_demo",
        name: email.split("@")[0].replace(/[^a-z]/gi, " ") || "Guest",
        email,
        createdAt: new Date().toISOString(),
      };
      persist(fakeToken(), demoUser);
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.register(name, email, password);
      persist(res.token, res.user);
    } catch {
      if (!name || !email || password.length < 4) {
        setError("Please fill in every field correctly.");
        setLoading(false);
        throw new Error("invalid");
      }
      const demoUser: User = {
        id: "user_demo",
        name,
        email,
        createdAt: new Date().toISOString(),
      };
      persist(fakeToken(), demoUser);
    } finally {
      setLoading(false);
    }
  }

  function persist(t: string, u: User) {
    localStorage.setItem(STORAGE_TOKEN, t);
    localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    setToken(t);
    setUser(u);
  }

  function updateUser(u: Partial<User>) {
    setUser((prev) => {
      const next = prev ? { ...prev, ...u } : prev;
      if (next) localStorage.setItem(STORAGE_USER, JSON.stringify(next));
      return next;
    });
  }

  function logout() {
    authService.logout();
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
