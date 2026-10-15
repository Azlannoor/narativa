import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { eq } from "drizzle-orm";
import {
  DUMMY_IDEAS,
  DUMMY_HOOKS,
  DUMMY_CTAS,
  DUMMY_FORMULAS,
  DUMMY_BROLLS,
} from "@/src/data/dummy-seed";

// Cache in-memory dengan Time-To-Live (TTL) 5 menit (300.000 ms)
interface CacheStore {
  data: any;
  timestamp: number;
}

const globalForCache = globalThis as unknown as {
  __narativaLibraryCache?: CacheStore | null;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

function getCachedLibrary(): CacheStore | null {
  return globalForCache.__narativaLibraryCache || null;
}

function setCachedLibrary(store: CacheStore) {
  globalForCache.__narativaLibraryCache = store;
}

/**
 * GET /api/library
 * Mengambil katalog ide, hook, CTA, formula, dan B-roll aktif dengan caching in-memory & HTTP header.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "all";
  const pillar = url.searchParams.get("pillar");
  const category = url.searchParams.get("category");
  const goal = url.searchParams.get("goal");
  const bypassCache = url.searchParams.get("bypass_cache") === "true";

  const now = Date.now();
  let isCacheHit = false;

  // 1. Cek apakah ada cache yang masih valid
  let catalogData: any = null;
  const currentCache = getCachedLibrary();
  if (!bypassCache && currentCache && now - currentCache.timestamp < CACHE_TTL_MS) {
    catalogData = currentCache.data;
    isCacheHit = true;
  } else {
    // 2. Query data aktif dari database PostgreSQL
    try {
      const [dbIdeas, dbHooks, dbCtas, dbFormulas, dbSalesStyles, dbBrolls] =
        await Promise.all([
          db.select().from(schema.ideas).where(eq(schema.ideas.isActive, true)),
          db.select().from(schema.hooks).where(eq(schema.hooks.isActive, true)),
          db.select().from(schema.ctas).where(eq(schema.ctas.isActive, true)),
          db.select().from(schema.formulas).where(eq(schema.formulas.isActive, true)),
          db.select().from(schema.salesStyles),
          db.select().from(schema.brollAssets).where(eq(schema.brollAssets.isActive, true)),
        ]);

      // Jika database sudah memiliki data seed
      if (
        dbIdeas.length > 0 ||
        dbHooks.length > 0 ||
        dbCtas.length > 0 ||
        dbFormulas.length > 0
      ) {
        catalogData = {
          ideas: dbIdeas,
          hooks: dbHooks,
          ctas: dbCtas,
          formulas: dbFormulas,
          salesStyles: dbSalesStyles,
          brollAssets: dbBrolls,
          source: "database",
        };
      } else {
        // Fallback jika database belum di-seed
        catalogData = {
          ideas: DUMMY_IDEAS,
          hooks: DUMMY_HOOKS,
          ctas: DUMMY_CTAS,
          formulas: DUMMY_FORMULAS,
          salesStyles: [
            {
              code: "hard_selling",
              name: "Hard Selling",
              structure: ["Visual Produk", "Headline Pancingan", "Penjelasan Singkat", "Urgensi Promo", "CTA Tegas"],
              ctaTone: "Tegas dan mendesak: konversi instan.",
              defaultFormula: "pas",
            },
            {
              code: "soft_selling",
              name: "Soft Selling",
              structure: ["Hook Pain Point", "Eksplorasi Masalah", "Nilai Edukasi", "Bukti Sosial", "Soft CTA"],
              ctaTone: "Santai tanpa paksaan: nilai edukasi tinggi.",
              defaultFormula: "aida",
            },
            {
              code: "storyteller",
              name: "Storyteller",
              structure: ["Karakter", "Konteks (What-Why)", "Konflik", "Klimaks", "Kesimpulan"],
              ctaTone: "Reflektif dan terbuka untuk diskusi: empati tinggi.",
              defaultFormula: "heros_journey",
            },
          ],
          brollAssets: DUMMY_BROLLS,
          source: "fallback_seed",
        };
      }

      // Simpan ke in-memory cache
      setCachedLibrary({
        data: catalogData,
        timestamp: now,
      });
    } catch (dbErr) {
      console.warn("⚠️ Query database untuk /api/library gagal, menggunakan fallback seed data:", dbErr);
      catalogData = {
        ideas: DUMMY_IDEAS,
        hooks: DUMMY_HOOKS,
        ctas: DUMMY_CTAS,
        formulas: DUMMY_FORMULAS,
        salesStyles: [
          {
            code: "hard_selling",
            name: "Hard Selling",
            structure: ["Visual Produk", "Headline Pancingan", "Penjelasan Singkat", "Urgensi Promo", "CTA Tegas"],
            ctaTone: "Tegas dan mendesak: konversi instan.",
            defaultFormula: "pas",
          },
          {
            code: "soft_selling",
            name: "Soft Selling",
            structure: ["Hook Pain Point", "Eksplorasi Masalah", "Nilai Edukasi", "Bukti Sosial", "Soft CTA"],
            ctaTone: "Santai tanpa paksaan: nilai edukasi tinggi.",
            defaultFormula: "aida",
          },
          {
            code: "storyteller",
            name: "Storyteller",
            structure: ["Karakter", "Konteks (What-Why)", "Konflik", "Klimaks", "Kesimpulan"],
            ctaTone: "Reflektif dan terbuka untuk diskusi: empati tinggi.",
            defaultFormula: "heros_journey",
          },
        ],
        brollAssets: DUMMY_BROLLS,
        source: "fallback_error",
      };

      setCachedLibrary({
        data: catalogData,
        timestamp: now,
      });
    }
  }

  // 3. Filter berdasarkan parameter kueri jika diminta
  let responseData: any = {};

  if (type === "all") {
    let filteredIdeas = catalogData.ideas;
    if (pillar) {
      filteredIdeas = filteredIdeas.filter((item: any) => item.pillar === pillar);
    }

    let filteredHooks = catalogData.hooks;
    if (category) {
      filteredHooks = filteredHooks.filter((item: any) => item.category === category);
    }

    let filteredCtas = catalogData.ctas;
    if (goal) {
      filteredCtas = filteredCtas.filter((item: any) => item.goal === goal);
    }

    let filteredBrolls = catalogData.brollAssets;
    if (category) {
      filteredBrolls = filteredBrolls.filter((item: any) => item.category === category);
    }

    responseData = {
      ideas: filteredIdeas,
      hooks: filteredHooks,
      ctas: filteredCtas,
      formulas: catalogData.formulas,
      salesStyles: catalogData.salesStyles,
      brollAssets: filteredBrolls,
      counts: {
        ideas: filteredIdeas.length,
        hooks: filteredHooks.length,
        ctas: filteredCtas.length,
        formulas: catalogData.formulas.length,
        salesStyles: catalogData.salesStyles.length,
        brollAssets: filteredBrolls.length,
      },
    };
  } else if (type === "ideas") {
    let items = catalogData.ideas;
    if (pillar) items = items.filter((i: any) => i.pillar === pillar);
    responseData = { items, data: items, count: items.length };
  } else if (type === "hooks") {
    let items = catalogData.hooks;
    if (category) items = items.filter((h: any) => h.category === category);
    responseData = { items, data: items, count: items.length };
  } else if (type === "ctas") {
    let items = catalogData.ctas;
    if (goal) items = items.filter((c: any) => c.goal === goal);
    responseData = { items, data: items, count: items.length };
  } else if (type === "formulas") {
    responseData = { items: catalogData.formulas, data: catalogData.formulas, count: catalogData.formulas.length };
  } else if (type === "broll") {
    let items = catalogData.brollAssets;
    if (category) items = items.filter((b: any) => b.category === category);
    responseData = { items, data: items, count: items.length };
  } else if (type === "sales_styles") {
    responseData = { items: catalogData.salesStyles, data: catalogData.salesStyles, count: catalogData.salesStyles.length };
  } else {
    return new Response(JSON.stringify({ error: `Tipe library tidak dikenal: ${type}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Return dengan header HTTP Caching
  return new Response(
    JSON.stringify({
      success: true,
      cache: {
        hit: isCacheHit,
        ttlSeconds: Math.floor(CACHE_TTL_MS / 1000),
        timestamp: new Date(catalogData.timestamp || now).toISOString(),
      },
      ...responseData,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": isCacheHit ? "HIT" : "MISS",
      },
    }
  );
}
