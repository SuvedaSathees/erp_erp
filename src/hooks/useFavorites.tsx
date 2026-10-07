import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type FavoriteItem = {
  to: string;
  label: string;
  section: string;
};

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  isFavorite: (to: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
};

const STORAGE_KEY = "magnertia_favorites";

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(items: FavoriteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* noop */ }
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const isFavorite = useCallback(
    (to: string) => favorites.some((f) => f.to === to),
    [favorites],
  );

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.to === item.to);
      const next = exists ? prev.filter((f) => f.to !== item.to) : [...prev, item];
      saveFavorites(next);
      return next;
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
