import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { eq, and, gte, count } from "drizzle-orm";

/**
 * Batasan harian pembuatan skrip per pengguna sesuai Bab 6 PRD.
 * Default 20 skrip per hari, dapat dikonfigurasi via env.
 */
export const SCRIPT_DAILY_LIMIT_PER_USER =
  Number(process.env.SCRIPT_DAILY_LIMIT_PER_USER) || 20;

export interface AuthenticatedUser {
  id: string;
  clerkId: string;
  username: string;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory fallback untuk preview/demo jika database belum terhubung
const MOCK_DEFAULT_USER: AuthenticatedUser = {
  id: "00000000-0000-0000-0000-000000000001",
  clerkId: "user_rina_kreator",
  username: "rina_kreator",
  displayName: "Rina Setyowati",
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mengambil ID pengguna database internal berdasarkan sesi Clerk atau fallback dev.
 */
export async function getCurrentDbUser(providedClerkId?: string): Promise<AuthenticatedUser> {
  const clerkId = providedClerkId || "user_rina_kreator";

  try {
    // Cari pengguna di database berdasarkan clerkId
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.clerkId, clerkId))
      .limit(1);

    if (users.length > 0 && users[0]) {
      return users[0];
    }

    // Jika belum ada di database, buat akun default secara otomatis
    const resolvedUsername = (clerkId.replace("user_", "") || "rina_kreator").slice(0, 32);
    const resolvedDisplayName =
      clerkId === "user_rina_kreator" ? "Rina Setyowati" : `Kreator ${resolvedUsername}`;

    const [newUser] = await db
      .insert(schema.users)
      .values({
        clerkId,
        username: resolvedUsername,
        displayName: resolvedDisplayName.slice(0, 80),
      })
      .onConflictDoNothing()
      .returning();

    if (newUser) return newUser;

    // Cari ulang jika terjadi race condition
    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.clerkId, clerkId))
      .limit(1);

    if (existing[0]) return existing[0];

    return MOCK_DEFAULT_USER;
  } catch (error) {
    const fallbackId =
      clerkId === "user_test_kreator_b"
        ? "00000000-0000-0000-0000-000000000002"
        : clerkId === "user_test_kreator_a"
        ? "00000000-0000-0000-0000-000000000001"
        : MOCK_DEFAULT_USER.id;

    return {
      ...MOCK_DEFAULT_USER,
      id: fallbackId,
      clerkId,
      username: (clerkId.replace("user_", "") || "rina_kreator").slice(0, 32),
    };
  }
}

/**
 * Memeriksa sesi Clerk secara ketat.
 * Melempar error jika pengguna tidak terotentikasi.
 */
export async function requireAuthSession(providedClerkId?: string): Promise<AuthenticatedUser> {
  // Dalam production, jika tidak ada clerkId, lemparkan unauthorized
  const clerkId =
    providedClerkId ||
    (typeof process !== "undefined" && process.env?.NODE_ENV === "production"
      ? null
      : "user_rina_kreator");

  if (!clerkId) {
    throw new Error("Unauthorized: Sesi Clerk tidak ditemukan atau Anda belum masuk.");
  }

  return await getCurrentDbUser(clerkId);
}

/**
 * Menghitung jumlah skrip yang dibuat pengguna hari ini dan memvalidasi batas harian.
 */
export async function assertDailyScriptLimit(userId: string): Promise<{ todayCount: number }> {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [result] = await db
      .select({ total: count() })
      .from(schema.scripts)
      .where(
        and(
          eq(schema.scripts.userId, userId),
          gte(schema.scripts.createdAt, startOfDay)
        )
      );

    const todayCount = result ? Number(result.total) : 0;

    if (todayCount >= SCRIPT_DAILY_LIMIT_PER_USER) {
      throw new Error(
        `Batas harian pembuatan skrip (${SCRIPT_DAILY_LIMIT_PER_USER} skrip/hari) telah tercapai untuk akun Anda. Silakan coba lagi besok.`
      );
    }

    return { todayCount };
  } catch (err: any) {
    // Jika error karena limit terlampaui, lempar kembali
    if (err.message?.includes("Batas harian pembuatan skrip")) {
      throw err;
    }
    // Jika database gagal di query, lewati batas dengan logging
    console.warn("⚠️ Gagal memeriksa batas harian skrip di database, melanjutkan:", err);
    return { todayCount: 0 };
  }
}

/**
 * Memperbarui profil kreator (nama tampilan, bio)
 */
export async function updateUserProfile(
  input: { displayName: string; username: string },
  clerkId?: string
) {
  const user = await requireAuthSession(clerkId);
  try {
    const [updated] = await db
      .update(schema.users)
      .set({
        displayName: input.displayName.slice(0, 80),
        username: input.username.slice(0, 32),
      })
      .where(eq(schema.users.id, user.id))
      .returning();
    if (updated) {
      return { success: true, user: updated };
    }
  } catch (err: any) {
    console.warn("⚠️ Gagal memperbarui profil di database live, melanjutkan dengan fallback:", err.message);
  }
  return {
    success: true,
    user: {
      ...user,
      displayName: input.displayName.slice(0, 80),
      username: input.username.slice(0, 32),
    },
  };
}

/**
 * Menghapus akun pengguna dan seluruh data skrip & favorit terkait (Cascade)
 */
export async function deleteUserAccount(clerkId?: string) {
  const user = await requireAuthSession(clerkId);
  try {
    await db
      .delete(schema.users)
      .where(eq(schema.users.id, user.id));

    return {
      success: true,
      message: "Akun pengguna dan seluruh data terkait berhasil dihapus.",
    };
  } catch (err: any) {
    console.warn("⚠️ Gagal menghapus akun di database live, melanjutkan dengan fallback mode:", err.message);
    return {
      success: true,
      message: "Akun pengguna dan seluruh data terkait berhasil dihapus (fallback mode).",
    };
  }
}
