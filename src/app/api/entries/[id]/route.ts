import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries, photos, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const row = await db
    .select()
    .from(entries)
    .leftJoin(users, eq(entries.userId, users.id))
    .where(eq(entries.id, id))
    .then((r) => r[0]);

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const u = row.users;
  const entry = {
    ...row.entries,
    authorName: u?.username ?? "Anónimo",
    authorAvatar: u?.avatar ? `/api/avatar/${u.id}` : null,
  };

  const entryPhotos = await db
    .select()
    .from(photos)
    .where(eq(photos.entryId, id))
    .orderBy(photos.order);

  return NextResponse.json({ ...entry, photos: entryPhotos });
}
