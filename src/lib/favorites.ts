"use client";

// localStorage tabanlı favori yönetimi (sunucu/DB yok).
import { useCallback, useEffect, useState } from "react";

const KEY = "favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(slugs));
  // Aynı sekmedeki diğer bileşenleri haberdar et
  window.dispatchEvent(new Event("favorites-changed"));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(read());
    const sync = () => setFavorites(read());
    window.addEventListener("favorites-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    write(next);
    setFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites],
  );

  return { favorites, toggle, isFavorite };
}
