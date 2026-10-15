import { z } from "zod";
import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuthSession } from "./auth-helper";

// ===== ZOD VALIDATION SCHEMAS =====

export const toggleFavoriteSchema = z.object({
  itemType: z.enum(["idea", "hook", "cta", "broll"]),
  itemId: z.string().min(1, "Item ID tidak boleh kosong"),
});

export const getFavoritesSchema = z.object({
  itemType: z.enum(["idea", "hook", "cta", "broll"]).optional(),
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
export type GetFavoritesInput = z.infer<typeof getFavoritesSchema>;

// ===== SERVER ACTIONS =====

/**
 * toggleFavorite
 * Menambah atau menghapus item library dari daftar favorit pengguna.
 * Wajib memvalidasi input dengan Zod, memeriksa sesi Clerk, dan memfilter userId.
 */
export async function toggleFavorite(
  rawInput: ToggleFavoriteInput,
  clerkId?: string
) {
  // 1. Validasi input dengan Zod
  const validated = toggleFavoriteSchema.parse(rawInput);

  // 2. Periksa sesi Clerk dan dapatkan ID pengguna
  const user = await requireAuthSession(clerkId);

  try {
    // 3. Periksa apakah item sudah ada di favorit milik user ini (filter userId)
    const existing = await db
      .select()
      .from(schema.libraryFavorites)
      .where(
        and(
          eq(schema.libraryFavorites.userId, user.id),
          eq(schema.libraryFavorites.itemType, validated.itemType),
          eq(schema.libraryFavorites.itemId, validated.itemId)
        )
      )
      .limit(1);

    if (existing.length > 0 && existing[0]) {
      // Jika sudah ada -> Hapus dari favorit
      await db
        .delete(schema.libraryFavorites)
        .where(
          and(
            eq(schema.libraryFavorites.userId, user.id),
            eq(schema.libraryFavorites.itemType, validated.itemType),
            eq(schema.libraryFavorites.itemId, validated.itemId)
          )
        );

      return {
        success: true,
        isFavorited: false,
        itemType: validated.itemType,
        itemId: validated.itemId,
        message: "Item berhasil dihapus dari daftar favorit.",
      };
    } else {
      // Jika belum ada -> Tambahkan ke favorit
      await db
        .insert(schema.libraryFavorites)
        .values({
          userId: user.id,
          itemType: validated.itemType,
          itemId: validated.itemId,
        })
        .onConflictDoNothing();

      return {
        success: true,
        isFavorited: true,
        itemType: validated.itemType,
        itemId: validated.itemId,
        message: "Item berhasil disimpan ke daftar favorit.",
      };
    }
  } catch (error: any) {
    console.error("❌ Gagal toggle favorit di database:", error);
    throw new Error(`Gagal mengubah status favorit: ${error.message || "Kesalahan database"}`);
  }
}

/**
 * getUserFavorites
 * Mengambil daftar ID item favorit milik pengguna yang sedang aktif.
 */
export async function getUserFavorites(
  rawInput?: GetFavoritesInput,
  clerkId?: string
) {
  const validated = getFavoritesSchema.parse(rawInput || {});
  const user = await requireAuthSession(clerkId);

  try {
    const conditions = [eq(schema.libraryFavorites.userId, user.id)];

    if (validated.itemType) {
      conditions.push(eq(schema.libraryFavorites.itemType, validated.itemType));
    }

    const favorites = await db
      .select()
      .from(schema.libraryFavorites)
      .where(and(...conditions));

    return {
      success: true,
      favorites,
      favoritedItemIds: favorites.map((f) => f.itemId),
    };
  } catch (error: any) {
    console.error("❌ Gagal mengambil daftar favorit dari database:", error);
    return {
      success: false,
      favorites: [],
      favoritedItemIds: [],
      error: error.message,
    };
  }
}
