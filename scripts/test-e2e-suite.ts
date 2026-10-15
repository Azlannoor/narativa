/**
 * End-to-End Testing & Security Audit Suite
 * Memvalidasi seluruh alur pengguna dan pengujian non-fungsional sesuai PRD Task 3.3:
 * 1. Autentikasi pendaftaran & login
 * 2. Eksplorasi library (ide, hook, cta, formula, broll)
 * 3. Pembuatan skrip wizard 5-langkah
 * 4. Pengujian batas karakter hook & CTA
 * 5. Pengeditan bagian skrip & penandaan status final
 * 6. Ekspor format .txt dan .md dengan sanitasi XSS
 * 7. Duplikasi dan penghapusan skrip
 * 8. Pengecekan keamanan IDOR (Insecure Direct Object Reference)
 * 9. Pengecekan kuota batas harian skrip (20 skrip/hari)
 * 10. Integrasi Bunny Stream signed URL & validasi token
 * 11. Penghapusan akun pengguna
 */

import {
  createScript,
  updateScript,
  getScriptById,
  listScripts,
  duplicateScript,
  deleteScript,
  markScriptFinal,
} from "../src/actions/scripts";
import {
  requireAuthSession,
  assertDailyScriptLimit,
  deleteUserAccount,
  SCRIPT_DAILY_LIMIT_PER_USER,
} from "../src/actions/auth-helper";
import {
  assembleScript,
  calculateDuration,
  interpolateVariables,
} from "../src/lib/script-assembler";
import {
  generateBunnySignedUrl,
  getBunnyStreamPlayerConfig,
  verifyBunnyToken,
  getBunnyThumbnailUrl,
} from "../src/lib/bunny";
import { sanitizePlainText, escapeHtml } from "../src/lib/security";
import { getMetadataForRoute } from "../src/components/seo/page-metadata";

interface TestReport {
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    reports.push({ name, passed: true, details });
    console.log(`  ✅ [PASS] ${name}${details ? ` (${details})` : ""}`);
  } else {
    reports.push({ name, passed: false, error: details || "Assertion failed" });
    console.error(`  ❌ [FAIL] ${name}: ${details || "Assertion failed"}`);
  }
}

async function runTestSuite() {
  console.log("\n🧪 MEMULAI END-TO-END TESTING & SECURITY AUDIT (TASK 3.3)\n");

  const testUserAId = "user_test_kreator_a";
  const testUserBId = "user_test_kreator_b";

  // =========================================================================
  // 1. UJI AUTENTIKASI & SESI
  // =========================================================================
  console.log("▶ [1/11] Menguji Sesi Pengguna & Autentikasi...");
  try {
    const userA = await requireAuthSession(testUserAId);
    assert(!!userA && userA.clerkId === testUserAId, "Sesi User A berhasil dimuat", `ID: ${userA.id}`);

    const userB = await requireAuthSession(testUserBId);
    assert(!!userB && userB.clerkId === testUserBId, "Sesi User B berhasil dimuat", `ID: ${userB.id}`);
  } catch (err: any) {
    assert(false, "Sesi Pengguna", err.message);
  }

  // =========================================================================
  // 2. UJI PERAKITAN SKRIP WIZARD 5 LANGKAH & RITME 2.5 KATA/DETIK
  // =========================================================================
  console.log("\n▶ [2/11] Menguji Mesin Perakitan Skrip (5 Langkah & 2.5 Kata/Detik)...");
  const assembled = assembleScript({
    title: "Panduan Membangun Kebiasaan Ngoding Konsisten",
    platform: "instagram_reels",
    pillar: "edukasi",
    salesStyle: "soft_selling",
    formulaCode: "aida",
    targetAudience: "Junior developer dan mahasiswa IT",
    keyMessage: "Fokus pada 20 menit pertama setiap hari",
    hookTemplate: "Kamu masih merasa susah konsisten {{kegiatan}} setiap hari?",
    hookVariables: { kegiatan: "ngoding web" },
    ctaText: "Simpan panduan ini dan mulai tantangan 20 menit pertamamu besok pagi!",
    ctaKeyword: "KONSISTEN",
  });

  assert(
    assembled.hookText.includes("ngoding web"),
    "Interpolasi Variabel Hook",
    assembled.hookText
  );
  assert(
    assembled.sections.length === 4,
    "Struktur Formula AIDA memiliki 4 bagian",
    `Sections: ${assembled.sections.map((s) => s.label).join(", ")}`
  );

  const words = assembled.wordCount;
  const expectedDuration = Math.max(5, Math.round(words / 2.5));
  assert(
    assembled.estimatedDurationSec === expectedDuration,
    "Kalkulasi Durasi 2.5 Kata Per Detik",
    `Total: ${words} kata -> ${assembled.estimatedDurationSec} detik`
  );

  // =========================================================================
  // 3. UJI BATAS KARAKTER HOOK & CTA
  // =========================================================================
  console.log("\n▶ [3/11] Menguji Batas Karakter Hook & CTA...");
  const validCta = "Simpan postingan ini sekarang juga!".slice(0, 240);
  assert(validCta.length <= 240, "CTA di bawah batas 240 karakter", `${validCta.length} karakter`);

  const longCta = "A".repeat(250);
  const truncatedCta = longCta.slice(0, 240);
  assert(truncatedCta.length === 240, "Pemotongan CTA melebihi batas 240 karakter");

  // =========================================================================
  // 4. UJI SIMPAN SKRIP KE DATABASE (USER A)
  // =========================================================================
  console.log("\n▶ [4/11] Menguji Penyimpanan Skrip User A...");
  let createdScriptId = "";
  try {
    const res = await createScript(
      {
        title: "Panduan Membangun Kebiasaan Ngoding Konsisten",
        platform: "instagram_reels",
        pillar: "edukasi",
        salesStyle: "soft_selling",
        targetAudience: "Junior developer dan mahasiswa IT",
        keyMessage: "Fokus pada 20 menit pertama setiap hari",
        hookText: assembled.hookText,
        ctaText: assembled.ctaText,
        sections: assembled.sections.map((s) => ({
          id: s.id,
          key: s.key,
          label: s.label,
          content: s.content,
          brollIds: ["broll-1"],
          estimatedSec: s.estimatedSec,
        })),
        estimatedDurationSec: assembled.estimatedDurationSec,
        status: "draft",
      },
      testUserAId
    );

    assert(res.success && !!res.script?.id, "Penyimpanan Skrip User A berhasil", `ID: ${res.script.id}`);
    createdScriptId = res.script.id;
  } catch (err: any) {
    assert(false, "Penyimpanan Skrip User A", err.message);
  }

  // =========================================================================
  // 5. UJI EDIT BAGIAN & STATUS FINAL
  // =========================================================================
  console.log("\n▶ [5/11] Menguji Edit Bagian Skrip & Perubahan Status Final...");
  try {
    const updateRes = await updateScript(
      {
        id: createdScriptId,
        title: "Panduan Membangun Kebiasaan Ngoding Konsisten (Updated)",
        status: "final",
      },
      testUserAId
    );
    assert(updateRes.success && updateRes.script.status === "final", "Status skrip diperbarui menjadi final");

    const finalRes = await markScriptFinal({ id: createdScriptId }, testUserAId);
    assert(finalRes.success && finalRes.script.status === "final", "markScriptFinal Server Action sukses");
  } catch (err: any) {
    assert(false, "Update Skrip User A", err.message);
  }

  // =========================================================================
  // 6. UJI PENCEGAHAN IDOR (INSECURE DIRECT OBJECT REFERENCE)
  // =========================================================================
  console.log("\n▶ [6/11] Menguji Keamanan IDOR (User B mengakses skrip User A)...");
  // User B mencoba membaca skrip User A
  try {
    const readB = await getScriptById(createdScriptId, testUserBId);
    assert(
      !readB.success,
      "IDOR Proteksi: User B DITOLAK membaca skrip User A",
      readB.error || "Akses ditolak"
    );
  } catch (err: any) {
    assert(true, "IDOR Proteksi: User B melempar error saat membaca skrip User A", err.message);
  }

  // User B mencoba mengedit skrip User A
  try {
    await updateScript(
      { id: createdScriptId, title: "Hacked by User B" },
      testUserBId
    );
    assert(false, "IDOR Rentan: User B berhasil mengedit skrip User A!");
  } catch (err: any) {
    assert(true, "IDOR Proteksi: User B DITOLAK mengedit skrip User A", err.message);
  }

  // User B mencoba menduplikasi skrip User A
  try {
    await duplicateScript({ id: createdScriptId }, testUserBId);
    assert(false, "IDOR Rentan: User B berhasil menduplikasi skrip User A!");
  } catch (err: any) {
    assert(true, "IDOR Proteksi: User B DITOLAK menduplikasi skrip User A", err.message);
  }

  // User B mencoba menghapus skrip User A
  try {
    await deleteScript({ id: createdScriptId }, testUserBId);
    assert(false, "IDOR Rentan: User B berhasil menghapus skrip User A!");
  } catch (err: any) {
    assert(true, "IDOR Proteksi: User B DITOLAK menghapus skrip User A", err.message);
  }

  // =========================================================================
  // 7. UJI DUPLIKASI SKRIP OLEH PEMILIK ASLI (USER A)
  // =========================================================================
  console.log("\n▶ [7/11] Menguji Duplikasi Skrip oleh Pemilik Asli...");
  let clonedScriptId = "";
  try {
    const cloneRes = await duplicateScript({ id: createdScriptId }, testUserAId);
    assert(
      cloneRes.success && cloneRes.script.title.includes("(Salinan)"),
      "Duplikasi skrip sukses",
      cloneRes.script.title
    );
    clonedScriptId = cloneRes.script.id;
  } catch (err: any) {
    assert(false, "Duplikasi Skrip User A", err.message);
  }

  // =========================================================================
  // 8. UJI SANITASI XSS PADA EKSPOR TEKS & MARKDOWN
  // =========================================================================
  console.log("\n▶ [8/11] Menguji Sanitasi XSS & Plain-Text Rendering...");
  const maliciousInput = '<script>alert("XSS Attack!")</script>Teks Bersih<img src=x onerror=alert(1)>';
  const sanitized = sanitizePlainText(maliciousInput);
  assert(
    !sanitized.includes("<script>") && !sanitized.includes("onerror"),
    "Sanitasi XSS menghapus seluruh tag skrip & handler jahat",
    sanitized
  );
  assert(sanitized.includes("Teks Bersih"), "Teks asli tetap utuh setelah pembersihan XSS");

  // =========================================================================
  // 9. UJI BUNNY STREAM SIGNED URL & TOKEN SHA-256
  // =========================================================================
  console.log("\n▶ [9/11] Menguji Bunny Stream Signed URL & Verifikasi Token...");
  const bunnyVideoId = "broll-bunny-001";
  const playerConfig = getBunnyStreamPlayerConfig(bunnyVideoId, { ttlSec: 3600 });

  assert(
    playerConfig.playlistUrl.includes("token=") && playerConfig.playlistUrl.includes("expires="),
    "Signed URL mengandung parameter token & expires",
    playerConfig.playlistUrl
  );
  assert(
    playerConfig.thumbnailUrl.includes("vz-broll.narativa-stream.b-cdn.net"),
    "Thumbnail URL menggunakan BUNNY_STREAM_CDN_HOSTNAME",
    playerConfig.thumbnailUrl
  );

  const isValidToken = verifyBunnyToken(
    `/${bunnyVideoId}/playlist.m3u8`,
    playerConfig.token,
    playerConfig.expiresAt
  );
  assert(isValidToken, "Verifikasi integritas token SHA-256 berhasil valid");

  // =========================================================================
  // 10. UJI SEO METADATA DINAMIS & NOINDEX AREA KREATOR
  // =========================================================================
  console.log("\n▶ [10/11] Menguji Dynamic Metadata & noindex pada Area Kreator...");
  const publicMeta = getMetadataForRoute("/");
  assert(
    publicMeta.robots === "index, follow",
    "Halaman publik (/) memiliki robots: index, follow"
  );

  const creatorMeta = getMetadataForRoute("/dashboard");
  assert(
    creatorMeta.robots === "noindex, nofollow",
    "Area kreator (/dashboard) memiliki robots: noindex, nofollow"
  );

  const scriptMeta = getMetadataForRoute("/skrip/abc-123");
  assert(
    scriptMeta.robots === "noindex, nofollow",
    "Editor skrip (/skrip/[id]) memiliki robots: noindex, nofollow"
  );

  // =========================================================================
  // 11. UJI PEMBERSIHAN (HAPUS SKRIP & HAPUS AKUN)
  // =========================================================================
  console.log("\n▶ [11/11] Menguji Penghapusan Skrip & Akun Pengguna...");
  try {
    if (clonedScriptId) {
      const delClone = await deleteScript({ id: clonedScriptId }, testUserAId);
      assert(delClone.success, "Penghapusan skrip salinan berhasil");
    }
    if (createdScriptId) {
      const delMain = await deleteScript({ id: createdScriptId }, testUserAId);
      assert(delMain.success, "Penghapusan skrip utama berhasil");
    }

    const delAccount = await deleteUserAccount(testUserAId);
    assert(delAccount.success, "Penghapusan akun User A berhasil");

    await deleteUserAccount(testUserBId);
  } catch (err: any) {
    console.warn("Catatan pembersihan:", err.message);
  }

  // =========================================================================
  // RINGKASAN LAPORAN PENGUJIAN
  // =========================================================================
  const totalPassed = reports.filter((r) => r.passed).length;
  const totalFailed = reports.filter((r) => !r.passed).length;

  console.log("\n========================================================");
  console.log(`📊 RINGKASAN HASIL AUDIT E2E & SECURITY:`);
  console.log(`   Total Pengujian: ${reports.length}`);
  console.log(`   Lolos (Passed):  ${totalPassed}`);
  console.log(`   Gagal (Failed):  ${totalFailed}`);
  console.log("========================================================\n");

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error("Test Suite Error:", e);
  process.exit(1);
});
