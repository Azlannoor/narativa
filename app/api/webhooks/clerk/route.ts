import { Webhook } from "svix";
import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { eq } from "drizzle-orm";

interface ClerkUserWebhookEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email_addresses?: Array<{ email_address: string }>;
    image_url?: string | null;
  };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET belum dikonfigurasi di environment variables.");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Ambil headers verifikasi Svix
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Baca payload body mentah
  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkUserWebhookEvent;
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as unknown as ClerkUserWebhookEvent;
  } catch (err) {
    console.error("❌ Verifikasi Svix signature gagal:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  const { id: clerkId, username, first_name, last_name } = evt.data;

  const resolvedUsername = (username || clerkId.replace("user_", "")).slice(0, 32);
  const displayName = [first_name, last_name].filter(Boolean).join(" ") || resolvedUsername;

  try {
    if (eventType === "user.created") {
      console.log(`👤 Menerima event user.created: ${resolvedUsername} (${clerkId})`);

      await db
        .insert(schema.users)
        .values({
          clerkId,
          username: resolvedUsername,
          displayName: displayName.slice(0, 80),
        })
        .onConflictDoNothing();
    } else if (eventType === "user.updated") {
      console.log(`👤 Menerima event user.updated: ${resolvedUsername} (${clerkId})`);

      await db
        .update(schema.users)
        .set({
          username: resolvedUsername,
          displayName: displayName.slice(0, 80),
          updatedAt: new Date(),
        })
        .where(eq(schema.users.clerkId, clerkId));
    } else if (eventType === "user.deleted") {
      console.log(`🗑️ Menerima event user.deleted: (${clerkId})`);

      await db.delete(schema.users).where(eq(schema.users.clerkId, clerkId));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (dbErr) {
    console.error("❌ Gagal menyinkronkan data user ke database:", dbErr);
    return new Response("Database error", { status: 500 });
  }
}
