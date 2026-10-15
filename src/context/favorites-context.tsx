import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toggleFavorite as toggleFavoriteAction } from "@/src/actions/favorites";
import { toast } from "@/src/components/ui/sonner";

export type FavoriteItemType = "idea" | "hook" | "cta" | "broll";

export interface FavoriteRecord {
  id: string;
  itemType: FavoriteItemType;
  itemId: string;
  createdAt?: string;
}

interface FavoritesContextType {
  favorites: Record<string, boolean>; // key format: `${itemType}:${itemId}`
  isFavorite: (itemId: string, itemType: FavoriteItemType) => boolean;
  toggleFavorite: (
    itemId: string,
    itemType: FavoriteItemType,
    title?: string
  ) => Promise<boolean>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "narativa_user_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.warn("Gagal memuat data favorit lokal:", err);
      }
    }
    // Default clean favorites (kosong tanpa data dummy)
    return {};
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
      } catch (err) {
        // quota exceeded or private mode
      }
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (itemId: string, itemType: FavoriteItemType): boolean => {
      const key = `${itemType}:${itemId}`;
      return !!favorites[key];
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (
      itemId: string,
      itemType: FavoriteItemType,
      title?: string
    ): Promise<boolean> => {
      const key = `${itemType}:${itemId}`;
      const previousState = !!favorites[key];
      const newState = !previousState;

      // 1. Optimistic UI update
      setFavorites((prev) => {
        const updated = { ...prev };
        if (newState) {
          updated[key] = true;
        } else {
          delete updated[key];
        }
        return updated;
      });

      if (newState) {
        toast.success(
          title
            ? `"${title.slice(0, 30)}..." ditambahkan ke favorit.`
            : "Item berhasil disimpan ke daftar favorit!"
        );
      } else {
        toast.info(
          title
            ? `"${title.slice(0, 30)}..." dihapus dari favorit.`
            : "Item dihapus dari daftar favorit."
        );
      }

      // 2. Invoke Server Action to persist to Neon PostgreSQL
      try {
        const result = await toggleFavoriteAction({
          itemType,
          itemId,
        });

        if (result && !result.success) {
          console.warn("⚠️ Server Action toggleFavorite mengembalikan warning:", result.message);
        }

        return newState;
      } catch (error) {
        console.warn("⚠️ Server Action toggleFavorite gagal (menggunakan fallback lokal):", error);
        return newState;
      }
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
