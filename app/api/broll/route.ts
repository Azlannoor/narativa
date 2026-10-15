import { getSignedBrollUrl } from "@/src/actions/bunny";
import {
  BUNNY_STREAM_CDN_HOSTNAME,
  BUNNY_SIGNED_URL_TTL_SEC,
  getBunnyStreamPlayerConfig,
  getBunnyThumbnailUrl,
} from "@/src/lib/bunny";
import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { DUMMY_BROLLS } from "@/src/data/dummy-seed";

/**
 * GET /api/broll
 * - ?videoId=xxx : Mengembalikan signed URL Bunny Stream untuk videoId
 * - ?category=xxx : Mengembalikan daftar B-roll assets dengan thumbnail Bunny CDN
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("videoId");
  const category = url.searchParams.get("category");
  const ttlSecParam = url.searchParams.get("ttl");
  const ttlSec = ttlSecParam ? parseInt(ttlSecParam, 10) : BUNNY_SIGNED_URL_TTL_SEC;

  // 1. Jika meminta signed URL untuk klip tertentu
  if (videoId) {
    const signedData = await getSignedBrollUrl({ videoId, ttlSec });
    if (!signedData.success) {
      return new Response(
        JSON.stringify({ success: false, error: signedData.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: signedData.data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=60",
          "X-Bunny-Token-TTL": String(ttlSec),
        },
      }
    );
  }

  // 2. Jika meminta daftar aset B-roll
  try {
    let assets = await db
      .select()
      .from(schema.brollAssets)
      .where(eq(schema.brollAssets.isActive, true));

    if (assets.length === 0) {
      assets = DUMMY_BROLLS as any;
    }

    if (category && category !== "all") {
      assets = assets.filter((a) => a.category === category);
    }

    // Pastikan setiap aset memiliki thumbnail resmi dari BUNNY_STREAM_CDN_HOSTNAME
    const enrichedAssets = assets.map((a) => ({
      ...a,
      bunnyThumbnailUrl: getBunnyThumbnailUrl(a.bunnyVideoId),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        items: enrichedAssets,
        data: enrichedAssets,
        count: enrichedAssets.length,
        cdnHostname: BUNNY_STREAM_CDN_HOSTNAME,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err: any) {
    const fallback = DUMMY_BROLLS.map((a) => ({
      ...a,
      bunnyThumbnailUrl: getBunnyThumbnailUrl(a.bunnyVideoId),
    }));
    return new Response(
      JSON.stringify({
        success: true,
        items: fallback,
        data: fallback,
        count: fallback.length,
        cdnHostname: BUNNY_STREAM_CDN_HOSTNAME,
        warning: "Menggunakan fallback lokal: " + err.message,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * POST /api/broll
 * Meminta batch signed URLs untuk daftar videoId
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const videoIds: string[] = Array.isArray(body?.videoIds) ? body.videoIds : [];

    const result: Record<string, any> = {};
    for (const id of videoIds) {
      if (id) {
        result[id] = getBunnyStreamPlayerConfig(id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
