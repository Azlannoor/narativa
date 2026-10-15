import { z } from "zod";
import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { eq } from "drizzle-orm";
import {
  getBunnyStreamPlayerConfig,
  BUNNY_SIGNED_URL_TTL_SEC,
  type BunnyPlayerConfig,
} from "@/src/lib/bunny";
import { DUMMY_BROLLS } from "@/src/data/dummy-seed";

export const getSignedBrollUrlSchema = z.object({
  videoId: z.string().min(1, "Video ID tidak boleh kosong"),
  ttlSec: z.number().int().positive().optional(),
});

export type GetSignedBrollUrlInput = z.infer<typeof getSignedBrollUrlSchema>;

/**
 * Server Action: getSignedBrollUrl
 * Mengambil signed URL Bunny Stream untuk video b-roll tertentu dari database atau fallback seed.
 */
export async function getSignedBrollUrl(
  input: GetSignedBrollUrlInput | string
): Promise<{
  success: boolean;
  data?: BunnyPlayerConfig & {
    title?: string;
    category?: string;
    durationSec?: number;
    description?: string;
  };
  error?: string;
}> {
  try {
    const videoId = typeof input === "string" ? input : input.videoId;
    const ttlSec = typeof input === "string" ? BUNNY_SIGNED_URL_TTL_SEC : input.ttlSec || BUNNY_SIGNED_URL_TTL_SEC;

    // 1. Cari metadata aset di database
    let assetTitle = "";
    let assetCategory = "";
    let assetDuration = 6;
    let assetDescription = "";
    let resolvedBunnyId = videoId;

    try {
      const dbAssets = await db
        .select()
        .from(schema.brollAssets)
        .where(eq(schema.brollAssets.bunnyVideoId, videoId))
        .limit(1);

      if (dbAssets.length > 0 && dbAssets[0]) {
        const item = dbAssets[0];
        assetTitle = item.title;
        assetCategory = item.category;
        assetDuration = item.durationSec;
        assetDescription = item.description || "";
        resolvedBunnyId = item.bunnyVideoId;
      } else {
        // Coba cari berdasarkan ID UUID atau slug
        const dbAssetsById = await db
          .select()
          .from(schema.brollAssets)
          .where(eq(schema.brollAssets.id, videoId as any))
          .limit(1);

        if (dbAssetsById.length > 0 && dbAssetsById[0]) {
          const item = dbAssetsById[0];
          assetTitle = item.title;
          assetCategory = item.category;
          assetDuration = item.durationSec;
          assetDescription = item.description || "";
          resolvedBunnyId = item.bunnyVideoId;
        }
      }
    } catch {
      // Fallback ke data dummy jika query database gagal / offline
    }

    // Jika belum ketemu di database, cocokkan di dummy seed
    if (!assetTitle) {
      const dummyMatch = DUMMY_BROLLS.find(
        (b) => b.bunnyVideoId === videoId || b.id === videoId
      );
      if (dummyMatch) {
        assetTitle = dummyMatch.title;
        assetCategory = dummyMatch.category;
        assetDuration = dummyMatch.durationSec;
        assetDescription = dummyMatch.description;
        resolvedBunnyId = dummyMatch.bunnyVideoId;
      }
    }

    // 2. Buat signed URL menggunakan utilitas Bunny
    const playerConfig = getBunnyStreamPlayerConfig(resolvedBunnyId, { ttlSec });

    return {
      success: true,
      data: {
        ...playerConfig,
        title: assetTitle || `Klip B-roll (${resolvedBunnyId})`,
        category: assetCategory || "faceless",
        durationSec: assetDuration,
        description: assetDescription,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Gagal menghasilkan Bunny signed URL",
    };
  }
}

/**
 * Server Action: batchGetSignedBrollUrls
 * Mengambil beberapa signed URL sekaligus untuk kumpulan klip
 */
export async function batchGetSignedBrollUrls(
  videoIds: string[]
): Promise<Record<string, BunnyPlayerConfig>> {
  const result: Record<string, BunnyPlayerConfig> = {};
  for (const id of videoIds) {
    if (!id) continue;
    const config = getBunnyStreamPlayerConfig(id);
    result[id] = config;
  }
  return result;
}
