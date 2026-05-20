import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries, photos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { head } from "@vercel/blob";

async function refreshUrl(url: string): Promise<string> {
  if (url.includes("blob.vercel-storage.com")) {
    try {
      const blob = await head(url);
      return blob.downloadUrl;
    } catch {
      return url;
    }
  }
  return url;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const entry = await db
    .select()
    .from(entries)
    .where(eq(entries.id, id))
    .then((r) => r[0]);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const entryPhotos = await db
    .select()
    .from(photos)
    .where(eq(photos.entryId, id))
    .orderBy(photos.order);

  const refreshed = await Promise.all(
    entryPhotos.map(async (p) => ({ ...p, url: await refreshUrl(p.url) }))
  );

  return NextResponse.json({ ...entry, photos: refreshed });
}
