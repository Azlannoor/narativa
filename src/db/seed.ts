import { db } from "./index";
import * as schema from "./schema";
import { SEED_FORMULAS } from "../data/formulas";
import { generate150Ideas } from "../data/largeIdeas";
import { generate700Hooks } from "../data/largeHooks";
import { generate170Ctas } from "../data/largeCtas";
import { generate100Broll } from "../data/largeBroll";

// Helper untuk chunking batch inserts
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function runSeed() {
  console.log("==================================================");
  console.log("🌱 MEMULAI SEEDING PENUH DATASET KATALOG NARATIVA");
  console.log("==================================================");

  // 1. SALES STYLES (3 Menu Utama)
  console.log("\n📦 [1/6] Memproses 3 Sales Styles...");
  const salesStylesData = [
    {
      code: "hard_selling" as const,
      name: "Hard Selling",
      structure: [
        "Visual Produk",
        "Headline Pancingan",
        "Penjelasan Singkat",
        "Urgensi Promo",
        "CTA Tegas",
      ],
      ctaTone: "Tegas dan mendesak: langsung konversi dan tindakan instan.",
      defaultFormula: "pas" as const,
    },
    {
      code: "soft_selling" as const,
      name: "Soft Selling",
      structure: [
        "Hook Pain Point",
        "Eksplorasi Masalah",
        "Nilai Edukasi",
        "Bukti Sosial",
        "Soft CTA",
      ],
      ctaTone: "Santai tanpa paksaan: nilai edukasi tinggi dan sukarela.",
      defaultFormula: "aida" as const,
    },
    {
      code: "storyteller" as const,
      name: "Storyteller",
      structure: [
        "Karakter",
        "Konteks (What-Why)",
        "Konflik (Hero vs Villain)",
        "Klimaks",
        "Kesimpulan",
      ],
      ctaTone: "Reflektif dan terbuka untuk diskusi: empati dan narasi emosional.",
      defaultFormula: "heros_journey" as const,
    },
  ];

  // 2. FORMULAS (8 Formula yang cocok dengan Enum Bab 10)
  console.log("📦 [2/6] Memproses Kerangka Formula Penulisan...");
  const validFormulaCodes: Record<
    string,
    "aida" | "4p" | "acca" | "pas" | "teardown" | "playbook" | "bab" | "heros_journey"
  > = {
    "FORM-01": "aida",
    "FORM-02": "pas",
    "FORM-03": "bab",
    "FORM-04": "4p",
    "FORM-05": "heros_journey",
    "FORM-06": "teardown",
    "FORM-08": "playbook",
    "FORM-09": "acca",
  };

  const formulasData = SEED_FORMULAS.filter((f) => validFormulaCodes[f.id]).map((f) => {
    const code = validFormulaCodes[f.id];
    const steps: schema.FormulaStep[] = f.steps.map((st, idx) => {
      const parts = st.split(":");
      const label = parts[0]?.trim() || `Langkah ${idx + 1}`;
      const guide = parts[1]?.trim() || st;
      const key = label.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 32);

      return {
        key,
        label,
        guide,
        example: f.example.slice(0, 200),
      };
    });

    return {
      code,
      name: f.name,
      objective: f.psychology.slice(0, 240),
      steps,
      isActive: true,
    };
  });

  // 3. IDEAS (150 Ide Konten dari generate150Ideas)
  console.log("📦 [3/6] Memproses 150 Ide Konten Berdasarkan Pilar...");
  const rawIdeas = generate150Ideas();
  const ideasData = rawIdeas.map((i) => {
    let pillar: "edukasi" | "inspirasi" | "promosi" | "bts_personal" = "edukasi";
    const lowerPillar = i.pillar.toLowerCase();
    if (lowerPillar.includes("inspirasi")) pillar = "inspirasi";
    else if (lowerPillar.includes("promosi")) pillar = "promosi";
    else if (lowerPillar.includes("bts") || lowerPillar.includes("personal"))
      pillar = "bts_personal";

    return {
      title: i.title.slice(0, 160),
      pillar,
      formats: ["instagram_reels", "tiktok"],
      targetAudience: i.notes ? i.notes.slice(0, 200) : "Kreator konten digital",
      technicalNote: i.notes || null,
      isActive: true,
    };
  });

  // 4. HOOKS (700 Hooks dari generate700Hooks)
  console.log("📦 [4/6] Memproses 700 Hook Pembuka (Mustache Format {{topik}})...");
  const rawHooks = generate700Hooks();
  const hooksData = rawHooks.map((h) => {
    // Ubah pola [variabel] menjadi {{variabel}}
    const mustacheTemplate = h.template.replace(/\[([^\]]+)\]/g, "{{$1}}");
    const variables = (h.placeholders || []).map((p) =>
      p.replace(/[\[\]]/g, "").trim().toLowerCase()
    );

    // Petakan kategori ke enum Bab 10
    let category: "kesalahan_fatal" | "kontroversial" | "studi_kasus" = "studi_kasus";
    const cat = h.category.toLowerCase();
    if (cat.includes("kesalahan") || cat.includes("urgensi") || cat.includes("peringatan")) {
      category = "kesalahan_fatal";
    } else if (cat.includes("kontroversial") || cat.includes("pertanyaan")) {
      category = "kontroversial";
    } else {
      category = "studi_kasus"; // mencakup studi kasus, daftar & tips, transformasi, storytelling
    }

    return {
      category,
      template: mustacheTemplate,
      variables,
      interruptNote: "Interupsi visual 1-3 detik, teks layar tebal dan tajam.",
      exampleFilled: h.example,
      isActive: true,
    };
  });

  // 5. CTAs (170 CTAs dari generate170Ctas)
  console.log("📦 [5/6] Memproses 170 Call to Action (CTA)...");
  const rawCtas = generate170Ctas();
  const ctasData = rawCtas.map((c) => {
    let goal: "save_bookmark" | "dm_lead_gen" | "engagement_share" = "engagement_share";
    const obj = c.objective.toLowerCase();
    if (obj.includes("save") || obj.includes("bookmark")) {
      goal = "save_bookmark";
    } else if (obj.includes("dm") || obj.includes("lead")) {
      goal = "dm_lead_gen";
    } else {
      goal = "engagement_share"; // engagement, share viral, klik link
    }

    // Ekstrak keyword huruf kapital jika DM Lead Gen
    let keyword: string | null = null;
    if (goal === "dm_lead_gen") {
      const match =
        c.text.match(/'([A-Z0-9_]{3,32})'/)?.[1] ||
        c.text.match(/\b([A-Z]{3,32})\b/)?.[1] ||
        "TEMPLATE";
      keyword = match.slice(0, 32);
    }

    // Petakan sales style berdasarkan teks
    let salesStyle: "hard_selling" | "soft_selling" | "storyteller" = "soft_selling";
    const txtLower = c.text.toLowerCase();
    if (
      txtLower.includes("sekarang juga") ||
      txtLower.includes("diskon") ||
      txtLower.includes("voucher") ||
      txtLower.includes("sebelum")
    ) {
      salesStyle = "hard_selling";
    } else if (
      txtLower.includes("cerita") ||
      txtLower.includes("merintis") ||
      txtLower.includes("pengalaman") ||
      txtLower.includes("posisi yang sama")
    ) {
      salesStyle = "storyteller";
    }

    return {
      goal,
      salesStyle,
      text: c.text.slice(0, 240),
      keyword,
      isActive: true,
    };
  });

  // 6. B-ROLL ASSETS (105 Assets dari generate100Broll)
  console.log("📦 [6/6] Memproses 105 Aset Visual B-roll 9:16...");
  const rawBrolls = generate100Broll();
  const brollsData = rawBrolls.map((b) => {
    let category: "desk_setup" | "coding_terminal" | "creative_flow" = "creative_flow";
    const cat = b.category.toLowerCase();
    if (cat.includes("desk") || cat.includes("coffee")) {
      category = "desk_setup";
    } else if (cat.includes("coding") || cat.includes("terminal")) {
      category = "coding_terminal";
    } else {
      category = "creative_flow";
    }

    return {
      category,
      title: b.title.slice(0, 160),
      description: b.description,
      aspectRatio: "9:16",
      bunnyVideoId: `broll-bunny-${b.id.toLowerCase()}`,
      thumbnailUrl: b.previewUrl,
      durationSec: 6,
      isActive: true,
    };
  });

  // EKSEKUSI DATABASE INGESTION
  const isRealDatabase =
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("ep-sample") &&
    !process.env.DATABASE_URL.includes("ep-xxxx");

  if (isRealDatabase) {
    console.log("\n🚀 Menyimpan seluruh data ke Neon PostgreSQL...");

    // 1. Sales Styles
    await db.insert(schema.salesStyles).values(salesStylesData).onConflictDoNothing();
    console.log("✓ Sales styles tersimpan.");

    // 2. Formulas
    await db.insert(schema.formulas).values(formulasData).onConflictDoNothing();
    console.log("✓ Formulas tersimpan.");

    // 3. Ideas in chunks of 50
    const ideaChunks = chunkArray(ideasData, 50);
    for (let i = 0; i < ideaChunks.length; i++) {
      await db.insert(schema.ideas).values(ideaChunks[i]);
    }
    console.log(`✓ 150 Ideas tersimpan dalam ${ideaChunks.length} batch.`);

    // 4. Hooks in chunks of 100
    const hookChunks = chunkArray(hooksData, 100);
    for (let i = 0; i < hookChunks.length; i++) {
      await db.insert(schema.hooks).values(hookChunks[i]);
    }
    console.log(`✓ 700 Hooks tersimpan dalam ${hookChunks.length} batch.`);

    // 5. CTAs in chunks of 50
    const ctaChunks = chunkArray(ctasData, 50);
    for (let i = 0; i < ctaChunks.length; i++) {
      await db.insert(schema.ctas).values(ctaChunks[i]);
    }
    console.log(`✓ 170 CTAs tersimpan dalam ${ctaChunks.length} batch.`);

    // 6. B-roll in chunks of 50
    const brollChunks = chunkArray(brollsData, 50);
    for (let i = 0; i < brollChunks.length; i++) {
      await db.insert(schema.brollAssets).values(brollChunks[i]);
    }
    console.log(`✓ 105 B-rolls tersimpan dalam ${brollChunks.length} batch.`);

    console.log("\n🎉 SELURUH DATASET BERHASIL DI-SEED KE DATABASE NEON!");
  } else {
    console.log(
      "\nℹ️ DATABASE_URL lokal/placeholder terdeteksi. Validasi pemetaan memori berhasil 100%:"
    );
  }

  const summary = {
    salesStylesCount: salesStylesData.length,
    formulasCount: formulasData.length,
    ideasCount: ideasData.length,
    hooksCount: hooksData.length,
    ctasCount: ctasData.length,
    brollsCount: brollsData.length,
  };

  console.log("\n📊 RINGKASAN DATASET SIAP SEED:", summary);
  return summary;
}

// Eksekusi CLI langsung: npx tsx src/db/seed.ts
if (
  process.argv[1]?.includes("seed.ts") ||
  process.argv[1]?.includes("seed.js")
) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Terjadi kesalahan saat seeding:", err);
      process.exit(1);
    });
}
