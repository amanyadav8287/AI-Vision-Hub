import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useScans } from "@/contexts/ScanContext";
import { ScanCard } from "@/components/scan/ScanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useScans();
  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-plum-500">Collection</p>
        <h1 className="mt-2 font-display text-4xl text-plum-900">Saved Insights</h1>
        <p className="mt-2 text-ink-mute">Your favorite scans, always within reach.</p>
      </header>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved insights yet"
          description="Hit the heart on any scan result to save it here."
          action={
            <Link to="/history">
              <Button variant="outline">Browse history</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((s) => (
            <ScanCard key={s.id} scan={s} onFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
