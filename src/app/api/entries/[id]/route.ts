import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries, photos } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  return NextResponse.json({ ...entry, photos: entryPhotos });
}
