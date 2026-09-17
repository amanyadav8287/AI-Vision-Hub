import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ScanMode, ScanResult } from "@/types";
import { MOCK_SCANS } from "@/data/mockScans";

interface ScanContextValue {
  scans: ScanResult[];
  addScan: (scan: ScanResult) => void;
  getScan: (id: string) => ScanResult | undefined;
  removeScan: (id: string) => void;
  toggleFavorite: (id: string) => void;
  favorites: ScanResult[];
  stats: {
    total: number;
    saved: number;
    mostUsed: ScanMode | null;
  };
}

const ScanContext = createContext<ScanContextValue | undefined>(undefined);
const STORAGE_KEY = "avh_scans";

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setScans(JSON.parse(raw));
        return;
      } catch {
        // fallthrough
      }
    }
    setScans(MOCK_SCANS);
  }, []);

  useEffect(() => {
    if (scans.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
  }, [scans]);

  function addScan(scan: ScanResult) {
    setScans((prev) => [scan, ...prev]);
  }

  function getScan(id: string) {
    return scans.find((s) => s.id === id);
  }

  function removeScan(id: string) {
    setScans((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleFavorite(id: string) {
    setScans((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  }

  const favorites = scans.filter((s) => s.favorite);

  const modeCount = scans.reduce<Record<string, number>>((acc, s) => {
    acc[s.mode] = (acc[s.mode] || 0) + 1;
    return acc;
  }, {});
  const mostUsed = (Object.entries(modeCount).sort((a, b) => b[1] - a[1])[0]?.[0] as ScanMode) || null;

  return (
    <ScanContext.Provider
      value={{
        scans,
        addScan,
        getScan,
        removeScan,
        toggleFavorite,
        favorites,
        stats: { total: scans.length, saved: favorites.length, mostUsed },
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScans() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScans must be used inside ScanProvider");
  return ctx;
}
